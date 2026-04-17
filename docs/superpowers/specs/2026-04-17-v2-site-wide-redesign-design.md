# Crestway Global — v2 Site-Wide Redesign

**Date:** 2026-04-17
**Scope:** All 9 English pages. Chinese locale deferred.
**Approach:** v2 homepage as visual direction, resolve AI design tells, rebuild CSS on Every Layout primitives.

---

## Design System

### Typography

- **Headlines (h1, h2, h3):** Fraunces (variable, optical sizing). Weight 500 for h1 (large, lighter), 600 for h2/h3. Let size carry hierarchy, not weight.
- **Body, nav, buttons, labels:** Plus Jakarta Sans 400. Nav weight 500.
- **Eyebrows (when used):** Plus Jakarta Sans 500, small caps, extra-wide letter-spacing (0.12em+), paired with a short horizontal rule to the left.

### Spacing (modular scale, ratio 1.5)

```
--s-2: 0.44rem    --s-1: 0.67rem    --s0: 1rem
--s1: 1.5rem      --s2: 2.25rem     --s3: 3.375rem
--s4: 5.063rem    --s5: 7.594rem
```

All spacing values from this scale. No magic pixel numbers.

### Colors (unchanged)

```
--ink: #000000          --ink-soft: #7f6f62
--forest: #29738e       --forest-dark: #1d5a70
--sand: #f0ede8         --cream: #faf7f2
--border: rgba(0,0,0,0.10)
```

### Layout Primitives

Built from Every Layout. These replace one-off flex/grid per component.

- **Stack** (`> * + *`): vertical rhythm. Configurable via `--space`.
- **Center**: `max-inline-size` + `margin-inline: auto` + `padding-inline`.
- **Sidebar**: flex-wrap, one child has fixed ideal width, other flexes. Wraps to vertical intrinsically.
- **Switcher**: flex-basis calc trick — row above threshold, column below. No media query.
- **Cluster**: flex-wrap for inline groups (nav, buttons, tags).
- **Cover**: flex-column with min-block-size for hero sections.
- **Frame**: aspect-ratio locked containers for images/video.

### Global Rules

- **Measure axiom:** `max-inline-size: 60ch` on text elements globally. Container elements (`html`, `body`, `div`, `header`, `main`, `footer`, `section`, `article`) exempted.
- **Logical properties** throughout: `inline-size`, `block-size`, `margin-inline`, `padding-block`, etc.
- **Fluid typography:** `clamp()` for headings. No px font sizes.
- **Responsive:** intrinsic via primitives. Media queries only for genuine layout reconfiguration (e.g., mobile nav drawer), not incremental adjustments.

---

## Shared Components

### Header

Minimal changes from current:
- Brand-mark in Fraunces (unchanged)
- Nav links in Plus Jakarta Sans
- Cluster primitive for nav layout
- Keep sticky behavior, lang toggle, hamburger, mobile drawer
- `nav-cta` pill button restyled with spacing scale

### Footer

Simplified from 3-column link dump to 2 horizontal rows:
- **Top row:** brand-mark (left) + inline row of page links (right).
- **Bottom row:** contact info (left) + social links inline (right). Muted, small type.

### Page Heroes (Interior Pages)

- Drop background-image overlays. Solid cream/sand background.
- Fraunces headline (large, weight 500), lede text in Plus Jakarta Sans.
- Left-aligned. No eyebrow on heroes — the nav already identifies the page.

### CTA Blocks

- Sidebar primitive: heading + text on one side, buttons on the other.
- One primary button, one ghost maximum.
- Reused across all pages that end with a call-to-action.

### Eyebrow Usage

- Cut to ~half the sections (only where a genuine category shift occurs).
- Styled as Plus Jakarta Sans 500, wide letter-spacing, with a short horizontal rule to the left.
- Not centered above headings (badge-above-headline is an AI tell).

### FAQ Sections

- Removed entirely. FAQ/collapsible-details sections are an AI tell per Quit Designing.
- Parents page FAQ content converted to prose with subheadings.
- Homepage FAQ already absent in v2.

---

## Homepage

v2/index.html structure adopted as starting point with the following modifications:

### 1. Hero

- Asymmetric split: text 1.3fr, image 0.7fr (Sidebar primitive).
- Drop the eyebrow ("New Country. Trusted Support.").
- Headline in Fraunces 500, fluid size via `clamp()`.
- Single "Book a Consultation" CTA button.
- The three-item rail from the current homepage is retired.

### 2. Partner Logos

- Seamless infinite scroll animation: clone the logo set, continuous `translateX`, linear timing, no visible seam.
- Pause on hover.
- `prefers-reduced-motion` media query: show static row instead.

### 3. About

- Image + text split using Sidebar primitive.
- Fraunces headline. Ghost button to /about/.

### 4. Services

- **Asymmetric pairs.** Three rows of two cards with deliberately unequal sizing (2:1 / 1:2 / 2:1).
- Alternating between image-background cards (with gradient overlay) and solid-color cards (sand/forest).
- Each card has a number tag, title, one-line description, and link to /services/.
- Breaks the "uniform cards with identical sizing" AI tell through scale variation and material alternation.

### 5. Testimonials

