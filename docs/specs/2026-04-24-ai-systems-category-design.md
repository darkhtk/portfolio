# AI Systems Category — Design Spec

**Date**: 2026-04-24
**Owner**: 홍대기
**Related plan**: `docs/plans/2026-04-24-ai-systems-category.md`

## Goal

Promote AI work from a sub-section inside Projects to a **dedicated top-level category** `AI Systems`. Reframe Ops-Cure from a single Discord-orchestration system into its real identity: a **channel-native state/event kernel** hosting multiple behaviors. Portfolio should read as "platform thinking," not just "another agent framework."

## Why

- Current Projects page mixes industrial delivery (VR Robot, WatchBIM, DXCenter, Neostalgia, VR Simulators) with AI work (Ops-Cure, Multi-Agent Orchestration TS, GenWorld+Ollama). AI story dilutes.
- Ops-Cure is already a kernel + multiple behaviors in code (`orchestration`, `remote_codex`, `chat`, plus validation behaviors `ops`, `game`, `workflow`). Portfolio currently hides this architecture.
- Separating AI into its own category matches the positioning line already on Home: "Industrial Unity × AI Systems."

## Information Architecture

### Nav change (breaks every page)

Current: `Home | Projects | Profile` (3-item).
New: `Home | Projects | AI Systems | Profile` (4-item).

Applies to all 4 nav patterns documented in `AGENTS.md` (A, A-variant, B, C) and their KO mirrors.

### Projects page (AI removed)

Remove `AI Extension` section entirely (structure + anchor `#ai-extension`). Projects page then contains only non-AI work:
- VR Robot Teleoperation
- WatchBIM
- DXCenter
- Neostalgia
- VR Simulator Collection

VR Simulator was previously misplaced in AI Extension; removing the section naturally leaves it among the regular projects — no special move or reframing. Section naming (keep `Core Proof` vs rename to `Selected Work`) is a layout call during implementation.

### AI Systems page (new)

File layout (follows existing EN-at-top / KO-at-ko convention, with the caveat that KO case studies live at top-level path — see below):

- EN landing: `/ai-systems/index.html`
- KO landing: `/ko/ai-systems/index.html`
- EN case study: `/en/ai-systems/ops-cure/index.html` ← user-confirmed path
- KO case study: `/ai-systems/ops-cure/index.html` ← follows existing KO-case-study-at-top convention

Hero → Kernel card → Behaviors grid → Related AI R&D.

```
[ Hero ]
  Kernel · Behaviors · Runtimes
  — "I didn't just build an agent system. I built the kernel it runs on."

[ Kernel ] (1 large hero card, spans full width)
  Ops-Cure Kernel
  channel-native state/event kernel
  → link to /en/ai-systems/ops-cure/

[ Behaviors ] (3 compact cards in a row)
  orchestration | remote_codex | chat
  (each is a scroll anchor on the Ops-Cure case study page, not a separate case study)

[ Related AI R&D ] (2 cards)
  GenWorld + Ollama  (local LLM experimentation)
  Multi-Agent Orchestration TS  (prior art — absorbed into Ops-Cure history, card retained as archive)
```

**Decision: Related AI R&D shows GenWorld+Ollama only**. `orchestration-ts` gets fully absorbed into the Ops-Cure case study's history section and is removed from the card grid. User approved "추천대로" for this.

### Ops-Cure case study (rewrite)

Single page with these sections:

1. Hero — kernel positioning
2. System diagram — kernel / behaviors / transports / runtimes
3. Core Vocabulary — `Space`, `Actor`, `Event`, `Behavior`
4. **Behavior: orchestration** — Discord-native multi-agent workflow, pc_launcher, planner/coder/reviewer, current production use. This is the longest section. Absorbs the existing TS framework history as "evolution from TS prototype → kernel-based production."
5. **Behavior: remote_codex** — browser-first remote Codex execution, canonical task/evidence/approval state, `codex-remote` site partnership, `remote_executor` connector. Honest framing: "contracts stabilizing, live wiring scoped."
6. **Behavior: chat** — Codex-to-Codex dialogue rooms, chat_participant connector, validates kernel generality (room state without task semantics).
7. Why three behaviors matters — proof that Space/Actor/Event abstraction actually holds across workflow / execution / dialogue.
8. Related artifacts — GitHub link, related pages.

