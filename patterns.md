# Crestway Global — UI Patterns

## Layout Primitives

- `.stack` / `.stack-lg` — vertical rhythm via `> * + *`. Set `--space` to override gap.
- `.with-sidebar` — two elements, first fixed width, second flexible. Wraps vertically at narrow widths.
- `.with-sidebar-rev` — reversed: first element flexible, second fixed.
- `.switcher` — horizontal row above 30rem threshold, vertical column below.
- `.cluster` — inline wrapping group for buttons, tags, nav links.
- `.cover` — vertically centered principal element in min-height container.
- `.frame` — aspect-ratio locked media container. Set `--ratio` (default 16/9).
- `.center` — constrained centered content with inline padding.
- `.wrap` — page-width container (70rem max, 90vw).

## Sections

- `.section` — standard section padding (var(--s4) block).
- `.section.bg-sand` — sand background for alternating sections.
- `.section.bg-forest` — dark forest background, white text.
- `.section-head` — heading group (eyebrow + h2 + optional p), margin below.

## Components

- `.eyebrow` — uppercase label with left horizontal rule.
- `.btn.primary` — filled button (forest green).
- `.btn.ghost` — outlined button.
- `.cta-block` — Sidebar layout for end-of-page CTAs (text left, buttons right).
- `.final-cta` — full-width dark CTA section, centered text.

## Page-Specific Patterns

### Homepage
- `.hero-home` — asymmetric Sidebar hero (text 28rem + image flexible).
- `.services-grid` / `.services-row` — asymmetric 2:1/1:2/2:1 card pairs.
- `.service-card--image` — image-background card with gradient overlay.
- `.service-card--solid` — solid-color card (sand or forest-dark).
- `.testimonial` — featured quote rotator (single slide visible, dots below).
- `.city-card` — image-background card with text overlay.
- `.partners-banner` — full-width scrolling logo strip.

### Services
- `.pillar` — Sidebar with number/title one side, detail list other side.

### About
- `.founder` — Sidebar with photo frame + bio text.

### Ambassadors
- `.ambassador-profile` — Sidebar with photo + full bio. Alternates via with-sidebar / with-sidebar-rev.

### Difference
- `.fact` — Sidebar with oversized number + description.

### Parents
- `.flow-steps` — Cluster of numbered steps with arrows.
- `.reassurance-item` — flex row with checkmark + content.

### Problem
- `.gap-item` — Sidebar with number + statement.

## Typography

- Headlines: Fraunces (variable), weight 500 (h1) / 600 (h2, h3)
- Body: Plus Jakarta Sans 400
- Eyebrows: Plus Jakarta Sans 500, uppercase, 0.15em letter-spacing

## Colors

- `--forest` (#29738e) — primary accent
- `--forest-dark` (#1d5a70) — dark accent, dark section backgrounds
- `--cream` (#faf7f2) — page background
- `--sand` (#f0ede8) — alternate section background
- `--ink` (#000) — headings
- `--ink-soft` (#7f6f62) — body text

## Spacing

Modular scale, ratio 1.5: `--s-2` through `--s5`. All spacing uses scale values.
