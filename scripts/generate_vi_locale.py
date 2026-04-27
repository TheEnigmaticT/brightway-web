#!/Library/Developer/CommandLineTools/usr/bin/python3

from __future__ import annotations

import argparse
import json
import re
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable

from bs4 import BeautifulSoup, Comment, Doctype, NavigableString
from litellm import completion


ROOT = Path(__file__).resolve().parent.parent
ENGLISH_PAGES = [
    "index.html",
    "about/index.html",
    "ambassadors/index.html",
    "book/index.html",
    "difference/index.html",
    "governance/index.html",
    "parents/index.html",
    "partnerships/index.html",
    "partnerships/universities/index.html",
    "problem/index.html",
    "services/index.html",
]
TRANSLATABLE_ATTRS = ("title", "alt", "aria-label", "placeholder")
SKIP_PARENTS = {"script", "style"}
VI_CANONICAL_LINK_LABELS = {
    "/vi/about/": "Giới thiệu",
    "/vi/services/": "Dịch vụ",
    "/vi/governance/": "Quản trị",
    "/vi/difference/": "Điểm khác biệt",
    "/vi/partnerships/": "Đối tác",
    "/vi/ambassadors/": "Đại sứ",
    "/vi/book/": "Đặt lịch gọi",
}


@dataclass
class TextUnit:
    kind: str
    handle: object
    original: str
    leading: str
    core: str
    trailing: str
    attr_name: str | None = None


def route_for_page(page: str) -> str:
    if page == "index.html":
        return "/"
    return "/" + page.removesuffix("index.html")


def zh_route(route: str) -> str:
    return "/zh/" if route == "/" else f"/zh{route}"


def should_translate(text: str) -> bool:
    stripped = text.strip()
    if not stripped:
        return False
    if stripped in {"EN", "VI", "中文"}:
        return False
    if re.fullmatch(r"[\d\s./:+\-–—()]+", stripped):
        return False
    return True


def split_whitespace(text: str) -> tuple[str, str, str]:
    match = re.match(r"^(\s*)(.*?)(\s*)$", text, re.S)
    if not match:
        return "", text, ""
    return match.group(1), match.group(2), match.group(3)


def collect_units(soup: BeautifulSoup) -> list[TextUnit]:
    units: list[TextUnit] = []

    for tag in soup.find_all(True):
        for attr in TRANSLATABLE_ATTRS:
            if attr not in tag.attrs:
                continue
            value = tag.attrs.get(attr)
            if not isinstance(value, str):
                continue
            leading, core, trailing = split_whitespace(value)
            if should_translate(core):
                units.append(
                    TextUnit(
                        kind="attr",
                        handle=tag,
                        original=value,
                        leading=leading,
                        core=core,
                        trailing=trailing,
                        attr_name=attr,
                    )
                )

    for node in soup.descendants:
        if isinstance(node, (Comment, Doctype)):
            continue
        if not isinstance(node, NavigableString):
            continue
        parent = getattr(node, "parent", None)
        if parent and parent.name in SKIP_PARENTS:
            continue
        text = str(node)
        leading, core, trailing = split_whitespace(text)
        if should_translate(core):
            units.append(
                TextUnit(
                    kind="text",
                    handle=node,
                    original=text,
                    leading=leading,
                    core=core,
                    trailing=trailing,
                )
            )

    return units


def chunked(items: list[str], max_items: int = 20, max_chars: int = 2600) -> Iterable[list[str]]:
    chunk: list[str] = []
    chars = 0
    for item in items:
        if chunk and (len(chunk) >= max_items or chars + len(item) > max_chars):
            yield chunk
            chunk = []
            chars = 0
        chunk.append(item)
        chars += len(item)
    if chunk:
        yield chunk


def extract_json_array(text: str) -> list[dict]:
    candidate = text.strip()
    if candidate.startswith("```"):
        candidate = re.sub(r"^```(?:json)?\s*", "", candidate)
        candidate = re.sub(r"\s*```$", "", candidate)
    decoder = json.JSONDecoder()
    for i, ch in enumerate(candidate):
        if ch != "[":
            continue
        try:
            value, _ = decoder.raw_decode(candidate[i:])
        except json.JSONDecodeError:
            continue
        if isinstance(value, list):
            return value
    raise ValueError(f"Could not decode JSON array from model output: {text[:400]}")


