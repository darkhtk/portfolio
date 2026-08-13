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
- **Font**: Space Grotesk (display/headline), Noto Sans KR (body), JetBrains Mono (mono)
- **빌드 시스템 없음** — Tailwind CDN이 런타임 처리
- **Theme**: 전 페이지 dark (`<html class="dark">` + `assets/css/portfolio-dark.css`) — light 용 `assets/css/site.css` 는 redirect stub(`resume/`, `ko/resume/`, `cover-letter/`)에만 잔존
- **언어**: 루트 트리 = 한국어 디폴트, `en/` 트리 = 영어 미러. print 페이지와 redirect stub 을 제외한 모든 페이지 헤더에 KO/EN 토글

## Page Structure

전 페이지 공통 4항목 nav `home | ai | industrial | profile`. KO 홈(`index.html`)은 앵커 기반(`#ch02` / `#ch01` / `#profile`), 케이스 스터디 페이지는 같은 라벨로 루트 앵커를, 랜딩·프로필 페이지와 EN 홈은 디렉터리 페이지(`ai-systems/`, `projects/`, `about/` 와 `en/` 미러)를 가리킨다. print 페이지와 redirect stub 을 제외한 모든 페이지가 헤더에 KO/EN 토글 보유.

| 파일 | 역할 | 테마 |
|---|---|---|
| `index.html` | Home (KO — `#ch01` 산업 / `#ch02` AI / `#profile` 앵커 섹션) | dark |
| `en/index.html` | Home (EN 미러) | dark |
| `about/index.html` | Profile (KO) | dark |
| `en/about/index.html` | Profile (EN) | dark |
| `projects/index.html` | 산업 프로젝트 아카이브 (KO) | dark |
| `en/projects/index.html` | 산업 프로젝트 아카이브 (EN) | dark |
| `ai-systems/index.html` | AI Systems 허브 (KO) | dark |
| `en/ai-systems/index.html` | AI Systems 허브 (EN) | dark |
| `ai-systems/<case>/index.html` | AI 케이스 KO — ops-cure, genworld-ollama, deskrelay, oracluna-tarot | dark |
| `en/ai-systems/<case>/index.html` | AI 케이스 EN — ops-cure, genworld-ollama, deskrelay, oracluna-tarot | dark |
| `projects/<case>/index.html` | 산업 케이스 KO — vr-robot, watchbim, dxcenter, neostalgia, vr-simulators | dark |
| `en/projects/<case>/index.html` | 산업 케이스 EN — 동일 5종 | dark |
| `print/portfolio/`, `print/ko-portfolio/`, `print/resume/`, `print/resume-en/` | A4 인쇄용 (EN/KO 포트폴리오 + KO/EN 이력서) | print CSS |

**Redirect stub** (`<meta http-equiv="refresh">` + JS replace): `ko/about/` → `about/`, `resume/` → `en/about/`, `ko/resume/` → `about/`, `cover-letter/` → `about/`, `ko/index.html` → `/`. `ko/ai-systems/`, `ko/projects/` 디렉터리는 존재하지 않음.

## Nav & Mobile Menu (공용 구현)

**print 페이지와 redirect stub 을 제외한 모든 페이지가 `header[data-mobile-menu-root]` 마크업 + 공용 `assets/js/site.js` 조합 사용** — 페이지별 IIFE 없음. 새 페이지 추가 시 아래 data-attribute 마크업을 복사하고 `site.js` 를 로드하면 동작.

```html
<header data-mobile-menu-root class="sticky-nav fixed top-0 left-0 right-0 z-50">
  <nav class="hidden md:flex items-center gap-6">
    <a href="./" class="nav-link is-active">home</a>
    <!-- ai / industrial / profile -->
  </nav>
  <button data-mobile-menu-toggle aria-label="메뉴 열기" aria-expanded="false" aria-controls="mobile-menu" class="md:hidden ...">
    <span class="material-symbols-outlined">menu</span>
  </button>
  <div id="mobile-menu" data-mobile-menu class="mobile-drawer fixed inset-0 hidden flex-col ... md:hidden" role="dialog" aria-modal="true" aria-label="메인 메뉴">
    <button data-mobile-menu-close aria-label="메뉴 닫기">...</button>
    <!-- nav links -->
  </div>
</header>
```

**`site.js` 동작**: 토글 클릭 open/close (`body.menu-open` 클래스 토글), Escape 닫기, 드로어 내 링크 클릭 시 닫기, viewport ≥ 768px 리사이즈 시 자동 닫기. 가로 스크롤 드래그 지원(`.h-scroll`, `[data-h-drag]`)도 같은 파일에 포함.

**Active link 표시**: desktop nav 현재 페이지 링크에 `nav-link is-active`

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

모든 실페이지가 head 의 `<script id="tailwind-config">` 에 아래 토큰을 동일하게 정의하고 공용 `assets/css/portfolio-dark.css` 를 로드. 변경 시 모든 페이지 동기화.

```js
colors: {
  "bg-primary": "#0B0F14", "bg-elevated": "#11161D", "bg-grid": "#0E141B",
  "text-primary": "#E6EDF3", "text-secondary": "#8A94A6", "text-muted": "#76818F",
  "accent-cyan": "#6FE3FF", "accent-amber": "#F5C26B",
  "success-green": "#6EE787", "danger-red": "#FF7B72",
  "hairline": "rgba(230,237,243,0.08)", "hairline-strong": "rgba(230,237,243,0.16)"
}
```

