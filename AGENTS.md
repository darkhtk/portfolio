# 홍대기 Portfolio — Project Context

> 다음 세션에서 즉시 컨텍스트 복원용. 변경 시 항상 최신 상태 유지.

## What This Is

Industrial Unity × AI Agent 포트폴리오 사이트. 정적 HTML × Tailwind CDN. GitHub Pages 배포 (https://darkhtk.github.io/portfolio/).

- **Owner**: 홍대기 (Daeki Hong) — Unity 10년차 산업 시니어
- **Repo**: github.com/darkhtk/portfolio
- **Live**: https://darkhtk.github.io/portfolio/
- **Deployment**: main branch push → GitHub Pages 자동 배포 (1-2분)

## Repository Layout

- **Root**: 실제 GitHub Pages 배포 파일만 유지
- **`AGENTS.md`**: 저장소 내부 협업 기준
- **`C:\sourcetree\portfolio-internal\portfolio\tracker`**: NAS에 배포하는 방문 추적 서버와 대시보드
- **`C:\sourcetree\portfolio-internal\portfolio\workspace\docs\site`**: 포트폴리오 리라이트, 구조, 카테고리 관련 문서
- **`C:\sourcetree\portfolio-internal\portfolio\workspace\docs\superpowers`**: spec / plan 문서
- **`C:\sourcetree\portfolio-internal\portfolio\workspace\layout`**: 레이아웃 레퍼런스와 시안
- **`C:\sourcetree\portfolio-internal\portfolio\CLAUDE.md`**: 확장 컨텍스트 백업

## Tech Stack & Constraints

- **HTML5** + **Tailwind CSS CDN** (`?plugins=forms,container-queries`)
- **Vanilla JavaScript** (필터, 모바일 nav 토글 등)
- **Material Symbols Outlined** (Google Fonts)
- **Font**: Space Grotesk (headline), Inter (body), Manrope (label)
- **빌드 시스템 없음** — Tailwind CDN이 런타임 처리
- **Dark theme 고정** (`<html class="dark">`)
- **언어**: ko (한국어 + 영문 키워드 혼용)

## Page Structure

Nav is 4-item (`Home | Projects | AI Systems | Profile`) as of 2026-04-24. AI work is in its own top-level category.

| 파일 | 역할 | nav 패턴 |
|---|---|---|
| `index.html` | Home (Hero + 3 Focus tiles + Featured Project) | A |
| `projects/index.html` | Projects landing (non-AI industrial work) | A |
| `ai-systems/index.html` | AI Systems landing (kernel + behaviors + R&D) | A |
| `about/index.html` | About + Tech Ecosystem | A-variant |
| `resume/index.html` | Resume redirect → Profile | redirect page |
| `cover-letter/index.html` | Cover letter redirect → Profile | redirect page |
| `en/ai-systems/ops-cure/index.html` | Ops-Cure Kernel case study (kernel + 3 behaviors) | B (light) |
| `en/ai-systems/genworld-ollama/index.html` | GenWorld + Ollama R&D (EN, minimal) | content-only |
| `en/projects/vr-robot/index.html` | VR Robot + IK solver | B (light) |
| `en/projects/watchbim/index.html` | WatchBIM | B (light) |
| `en/projects/dxcenter/index.html` | DXCenter LG에너지솔루션 | B (light) |
| `en/projects/neostalgia/index.html` | Neostalgia (EN, minimal) | content-only |
| `en/projects/vr-simulators/index.html` | VR Simulator Collection (EN, minimal) | content-only |
| `ko/ai-systems/index.html` | AI Systems landing (KO) | A |
| `ko/projects/index.html` | Projects landing (KO) | A |
| `ai-systems/ops-cure/index.html` | Ops-Cure Kernel (KO, light theme) | B (light) |
| `ai-systems/genworld-ollama/index.html` | GenWorld + Ollama (KO, old dark theme) | B (dark legacy) |
| `projects/<case>/index.html` | KO case studies (old dark theme: vr-robot, watchbim, dxcenter, neostalgia, vr-simulators) | B (dark legacy) |

**Note on inconsistency**: existing KO case studies at top-level `projects/<case>/` still link their nav to EN root pages (legacy from pre-restructure). New AI Systems KO landing (`ko/ai-systems/`) and new KO kernel case (`ai-systems/ops-cure/`) link correctly inside EN nav tree. Fix is out of scope for the AI Systems category work.

## Nav Patterns (4 variants)

**모든 페이지에 햄버거 메뉴 + 모바일 overlay 적용됨** (mobile-responsive-redesign 작업 결과). 새 case study 추가 시 처음부터 모바일 패턴 포함해야 함.

- **Pattern A** (index, projects, cover-letter):
  - Connect 버튼이 desktop nav 밖, 별도 `<div class="flex items-center gap-3">` 안
  - 모바일 햄버거 + Connect 메일 아이콘이 같은 div 안
- **Pattern A-variant** (about):
  - Pattern A와 동일하지만 `space-x-*`가 아닌 `gap-*` 사용 (mobile redesign에서 마이그레이션됨)
  - Connect 버튼이 `hero-gradient` 커스텀 CSS 클래스 유지
- **Pattern B** (3 case studies):
  - Connect 버튼이 desktop nav 안 (`<div class="hidden md:flex">` 안의 마지막 항목)
  - 모바일용 별도 `<div class="md:hidden flex items-center gap-3">` 안에 mail 아이콘 + 햄버거
- **Pattern C** (resume/index.html — 특수):
  - `<aside>` SideNavBar (`hidden lg:flex w-64 fixed`) + `<header>` TopAppBar
  - 햄버거는 TopAppBar 우측에 위치 (`md:hidden`)
  - 사이드바는 lg+ 에서만, 데스크톱 nav는 md+ 에서, 햄버거는 md 미만에서

### Mobile Menu Component (모든 페이지 동일)

```html
<!-- Hamburger button (in nav) -->
<button id="mobile-menu-toggle" class="md:hidden ..." aria-label="메뉴 열기" aria-expanded="false" aria-controls="mobile-menu">
  <span class="material-symbols-outlined">menu</span>
</button>

<!-- Overlay (after </nav>) -->
<div id="mobile-menu" class="fixed inset-0 z-[60] bg-[#0c1324]/95 backdrop-blur-2xl hidden flex-col md:hidden" role="dialog" aria-modal="true" aria-label="메인 메뉴">
  <!-- 5 nav links + Connect CTA + GitHub/LinkedIn social -->
</div>

<!-- IIFE (before </body>) -->
<script>
(function() {
  const toggle = document.getElementById('mobile-menu-toggle');
  const close  = document.getElementById('mobile-menu-close');
  const menu   = document.getElementById('mobile-menu');
  if (!toggle || !menu) return;
  function openMenu() { menu.classList.remove('hidden'); menu.classList.add('flex'); document.body.style.overflow = 'hidden'; toggle.setAttribute('aria-expanded', 'true'); }
  function closeMenu() { menu.classList.add('hidden'); menu.classList.remove('flex'); document.body.style.overflow = ''; toggle.setAttribute('aria-expanded', 'false'); }
  toggle.addEventListener('click', openMenu);
  if (close) close.addEventListener('click', closeMenu);
  document.addEventListener('keydown', function(e) { if (e.key === 'Escape') closeMenu(); });
  menu.querySelectorAll('a').forEach(function(a) { a.addEventListener('click', closeMenu); });
})();
</script>
```

**Active link 표시**:
- Desktop nav: `text-primary border-b-2 border-primary pb-1`
- Mobile overlay: `text-primary border-l-4 border-primary pl-3`
- Case study 페이지는 모두 PROJECTS 가 active (sub-page)

## Mobile Responsive Tokens (mobile-responsive-redesign 작업 결과)

| Token | Before | After |
|---|---|---|
| **T1** Container 가로 패딩 | `mx-auto px-8` | `mx-auto px-4 sm:px-6 md:px-8` |
| **T1b** Nav inner 패딩 | `flex ... px-8 py-4 max-w-7xl mx-auto` | `flex ... px-4 sm:px-6 md:px-8 py-4 max-w-7xl mx-auto` |
| **T2** Section 세로 패딩 | `class="py-32` | `class="py-16 sm:py-20 md:py-32` |
| **T3a** H1 hero | `text-5xl md:text-7xl` | `text-4xl sm:text-5xl md:text-7xl` |
| **T3b** H2 | `text-4xl md:text-5xl` | `text-3xl sm:text-4xl md:text-5xl` |
| **T3c** H1 거대 | `text-6xl md:text-8xl` | `text-4xl sm:text-6xl md:text-8xl` |
| **T3d** H1 lg 분기 | `text-5xl lg:text-7xl` | `text-4xl sm:text-5xl lg:text-7xl` |
| **T4** Grid 셀 | `grid-cols-4` (고정) | `grid-cols-2 md:grid-cols-4` |

**T1 적용 주의**: 컨테이너에만 적용. 버튼의 `px-8 py-4` 같은 패딩은 그대로.

**Target Viewports**:
- 360px (Galaxy S20) — 1차
- 390px (iPhone 14 Pro) — 1차
- 768px (iPad) — 2차
- 1280px (Desktop) — 회귀 검증 0

## Design System (Tailwind config)

모든 페이지 head 안의 `<script id="tailwind-config">` 에 동일하게 정의됨. 변경 시 8개 페이지 모두 동기화.

```js
colors: {
  "primary": "#b7c4ff", "primary-fixed": "#dde1ff", "primary-fixed-dim": "#b7c4ff",
  "primary-container": "#0052ff", "on-primary": "#002682",
  "on-surface": "#dce1fb", "on-surface-variant": "#c3c5d9",
  "on-background": "#dce1fb",
  "surface": "#0c1324", "background": "#0c1324",
  "surface-container": "#191f31", "surface-container-low": "#151b2d",
  "surface-container-high": "#23293c", "surface-container-highest": "#2e3447",
  "surface-container-lowest": "#070d1f",
  "secondary": "#bec6e0", "secondary-container": "#3f465c",
  "tertiary": "#b7c8e1", "tertiary-container": "#57677e",
  "outline": "#8d90a2", "outline-variant": "#434656",
  "surface-variant": "#2e3447"
}
```

## Code Block CSS (KO legacy case studies using old dark theme)

코드 스니펫이 있는 case study는 head `<style>` 블록에 `.code-block` CSS 정의. 모바일 미디어쿼리 포함.

```css
.code-block {
  font-family: 'Consolas', 'D2Coding', monospace;
  font-size: 12px;
  line-height: 1.6;
  background: #070d1f;
  border-radius: 8px;
  padding: 20px;
  overflow-x: auto;
  white-space: pre;
  color: #c3c5d9;
}
.code-block .kw { color: #b7c4ff; font-weight: 600; }
.code-block .str { color: #dde1ff; }
.code-block .com { color: #8d90a2; font-style: italic; }
.code-block .num { color: #b7c8e1; }
@media (max-width: 640px) {
  .code-block { padding: 12px; font-size: 11px; line-height: 1.5; }
}
```

## Assets

`assets/images/` 위주로 사용:

| 파일 | 용도 |
|---|---|
| `vr_robot_expo1.png`, `vr_robot_expo2.png` | VR Robot 케이스 + index Hero |
| `dxcenter*.png` | DXCenter 케이스 |
| `genworld-world.png` | GenWorld 게임 월드 (case study 04 Hero) |
| `genworld-npc-mood.png` | NPC 대화 + Mood/Relationship UI (§ 5) |
| `genworld-dialogue.png` | 사냥꾼 다중 턴 대화 (§ 2) |
| `genworld-skills.png` | 스킬 트리 (미사용, future case study용 보관) |
| `profile.jpg` | 프로필 사진 |
| `favicon-*.png`, `apple-touch-icon.png` | 파비콘 |

## Spec / Plan Documentation

레포 내부: `docs/specs/` (design spec) + `docs/plans/` (implementation plan).

**기존 문서**:
- `docs/specs/2026-04-11-mobile-first-responsive-renewal-design.md`
- `docs/plans/2026-04-11-mobile-first-responsive-renewal.md`
- `docs/specs/2026-04-24-ai-systems-category-design.md`
- `docs/plans/2026-04-24-ai-systems-category.md`

새 작업도 같은 경로 패턴 (`YYYY-MM-DD-<topic>-design.md` / `YYYY-MM-DD-<topic>.md`) 으로 저장.

## Recent Work History

### 2026-04-08: Mobile Responsive Redesign (1차 작업)
- 8 페이지 모두 햄버거 nav 컴포넌트 + 토큰 T1/T2/T3 적용
- 4가지 nav 패턴 (A, A-variant, B, C) 정리
- README.md에 cover-letter 자기소개서 6 섹션 반영
- branch: `mobile-responsive-redesign` (보존)

### 2026-04-08: GenWorld + Ollama Case Study (2차 작업)
- `projects/genworld-ollama/index.html` 신규 생성 (Case Study 04, R&D 톤)
- 통합: projects (카드+필터) / cover-letter (단락) / resume (R&D 항목) / README / 3개 기존 case study cross-ref
- 4개 스크린샷 추가, 3개 사용 (Hero, § 2, § 5), 1개 미사용 보관
- 새 'Local LLM' 필터 추가 (`data-filter="local-llm"`)
- branch: `genworld-ollama-case-study` (보존)

### 2026-04-25: `world` behavior 설계 (Phase 0)
- ops-cure 저장소에 `docs/world-behavior.md` (design + 계약) + `docs/world-behavior-execution-plan.md` (Phase 0~3 plan) 신규.
- 시드 R&D 는 `C:\Users\darkh\Projects\GenWorld` (NPCBrain · WorldEventSystem · QuestSystem · OllamaClient · EventBus 18개 struct). 분석으로 검증된 매핑: Space=save 세션, Actor=Player/NPC/Monster, Event=기존 EventBus 타입, Behavior=신규 `world`.
- 새 축: simulation (NPC 가 부분적으로 behavior 가 직접 시뮬레이션 + sparse/dense 이벤트 혼재 + clock-driven). 지금 셋(orchestration / remote_codex / chat) 어느 것도 누르지 않은 자리.
- portfolio 변경: EN/KO ops-cure 케이스 § 05 끝에 "다음 축 · 설계 단계" 패널 추가, AI Systems 랜딩의 GenWorld+Ollama 카드 부제 갱신("seed for upcoming `world` behavior").
- GenWorld 코드 변경 0. CURRENT_GOAL.md 가 stabilization 단계를 끝낼 때까지 Phase 1 (Opscure scaffold) 도 보류.

### 2026-04-25: Ops-Cure / codex-remote 진척 반영
- `remote_codex` behavior 가 `nas_bridge/app/behaviors/remote_codex/` (api/service/schemas/kernel_binding/discord_binding) 로 자리잡고 라이브 remote task 서비스를 감싼다는 점, codex-remote 가 site-proxy 모드 전용으로 정리되어 로컬 broker/`/api/agent/...` 가 은퇴됐다는 점, behavior 가 설치형 패키지 (`chat-participant`, `remote-executor`) 로 표준화돼 `python -m pc_launcher.behavior_tools` 로 install/doctor/run/send 한다는 점을 EN/KO ops-cure 케이스 스터디 + AI Systems 랜딩 카드에 반영.
- 변경 파일: `en/ai-systems/ops-cure/index.html`, `ai-systems/ops-cure/index.html`, `ai-systems/index.html`, `ko/ai-systems/index.html`.
- remote_codex 카드/배지: `Scaffold · 계약 안정화 중` → `Live · Opscure 가 canonical` / `Live · Canonical via Opscure`.
- 케이스 스터디 § 01 에 "behavior 는 설치형 패키지" 패널 신규.

### 2026-04-24: AI Systems 카테고리 분리
- Nav 3-item → 4-item (`Home | Projects | AI Systems | Profile`). 전 페이지 propagate.
- 신규 페이지: `ai-systems/index.html` (EN), `ko/ai-systems/index.html` (KO), `en/ai-systems/ops-cure/index.html` + `ai-systems/ops-cure/index.html` (Ops-Cure 커널 + orchestration / remote_codex / chat behavior 케이스 스터디).
- 이동: `en/projects/genworld-ollama/` → `en/ai-systems/genworld-ollama/`, `projects/genworld-ollama/` → `ai-systems/genworld-ollama/`.
- 삭제: `en/projects/orchestration-ts/`, `projects/orchestration-ts/`, `en/projects/ops-cure/`, `projects/ops-cure/` (TS 프레임은 kernel 케이스 orchestration 섹션 history 로 흡수).
- Projects 페이지: `AI Extension` 섹션 + `#ai-extension` 앵커 제거. VR Simulator 를 Core Proof 로 이동.
- Home: Focus 01 을 "AI Systems" 로 리프레임, `#ai-extension` 링크 → `ai-systems/`.
- docs: `docs/specs/2026-04-24-ai-systems-category-design.md`, `docs/plans/2026-04-24-ai-systems-category.md`.
- branch: `ai-systems-category`.

## Workflow Conventions

1. **큰 작업은 brainstorm → spec → plan → subagent-driven 패턴 사용** (superpowers skills)
2. **Feature branch 생성 후 작업**, main에서 직접 안 함
3. **마무리: feature branch push → main fast-forward merge → main push** → GitHub Pages 자동 배포
4. **새 case study 추가 시 8 파일 변경 패턴**: 신규 case study + projects 카드 + cover-letter 단락 + resume 항목 + README + 기존 case study 3개 cross-ref
5. **Cross-ref grid**: case study 추가 시 기존 grid `md:grid-cols-2` → `md:grid-cols-2 lg:grid-cols-3` 변경 (3 카드 노출)
6. **commit 메시지**: 한국어 본문 + Co-Authored-By 라인. `feat:`, `docs:`, `feat(scope):` 형식.

## Active Branches

- `main` — production (origin/main 동기화)
- `mobile-responsive-redesign` — 보존 (mobile redesign 작업 history)
- `genworld-ollama-case-study` — 보존 (case study 04 작업 history)
- `ai-systems-category` — AI Systems 카테고리 분리 작업 (2026-04-24)

## External References

- **darkhtk/portfolio** — 이 프로젝트
- **darkhtk/game-GenWorld** — Gen 프로젝트 (case study 04에서 인용)
- 기타 산업 프로젝트는 코드 비공개, case study에서만 언급

## Things NOT to Do

- nav HTML을 JS include / 템플릿 엔진으로 추출하지 말 것 (FOUC + SEO 손실, 의도적 결정)
- 빌드 시스템 도입하지 말 것 (Tailwind CDN 유지)
- 이미지 최적화/WebP 변환 안 함 (이번 scope 외)
- "Live · 재직 중" 배지를 case study 04 (GenWorld)에 사용 안 함 — R&D 톤이므로 `science` 아이콘 + "R&D · Tech Validation" 배지 사용
- main 브랜치에서 직접 작업 시작하지 말 것
