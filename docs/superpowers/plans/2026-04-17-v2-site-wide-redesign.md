# v2 Site-Wide Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle all 9 English pages using v2 as visual direction — resolving AI design tells, rebuilding CSS on Every Layout primitives, and creating a unified design system.

**Architecture:** Single CSS file rewritten from scratch around a modular spacing scale and layout primitives (Stack, Center, Sidebar, Switcher, Cluster, Cover, Frame). Typography switches to Fraunces (headlines) + Plus Jakarta Sans (body). Homepage adopts v2 structure with asymmetric services grid and featured-quote testimonials. Interior pages restructured per spec. No build step needed — Bun compiles client.ts to client.js, static files served by Vercel.

**Tech Stack:** Vanilla HTML/CSS/TypeScript, Bun (dev server + build), Vercel (deploy)

**Spec:** `docs/superpowers/specs/2026-04-17-v2-site-wide-redesign-design.md`

**Dev server:** `bun dev-server.ts` (port 8085)

---

## File Map

### Created
- `styles.css` — complete rewrite (replaces current 2699-line file)
- `patterns.md` — design system documentation
- `client.js` — rebuilt from client.ts (Bun compiles)

### Modified
- `client.ts` — add testimonial rotation, remove dead tab/panel code
- `index.html` — replace with v2-based homepage
- `about/index.html` — restructure with primitives
- `services/index.html` — restructure with Sidebar pillars
- `governance/index.html` — restructure, remove uniform card grids
- `difference/index.html` — restructure with Switcher/Sidebar
- `partnerships/index.html` — restructure with Sidebar audience sections
- `parents/index.html` — remove FAQ, drop emoji icons, restructure
- `ambassadors/index.html` — alternating profile layout
- `problem/index.html` — restyle with new tokens
- `book/index.html` — update header/footer/typography

### Deleted
- `v2/` directory (contents merged into root)

---

## Task 1: CSS Foundation — Custom Properties, Reset, Primitives

**Files:**
- Rewrite: `styles.css` (replace entire file)

This task creates the design system CSS layer: custom properties, global reset, measure axiom, and all layout primitives. No page-specific styles yet — those come in later tasks. Every subsequent task depends on this one.

- [ ] **Step 1: Write the custom properties block**

Write the top of `styles.css` with color tokens, spacing scale, typography, and radii:

```css
:root {
  color-scheme: light;

  /* Colors */
  --ink: #000000;
  --ink-soft: #7f6f62;
  --forest: #29738e;
  --forest-dark: #1d5a70;
  --forest-bright: #5f96aa;
  --sand: #f0ede8;
  --cream: #faf7f2;
  --border: rgba(0, 0, 0, 0.10);

  /* Spacing — modular scale, ratio 1.5 */
  --ratio: 1.5;
  --s-2: calc(var(--s-1) / var(--ratio));
  --s-1: calc(var(--s0) / var(--ratio));
  --s0: 1rem;
  --s1: calc(var(--s0) * var(--ratio));
  --s2: calc(var(--s1) * var(--ratio));
  --s3: calc(var(--s2) * var(--ratio));
  --s4: calc(var(--s3) * var(--ratio));
  --s5: calc(var(--s4) * var(--ratio));

  /* Radii */
  --radius-lg: 28px;
  --radius-md: 18px;
  --radius-sm: 10px;
}
```

- [ ] **Step 2: Write the global reset and measure axiom**

Append to `styles.css`:

```css
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

* {
  max-inline-size: 60ch;
}

html, body, div, header, nav, main, footer,
section, article, aside, figure, figcaption,
img, video, iframe, picture, svg,
ul, ol, dl, table, form, fieldset {
  max-inline-size: none;
}

body {
  font-family: "Plus Jakarta Sans", "Space Grotesk", "Trebuchet MS", sans-serif;
  color: var(--ink);
  background: var(--cream);
  line-height: 1.6;
  font-size: 1rem;
}

a { color: inherit; text-decoration: none; }
img { max-inline-size: 100%; block-size: auto; display: block; }
ul, ol { padding-inline-start: 1.2em; }
```

- [ ] **Step 3: Write the typography system**

Append to `styles.css`:

```css
/* === Typography === */

h1, h2, h3 {
  font-family: "Fraunces", "Times New Roman", serif;
  line-height: 1.15;
  text-wrap: balance;
}

h1 {
  font-size: clamp(2.4rem, 1rem + 3.5vw, 3.6rem);
  font-weight: 500;
  letter-spacing: -0.01em;
}

h2 {
  font-size: clamp(1.8rem, 1rem + 2.5vw, 2.6rem);
  font-weight: 600;
}

h3 {
  font-size: clamp(1.15rem, 0.8rem + 1vw, 1.4rem);
  font-weight: 600;
}

h4 {
  font-size: 1rem;
  font-weight: 600;
}

p { color: var(--ink-soft); }
h1, h2, h3, h4 { color: var(--ink); }

.eyebrow {
  font-family: "Plus Jakarta Sans", sans-serif;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--forest);
  display: flex;
  align-items: center;
  gap: var(--s-1);
}

.eyebrow::before {
  content: "";
  display: block;
  inline-size: 1.5rem;
  block-size: 2px;
  background: var(--forest);
}
```

- [ ] **Step 4: Write the layout primitives**

Append to `styles.css`:

```css
/* === Layout Primitives === */

/* Stack: vertical rhythm */
.stack > * + * {
  margin-block-start: var(--space, var(--s1));
}

.stack-lg > * + * {
  margin-block-start: var(--space, var(--s3));
}

/* Center: constrained centered content */
.center {
  box-sizing: content-box;
  max-inline-size: var(--measure, 70rem);
  margin-inline: auto;
  padding-inline: var(--s1);
}

/* Sidebar: two elements, one fixed ideal width, one flexible */
.with-sidebar {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space, var(--s2));
}

.with-sidebar > :first-child {
  flex-basis: 20rem;
  flex-grow: 1;
}

.with-sidebar > :last-child {
  flex-basis: 0;
  flex-grow: 999;
  min-inline-size: 50%;
}

/* Sidebar reversed: wide element first */
.with-sidebar-rev {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space, var(--s2));
}

.with-sidebar-rev > :first-child {
  flex-basis: 0;
  flex-grow: 999;
  min-inline-size: 50%;
}

.with-sidebar-rev > :last-child {
  flex-basis: 20rem;
  flex-grow: 1;
}

/* Switcher: row above threshold, column below */
.switcher {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space, var(--s1));
}

.switcher > * {
  flex-grow: 1;
  flex-basis: calc((30rem - 100%) * 999);
}

/* Cluster: inline wrapping group */
.cluster {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space, var(--s0));
  align-items: center;
}

/* Cover: vertically centered hero sections */
.cover {
  display: flex;
  flex-direction: column;
  min-block-size: var(--cover-min, 50vh);
  padding: var(--s2);
}

.cover > * { margin-block: var(--s0); }
.cover > .principal { margin-block: auto; }

/* Frame: aspect-ratio locked media */
.frame {
  aspect-ratio: var(--ratio, 16 / 9);
  overflow: hidden;
  border-radius: var(--radius-lg);
}

.frame > * {
  inline-size: 100%;
  block-size: 100%;
  object-fit: cover;
}

/* Wrap: page-width container (replaces .wrap) */
.wrap {
  inline-size: min(70rem, 90vw);
  margin-inline: auto;
}
```