def call_qwen(model: str, system_prompt: str, user_prompt: str) -> str:
    response = completion(
        model=f"ollama/{model}",
        api_base="http://127.0.0.1:11434",
        extra_body={"think": False},
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        temperature=0.2,
        max_tokens=6000,
        timeout=600,
    )
    content = response.choices[0].message.content or ""
    if not content.strip():
        raise RuntimeError(f"Empty response from model {model}")
    return content


def translate_batch(
    model: str,
    page_label: str,
    texts: list[str],
    mode: str,
) -> list[str]:
    if mode == "first-pass":
        system_prompt = (
            "You are a professional website translator. Translate English into Vietnamese. "
            "Return JSON only. Keep meaning exact, keep numbering and proper nouns intact, "
            "and do not add commentary."
        )
        instructions = (
            "Translate each source string into clear Vietnamese. Keep the tone warm, reassuring, "
            "and premium. Preserve names like Crestway Global, personal names, university names, "
            "Toronto, Vancouver, Montreal, and program names unless standard Vietnamese usage clearly differs."
        )
    else:
        system_prompt = (
            "You are a Vietnamese copy editor writing polished, idiomatic website copy for a premium "
            "student support service. Return JSON only and preserve the original meaning."
        )
        instructions = (
            "Rewrite each Vietnamese draft to sound idiomatic, natural, and persuasive for contemporary "
            "readers in Ho Chi Minh City. Keep it polished rather than slangy. Preserve meaning, numbering, "
            "proper nouns, and accessibility clarity."
        )

    def run_batch(batch: list[str], batch_label: str) -> list[str]:
        payload = [{"id": i, "text": text} for i, text in enumerate(batch)]
        user_prompt = (
            f"Page: {page_label}\n"
            f"Task: {instructions}\n"
            "Return a JSON array of objects with the same ids, exactly in this shape:\n"
            '[{"id":0,"text":"..."}, {"id":1,"text":"..."}]\n'
            "Here are the strings:\n"
            f"{json.dumps(payload, ensure_ascii=False, indent=2)}"
        )
        try:
            raw = call_qwen(model, system_prompt, user_prompt)
            data = extract_json_array(raw)
        except Exception:
            if len(batch) == 1:
                raise
            midpoint = len(batch) // 2
            left = run_batch(batch[:midpoint], f"{batch_label}a")
            right = run_batch(batch[midpoint:], f"{batch_label}b")
            return left + right

        translated = {item["id"]: item["text"] for item in data if "id" in item and "text" in item}
        output: list[str] = []
        for index in range(len(batch)):
            if index not in translated:
                raise ValueError(f"Missing id {index} in {mode} response for {page_label} batch {batch_label}")
            output.append(str(translated[index]))
        return output

    output: list[str] = []
    for start, batch in enumerate(chunked(texts), start=1):
        output.extend(run_batch(batch, str(start)))
    return output


def rewrite_vi_href(href: str) -> str:
    if not href.startswith("/"):
        return href
    if href.startswith(("/images/", "/styles.css", "/client.js", "/zh/", "/vi/")):
        return href
    if re.search(r"\.(?:png|jpe?g|svg|webp|gif|ico|css|js|pdf)$", href):
        return href
    return vi_route(href)


def vi_route(href: str) -> str:
    if href == "/":
        return "/vi/"
    return f"/vi{href}"


def build_lang_toggle_html(route: str, locale: str, aria_label: str) -> str:
    buttons = [
        ("EN", route, locale == "en"),
        ("中文", zh_route(route), locale == "zh"),
        ("VI", vi_route(route), locale == "vi"),
    ]
    lines = [f'<div class="lang-toggle" role="group" aria-label="{aria_label}">']
    for label, href, active in buttons:
        class_name = "lang-btn is-active" if active else "lang-btn"
        lines.append(f'  <a class="{class_name}" href="{href}">{label}</a>')
    lines.append("</div>")
    return "\n".join(lines)