- **Featured quote, single focus.**
- Large photo on the left (Frame primitive with rounded corners).
- Oversized opening quote mark in muted forest color.
- Quote text in Fraunces italic.
- Attribution: name + university only (not "Name · Program · Year").
- Progress dots below. Auto-rotates (reuse existing 30-second auto-switch logic from client.ts). Pauses on interaction.
- "Meet All Ambassadors" link below.

### 6. Cities

- Three city cards: Toronto (active), Vancouver (coming soon), Montreal (coming soon).
- Image-background cards with overlay. The "Coming Soon" badges break uniformity naturally.
- Restyle with new spacing tokens and radii.

### 7. Final CTA

- `--forest-dark` background, white text, centered.
- Fraunces headline, single primary button.

---

## Interior Pages

### Services (`/services/`)

- Text-focused hero (cream background, no image overlay).
- Six pillars: each pillar uses the Sidebar primitive — number/title on one side, outcome + bulleted details on the other. Odd pillars: number left, content right. Even pillars: reversed.
- "Our Approach" section: three items in a Switcher (row at wide, column at narrow).
- Pricing section: Sidebar primitive, text left, CTA right.

### About (`/about/`)

- Text-focused hero.
- Mission: Stack with centered text (Center primitive).
- Founders: each founder is a Sidebar — photo on one side, bio on the other. Dave left-aligned, Doug right-aligned, for visual alternation.
- Team: simple text section (Stack).
- Values: four items in a Switcher.
- CTA block at bottom.

### Governance (`/governance/`)

- Text-focused hero.
- Replace 3×N identical governance-card grids. Each governance topic becomes a full-width section with alternating cream/sand backgrounds. Within each section, items laid out with the Sidebar primitive or as a Stack of items.
- Compliance section: items in a Switcher.

### Difference (`/difference/`)

- Text-focused hero.
- Comparison section: clean single-column list, styled with Stack.
- Three pillars: Switcher (not identical cards).
- Key facts (24/7, 1, Monthly, Week 1): moderate oversized numbers (not structural-scale, just ~2rem), using the Sidebar for number + description.
- Parent assurance: four items in a Switcher.
- CTA block at bottom.

### Partnerships (`/partnerships/`)

- Text-focused hero.
- Three audience sections (Institutions, Agents, Businesses): each uses a Sidebar — audience label on one side, benefit items as a Stack on the other.
- "Why Crestway Global": five items in a Switcher.
- Two CTA blocks at bottom (universities + general).

### Parents (`/parents/`)

- Text-focused hero.
- Priority section: four items in a Switcher. Drop the emoji icons — no icons, just title + description.
- "What you can count on": Stack of reassurance items with checkmarks (these are fine — they're a list, not a card grid).
- Communication flow (01 → 02 → 03): keep the step-flow layout, restyle with spacing scale. Use Cluster for the horizontal arrows.
- FAQ section removed. Content converted to prose with subheadings under a "Common Questions" heading.
- CTA at bottom.

### Ambassadors (`/ambassadors/`)

- Text-focused hero.
- Drop the "program grid" of 4 identical program-item cards. Replace with a brief intro paragraph (Stack).
- Ambassador profiles: each is a Sidebar — photo on one side, full bio on the other. Alternate sides (photo left, photo right, photo left...) for rhythm.
- CTA at bottom ("Want to become a Student Ambassador?").

### Problem (`/problem/`)

- Text-focused hero.
- "The Challenge" section: centered text (Center + Stack).
- Gap list: numbered items with moderately oversized numbers (~2rem). Stack layout.
- Short page, minimal structural change.

### Book (`/book/`)

- Update header/footer to new design.
- Update typography around the iframe.
- No structural changes — the page is an iframe form.

### Partnerships/Universities (`/partnerships/universities/`)

- Token treatment only (fonts, spacing, colors). No structural redesign.

---

## CSS Architecture

### File Structure

Single `styles.css` replaces both the current `styles.css` and `v2/styles.css`:

1. **Custom properties** — colors, spacing scale, typography, radii
2. **Global reset + measure axiom**
3. **Layout primitives** — Stack, Center, Sidebar, Switcher, Cluster, Cover, Frame
4. **Shared components** — header, footer, buttons, eyebrow, CTA block
5. **Page-specific styles** — homepage hero, services grid, testimonial, ambassador profiles, etc.
6. **Utilities** — single-purpose classes as needed

### Key Deletions

- `v2/styles.css` — merged into main
- `v2/index.html` — content merged into root `index.html`
- All current one-off grid/card classes that duplicate patterns (governance-grid, partner-benefits, priority-grid, program-grid, etc.) — replaced by primitives

### patterns.md

Created at project root. Documents all layout primitives, grid variants, section patterns, card styles, color treatments, and spacing conventions. Updated as part of implementation.

---

## JS Changes (client.ts)

- **Testimonial rotation:** adapt existing 30-second auto-switch logic (currently on parents hero panel) for the homepage testimonial. Pause on hover/focus.
- **Partner logo scroll:** add seamless infinite scroll animation. Clone logo set on init, animate via `translateX`, respect `prefers-reduced-motion`.
- **Scroll reveals:** existing IntersectionObserver logic stays. No changes needed.
- **Access gate:** unchanged.
- **Mobile menu:** unchanged beyond CSS token updates.

---

## Out of Scope

- Chinese locale (`/zh/`) — deferred to a follow-up.
- New images or photography — use existing image assets.
- Content rewrites — all existing copy preserved; only structural reorganization.
- Capacitor/mobile app changes.
- Analytics or SEO changes.