- [ ] **Step 5: Write shared component styles — buttons**

Append to `styles.css`:

```css
/* === Buttons === */

.btn {
  display: inline-block;
  font-family: "Plus Jakarta Sans", sans-serif;
  font-size: 0.95rem;
  font-weight: 500;
  padding: var(--s-1) var(--s1);
  border-radius: 999px;
  border: 2px solid transparent;
  cursor: pointer;
  transition: background 0.2s, color 0.2s, border-color 0.2s;
}

.btn.primary {
  background: var(--forest);
  color: #fff;
  border-color: var(--forest);
}

.btn.primary:hover {
  background: var(--forest-dark);
  border-color: var(--forest-dark);
}

.btn.ghost {
  background: transparent;
  color: var(--forest);
  border-color: var(--forest);
}

.btn.ghost:hover {
  background: var(--forest);
  color: #fff;
}
```

- [ ] **Step 6: Write shared component styles — header**

Append to `styles.css`:

```css
/* === Header === */

.site-header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: rgba(250, 247, 242, 0.92);
  backdrop-filter: blur(8px);
  border-block-end: 1px solid var(--border);
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-block: var(--s-1);
  gap: var(--s0);
}

.brand {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.brand-mark {
  font-family: "Fraunces", "Times New Roman", serif;
  font-size: 1.35rem;
  letter-spacing: 0.01em;
  font-weight: 600;
}

.brand-sub {
  font-size: 0.55rem;
  color: var(--forest);
  text-transform: uppercase;
  letter-spacing: 0.15em;
  font-weight: 500;
  white-space: nowrap;
}

.nav {
  display: flex;
  align-items: center;
  gap: var(--s1);
  font-size: 0.95rem;
  font-weight: 500;
}

.nav a {
  white-space: nowrap;
  padding-block-end: 4px;
  border-block-end: 3px solid transparent;
  transition: border-color 0.2s, color 0.2s;
}

.nav a.is-active,
.nav a:hover {
  border-color: var(--forest);
  color: var(--forest-dark);
}

.nav-cta {
  padding: var(--s-2) var(--s0) !important;
  border-radius: 999px !important;
  background: var(--forest);
  color: #fff !important;
  border: none !important;
}

.nav-cta:hover {
  background: var(--forest-dark);
}

.lang-toggle {
  display: inline-flex;
  gap: 6px;
  padding: 4px;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: #fff;
}

.lang-btn {
  font-size: 0.8rem;
  letter-spacing: 0.08em;
  padding: 4px 10px;
  border-radius: 999px;
  color: var(--forest-dark);
}

.lang-btn.is-active {
  background: var(--forest-dark);
  color: #fff;
}

.menu-toggle {
  display: none;
  border: 1px solid var(--border);
  background: #fff;
  padding: var(--s-2) var(--s-1);
  border-radius: 999px;
  font-size: 0.9rem;
  cursor: pointer;
}
```

- [ ] **Step 7: Write shared component styles — footer**

Append to `styles.css`. New 2-row footer layout:

```css
/* === Footer === */

.site-footer {
  border-block-start: 1px solid var(--border);
  padding-block: var(--s3);
  font-size: 0.85rem;
  color: var(--ink-soft);
}

.footer-top {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--s1);
  padding-block-end: var(--s2);
  border-block-end: 1px solid var(--border);
}

.footer-top .brand-mark {
  font-size: 1.1rem;
  margin-block-end: var(--s-2);
}

.footer-links {
  display: flex;
  flex-wrap: wrap;
  gap: var(--s0);
  align-items: center;
}

.footer-links a:hover { color: var(--forest); }

.footer-bottom {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: var(--s0);
  padding-block-start: var(--s1);
}

.footer-social {
  display: flex;
  gap: var(--s0);
}

.footer-social a:hover { color: var(--forest); }
```

- [ ] **Step 8: Write shared component styles — page heroes, sections, CTA blocks, scroll reveals**

Append to `styles.css`:

```css
/* === Page Heroes (interior) === */

.page-hero {
  padding-block: var(--s4) var(--s3);
  background: var(--cream);
}

.page-hero h1 { margin-block-end: var(--s0); }

.page-hero-lede {
  font-size: 1.1rem;
  color: var(--ink-soft);
  line-height: 1.7;
}

/* === Sections === */

.section {
  padding-block: var(--s4);
}

.section.bg-sand { background: var(--sand); }
.section.bg-forest { background: var(--forest-dark); color: #fff; }
.section.bg-forest h2, .section.bg-forest h3 { color: #fff; }
.section.bg-forest p { color: rgba(255, 255, 255, 0.85); }
.section.bg-forest .eyebrow { color: rgba(255, 255, 255, 0.7); }
.section.bg-forest .eyebrow::before { background: rgba(255, 255, 255, 0.4); }

.section-head {
  margin-block-end: var(--s2);
}

.section-head h2 { margin-block-end: var(--s-1); }

/* === CTA Blocks === */

.cta-block {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space, var(--s2));
  align-items: center;
}

.cta-block > :first-child {
  flex-basis: 0;
  flex-grow: 999;
  min-inline-size: 50%;
}

.cta-block > :last-child {
  flex-basis: 15rem;
  flex-grow: 1;
}

.cta-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--s-1);
}

/* === Final CTA (full-width dark) === */

.final-cta {
  background: var(--forest-dark);
  color: #fff;
  text-align: center;
  padding-block: var(--s4);
}

.final-cta h2 { color: #fff; margin-block-end: var(--s-1); }
.final-cta p { color: rgba(255, 255, 255, 0.8); margin-block-end: var(--s2); margin-inline: auto; }

/* === Scroll reveals === */

[data-reveal] {
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

[data-reveal].is-visible {
  opacity: 1;
  transform: none;
}

/* === Mobile nav === */

@media (max-width: 48rem) {
  .menu-toggle { display: block; }

  .nav {
    display: none;
    position: absolute;
    top: 100%;
    inset-inline: 0;
    background: var(--cream);
    flex-direction: column;
    padding: var(--s1);
    border-block-end: 1px solid var(--border);
    gap: var(--s-1);
  }

  .nav.is-open { display: flex; }
}

/* Reduced motion: disable scroll animations and reveals */
@media (prefers-reduced-motion: reduce) {
  .partners-track { animation: none !important; transform: none !important; }
  [data-reveal] { opacity: 1; transform: none; transition: none; }
}
```

