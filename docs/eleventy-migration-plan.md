# Eleventy Migration Plan

## Why

Every nav or footer change currently requires editing 20+ HTML files (10 EN + 10+ ZH). Eleventy lets us extract shared markup into single-source partials and layouts. The site keeps its current URL structure and zero-framework CSS/JS approach — Eleventy only templates the HTML at build time.

## Prerequisites

- `bun add -d @11ty/eleventy` (Eleventy works fine under Bun)
- Add `.eleventy.js` config file
- Add a `_data/` folder for shared site data (site name, contact info, nav links)

## Step-by-step

### 1. Create the base layout

**File:** `_includes/base.njk`

This is a Nunjucks template containing the full HTML shell that every page shares: `<head>`, header, nav, footer, and the script tag. Use Nunjucks blocks so each page only defines its `<main>` content.

```
<!doctype html>
<html lang="{{ locale }}">
<head>
  <meta charset="utf-8" />
  <title>{{ title }} | Crestway Global</title>
  ...fonts, stylesheet...
</head>
<body>
  {% include "partials/header.njk" %}
  <main>
    {{ content | safe }}
  </main>
  {% include "partials/footer.njk" %}
  <script type="module" src="/client.js"></script>
</body>
</html>
```

### 2. Extract nav and footer into partials

**Files:** `_includes/partials/header.njk`, `_includes/partials/footer.njk`

Pull the current `<header>` and `<footer>` markup into these files. Use a data-driven nav loop:

```njk
{% for item in nav[locale] %}
  <a href="{{ item.href }}" data-nav-link
    {% if item.href == page.url %}class="is-active"{% endif %}>
    {{ item.label }}
  </a>
{% endfor %}
```

This eliminates the hardcoded `is-active` class on every page and the manual nav replication.

### 3. Create nav data file

**File:** `_data/nav.json`

```json
{
  "en": [
    { "href": "/about/", "label": "About" },
    { "href": "/services/", "label": "Services" },
    { "href": "/governance/", "label": "Governance" },
    { "href": "/difference/", "label": "Our Difference" },
    { "href": "/partnerships/", "label": "Partnerships" }
  ],
  "zh": [
    { "href": "/zh/about/", "label": "关于我们" },
    { "href": "/zh/services/", "label": "服务内容" },
    { "href": "/zh/governance/", "label": "治理与保障" },
    { "href": "/zh/difference/", "label": "独特优势" },
    { "href": "/zh/partnerships/", "label": "合作伙伴" }
  ]
}
```

One file to update when nav changes. Both languages.

### 4. Convert each page to a template

Each current HTML file (e.g., `about/index.html`) becomes a Nunjucks file with frontmatter:

```njk
---
title: About Us
locale: en
layout: base.njk
---

<section class="page-hero has-bg bg-library" aria-labelledby="page-hero-title">
  ...only the <main> content, no header/footer...
</section>
```

This is the bulk of the work — 20+ files — but it's purely mechanical: delete the repeated header/footer/head, add 3 lines of frontmatter.

### 5. Handle the EN/ZH locale pattern

Two approaches (pick one):

**A. Directory-based (simplest, matches current structure):**
- EN pages live in root: `about/index.njk`
- ZH pages live in `zh/`: `zh/about/index.njk`
- Each ZH page sets `locale: zh` in frontmatter
- The layout reads `locale` to pick the right nav array and lang attribute

**B. Eleventy i18n plugin:**
- More automatic but adds config complexity
- Overkill for 2 locales

Recommend option A — it matches the current directory structure exactly, so URLs don't change.

### 6. Configure Eleventy

**File:** `.eleventy.js`

```js
module.exports = function(eleventyConfig) {
  // Pass through static assets unchanged
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("styles.css");
  eleventyConfig.addPassthroughCopy("client.js");
  eleventyConfig.addPassthroughCopy("vercel.json");

  return {
    dir: {
      input: "src",      // move templates here
      output: "_site",    // build output
      includes: "_includes"
    }
  };
};
```

### 7. Update Vercel config

Change Vercel to serve from `_site/` instead of root, or add a build command:

```json
{
  "buildCommand": "npx @11ty/eleventy",
  "outputDirectory": "_site"
}
```

### 8. Update dev workflow

Replace `bun dev-server.ts` with:
```bash
npx @11ty/eleventy --serve
```

Eleventy's built-in dev server handles live reload. The existing `client.ts` → `client.js` build step can be a before-build script or kept as a separate watch.

## What doesn't change

- `styles.css` — untouched
- `client.ts` / `client.js` — untouched
- All URLs — identical output structure
- Image paths — passthrough copy
- Vercel hosting — just needs build command added

## Migration checklist

- [ ] Install Eleventy
- [ ] Create `_includes/base.njk` layout
- [ ] Extract header partial with data-driven nav
- [ ] Extract footer partial
- [ ] Create `_data/nav.json`
- [ ] Convert EN pages (10 files) to templates
- [ ] Convert ZH pages (10+ files) to templates
- [ ] Create book pages as templates
- [ ] Configure `.eleventy.js`
- [ ] Update `vercel.json` build config
- [ ] Test all URLs match previous structure
- [ ] Verify EN/ZH lang toggle links still work
- [ ] Delete old `dev-server.ts` (replaced by Eleventy serve)
