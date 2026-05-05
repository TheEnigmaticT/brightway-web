#!/usr/bin/env python3

from __future__ import annotations

import csv
import re
from dataclasses import dataclass, field
from html.parser import HTMLParser
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
VI_ROOT = ROOT / "vi"
OUTPUT = ROOT / "vietnamese-copy-review.csv"

TRANSLATABLE_ATTRS = ("title", "alt", "aria-label", "placeholder", "value")
SKIP_TEXT_PARENTS = {"script", "style", "noscript", "svg"}
SKIP_INPUT_TYPES = {"hidden", "submit"}
VOID_TAGS = {
    "area",
    "base",
    "br",
    "col",
    "embed",
    "hr",
    "img",
    "input",
    "link",
    "meta",
    "source",
    "track",
    "wbr",
}
PAGE_ORDER = [
    "vi/index.html",
    "vi/about/index.html",
    "vi/services/index.html",
    "vi/governance/index.html",
    "vi/difference/index.html",
    "vi/partnerships/index.html",
    "vi/partnerships/universities/index.html",
    "vi/parents/index.html",
    "vi/problem/index.html",
    "vi/ambassadors/index.html",
    "vi/book/index.html",
]


@dataclass
class CopyEntry:
    text: str
    first_seen: int
    pages: set[str] = field(default_factory=set)
    locations: list[str] = field(default_factory=list)
    kinds: set[str] = field(default_factory=set)


def page_route(path: Path) -> str:
    rel = path.relative_to(ROOT).as_posix()
    route = "/" + rel.removesuffix("index.html")
    return route if route != "/vi/" else "/vi/"


def page_label(path: Path) -> str:
    route = page_route(path).removeprefix("/vi/").strip("/")
    return "Homepage" if not route else route.replace("/", " / ").title()


def clean_text(text: str) -> str:
    return re.sub(r"\s+", " ", text).strip()


def should_include(text: str) -> bool:
    text = clean_text(text)
    if not text:
        return False
    if re.fullmatch(r"[\d\s./:+\-–—()]+", text):
        return False
    return True


def locator_for_tag(stack: list[tuple[str, dict[str, str]]]) -> str:
    parts: list[str] = []
    for name, attrs in stack:
        if name in {"html", "body"}:
            continue
        selector = name
        tag_id = attrs.get("id")
        classes = (attrs.get("class") or "").split()
        if tag_id:
            selector += f"#{tag_id}"
        elif classes:
            selector += "." + ".".join(classes[:2])
        parts.append(selector)
    return " > ".join(parts[-4:])


def add_entry(
    entries: dict[str, CopyEntry],
    text: str,
    page: str,
    location: str,
    kind: str,
    order: int,
) -> None:
    text = clean_text(text)
    if not should_include(text):
        return
    entry = entries.setdefault(text, CopyEntry(text=text, first_seen=order))
    entry.pages.add(page)
    entry.kinds.add(kind)
    if location not in entry.locations:
        entry.locations.append(location)


class CopyHTMLParser(HTMLParser):
    def __init__(self, page: str, entries: dict[str, CopyEntry], order_start: int) -> None:
        super().__init__(convert_charrefs=True)
        self.page = page
        self.entries = entries
        self.order = order_start
        self.stack: list[tuple[str, dict[str, str]]] = []

    def add(self, text: str, location: str, kind: str) -> None:
        self.order += 1
        add_entry(self.entries, text, self.page, location, kind, self.order)

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attr_map = {name: value or "" for name, value in attrs}
        current_stack = self.stack + [(tag, attr_map)]

        if not (tag == "input" and attr_map.get("type") in SKIP_INPUT_TYPES):
            for attr in TRANSLATABLE_ATTRS:
                value = attr_map.get(attr)
                if value is not None:
                    self.add(
                        value,
                        f"{locator_for_tag(current_stack)}@{attr}",
                        f"attribute:{attr}",
                    )

        if tag not in VOID_TAGS:
            self.stack.append((tag, attr_map))

    def handle_endtag(self, tag: str) -> None:
        for index in range(len(self.stack) - 1, -1, -1):
            if self.stack[index][0] == tag:
                del self.stack[index:]
                break

    def handle_data(self, data: str) -> None:
        if not self.stack:
            return
        parent = self.stack[-1][0]
        if parent in SKIP_TEXT_PARENTS:
            return
        self.add(data, locator_for_tag(self.stack), "text")


def collect_from_page(path: Path, entries: dict[str, CopyEntry], order_start: int) -> int:
    parser = CopyHTMLParser(page_label(path), entries, order_start)
    parser.feed(path.read_text(encoding="utf-8"))
    return parser.order


def main() -> int:
    entries: dict[str, CopyEntry] = {}
    ordered = [ROOT / page for page in PAGE_ORDER]
    remaining = sorted(page for page in VI_ROOT.glob("**/index.html") if page not in ordered)
    pages = [page for page in ordered if page.exists()] + remaining
    order = 0
    for page in pages:
        order = collect_from_page(page, entries, order)

    rows = sorted(entries.values(), key=lambda entry: entry.first_seen)
    with OUTPUT.open("w", encoding="utf-8-sig", newline="") as handle:
        writer = csv.writer(handle)
        writer.writerow(
            [
                "String ID",
                "Vietnamese Text",
                "Pages",
                "Kind",
                "Locations",
                "Reviewer Feedback",
            ]
        )
        for index, entry in enumerate(rows, start=1):
            writer.writerow(
                [
                    f"vi-{index:03d}",
                    entry.text,
                    "; ".join(sorted(entry.pages)),
                    "; ".join(sorted(entry.kinds)),
                    "; ".join(entry.locations),
                    "",
                ]
            )

    print(f"Wrote {len(rows)} unique Vietnamese strings from {len(pages)} pages to {OUTPUT}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
