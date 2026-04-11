# Mobile-First Responsive Renewal Design

Date: 2026-04-11
Status: In progress
Scope: Portfolio-wide redesign foundation with homepage first

## Problem

The portfolio already has partial mobile adjustments, but it still behaves like a desktop-first site that was compressed afterward.

Current issues:

- Navigation patterns are split across multiple page types.
- Tailwind config and custom styles are repeated page by page.
- Information density is inconsistent between `index`, `projects`, `resume`, and case studies.
- Mobile reading flow is longer and heavier than it should be, especially on project detail pages.
- The site lacks a shared responsive system that can scale from 360px to large desktop layouts.

## Design Goal

Rebuild the portfolio as a mobile-first responsive site where:

- mobile defines content priority,
- tablet expands layout density,
- desktop enhances rhythm, editorial composition, and visual depth.

This is not a small breakpoint patch. It is a structure-first redesign.

## Product Goal

The site should help a recruiter, collaborator, or client understand three things quickly:

1. What kind of work Daeki Hong does.
2. Which projects prove that capability.
3. How to continue the conversation.

## Core Principles

### 1. Mobile first

- Design starts at 360px and 390px widths.
- No horizontal scroll.
- CTA, summary, and project proof must appear early.
- Long-form pages must become scannable before they become expressive.

### 2. System first

- One navigation model
- One container scale
- One spacing system
- One card family
- One CTA language

### 3. Editorial clarity

The visual direction should feel intentional and senior, not like a default Tailwind landing page.

- Strong hierarchy
- Calm but high-contrast color system
- Spacious reading rhythm
- Bold project framing

### 4. Progressive enhancement

- Mobile: single-column, fast scanning
- Tablet: paired blocks and denser summaries
- Desktop: asymmetric composition, richer media balance, stronger secondary detail

## Target Breakpoints

- `360px`: minimum priority layout
- `390px`: modern small-phone baseline
- `768px`: tablet transition
- `1024px`: compact desktop / laptop
- `1440px`: expanded editorial desktop

## Information Architecture

- `Home`
  - value proposition
  - 3 focus areas
  - featured projects
  - working method
  - contact CTA
- `Projects`
  - filterable overview
  - project cards optimized for mobile scan
- `Case Studies`
  - summary
  - problem
  - approach
  - outcome
  - technical notes
  - related work
- `About`
  - working principles
  - strengths
  - tool/ecosystem framing
- `Resume`
  - timeline + proof links
- `Cover Letter`
  - concise summary blocks + longer narrative

## Shared UI System

### Layout

- container widths: `px-4 / sm:px-6 / lg:px-8`
- section spacing expands by breakpoint
- default mobile structure is 1 column
- desktop asymmetry is intentional, not automatic

### Typography

- display/headline: `Space Grotesk` + Korean fallback
- body: `Noto Sans KR`
- labels: tighter uppercase display style

### Components

- sticky top navigation
- mobile drawer navigation
- primary CTA
- secondary CTA
- feature card
- project card
- media frame
- metric strip
- process card
- timeline card
- CTA banner

### Color Direction

- base: mist / graphite / cobalt
- accent: warm industrial orange for emphasis
- avoid generic purple-dark SaaS palette

## Page-Level Renewal Intent

### Home

- Shorter hero
- Faster proof of capability
- Featured projects become the central story
- Contact path appears earlier

### Projects

- Mobile-first card system
- Filter interaction simplified for small screens
- Stronger distinction between featured and background work

### Resume

- Replace desktop-led side-panel emphasis with readable mobile timeline logic
- Keep proof links close to each role or period

### Cover Letter

- Split into summary blocks first, detailed narrative second

### Case Studies

- Standardize into one responsive article template
- Add mobile summary and in-page section navigation

## Accessibility and Quality Bar

- touch targets at least 44px
- keyboard-friendly navigation
- visible focus states
- reduced motion should still read well
- image framing should remain stable at every breakpoint

## Success Criteria

- A first-time visitor on mobile understands the portfolio in under 30 seconds.
- A recruiter can reach key projects from the homepage in one thumb flow.
- Every page works cleanly at `360px`, `390px`, `768px`, `1024px`, and `1440px`.
- The site feels like one system, not a set of separately styled pages.
