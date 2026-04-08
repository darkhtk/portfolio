# Architecture

홍대기 portfolio site — Industrial Unity × AI Agent.

## Stack

- **HTML5** + **Tailwind CSS CDN** (`?plugins=forms,container-queries`)
- **Vanilla JavaScript** (필터, 모바일 nav 토글)
- **Material Symbols Outlined** (Google Fonts)
- **Fonts**: Space Grotesk (headline), Inter (body), Manrope (label)
- **No build system** — Tailwind CDN handles everything at runtime
- **Dark theme 고정** (`<html class="dark">`)
- **Hosting**: GitHub Pages (auto-deploy on push to main, ~1-2 min)

## Pages

| File | Role |
|---|---|
| `index.html` | Home — Hero, 3 Pillars, Featured Project |
| `projects.html` | Selected Works — bento grid + 6 filters (ai-agent, xr, robotics, bim, oss, local-llm) |
| `about.html` | About + Tech Ecosystem |
| `resume.html` | Resume — sidebar + TopAppBar layout |
| `cover-letter.html` | 자기소개서 (6 sections, max-w-5xl) |
| `case-study-vr-robot.html` | VR 로봇 + 자체 IK 솔버 (Case Study 01) |
| `case-study-dxcenter.html` | DXCenter — LG에너지솔루션 (Case Study 02) |
| `case-study-orchestration-ts.html` | Multi-Agent Orchestration Framework (Case Study 03) |
| `case-study-genworld-ollama.html` | GenWorld + Ollama R&D (Case Study 04) |

## Navigation Patterns

4가지 nav 구조 패턴이 존재합니다. 모든 페이지에 모바일 햄버거 컴포넌트가 적용되어 있습니다.

- **Pattern A** (`index`, `projects`, `cover-letter`): Connect 버튼이 desktop nav 밖, 별도 div 안. 모바일 햄버거 + Connect 메일 아이콘이 같은 div.
- **Pattern A-variant** (`about`): Pattern A와 동일, Connect 버튼이 `hero-gradient` 커스텀 CSS 클래스 사용.
- **Pattern B** (3 case studies): Connect 버튼이 desktop nav 안 마지막 항목. 모바일용 별도 `<div class="md:hidden flex">` 에 mail 아이콘 + 햄버거.
- **Pattern C** (`resume`): `<aside>` 사이드바 (`hidden lg:flex w-64 fixed`) + `<header>` TopAppBar. 햄버거는 TopAppBar 우측 (`md:hidden`).

### Mobile Menu Component

모든 페이지에 동일한 IIFE + overlay div + 햄버거 버튼. 동작:
- 햄버거 클릭 → overlay 열림 + body scroll lock
- ESC 키, 닫기 버튼, 메뉴 링크 클릭 → overlay 닫힘
- `aria-expanded` 토글, `role="dialog"`, `aria-modal="true"`
- z-index: nav `z-50`, overlay `z-[60]`

### Active Link 표시

- Desktop nav: `text-primary border-b-2 border-primary pb-1`
- Mobile overlay: `text-primary border-l-4 border-primary pl-3`
- Case study 페이지는 모두 PROJECTS가 active (sub-page)

## Mobile Responsive Tokens

| Token | Before | After |
|---|---|---|
| **T1** Container 가로 패딩 | `mx-auto px-8` | `mx-auto px-4 sm:px-6 md:px-8` |
| **T1b** Nav inner | `flex ... px-8 py-4 max-w-7xl mx-auto` | `flex ... px-4 sm:px-6 md:px-8 py-4 max-w-7xl mx-auto` |
| **T2** Section 세로 패딩 | `py-32` | `py-16 sm:py-20 md:py-32` |
| **T3a** H1 hero | `text-5xl md:text-7xl` | `text-4xl sm:text-5xl md:text-7xl` |
| **T3b** H2 | `text-4xl md:text-5xl` | `text-3xl sm:text-4xl md:text-5xl` |
| **T3c** H1 거대 | `text-6xl md:text-8xl` | `text-4xl sm:text-6xl md:text-8xl` |
| **T3d** H1 lg 분기 | `text-5xl lg:text-7xl` | `text-4xl sm:text-5xl lg:text-7xl` |
| **T4** Grid 셀 | `grid-cols-4` (고정) | `grid-cols-2 md:grid-cols-4` |

**T1 적용 주의**: 컨테이너에만. 버튼의 `px-8 py-4` 같은 패딩은 그대로.

**Target viewports**: 360px (Galaxy S20), 390px (iPhone 14 Pro), 768px (iPad), 1280px (Desktop).

## Design System (Tailwind config)

모든 페이지 head 안의 `<script id="tailwind-config">` 에 동일하게 정의됨. 변경 시 모든 페이지 동기화 필요.

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

`borderRadius: { DEFAULT: "0.125rem", lg: "0.25rem", xl: "0.5rem", full: "0.75rem" }`
`fontFamily: { headline: ["Space Grotesk"], body: ["Inter"], label: ["Manrope"] }`

## Code Block CSS

코드 스니펫이 있는 case study (`case-study-orchestration-ts.html`, `case-study-genworld-ollama.html`)는 head `<style>` 블록에 `.code-block` CSS 정의. 모바일 미디어쿼리 포함.

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

`assets/images/`:
- `vr_robot_expo1.png`, `vr_robot_expo2.png` — VR Robot case study + index Hero
- `dxcenter*.png` — DXCenter case study
- `genworld-world.png` — GenWorld game world (case study 04 Hero)
- `genworld-npc-mood.png` — NPC dialogue + Mood/Relationship UI (§ 5)
- `genworld-dialogue.png` — 사냥꾼 다중 턴 dialogue (§ 2)
- `genworld-skills.png` — 스킬 트리 (보관용, 미사용)
- `profile.jpg` — 프로필 사진
- `favicon-*.png`, `apple-touch-icon.png` — 파비콘

## Adding a New Case Study

새 case study 추가 시 8개 파일 변경 패턴:

1. 신규 case study HTML 작성 (Pattern B nav, mobile component 처음부터 적용)
2. `projects.html` — 카드 + (필요 시) 새 필터 버튼 추가
3. `cover-letter.html` — 관련 섹션에 단락 추가
4. `resume.html` — Open Source · 자작 도구 또는 R&D 섹션에 항목 추가
5. `README.md` — Pages 목록에 1줄
6-8. 기존 3개 case study의 cross-reference 그리드 — 새 카드 추가 + grid `md:grid-cols-2 lg:grid-cols-3` 변경

## Local Development

빌드 없음. HTML 파일을 브라우저로 직접 열거나, 간단한 정적 서버:

```bash
cd C:\sourcetree\portfolio
python -m http.server 8000
# http://localhost:8000
```

DevTools device toolbar로 모바일 viewport 검증 (Ctrl+Shift+M).
