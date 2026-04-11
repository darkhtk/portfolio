# Mobile-First Responsive Renewal Plan

Date: 2026-04-11
Status: In progress

## Objective

Turn the portfolio into a mobile-first responsive system, then expand it into a stronger desktop experience.

## Delivery Strategy

### Phase 1. Foundation

- Create tracked design spec and plan
- Introduce shared `site.css`
- Introduce shared `site.js`
- Establish mobile-first navigation and base component classes

Deliverables:

- `docs/specs/2026-04-11-mobile-first-responsive-renewal-design.md`
- `docs/plans/2026-04-11-mobile-first-responsive-renewal.md`
- `assets/css/site.css`
- `assets/js/site.js`

### Phase 2. Homepage Renewal

- Redesign `index.html` around mobile-first structure
- Reduce hero complexity
- Improve early proof and CTA clarity
- Introduce reusable project card and process card patterns

Success check:

- homepage passes internal link validation
- no horizontal overflow at mobile widths
- navigation works consistently on mobile and desktop

### Phase 3. Shared Page Conversion

- convert `projects/index.html`
- convert `about/index.html`
- convert `resume/index.html`
- convert `cover-letter/index.html`

Goal:

- page types share one visual and structural language

### Phase 4. Case Study Unification

- create one article template pattern
- port all project detail pages to that pattern
- normalize summary, gallery, metadata, and related-links sections

### Phase 5. QA and Cleanup

- breakpoint sweep at `360 / 390 / 768 / 1024 / 1440`
- remove repeated inline styles where possible
- reduce duplicated mobile menu code
- verify image crops and CTA placement

## Priority Order

1. Foundation
2. Homepage
3. Projects overview
4. Resume and cover letter
5. Case studies
6. Final QA

## Risks

- Rewriting page structure without a shared system will create more inconsistency.
- Mobile layouts can regress if desktop composition is introduced too early.
- Case study pages are long and need template discipline to avoid layout drift.

## Current Turn Scope

- create foundation docs
- add shared responsive assets
- renew homepage as the first reference implementation

## Follow-Up Scope

- port the shared system to the remaining pages
- standardize case studies on the same responsive article model