- [ ] **Step 9: Verify foundation renders**

Run: `bun dev-server.ts`

Open `http://localhost:8085` — expect the current homepage to render with the new base typography (Plus Jakarta Sans body, Fraunces headlines) and spacing. The page will look partially broken because page-specific styles are gone. That's expected — they're added in subsequent tasks.

- [ ] **Step 10: Commit**

```bash
git add styles.css
git commit -m "feat: rewrite CSS foundation — design tokens, primitives, shared components"
```

---

## Task 2: Update Google Fonts Links Across All HTML Files

**Files:**
- Modify: all `index.html` files (root + 8 subdirectories)

Every HTML file currently loads `Fraunces` + `Space Grotesk`. We need to add `Plus Jakarta Sans` to the font request. Use the same combined URL as v2.

- [ ] **Step 1: Update the Google Fonts link in all HTML files**

In every `index.html` file, replace:
```html
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500,600&family=Space+Grotesk:wght@300,400,500,600&display=swap" rel="stylesheet" />
```
with:
```html
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Fraunces:opsz,wght@9..144,400,500,600&family=Space+Grotesk:wght@300,400,500,600&display=swap" rel="stylesheet" />
```

Files to update (10 total):
- `index.html`
- `about/index.html`
- `services/index.html`
- `governance/index.html`
- `difference/index.html`
- `partnerships/index.html`
- `parents/index.html`
- `ambassadors/index.html`
- `problem/index.html`
- `book/index.html`

Note: also add Fraunces weight 400 (used for lighter h1 style).

- [ ] **Step 2: Update the footer markup in all HTML files**

Replace the existing 3-column footer in every HTML file with the new 2-row footer. The new footer markup:

```html
<footer class="site-footer">
  <div class="wrap">
    <div class="footer-top">
      <div>
        <p class="brand-mark">Crestway Global</p>
        <p>Educational guardianship and support for international students in Canada.</p>
      </div>
      <div class="footer-links">
        <a href="/about/">About</a>
        <a href="/services/">Services</a>
        <a href="/governance/">Governance</a>
        <a href="/difference/">Our Difference</a>
        <a href="/partnerships/">Partnerships</a>
        <a href="/ambassadors/">Ambassadors</a>
        <a href="/book/">Book a Call</a>
      </div>
    </div>
    <div class="footer-bottom">
      <p>110 Sheppard Ave E, Suite 110, North York, ON M2N 6K1 · <a href="mailto:info@crestwayglobal.com">info@crestwayglobal.com</a></p>
      <div class="footer-social">
        <a href="https://www.instagram.com/crestway_global" target="_blank" rel="noopener">Instagram</a>
        <a href="https://www.facebook.com/share/1GAZFDcU7j/" target="_blank" rel="noopener">Facebook</a>
        <a href="https://xhslink.com/m/98GgNHDDpUi" target="_blank" rel="noopener">RedNote</a>
      </div>
    </div>
  </div>
</footer>
```

Apply this to all 10 HTML files listed above.

- [ ] **Step 3: Verify and commit**

Run dev server, spot-check 2-3 pages for correct font loading and footer layout.

```bash
git add -A
git commit -m "feat: update fonts and footer across all pages"
```

---

## Task 3: Homepage HTML + CSS

**Files:**
- Rewrite: `index.html`
- Append to: `styles.css` (homepage-specific styles)

**Reference:** Read `v2/index.html` and the current `index.html` before starting — v2 is the structural base, existing index has content to preserve (partner logos, city cards). The new homepage adapts v2's layout with these changes: drop the hero eyebrow, use Fraunces for headlines, asymmetric services grid, featured-quote testimonials.

- [ ] **Step 1: Write the homepage HTML**

Replace the entire contents of `index.html`. Key sections:

**Head:** Use the updated Google Fonts link and `/styles.css`.

**Header:** Same shared header as current (with `href="/"` on brand, lang toggle pointing to `/` and `/zh/`).

**Hero section:**
```html
<section class="hero-home" aria-labelledby="hero-title">
  <div class="wrap with-sidebar">
    <div class="stack" data-reveal>
      <h1 id="hero-title">Your child's safety and success in Canada — managed by people who care.</h1>
      <p class="hero-lede">A premium, dedicated support system for international families, combining institutional expertise with culturally informed care.</p>
      <div><a class="btn primary" href="/book/">Book a Consultation</a></div>
    </div>
    <div class="hero-image frame" data-reveal>
      <img src="/images/hero-student-parent.png" alt="International students arriving in Canada with confidence." />
    </div>
  </div>
</section>
```

**Partner logos:** Keep the existing `partners-banner` markup (seamless scroll already works in client.ts).

**About section:**
```html
<section class="section" aria-labelledby="about-title">
  <div class="wrap with-sidebar">
    <div class="frame" data-reveal style="--ratio: 4/3">
      <img src="/images/advisor-student.jpg" alt="A Crestway Global advisor working one-on-one with a student." />
    </div>
    <div class="stack" data-reveal>
      <p class="eyebrow">Who We Are</p>
      <h2 id="about-title">A trusted local team supporting international students and their families.</h2>
      <p>Crestway Global provides structured, on-the-ground support so your child is guided academically, emotionally, and practically — while you remain informed and confident from anywhere in the world.</p>
      <div><a class="btn ghost" href="/about/">More About Us</a></div>
    </div>
  </div>
</section>
```

**Services section — asymmetric pairs:**
```html
<section class="section bg-sand" aria-labelledby="services-title">
  <div class="wrap">
    <div class="section-head stack" data-reveal>
      <p class="eyebrow">Our Services</p>
      <h2 id="services-title">Six pillars of student success.</h2>
      <p>From arrival logistics to academic monitoring, we guide students through every stage of their Canadian experience.</p>
    </div>
    <div class="services-grid" data-reveal>
      <div class="services-row">
        <article class="service-card service-card--image" style="flex: 2">
          <img src="/images/city-toronto.png" alt="Toronto skyline — Arrival & Settlement" />
          <div class="service-card__overlay"></div>
          <div class="service-card__content">
            <span class="service-tag">01</span>
            <h3>Arrival & Settlement</h3>
            <p>Students arrive prepared and housed safely.</p>
          </div>
        </article>
        <article class="service-card service-card--solid" style="flex: 1">
          <div class="service-card__content">
            <span class="service-tag">02</span>
            <h3>Health & Wellness</h3>
            <p>Physical and mental wellbeing maintained year-round.</p>
          </div>
        </article>
      </div>
      <div class="services-row">
        <article class="service-card service-card--solid" style="flex: 1">
          <div class="service-card__content">
            <span class="service-tag">03</span>
            <h3>Academic Monitoring</h3>
            <p>Progress tracking and intervention when needed.</p>
          </div>
        </article>
        <article class="service-card service-card--image" style="flex: 2">
          <img src="/images/academics-background.png" alt="Academic environment — Cultural Adaptation" />
          <div class="service-card__overlay"></div>
          <div class="service-card__content">
            <span class="service-tag">04</span>
            <h3>Cultural Adaptation</h3>
            <p>Students build community and confidence in their new environment.</p>
          </div>
        </article>
      </div>
      <div class="services-row">
        <article class="service-card service-card--image" style="flex: 2">
          <img src="/images/parents-evening-call.png" alt="Parent on video call — Family Communication" />
          <div class="service-card__overlay"></div>
          <div class="service-card__content">
            <span class="service-tag">05</span>
            <h3>Family Communication</h3>
            <p>Parents remain informed and connected across distance.</p>
          </div>
        </article>
        <article class="service-card service-card--solid" style="flex: 1">
          <div class="service-card__content">
            <span class="service-tag">06</span>
            <h3>Safety & Protection</h3>
            <p>A trusted safety network, whenever students need it.</p>
          </div>
        </article>
      </div>
    </div>
    <div style="text-align: center; margin-block-start: var(--s2);" data-reveal>
      <a class="btn ghost" href="/services/">View All Services</a>
    </div>
  </div>
</section>
```