Each behavior section has:
- One-line problem
- Contract (what the behavior owns)
- Evidence (screenshot, diagram, or code fragment)
- Production status

## Content Moves

| Existing file | Action | Destination |
|---|---|---|
| `en/projects/ops-cure/index.html` | Rewrite → kernel + 3 behaviors | `en/ai-systems/ops-cure/index.html` |
| `projects/ops-cure/index.html` (KO) | Rewrite → kernel + 3 behaviors | `ai-systems/ops-cure/index.html` |
| `en/projects/orchestration-ts/index.html` | Delete | — (content absorbed into Ops-Cure § 4) |
| `projects/orchestration-ts/index.html` (KO) | Delete | — |
| `en/projects/genworld-ollama/index.html` | Move | `en/ai-systems/genworld-ollama/index.html` |
| `projects/genworld-ollama/index.html` (KO) | Move | `ai-systems/genworld-ollama/index.html` |
| `projects/index.html` (EN) | Remove AI Extension section + `#ai-extension` anchor. No special handling for VR Simulators (already a regular project) | same path |
| `ko/projects/index.html` | Same edit | same path |
| `index.html` (EN home) | Update Focus 01/02/03 tile copy to include AI Systems; update Explore link from `projects/#ai-extension` to `ai-systems/` | same path |
| `ko/index.html` | Same edit | same path |

All inbound links to `orchestration-ts` and moved case studies must be updated (resume, cover-letter, about, existing case studies cross-ref, README.md).

## Nav pattern changes

Every page adds a 4th nav item. Mobile drawer also needs the 4th entry.

**Pattern A** (index, projects, cover-letter): add `<a href="ai-systems/">AI Systems</a>` between Projects and Profile in both desktop nav and mobile drawer.

**Pattern A-variant** (about): same change, with `gap-*` spacing.

**Pattern B** (case studies): add to desktop nav and mobile drawer.

**Pattern C** (resume sidebar): add to sidebar list and mobile drawer.

Active link rule: on `ai-systems/*` pages, `AI Systems` nav item carries `text-[#1a57c7] border-b-2` (desktop) and `text-[#1a57c7] border-l-4` (mobile) active styling, like other sections.

## Home page updates (index.html + ko/index.html)

Current Focus tiles are:
- Focus 01: AI Orchestration
- Focus 02: AI / API Integration
- Focus 03: Industrial Real-Time Systems

New:
- Focus 01: **AI Systems** — "Kernel + behaviors. Ops-Cure treats a Discord channel as a stateful space that can host workflow, remote execution, and dialogue on the same substrate."
- Focus 02: AI / API Integration (keep)
- Focus 03: Industrial Real-Time Systems (keep)

"Explore" link block: replace `projects/#ai-extension` → `ai-systems/`. Keep `projects/#core-proof` → `projects/`.

Featured Proof cards on home stay as VR Robot / WatchBIM / Neostalgia (unchanged — industrial delivery is still the headline proof for recruiters in Unity/XR roles).

## Out of scope

- Design system overhaul (keep current light-theme tokens from the 2026-04-11 redesign).
- Print materials (`print/portfolio/`, `print/resume/`) — separate update after web ships.
- Cover letter rewrite — may need one-line insert about AI Systems category, but not a section rework.
- Existing case study page redesign beyond nav update and broken-link patching.

## Open questions (resolve during implementation)

1. Ops-Cure case study page length — behavior 3개가 모두 들어가면 긴 페이지가 될 수 있음. 실제 길이는 구현 중 판단. 너무 길면 page-level TOC 또는 section nav 도입.
2. Behavior 섹션 시각 자산: diagram 은 필수로 각 섹션에 둠. screenshot 은 `orchestration` 기존 캡처 2장 재사용, `remote_codex` / `chat` 은 설계 중 단계라 필요 시점에 사용자에게 캡처 요청.

`#ai-extension` anchor 는 외부 링크 redirect 없이 그대로 삭제 (내부 링크만 정리).

## Success criteria

- Every page loads with 4-item nav and correct active state.
- AI Systems landing page communicates "kernel + behaviors" within the first viewport scroll.
- Ops-Cure case study reads as a kernel story, not an agent framework story.
- No dead links anywhere in the site (orchestration-ts, genworld-ollama old paths).
- Mobile (360px, 390px, 768px) viewport checks pass on all new / changed pages.
