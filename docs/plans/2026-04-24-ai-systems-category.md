# AI Systems Category — Implementation Plan

**Date**: 2026-04-24
**Spec**: `docs/specs/2026-04-24-ai-systems-category-design.md`
**Branch**: `ai-systems-category`

## Phase 0 — Setup

- [ ] Create feature branch `ai-systems-category` from `main`.
- [ ] Inventory all pages touched by nav change. Expected count: 16 HTML pages (8 EN + 8 KO) + 2 print pages (deferred).

## Phase 1 — Build new AI Systems landing (EN + KO)

Create top-level category page first. No dependencies, lowest risk.

- [ ] `ai-systems/index.html` (EN) — landing page.
- [ ] `ko/ai-systems/index.html` (KO) — mirror.

Structure inside each:
- Hero (kernel + behaviors 한 줄 positioning)
- Kernel card (large, full-width, links to Ops-Cure case study)
- Behaviors row (3 compact cards: orchestration / remote_codex / chat — each anchors into the Ops-Cure case study)
- Related AI R&D (1 card: GenWorld + Ollama — links to moved path)
- Footer / nav consistent with Pattern A

Reuses existing CSS tokens. No new design system components.

## Phase 2 — Build Ops-Cure kernel case study (EN + KO)

- [ ] `en/ai-systems/ops-cure/index.html` (EN) — full rewrite.
- [ ] `ai-systems/ops-cure/index.html` (KO) — full rewrite.

Sections in order:
1. Hero — kernel positioning
2. System diagram (reuse existing `stack-diagram` styling)
3. Core vocabulary (Space / Actor / Event / Behavior)
4. § Orchestration (longest; absorbs TS framework history as one paragraph)
5. § Remote Codex (diagram-first, no screenshot yet)
6. § Chat (diagram-first, no screenshot yet)
7. Why three behaviors (proof of kernel generality)
8. Related artifacts (GitHub link, GenWorld+Ollama cross-ref)

**Screenshots**:
- `orchestration` section reuses `ops-cure-discord-thread.jpg` and `ops-cure-discord-report.jpg` (already in `assets/images/`).
- `remote_codex` / `chat` sections ship with diagrams only. Flag to user when caps needed.

**Length check**: after draft, if the page exceeds ~2500px scroll height on desktop, add sticky section nav on lg+. Skip if not needed.

## Phase 3 — Move GenWorld + Ollama case study

Pure path migration + inbound link patching. No content rewrite.

- [ ] Move `en/projects/genworld-ollama/index.html` → `en/ai-systems/genworld-ollama/index.html`.
  - Update all relative paths inside the file (`../../../` depth stays the same — verify).
  - Update nav active state to `AI Systems`.
- [ ] Move `projects/genworld-ollama/index.html` → `ai-systems/genworld-ollama/index.html`.
  - Same treatment (KO).
- [ ] Find & update every inbound link to the old paths (resume, cover-letter, README, other case studies).

## Phase 4 — Delete orchestration-ts

- [ ] Delete `en/projects/orchestration-ts/` (entire directory).
- [ ] Delete `projects/orchestration-ts/` (entire directory).
- [ ] Find & remove all links to these paths site-wide.
- [ ] Verify the orchestration TS history paragraph landed in the Ops-Cure § orchestration section (Phase 2 deliverable).

## Phase 5 — Update Projects page (remove AI Extension)

- [ ] `projects/index.html` (EN): remove `<section id="ai-extension">` block + `#ai-extension` anchor + `Recommended Cases` aside items that point to AI work if any.
- [ ] `ko/projects/index.html`: same edit.
- [ ] Verify VR Simulators card remains intact in its natural position (no-op if already fine).

## Phase 6 — Update Home page

- [ ] `index.html` (EN): rewrite Focus 01 tile to "AI Systems" (kernel + behaviors framing). Update Explore link `projects/#ai-extension` → `ai-systems/`. Hero chips unchanged.
- [ ] `ko/index.html`: same edit (Korean copy).
- [ ] Keep Featured Proof cards (VR Robot / WatchBIM / Neostalgia) unchanged.