**Testimonials — featured quote:**
```html
<section class="section" aria-labelledby="testimonials-title">
  <div class="wrap">
    <div class="section-head stack" data-reveal>
      <p class="eyebrow">Student Voices</p>
      <h2 id="testimonials-title">Real students who've been where you're going.</h2>
    </div>
    <div class="testimonial" data-reveal data-testimonial>
      <div class="testimonial__slides">
        <div class="testimonial__slide is-active" data-slide="0">
          <div class="testimonial__photo frame" style="--ratio: 3/4">
            <img src="/images/ambassador-anna.jpg" alt="Anna, Student Ambassador" />
          </div>
          <div class="testimonial__text stack">
            <span class="testimonial__mark">&ldquo;</span>
            <blockquote>Be open to making friends. You're not the only one feeling alone, and connecting with others makes a big difference.</blockquote>
            <div>
              <p class="testimonial__name">Anna</p>
              <p class="testimonial__school">University of Waterloo</p>
            </div>
          </div>
        </div>
        <div class="testimonial__slide" data-slide="1">
          <div class="testimonial__photo frame" style="--ratio: 3/4">
            <img src="/images/ambassador-ridhima.jpg" alt="Ridhima, Student Ambassador" />
          </div>
          <div class="testimonial__text stack">
            <span class="testimonial__mark">&ldquo;</span>
            <blockquote>Take small steps every day to step outside your comfort zone — whether it's joining a club, attending a campus event, or introducing yourself to someone new.</blockquote>
            <div>
              <p class="testimonial__name">Ridhima</p>
              <p class="testimonial__school">York University</p>
            </div>
          </div>
        </div>
        <div class="testimonial__slide" data-slide="2">
          <div class="testimonial__photo frame" style="--ratio: 3/4">
            <img src="/images/ambassador-tien.jpg" alt="Tien, Student Ambassador" />
          </div>
          <div class="testimonial__text stack">
            <span class="testimonial__mark">&ldquo;</span>
            <blockquote>Don't be afraid to ask for help or opportunities. Support won't come to you automatically — you'll only receive it when you reach out.</blockquote>
            <div>
              <p class="testimonial__name">Tien</p>
              <p class="testimonial__school">York University</p>
            </div>
          </div>
        </div>
      </div>
      <div class="testimonial__dots" role="tablist" aria-label="Testimonial navigation">
        <button class="testimonial__dot is-active" data-dot="0" role="tab" aria-selected="true" aria-label="Testimonial 1"></button>
        <button class="testimonial__dot" data-dot="1" role="tab" aria-selected="false" aria-label="Testimonial 2"></button>
        <button class="testimonial__dot" data-dot="2" role="tab" aria-selected="false" aria-label="Testimonial 3"></button>
      </div>
    </div>
    <div style="text-align: center; margin-block-start: var(--s2);" data-reveal>
      <a class="btn ghost" href="/ambassadors/">Meet All Ambassadors</a>
    </div>
  </div>
</section>
```

**Cities:** Keep v2's city card markup but use the updated class names.

```html
<section class="section bg-sand" aria-labelledby="cities-title">
  <div class="wrap">
    <div class="section-head stack" data-reveal>
      <p class="eyebrow">Explore Our Cities</p>
      <h2 id="cities-title">Local support in the places students actually live.</h2>
    </div>
    <div class="city-track" data-reveal>
      <article class="city-card">
        <img src="/images/city-toronto.png" alt="Aerial view of Toronto skyline." />
        <div class="city-card__overlay"></div>
        <div class="city-card__content">
          <h3>Toronto</h3>
          <p>Our founding team. Canada's largest post-secondary ecosystem with deep on-the-ground support.</p>
        </div>
      </article>
      <article class="city-card">
        <img src="/images/city-vancouver.png" alt="Aerial view of Vancouver." />
        <div class="city-card__overlay"></div>
        <div class="city-card__content">
          <h3>Vancouver <span class="coming-soon">Coming Soon</span></h3>
          <p>Coastal campuses and global connections. Expansion planned for 2026.</p>
        </div>
      </article>
      <article class="city-card">
        <img src="/images/city-montreal.png" alt="Aerial view of Montreal." />
        <div class="city-card__overlay"></div>
        <div class="city-card__content">
          <h3>Montreal <span class="coming-soon">Coming Soon</span></h3>
          <p>A bilingual student city. Expansion planned for 2026.</p>
        </div>
      </article>
    </div>
  </div>
</section>
```

**Final CTA:**
```html
<section class="final-cta" aria-labelledby="cta-title">
  <div class="wrap" data-reveal>
    <h2 id="cta-title">Ready to ensure your child's success in Canada?</h2>
    <p>Whether you're planning ahead or your student is already enrolled, our team is here to help your family every step of the way.</p>
    <a class="btn primary" href="/book/">Book a Consultation</a>
  </div>
</section>
```

Include the updated footer and `<script type="module" src="/client.js"></script>`.

- [ ] **Step 2: Add homepage-specific CSS to styles.css**

Append to `styles.css`:

```css
/* === Homepage Hero === */

.hero-home {
  padding-block: var(--s4) var(--s3);
  background: var(--cream);
}

.hero-home .with-sidebar > :first-child { flex-basis: 28rem; }
.hero-home .with-sidebar > :last-child { min-inline-size: 35%; }

.hero-lede {
  font-size: 1.1rem;
  color: var(--ink-soft);
  line-height: 1.7;
}

.hero-image img {
  max-block-size: 480px;
}

/* === Partners Banner === */

.partners-banner {
  padding-block: var(--s2);
  background: var(--sand);
  border-block: 1px solid var(--border);
}

.partners-banner .wrap {
  inline-size: 100%;
  max-inline-size: none;
  padding: 0;
}

.partners-eyebrow {
  text-align: center;
  margin-block-end: var(--s1);
  font-family: "Plus Jakarta Sans", sans-serif;
  font-size: 0.7rem;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  color: var(--ink-soft);
}

.partners-scroll {
  overflow: hidden;
  position: relative;
}

.partners-track {
  display: flex;
  gap: 5rem;
  width: max-content;
  padding-inline: var(--s2);
}

.partner-logo {
  block-size: 40px;
  inline-size: auto;
  opacity: 0.85;
}

/* === Services Grid (asymmetric pairs) === */

.services-grid {
  display: flex;
  flex-direction: column;
  gap: var(--s1);
}

.services-row {
  display: flex;
  gap: var(--s1);
}

.service-card {
  position: relative;
  min-block-size: 20rem;
  border-radius: var(--radius-lg);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  transition: transform 0.3s ease;
}

.service-card:hover { transform: translateY(-4px); }

.service-card--image { color: #fff; }

.service-card--image img {
  position: absolute;
  inset: 0;
  inline-size: 100%;
  block-size: 100%;
  object-fit: cover;
}

.service-card__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(0deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0.05) 100%);
}

.service-card--solid {
  background: var(--sand);
  color: var(--ink);
}

.service-card--solid:nth-child(even) {
  background: var(--forest-dark);
  color: #fff;
}

.service-card__content {
  position: relative;
  z-index: 1;
  padding: var(--s1);
}

.service-card__content h3 {
  color: inherit;
  margin-block-end: var(--s-2);
}

.service-card__content p {
  color: inherit;
  opacity: 0.85;
  font-size: 0.9rem;
}

.service-tag {
  display: inline-block;
  font-family: "Plus Jakarta Sans", sans-serif;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  background: var(--forest);
  color: #fff;
  padding: 3px var(--s-1);
  border-radius: 999px;
  margin-block-end: var(--s-1);
}

@media (max-width: 40rem) {
  .services-row { flex-direction: column; }
  .service-card { min-block-size: 16rem; }
}

/* === Testimonials (featured quote) === */

.testimonial__slide {
  display: none;
  gap: var(--s2);
  align-items: center;
}

.testimonial__slide.is-active {
  display: flex;
}

.testimonial__photo {
  flex: 0 0 clamp(10rem, 25vw, 16rem);
}

.testimonial__text {
  flex: 1;
}

.testimonial__mark {
  font-family: "Fraunces", serif;
  font-size: 4rem;
  line-height: 0.8;
  color: var(--forest);
  opacity: 0.3;
}

.testimonial__text blockquote {
  font-family: "Fraunces", serif;
  font-style: italic;
  font-size: clamp(1rem, 0.8rem + 0.8vw, 1.2rem);
  line-height: 1.6;
  color: var(--ink);
}

.testimonial__name {
  font-weight: 600;
  color: var(--ink);
}

.testimonial__school {
  font-size: 0.85rem;
  color: var(--ink-soft);
}

.testimonial__dots {
  display: flex;
  gap: var(--s-1);
  margin-block-start: var(--s1);
}

.testimonial__dot {
  inline-size: 1.5rem;
  block-size: 3px;
  border: none;
  border-radius: 2px;
  background: var(--border);
  cursor: pointer;
  padding: 0;
  transition: background 0.2s;
}

.testimonial__dot.is-active {
  background: var(--forest);
}

@media (max-width: 40rem) {
  .testimonial__slide.is-active {
    flex-direction: column;
  }
  .testimonial__photo { flex-basis: auto; max-inline-size: 12rem; }
}

/* === City Cards === */

.city-track {
  display: flex;
  gap: var(--s1);
}

.city-card {
  position: relative;
  flex: 1;
  min-block-size: 18rem;
  border-radius: var(--radius-lg);
  overflow: hidden;
  display: flex;
  align-items: flex-end;
  color: #fff;
}

.city-card img {
  position: absolute;
  inset: 0;
  inline-size: 100%;
  block-size: 100%;
  object-fit: cover;
}

.city-card__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(0deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.15) 60%, rgba(0,0,0,0) 100%);
}

.city-card__content {
  position: relative;
  z-index: 1;
  padding: var(--s1);
}

.city-card__content h3 { color: #fff; margin-block-end: var(--s-2); }
.city-card__content p { color: rgba(255,255,255,0.85); font-size: 0.9rem; }

.coming-soon {
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  background: rgba(255,255,255,0.2);
  padding: 2px 8px;
  border-radius: 999px;
  vertical-align: middle;
  margin-inline-start: 0.5em;
}

@media (max-width: 40rem) {
  .city-track { flex-direction: column; }
}
```

- [ ] **Step 3: Verify homepage renders correctly**

Run: `bun dev-server.ts`

Open `http://localhost:8085`. Verify:
- Hero: asymmetric split, Fraunces headline, no eyebrow, image on right
- Partners: scrolling logos
- About: Sidebar layout
- Services: 3 rows of 2 cards with varied sizing
- Testimonials: single featured quote with dots
- Cities: 3 cards
- Footer: 2-row layout
- Mobile: check at narrow width — sections stack vertically

- [ ] **Step 4: Commit**

```bash
git add index.html styles.css
git commit -m "feat: homepage — v2 structure with asymmetric services, featured testimonials"
```

---

## Task 4: Testimonial Rotation + Client.ts Cleanup

**Files:**
- Modify: `client.ts`

- [ ] **Step 1: Add testimonial rotation logic**

Add the following after the existing scroll reveal code in `client.ts`. This reuses the auto-switch pattern from the parents panel:

```typescript
// Testimonial rotation
const testimonialContainer = document.querySelector<HTMLElement>("[data-testimonial]");
if (testimonialContainer) {
  const slides = testimonialContainer.querySelectorAll<HTMLElement>("[data-slide]");
  const dots = testimonialContainer.querySelectorAll<HTMLButtonElement>("[data-dot]");
  let currentSlide = 0;
  let testimonialPaused = false;

  const showSlide = (index: number) => {
    slides.forEach((slide, i) => {
      slide.classList.toggle("is-active", i === index);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle("is-active", i === index);
      dot.setAttribute("aria-selected", String(i === index));
    });
    currentSlide = index;
  };

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const index = Number(dot.dataset.dot);
      showSlide(index);
      testimonialPaused = true;
    });
  });

  testimonialContainer.addEventListener("mouseenter", () => (testimonialPaused = true));
  testimonialContainer.addEventListener("mouseleave", () => (testimonialPaused = false));
  testimonialContainer.addEventListener("focusin", () => (testimonialPaused = true));
  testimonialContainer.addEventListener("focusout", () => (testimonialPaused = false));

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!prefersReducedMotion) {
    setInterval(() => {
      if (!testimonialPaused && slides.length > 1) {
        showSlide((currentSlide + 1) % slides.length);
      }
    }, 8000);
  }
}
```

