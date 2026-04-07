# Trolleybus Advisory — Content Engine Design Spec

**Date:** 2026-04-07
**Owner:** Trevor Longino
**Status:** Approved

---

## Context

Doug Hochglaube (Trolleybus Development) wants to launch an advisory arm targeting Toronto retail commercial property owners sitting on aging, underperforming assets. The advisory model: nominal monthly management fees + 15% of value creation from redevelopment. Doug needs ~5 clients/year.

Trolleybus has 16 years of development track record but zero digital marketing presence. trolleybusdevelopment.com is a low-info placeholder. Doug can commit 1 hour/month on camera.

This is a CrowdTamers Content Engine engagement at $4,000/month, 90-day minimum commitment. Target: 3-8 qualified leads/month by day 120.

Source meeting: Weekly Updates CrowdTamers x Brightway, 2026-04-01.

---

## Architecture

Three pillars feeding a single GHL pipeline:

```
FILMING (1hr/mo) ──→ CLIP CHOPPING (8-12 clips)──┐
                                                   ├──→ CONTENT ENGINE ──→ LinkedIn / YouTube / IG
HEYGEN AVATAR ──→ WEEKLY EXPLAINERS ──────────────┘         │
                                                             │
REMOTION + HEYGEN ──→ ANIMATED CASE STUDY ──────────────────┘
                                                             │
WEBSITE (advisory pages) ←── drives traffic ─────────────────┘
    │
    ├── Intake form ──→ GHL Pipeline
    └── Gated PDF ──→ GHL Nurture Sequence ──→ Consultation Booking
```

### Content Production

- **Input:** 1 hour Doug on camera/month
- **Processing:** Clip chopping, subtitling, branding via existing CT video pipeline
- **Supplemental:** HeyGen avatar explainers (weekly), Remotion animated case study (month 2)
- **Output:** 12-16 pieces/month, published 3-4x/week via AI agent
- **Channels:** LinkedIn (primary), YouTube, Instagram
- **Brand voice:** Defined in SOUL.md (to be created during onboarding)

### Website

- **Domain:** trolleybusdevelopment.com (existing, to be taken over)
- **Build approach:** Add advisory pages initially; potential full 11ty migration later
- **Pages:** Advisory landing page, case study, about/track record, contact/intake form
- **Downloadable:** PDF case study gated behind email capture
- **SEO:** Local + content SEO as slow burn, not primary driver

### CRM & Automations

- **Platform:** GoHighLevel (separate instance from Crestway/Brightway)
- **Pipeline stages:** New Lead → Qualified → Consultation Booked → Proposal Sent → Client
- **Automations:**
  - Intake form → pipeline
  - PDF download → 3-5 email nurture drip
  - Consultation booking flow
  - Stage-based notifications to Doug
  - Lead source attribution

---

## 120-Day Timeline

| Month | Focus | Key Deliverables |
|-------|-------|-----------------|
| 1 | Foundation | GHL live, first 8-12 clips published on LinkedIn, website build started, case study scripted, SOUL.md created |
| 2 | Cadence | Advisory pages live, 3-4x/week publishing, animated case study produced, PDF gated downloadable live, nurture active |
| 3 | Optimization | 40-50 pieces in market, performance analysis, content mix iterated, SEO indexing |
| 4 | Lead gen target | 3-8 qualified leads/month, first Content Engine report, strategy review |

---

## Content Themes

1. **Property value unlocking** — "Your building could be worth 3x what it is today"
2. **Rezoning demystified** — "How to get a 3-story addition approved through committee of adjustments"
3. **Alternative financing** — "How to fund redevelopment without cash out of pocket"
4. **Before/after case examples** — the math walkthrough (buy at $1M, redevelop, stabilize at $3M)
5. **Highest and best economic use** — educational content on the concept

---

## Production Pipeline

### Video Clips (from Doug filming)
1. Film 1 hour → raw footage
2. CT video pipeline: transcribe → detect edits → extract clips → subtitle → brand
3. Face-centered 9:16 crop for shorts, 16:9 for LinkedIn/YouTube
4. Content approval → schedule via social poller

### HeyGen Avatar Explainers
1. Script topic from content calendar
2. Generate via HeyGen API
3. Brand overlay if needed
4. Schedule alongside organic clips

### Animated Case Study (Remotion)
1. Script the math walkthrough (approved by Doug)
2. HeyGen avatar narration
3. Remotion animated charts/numbers overlay
4. Produce 90-second final cut
5. Distribute across all channels + embed on website

---

## Investment

- **$4,000/month**, 90-day minimum, month-to-month after
- Includes: content production, website, GHL, automations, reporting
- Excludes: paid ad spend (optional, ~$300-500/mo if added after month 2)
- Excludes: direct outreach / prospecting list building

---

## Success Criteria

- **Lead volume:** 3-8 qualified leads/month by day 120
- **Content velocity:** 12-16 pieces/month published by month 2
- **Pipeline operational:** GHL intake → nurture → booking flow working end-to-end by end of month 1
- **Website live:** Advisory pages with intake form and gated PDF by end of month 2
- **Attribution:** Clear data on which content drives which leads by month 4

---

## Dependencies

- Doug provides access to trolleybusdevelopment.com (credentials or DNS)
- Doug commits to 1 hour/month filming within first 2 weeks of each month
- Doug reviews and approves content before publishing (weekly approval cadence)
- Doug provides existing case study data / project examples for the animated walkthrough
- HeyGen and Remotion pipelines functional (existing CT infrastructure)

---

## Risks

| Risk | Mitigation |
|------|-----------|
| Doug doesn't film on schedule | HeyGen avatar fills gaps; buffer content from first session |
| trolleybusdevelopment.com access delayed | Build advisory pages on temp domain, migrate later |
| LinkedIn organic reach insufficient | Layer in paid promotion ($300-500/mo) after month 2 |
| Niche too small for content discovery | Audience is small but identifiable; frequency on LinkedIn compensates for limited search volume |
| 11ty migration scope creep | Keep it as a separate phase; advisory pages work on any platform |

---

## Proposal Document

Client-ready proposal saved to:
`~/Documents/Obsidian/CrowdTamers Obsidian Vault/work/CrowdTamers/Sales/Trolleybus_Advisory_Content_Engine_Proposal.md`

Uses `cssclass: ct-proposal` for PDF export via Obsidian.