## Code Block CSS (retired)

`.code-block` 클래스는 현재 어떤 페이지에서도 사용되지 않음 — 구 M3 dark legacy 케이스 스터디가 현행 테마로 리뉴얼되면서 함께 제거됨.

## Assets

| 위치 | 내용 |
|---|---|
| `assets/` (루트) | `profile.jpg`, `favicon-16.png`, `favicon-32.png`, `apple-touch-icon.png` |
| `assets/css/` | `portfolio-dark.css` (다크 공용), `site.css` (redirect stub 전용 잔존), `print-docs.css`, `print-dark.css` |
| `assets/js/` | `site.js` (모바일 메뉴 + 가로 스크롤 드래그) |
| `assets/images/` | 케이스 스크린샷 약 60개 — `deskrelay-*`, `remote-for-claude-*`, `ops-cure-discord-*`, `orchestration-v1-loop.png`, `genworld-*` (`genworld-skills.png` 포함 — genworld-ollama 케이스에서 사용 중), `oracluna-*` (모바일 녹화 추출 6장), `ik_*`, `vr_robot_expo*`, `vr_construction_*` / `vr_lcm_*` / `vr_lghaus_*`, `watchbim_*`, `neostalgia_*`, `v2_*`, `customeditor.png` (DXCenter 케이스), `milk-and-cereal.png` |

## Spec / Plan Documentation

레포 내부: `docs/specs/` (design spec) + `docs/plans/` (implementation plan) + `docs/design/` (디자인 프롬프트/레퍼런스).

**기존 문서**:
- `docs/specs/2026-04-11-mobile-first-responsive-renewal-design.md`
- `docs/plans/2026-04-11-mobile-first-responsive-renewal.md`
- `docs/specs/2026-04-24-ai-systems-category-design.md`
- `docs/plans/2026-04-24-ai-systems-category.md`
- `docs/design/2026-05-13-stitch-prompts.md`

새 작업도 같은 경로 패턴 (`YYYY-MM-DD-<topic>-design.md` / `YYYY-MM-DD-<topic>.md`) 으로 저장.

## Recent Work History

### 2026-08-13: Oracluna Screenshot Refresh
- `녹화_2026_08_11_14_38_37_734.mp4` 를 구간별로 검수해 고민 선택, 3분할 컷 재결합, 78장 카드 휠, 3장 공개, 카드별 해석, 저장·공유 장면을 새 스크린샷으로 반영.
- 구형 `oracluna-deck-matrix.jpg`, `oracluna-seven-card-reveal.jpg` 를 `oracluna-card-wheel.jpg`, `oracluna-three-card-reveal.jpg` 로 교체하고 KO/EN 케이스, AI 허브, 인쇄 포트폴리오, KO/EN 이력서 캡션과 설명을 현재 제품 흐름에 맞춤.
- Oracluna 케이스를 390px / 1280px, 인쇄 포트폴리오와 두 이력서를 1280px에서 검수. 깨진 이미지와 가로 overflow 0.

### 2026-08-06: Oracluna Tarot Case Study
- `ai-systems/oracluna-tarot/`, `en/ai-systems/oracluna-tarot/` 신규 생성.
- 질문 설정 → 3분할 컷 → 78장 매트릭스 → 카드 공개 → RAG 해석 → 저장·공유 흐름을 프로젝트 녹화에서 추출한 6개 프레임으로 구성.
- AI Systems KO/EN 허브 카드와 DeskRelay·Ops-Cure·GenWorld 관련 작업 링크, README 케이스 수를 함께 갱신.
- 홈에는 노출하지 않고 AI 카테고리 안에서만 연결.
- KO/EN 스크린샷 이력서에 Oracluna 프로젝트를 추가하고, 각 59개 이미지·17페이지 PDF를 10MB 이하로 갱신.
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
3. **커밋·푸시는 수동** — 자동 commit+push hook 은 2026-06-11 기준 비활성. 마무리: feature branch push → main merge → main push → GitHub Pages 자동 배포. 이 저장소는 여러 환경에서 커밋되므로 작업 시작 전 `git fetch` 로 분기 상태 확인 필수
4. **새 case study 추가 시 8 파일 변경 패턴**: 신규 case study + projects 카드 + cover-letter 단락 + resume 항목 + README + 기존 case study 3개 cross-ref
5. **Cross-ref grid**: case study 추가 시 기존 grid `md:grid-cols-2` → `md:grid-cols-2 lg:grid-cols-3` 변경 (3 카드 노출)
6. **commit 메시지**: 한국어 본문 + Co-Authored-By 라인. `feat:`, `docs:`, `feat(scope):` 형식.

## Active Branches

- `main` — production (origin/main 동기화)
- `ai-systems-category` / `mobile-responsive-redesign`(origin) / `genworld-ollama-case-study`(origin) — 보존된 작업 history
- `codex/*` — copy pass · print · 언어팩 등 작업 브랜치 다수 (로컬 + origin)
- `audit-mechanical-fixes` — 감사 기계적 수정 작업 (2026-06-11)
- `backup/pre-sync-20260611` — origin/main 동기화 전 백업

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