- [ ] **Step 2: Remove dead code for old homepage sections**

Read `client.ts` first to locate each block. Remove the following blocks by content (not line numbers, which may shift):

- The `heroButtons`/`heroPanels`/`setHeroPanel` block (starts with `const heroButtons = document.querySelectorAll<HTMLButtonElement>("[data-hero-toggle]")`) — hero tabs no longer exist.
- The `parentsButtons`/`parentsPanels`/`setParentsPanel` block (starts with `const parentsButtons = document.querySelectorAll<HTMLButtonElement>("[data-parents-toggle]")`) — before/after toggle removed.
- The `safetyButtons`/`safetyPanels`/`setSafetyPanel` block (starts with `const safetyButtons = document.querySelectorAll<HTMLButtonElement>("[data-safety-toggle]")`) — safety tabs removed.
- The parents section auto-switch observer (starts with `const parentsSection = document.querySelector<HTMLElement>("#parents")`) — replaced by testimonial rotation.
- The section-based active nav tracking (starts with `const sectionLinks = document.querySelectorAll<HTMLAnchorElement>("[data-nav-link]")`) — homepage no longer uses hash-based section nav.

Keep: menu toggle, access gate, partner logo scroll, scroll reveals.

- [ ] **Step 3: Build and verify**

Run: `bun build client.ts --outfile client.js`

Verify testimonial auto-rotation works on homepage (8-second interval), pauses on hover, dot clicks switch slides.

- [ ] **Step 4: Commit**

```bash
git add client.ts client.js
git commit -m "feat: testimonial rotation, remove dead homepage tab/panel code"
```

---

## Task 5: Services Page

**Files:**
- Rewrite: `services/index.html`
- Append to: `styles.css`

- [ ] **Step 1: Read existing file and rewrite services/index.html**

Read `services/index.html` first — all text content must be preserved verbatim. Text-focused hero (no background image). Six pillars using Sidebar layout — odd pillars: number/title left, details right; even pillars reversed. "Our Approach" section with Switcher. Pricing section with Sidebar.

Structure for each pillar (odd — number left):
```html
<div class="with-sidebar pillar" data-reveal>
  <div class="pillar-label">
    <span class="pillar-number">01</span>
    <h3>Arrival & Settlement</h3>
  </div>
  <div class="stack">
    <p><strong>Students arrive prepared and housed safely.</strong></p>
    <ul>
      <li>Pre-arrival immigration and documentation review</li>
      <!-- copy remaining bullet items from existing services/index.html -->
    </ul>
  </div>
</div>
```

Even pillars use `with-sidebar-rev` class to reverse the layout.

"Our Approach" section:
```html
<div class="switcher" data-reveal>
  <div class="stack">
    <h3>Structured Check-ins</h3>
    <p>Scheduled touchpoints ensure consistent contact, not just crisis response.</p>
  </div>
  <!-- ... 2 more items -->
</div>
```

Pricing section uses `cta-block`:
```html
<div class="cta-block" data-reveal>
  <div class="stack">
    <h3>How pricing works</h3>
    <p>Every family's situation is unique...</p>
    <ul><!-- pricing points --></ul>
  </div>
  <div class="cta-actions">
    <a class="btn primary" href="/book/">Schedule a consultation</a>
  </div>
</div>
```

Preserve all existing text content. Use shared header and new footer. Include the updated Google Fonts link.

- [ ] **Step 2: Add pillar-specific CSS**

Append to `styles.css`:

```css
/* === Pillar Layout (services page) === */

.pillar {
  padding-block: var(--s2);
  border-block-start: 1px solid var(--border);
}

.pillar-label {
  flex-basis: 14rem;
}

.pillar-number {
  display: block;
  font-family: "Fraunces", serif;
  font-size: 2rem;
  color: var(--forest);
  opacity: 0.4;
  margin-block-end: var(--s-1);
}
```

- [ ] **Step 3: Verify and commit**

Check `http://localhost:8085/services/`. Verify alternating Sidebar layout, pillar numbers, Switcher for approach items.

```bash
git add services/index.html styles.css
git commit -m "feat: services page — Sidebar pillars, Switcher approach"
```

---

## Task 6: About Page

**Files:**
- Rewrite: `about/index.html`
- Append to: `styles.css`

- [ ] **Step 1: Read existing file and rewrite about/index.html**

Read `about/index.html` first — all text content must be preserved verbatim. Text-focused hero. Mission section as centered Stack. Founders section: two Sidebar blocks — Dave has photo left (with-sidebar), Doug has photo right (with-sidebar-rev). Team section as simple Stack. Values as Switcher with 4 items. CTA block at bottom.

Founder markup:
```html
<article class="with-sidebar founder" data-reveal>
  <div class="frame" style="--ratio: 4/3">
    <img src="/images/dave-murray.jpg" alt="Dave Murray" />
  </div>
  <div class="stack">
    <div>
      <h3>Dave Murray</h3>
      <p class="founder-title">Co-Founder & Director of Safety & Director of Operations</p>
    </div>
    <p>Dave Murray served the City of Toronto for 31 years...</p>
    <!-- remaining bio paragraphs -->
  </div>
</article>
```

Doug uses `with-sidebar-rev`.

Preserve all existing text content.

- [ ] **Step 2: Add founder-specific CSS**

Append to `styles.css`:

```css
/* === Founder cards === */

.founder { --space: var(--s2); }
.founder .frame { flex-basis: 18rem; }
.founder-title { font-size: 0.9rem; color: var(--forest); }
```

- [ ] **Step 3: Verify and commit**

```bash
git add about/index.html styles.css
git commit -m "feat: about page — Sidebar founders, Switcher values"
```

---

## Task 7: Governance Page

**Files:**
- Rewrite: `governance/index.html`
- Append to: `styles.css`

- [ ] **Step 1: Read existing file and rewrite governance/index.html**

Read `governance/index.html` first — all text content must be preserved verbatim. Text-focused hero. Replace 3×N governance-card grids with full-width stacked sections, alternating `bg-sand` backgrounds. Within each section, items as a Stack of governance entries (not cards). Each entry: `h3` + `ul`.

Compliance section uses Switcher for the 4 compliance items.

Structure for a governance topic section:
```html
<section class="section bg-sand" aria-labelledby="safeguarding-title">
  <div class="wrap">
    <div class="section-head stack" data-reveal>
      <p class="eyebrow">Safeguarding</p>
      <h2 id="safeguarding-title">Student protection protocols</h2>
    </div>
    <div class="stack-lg" data-reveal>
      <div class="stack">
        <h3>Vetted Professionals</h3>
        <ul>
          <li>Background checks and vulnerable sector screening...</li>
          <!-- ... -->
        </ul>
      </div>
      <div class="stack">
        <h3>Operational Compliance</h3>
        <ul><!-- ... --></ul>
      </div>
      <div class="stack">
        <h3>Crisis Management Protocols</h3>
        <ul><!-- ... --></ul>
      </div>
    </div>
  </div>
</section>
```