## Phase 7 — Nav propagation (every remaining page)

Add `AI Systems` item to desktop nav + mobile drawer on every page. Pages that will still use the nav after phases 1–6:

EN:
- [ ] `index.html` (home — done in Phase 6, confirm nav update)
- [ ] `projects/index.html`
- [ ] `about/index.html`
- [ ] `resume/index.html`
- [ ] `en/projects/vr-robot/index.html`
- [ ] `en/projects/watchbim/index.html`
- [ ] `en/projects/dxcenter/index.html`
- [ ] `en/projects/neostalgia/index.html`
- [ ] `en/projects/vr-simulators/index.html`
- [ ] `en/ai-systems/ops-cure/index.html` (built in Phase 2)
- [ ] `en/ai-systems/genworld-ollama/index.html` (moved in Phase 3)
- [ ] `ai-systems/index.html` (built in Phase 1)

KO:
- [ ] `ko/index.html`
- [ ] `ko/projects/index.html`
- [ ] `ko/about/index.html`
- [ ] `ko/resume/index.html`
- [ ] `cover-letter/index.html`
- [ ] `projects/vr-robot/index.html`
- [ ] `projects/watchbim/index.html`
- [ ] `projects/dxcenter/index.html`
- [ ] `projects/neostalgia/index.html`
- [ ] `projects/vr-simulators/index.html`
- [ ] `ai-systems/ops-cure/index.html` (built in Phase 2)
- [ ] `ai-systems/genworld-ollama/index.html` (moved in Phase 3)
- [ ] `ko/ai-systems/index.html` (built in Phase 1)

Apply Pattern A / A-variant / B / C as already defined in `AGENTS.md`. Active state rule: `AI Systems` nav item highlights when URL starts with `/ai-systems/`, `/ko/ai-systems/`, or `/en/ai-systems/`.

Skip for this phase: `print/portfolio/index.html`, `print/resume/index.html` (no web nav).

## Phase 8 — Inbound link sweep

- [ ] `README.md` — update project references, add AI Systems section.
- [ ] Resume (EN + KO) — update orchestration-ts references, add AI Systems anchor, update GenWorld+Ollama path.
- [ ] Cover Letter (KO + EN) — update any links to moved / deleted paths.
- [ ] AGENTS.md — update page structure table, add Pattern notes for AI Systems pages, add 2026-04-24 work history entry.
- [ ] Grep for `orchestration-ts` / `projects/genworld-ollama` / `projects/ops-cure` / `ai-extension` — fix every hit.

## Phase 9 — Verification

- [ ] Open each page in browser locally (or via a quick static server) and visually check nav state + broken links.
- [ ] Mobile viewport check at 360px, 390px, 768px on:
  - `ai-systems/index.html`
  - `en/ai-systems/ops-cure/index.html`
  - `projects/index.html` (verify AI Extension removal doesn't leave whitespace)
- [ ] `grep -r "ai-extension\|orchestration-ts"` returns no hits.
- [ ] All new pages render with 4-item nav in desktop + mobile drawer.

## Phase 10 — Ship

- [ ] Commit per phase or logical group (not one giant commit). Korean commit messages.
- [ ] Push feature branch.
- [ ] Fast-forward merge into `main`.
- [ ] Push main → GitHub Pages deploys in 1–2 min.
- [ ] Post-deploy smoke test on live URL: `/ai-systems/`, `/en/ai-systems/ops-cure/`, `/ko/ai-systems/`.

## Deferred (follow-up tasks, not this branch)

- Print materials (`print/portfolio/index.html`, `print/resume/index.html`) — separate branch after web ships.
- Screenshot pass on `remote_codex` / `chat` once user supplies captures.
- Cover letter tone update (a one-line mention if it reads well, otherwise defer).

## Risk + fallback

- **Broken link risk** is highest in Phase 8. Mitigation: grep sweep before Phase 10.
- **Nav divergence risk** if a page is missed in Phase 7. Mitigation: the Phase 7 checklist is the authoritative list; any `<html lang>` file not in it means it was missed.
- **Long Ops-Cure case study risk**: if it blows past reasonable length, add section nav (Phase 2 notes this).