def update_existing_lang_toggle(page: str, locale: str) -> None:
    path = ROOT / page
    raw = path.read_text(encoding="utf-8")
    route = route_for_page(page.replace("zh/", "", 1))
    aria_label = "Language"
    replacement = build_lang_toggle_html(route, locale, aria_label)
    replacement = "\n".join("        " + line if line else line for line in replacement.splitlines())
    updated, count = re.subn(
        r'        <div class="lang-toggle" role="group" aria-label="[^"]+">.*?        </div>',
        replacement,
        raw,
        count=1,
        flags=re.S,
    )
    if count != 1:
        raise ValueError(f"Could not update lang toggle in {page}")
    path.write_text(updated, encoding="utf-8")


def generate_vi_page(page: str, first_pass_model: str, second_pass_model: str) -> None:
    source_path = ROOT / page
    route = route_for_page(page)
    soup = BeautifulSoup(source_path.read_text(encoding="utf-8"), "html.parser")
    units = collect_units(soup)
    source_texts = [unit.core for unit in units]
    if source_texts:
        first_pass = translate_batch(first_pass_model, route, source_texts, "first-pass")
        second_pass = translate_batch(second_pass_model, route, first_pass, "second-pass")
        for unit, translated in zip(units, second_pass):
            value = f"{unit.leading}{translated}{unit.trailing}"
            if unit.kind == "attr":
                unit.handle[unit.attr_name] = value
            else:
                unit.handle.replace_with(value)

    html_tag = soup.find("html")
    if html_tag is not None:
        html_tag["lang"] = "vi"

    for tag in soup.find_all(href=True):
        tag["href"] = rewrite_vi_href(tag["href"])

    toggle = soup.select_one(".lang-toggle")
    if toggle is not None:
        toggle.clear()
        toggle["aria-label"] = "Ngôn ngữ"
        fragment = BeautifulSoup(build_lang_toggle_html(route, "vi", "Ngôn ngữ"), "html.parser")
        toggle.replace_with(fragment.div)

    output_path = ROOT / "vi" / page
    output_path.parent.mkdir(parents=True, exist_ok=True)
    rendered = str(soup)
    if not rendered.lower().startswith("<!doctype"):
        rendered = "<!doctype html>\n" + rendered
    output_path.write_text(rendered + "\n", encoding="utf-8")


def normalize_vi_navigation(page: str) -> None:
    path = ROOT / "vi" / page
    soup = BeautifulSoup(path.read_text(encoding="utf-8"), "html.parser")
    route = route_for_page(page)

    for anchor in soup.select("header nav a[href]:not(.lang-btn), footer .footer-links a[href]"):
        href = anchor.get("href")
        if href in VI_CANONICAL_LINK_LABELS:
            anchor.string = VI_CANONICAL_LINK_LABELS[href]

    back_link = soup.select_one('p.gate-back a[href="/vi/partnerships/"]')
    if back_link is not None:
        back_link.string = "Quay lại Đối tác"

    toggle = soup.select_one(".lang-toggle")
    if toggle is not None:
        fragment = BeautifulSoup(build_lang_toggle_html(route, "vi", "Ngôn ngữ"), "html.parser")
        toggle.replace_with(fragment.div)

    rendered = str(soup)
    if not rendered.lower().startswith("<!doctype"):
        rendered = "<!doctype html>\n" + rendered
    path.write_text(rendered + "\n", encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--first-pass-model", default="qwen3:8b")
    parser.add_argument("--second-pass-model", default="qwen3:8b")
    parser.add_argument("--pages", nargs="*")
    parser.add_argument("--update-toggles-only", action="store_true")
    args = parser.parse_args()

    pages = args.pages or ENGLISH_PAGES

    if not args.update_toggles_only:
        for page in pages:
            print(f"Generating /vi for {page}", file=sys.stderr)
            generate_vi_page(page, args.first_pass_model, args.second_pass_model)

    for page in ENGLISH_PAGES:
        print(f"Normalizing VI navigation for vi/{page}", file=sys.stderr)
        normalize_vi_navigation(page)

    for page in ENGLISH_PAGES:
        print(f"Updating EN lang toggle for {page}", file=sys.stderr)
        update_existing_lang_toggle(page, "en")

    for page in ENGLISH_PAGES:
        zh_page = f"zh/{page}"
        print(f"Updating ZH lang toggle for {zh_page}", file=sys.stderr)
        update_existing_lang_toggle(zh_page, "zh")

    print("Vietnamese locale generation complete.", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