Alternate sections: no class (white bg) → `bg-sand` → no class → `bg-sand`.

Preserve all existing text content.

- [ ] **Step 2: Verify and commit**

```bash
git add governance/index.html
git commit -m "feat: governance page — stacked sections, Switcher compliance"
```

---

## Task 8: Difference Page

**Files:**
- Rewrite: `difference/index.html`
- Append to: `styles.css`

- [ ] **Step 1: Read existing file and rewrite difference/index.html**

Read `difference/index.html` first — all text content must be preserved verbatim. Text-focused hero. Comparison section: clean Stack list (not a table). Three pillars: Switcher. Key facts: Sidebar per fact (number left, description right). Parent assurance: Switcher with 4 items. CTA block at bottom.

Key facts markup:
```html
<div class="stack-lg" data-reveal>
  <div class="with-sidebar fact">
    <span class="fact-number">24/7</span>
    <p>Emergency line answered by a real Crestway Global advisor.</p>
  </div>
  <div class="with-sidebar fact">
    <span class="fact-number">1</span>
    <p>Local team in Toronto.</p>
  </div>
  <!-- ... -->
</div>
```

Preserve all existing text content.

- [ ] **Step 2: Add/verify fact-number styles**

Ensure `styles.css` has the fact-number styles (may already exist from Task 1 or need appending):

```css
/* === Key Facts === */

.fact { align-items: baseline; --space: var(--s1); }

.fact-number {
  font-family: "Fraunces", serif;
  font-size: 2rem;
  color: var(--forest-dark);
  flex-basis: 6rem;
  flex-shrink: 0;
}
```

- [ ] **Step 3: Verify and commit**

```bash
git add difference/index.html styles.css
git commit -m "feat: difference page — Switcher pillars, Sidebar facts"
```

---

## Task 9: Partnerships Page

**Files:**
- Rewrite: `partnerships/index.html`

- [ ] **Step 1: Read existing file and rewrite partnerships/index.html**

Read `partnerships/index.html` first — all text content must be preserved verbatim. Text-focused hero. Three audience sections (Institutions, Agents, Businesses): each uses Sidebar — large heading on one side, benefit items as Stack on the other. "Why Crestway Global" section: 5 items in a Switcher (will wrap naturally). Two CTA blocks at bottom.

Audience section structure:
```html
<section class="section" aria-labelledby="institutions-title">
  <div class="wrap">
    <div class="with-sidebar" data-reveal>
      <div class="stack">
        <p class="eyebrow">For Institutions & Universities</p>
        <h2 id="institutions-title">Bridge the gap between admission and successful settlement.</h2>
        <p>Crestway Global does not recruit students...</p>
      </div>
      <div class="stack">
        <div class="stack">
          <h3>Fewer non-academic escalations</h3>
          <p>Housing crises, health emergencies...</p>
        </div>
        <!-- copy remaining benefit items from existing partnerships/index.html -->
      </div>
    </div>
  </div>
</section>
```

Preserve all existing text content.

- [ ] **Step 2: Verify and commit**

```bash
git add partnerships/index.html
git commit -m "feat: partnerships page — Sidebar audience sections, Switcher benefits"
```

---

## Task 10: Parents Page

**Files:**
- Rewrite: `parents/index.html`
- Append to: `styles.css`

- [ ] **Step 1: Read existing file and rewrite parents/index.html**

Read `parents/index.html` first — all text content must be preserved verbatim. Text-focused hero. Priority section: 4 items in Switcher, **no emoji icons**, just title + description. Reassurance list: Stack of items with checkmark styling. Communication flow: 3 steps in a Cluster. FAQ section **removed** — content converted to prose with subheadings. CTA at bottom.

Priority items (no icons):
```html
<div class="switcher" data-reveal>
  <div class="stack">
    <h3>Safety Above All</h3>
    <p>Housing inspections, safe neighborhoods, emergency response. We check what you would check if you were there.</p>
  </div>
  <!-- copy remaining 3 priority items from existing parents/index.html, dropping emoji icons -->
</div>
```

FAQ replacement — prose with subheadings:
```html
<section class="section" aria-labelledby="concerns-title">
  <div class="wrap">
    <div class="section-head stack" data-reveal>
      <h2 id="concerns-title">Questions Chinese parents ask us</h2>
    </div>
    <div class="stack-lg" data-reveal>
      <div class="stack">
        <h3>Will my child be safe in Canada?</h3>
        <p>Canada is among the safest countries for international students. We add an extra layer: verified housing, known contacts in emergencies, and advisors who check in regularly. We treat your child's safety as if they were our own.</p>
      </div>
      <!-- copy remaining 5 questions from existing parents/index.html, converting each <details><summary>Q</summary><p>A</p></details> to <h3>Q</h3><p>A</p> -->
    </div>
  </div>
</section>
```

Communication flow:
```html
<div class="cluster flow-steps" data-reveal>
  <div class="flow-step stack">
    <span class="flow-number">01</span>
    <h4>Weekly Check-ins</h4>
    <p>Your child meets with their advisor to discuss how the week went</p>
  </div>
  <span class="flow-arrow" aria-hidden="true">&rarr;</span>
  <!-- steps 02, 03 -->
</div>
```

Preserve all existing text content.

- [ ] **Step 2: Add flow-step CSS**

Append to `styles.css`:

```css
/* === Communication Flow (parents page) === */

.flow-steps { --space: var(--s1); justify-content: center; }

.flow-step {
  flex-basis: 14rem;
  text-align: center;
}

.flow-number {
  font-family: "Fraunces", serif;
  font-size: 1.5rem;
  color: var(--forest);
  opacity: 0.5;
}

.flow-arrow {
  font-size: 1.5rem;
  color: var(--ink-soft);
  opacity: 0.5;
}

/* === Reassurance List === */

.reassurance-item {
  display: flex;
  gap: var(--s0);
  align-items: flex-start;
}

.reassurance-check {
  color: var(--forest);
  font-size: 1.2rem;
  flex-shrink: 0;
  margin-block-start: 0.2em;
}
```

- [ ] **Step 3: Verify and commit**

```bash
git add parents/index.html styles.css
git commit -m "feat: parents page — remove FAQ/emojis, Switcher priorities, prose questions"
```

---

## Task 11: Ambassadors Page

**Files:**
- Rewrite: `ambassadors/index.html`
- Append to: `styles.css`

- [ ] **Step 1: Read existing file and rewrite ambassadors/index.html**

Read `ambassadors/index.html` first — all text content (including all 5 full ambassador profiles) must be preserved verbatim. Text-focused hero. Drop the "program grid" of 4 identical cards — replace with a brief intro paragraph in a Stack. Ambassador profiles: each uses Sidebar, alternating sides (odd = photo left via `with-sidebar`, even = photo right via `with-sidebar-rev`). CTA at bottom.

Profile markup (odd — photo left):
```html
<article class="with-sidebar ambassador-profile" data-reveal>
  <div class="frame ambassador-photo" style="--ratio: 3/4">
    <img src="/images/ambassador-anna.jpg" alt="Anna, Student Ambassador" />
  </div>
  <div class="stack">
    <div>
      <h3>Anna</h3>
      <p class="ambassador-meta">University of Waterloo · Computer Science · 3rd Year</p>
      <p class="ambassador-origin">Originally from Japan</p>
    </div>
    <div class="stack">
      <h4>Anna's Journey</h4>
      <p>I was born and raised in Japan...</p>
    </div>
    <!-- remaining h4+p sections -->
    <blockquote class="ambassador-advice">"Be open to making friends..."</blockquote>
  </div>
</article>
```

Even profiles (Ridhima, Fernand) use `with-sidebar-rev`.

For ambassadors without photos (Fernand, Shafaq), use a placeholder initial:
```html
<div class="ambassador-placeholder">
  <span>F</span>
</div>
```

Preserve all existing text content.

- [ ] **Step 2: Add ambassador-specific CSS**

Append to `styles.css`:

```css
/* === Ambassador Profiles === */

.ambassador-profile { --space: var(--s2); }
.ambassador-profile + .ambassador-profile { margin-block-start: var(--s4); }
.ambassador-photo { flex-basis: 16rem; }

.ambassador-meta {
  font-size: 0.9rem;
  color: var(--forest);
}

.ambassador-origin {
  font-size: 0.85rem;
  color: var(--ink-soft);
}

.ambassador-advice {
  font-family: "Fraunces", serif;
  font-style: italic;
  font-size: 1.05rem;
  color: var(--ink);
  border-inline-start: 3px solid var(--forest);
  padding-inline-start: var(--s0);
}

.ambassador-placeholder {
  flex-basis: 16rem;
  flex-shrink: 0;
  aspect-ratio: 3/4;
  background: var(--sand);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Fraunces", serif;
  font-size: 4rem;
  color: var(--forest);
  opacity: 0.3;
}
```

- [ ] **Step 3: Verify and commit**

```bash
git add ambassadors/index.html styles.css
git commit -m "feat: ambassadors page — alternating Sidebar profiles"
```

---

## Task 12: Problem + Book Pages

**Files:**
- Rewrite: `problem/index.html`
- Rewrite: `book/index.html`

These are the two simplest pages.

- [ ] **Step 1: Read existing file and rewrite problem/index.html**

Read `problem/index.html` first — all text content must be preserved verbatim. Text-focused hero. "The Challenge" section: Center + Stack with centered text. Gap list: Stack of numbered items using `with-sidebar` per item (number left, text right).

Gap item:
```html
<div class="with-sidebar gap-item" data-reveal>
  <span class="gap-number">01</span>
  <p>Families expect safety, accountability and a point of contact who knows their children personally.</p>
</div>
```

Preserve all existing text content.

- [ ] **Step 2: Add gap-item CSS**

Append to `styles.css`:

```css
/* === Gap List (problem page) === */

.gap-item { align-items: baseline; --space: var(--s0); }

.gap-number {
  font-family: "Fraunces", serif;
  font-size: 1.5rem;
  color: var(--forest);
  opacity: 0.5;
  flex-basis: 3rem;
  flex-shrink: 0;
}
```

- [ ] **Step 3: Rewrite book/index.html**

Simple page: shared header, a heading + intro paragraph, the LeadConnector iframe (preserve exact iframe markup and attributes), shared footer.

```html
<main>
  <section class="section">
    <div class="wrap stack" data-reveal>
      <h2 id="book-title">Book a Consultation</h2>
      <p>Share a few details so we can personalize your consultation. We review every inquiry to ensure the best possible fit.</p>
      <iframe
        src="https://api.leadconnectorhq.com/widget/form/rXkPyatKxfH6cm7ciEbT"
        style="inline-size: 100%; border: none; overflow: hidden;"
        scrolling="no"
        id="inline-rXkPyatKxfH6cm7ciEbT"
        data-layout="{'id':'INLINE'}"
        data-trigger-type="alwaysShow"
        data-trigger-value=""
        data-activation-type="alwaysActivated"
        data-activation-value=""
        data-deactivation-type="neverDeactivate"
        data-deactivation-value=""
        data-form-name="Crestway Global Consultation"
        data-height="700"
        data-layout-iframe-id="inline-rXkPyatKxfH6cm7ciEbT"
        data-form-id="rXkPyatKxfH6cm7ciEbT"
        title="Crestway Global Consultation"
      ></iframe>
      <script src="https://link.msgsndr.com/js/form_embed.js"></script>
    </div>
  </section>
</main>
```

- [ ] **Step 4: Verify and commit**

```bash
git add problem/index.html book/index.html styles.css
git commit -m "feat: problem + book pages — restyled with new tokens"
```

---

## Task 13: Partnerships/Universities Sub-Page

**Files:**
- Modify: `partnerships/universities/index.html`

- [ ] **Step 1: Update header, footer, and font link**

Read the current file. Update only:
- Google Fonts link (add Plus Jakarta Sans)
- Replace footer with new 2-row footer
- Keep all existing content and structure unchanged

This is a token-treatment-only page per the spec.

- [ ] **Step 2: Verify and commit**

```bash
git add partnerships/universities/index.html
git commit -m "feat: partnerships/universities sub-page — update fonts and footer"
```

---

## Task 14: Cleanup + patterns.md

**Files:**
- Delete: `v2/` directory
- Create: `patterns.md`
- Rebuild: `client.js` (from updated client.ts)

- [ ] **Step 1: Delete the v2 directory**

```bash
rm -rf v2/
```

- [ ] **Step 2: Build client.js**

```bash
bun build client.ts --outfile client.js
```

- [ ] **Step 3: Create patterns.md**

Write `patterns.md` at the project root documenting all patterns used:

```markdown
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
```

- [ ] **Step 4: Final verification**

Run `bun dev-server.ts`. Click through all pages:
- `/` (homepage)
- `/about/`
- `/services/`
- `/governance/`
- `/difference/`
- `/partnerships/`
- `/parents/`
- `/ambassadors/`
- `/problem/`
- `/book/`

Verify at desktop and narrow (mobile) widths. Check:
- Fraunces headlines, Plus Jakarta Sans body
- Consistent footer across all pages
- No broken images or links
- Scroll reveals still animate
- Partner logo scroll works
- Testimonial rotation works
- Access gate still works (password: crestway101)

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: cleanup — delete v2/, add patterns.md, rebuild client.js"
```
