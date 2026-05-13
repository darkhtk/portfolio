# Google Stitch 프롬프트 — Portfolio 리뉴얼 (2026-05-13)

작성일: 2026-05-13
작성자: Daeki Hong (홍대기) + AI 어시스트
대상: Google Stitch (stitch.withgoogle.com) 입력용 화면별 프롬프트 묶음

## 0. 공통 설계 결정 (모든 화면에 적용)

이 문서의 모든 프롬프트는 아래 결정을 전제합니다. Stitch에 넣는 각 화면 프롬프트 안에도 핵심 토큰은 반복 명시되어 있으니, 화면별 코드 블록만 떼어서 Stitch에 넣어도 됩니다.

### 서사 척추
> **"산업 현장에서 다져진 10년의 Unity 엔지니어 → AI에 몰입해 여러 작품 → DeskRelay로 개발자 도구 수준 결실."**

- 타깃 독자: 한국 대기업·AI 조직 (Samsung, LG, 현대, 공공/연구기관 AI 팀)
- 언어 톤: 한국어 격식체. 영어는 기술 라벨·코드성 요소에만 사용.
- 클라이맥스: DeskRelay (홈에서 전용 챕터 + 머추어 프로덕트 쇼케이스)

### 비주얼 무드
- **Technical / Developer-Console**. 다크 베이스 + 모노스페이스 + 닷 그리드 + hairline divider. "도구처럼 보이는 포트폴리오." Linear × 터미널.
- 절대 금지: 스톡 일러스트, 3D 캐릭터, 풀스크린 hero 사진, 추가 액센트 컬러, pill 버튼 남용, 본문 center-align, 4단어 초과 영어 헤드라인.

### 디자인 토큰 (전 화면 공통)

```
COLORS
  bg-primary       #0B0F14
  bg-elevated      #11161D
  bg-grid          #0E141B  (dotted grid overlay)
  text-primary     #E6EDF3
  text-secondary   #8A94A6
  text-muted       #5B6573
  accent-cyan      #6FE3FF
  accent-amber     #F5C26B
  border-hairline  rgba(230,237,243,0.08)
  success-green    #6EE787

TYPOGRAPHY
  display/headings  Space Grotesk  500 / 700  tracking -0.03em
  body (KR)         Pretendard or Noto Sans KR  400 / 600  line-height 1.7
  mono (labels)     JetBrains Mono  500  uppercase tracking 0.12em
  hero size         desktop 64–80px / mobile 36–44px
  section title     desktop 36–44px / mobile 26–30px
  body              15–17px

GRID
  desktop 1440 max-width, 12 columns, 96px gutters
  mobile  390, single column, 24px gutters
  vertical rhythm: 120–160px between sections (desktop)

RADII
  cards & surfaces  8–12px (subtle — this is a tool, not a marketing page)
  chips             pill OK (only chips)
  buttons           primary 8px / ghost 8px

INTERACTION
  caret cursor blink on brand wordmark + footer
  chapter rule labels type in on scroll into view (mono, 60ms/char)
  card hover: hairline border → cyan @ 32% alpha, corner ticks extend 4px
  no card lift, no shadow bloom
```

### 사이트 구조 (Hybrid IA)

```
/            HOME — short hero + AI / Industrial / DeskRelay climax + profile snap + contact
/deskrelay/  DeskRelay 전체 케이스 (climax 의 본문)
/ai-systems/ AI Systems 인덱스 (DeskRelay · Ops-Cure · GenWorld · 그 외)
/projects/   Industrial Projects 인덱스 (VR Robot · WatchBIM · Neostalgia · DX · VR Sim)
/about/      Profile (timeline + skills + honors + PDFs)
/ko/  /en/   언어 토글 (KO 우선)
```

---

## 1. HOME (`/`)

목적: 90초 안에 서사 척추를 전달하고, DeskRelay 케이스로 클릭을 유도.

```
Design a single-page portfolio HOME for a senior engineer named Daeki Hong (홍대기), a 10-year industrial Unity engineer who pivoted into AI systems and shipped DeskRelay, a mature remote-session developer tool. Target audience: AI teams at Korean enterprises (Samsung, LG, Hyundai, public-sector AI orgs). Primary language is formal Korean (격식체); English is allowed for technical labels and code-style elements only.

Visual mood: technical / developer-console. Dark theme, monospaced for labels and chrome, humanist sans for body. Subtle dotted grid background, thin 1px hairline dividers, cyan + amber accents on near-black. Feel: a portfolio that looks like a well-built dev tool — Linear meets terminal, not neon, not playful. No stock illustrations. No gradients except a very soft cyan glow under hero and DeskRelay key visual.

Color tokens (use these exact hex values):
- bg-primary: #0B0F14
- bg-elevated: #11161D
- bg-grid: #0E141B (dotted grid overlay)
- text-primary: #E6EDF3
- text-secondary: #8A94A6
- text-muted: #5B6573
- accent-cyan: #6FE3FF
- accent-amber: #F5C26B
- border-hairline: rgba(230,237,243,0.08)
- success-green: #6EE787

Typography:
- Display & headings: Space Grotesk, weights 500 and 700, tracking -0.03em
- Body: Pretendard or Noto Sans KR, weights 400 and 600, line-height 1.7
- Monospace (labels, file-paths, chips, chapter markers): JetBrains Mono, weight 500, uppercase tracking 0.12em
- Hero display size: 64–80px desktop / 36–44px mobile
- Section title: 36–44px desktop / 26–30px mobile
- Body: 15–17px

Grid: 12-column at 1440px max, 96px gutters on desktop, 24px gutters on mobile. Sections separated by ~120–160px on desktop.

────────────────────────────────────────
PAGE COMPOSITION (top → bottom)

1) STICKY NAV (fixed top, ~72px, dark glass rgba(11,15,20,0.72) + backdrop blur, hairline bottom border):
   - Left: mono brand "daeki.hong" + blinking caret cursor
   - Center (desktop): mono nav — `home` `deskrelay` `ai` `industrial` `profile`
   - Right: "KO / EN" pill (KO active), primary CTA "DeskRelay 열기 →" (cyan outline, mono)
   - Mobile: hamburger replaces center nav

2) HERO (min-height 88vh, dotted grid bg):
   - Top mono label (text-muted, 12px, tracking 0.18em): `$ whoami`
   - Terminal-output line (mono, text-secondary): `> daeki.hong — industrial unity → ai systems`
   - Huge KR display headline, 2 lines, left-aligned:
       Line 1 (text-primary, 700): "산업 현장에서 다져진 10년의 Unity,"
       Line 2 (text-primary, 700, accent-cyan on "AI 개발자 도구"): "이제 AI 개발자 도구로 출고합니다."
   - Sub-paragraph (text-secondary, max 56ch, KR 격식체):
       "VR·BIM·로보틱스 시뮬레이터를 실제 운영 환경에 납품해 온 엔지니어가, 지난 1년간 AI 시스템을 직접 빌드해 왔습니다. 그 결실이 DeskRelay — 로컬 Claude/Codex 세션을 모바일·웹에서 안전하게 원격 조작하는 개발자 도구입니다."
   - Two CTAs side-by-side:
       Primary (cyan filled): "DeskRelay 케이스 보기 →"
       Ghost (mono, hairline border): "engineering archive ↓"
   - Right side of hero (desktop, 5 of 12 cols): a single dark composite mockup — DeskRelay phone UI overlapping a partial desktop window connected by a thin animated dotted line. Soft cyan glow underneath. On mobile, stacks below hero copy.
   - Below CTAs, a thin mono ticker strip:
       `BIFAN selection · MSIT 장관표창 · 10y Unity · Samsung / LG / POSCO 납품 · Lockheed Martin 영어 브리핑`

3) CHAPTER MARKER (used between every chapter, full-width hairline rule):
       `── ch.01 ─────────  INDUSTRIAL UNITY FOUNDATION  ───────────`
   accent-amber on chapter number, text-muted on title text, 2px tick marks at label edges.

4) CH.01 — INDUSTRIAL UNITY FOUNDATION
   - Section intro (left, 5 cols):
       mono kicker "10 years · 산업 Unity"
       heading: "현장이 검증한 엔지니어링 뿌리."
       paragraph (KR 격식체): "전시·공장·건설현장에서 실제로 운영되는 시뮬레이터와 도구를 만들었습니다. 안전, 운영 비용, 유지보수까지 책임지는 자세가 기본기였습니다."
   - Cards grid (3 cols desktop / 1 col mobile), bg-elevated, 1px hairline, 8–12px radius:
       Each card: 4/3 dark media slot with thin cyan corner ticks, row of mono chips, Space Grotesk 700 22px title, 3-line KR description, mono tail link "케이스 열기 ↗" in cyan.
       a) VR Robot Teleoperation — chips: XR / Robotics / IK — "Quest 3 입력, Unity 런타임, Flask 브리지, RoboDK, 사내 자코비안 IK 확장을 하나의 산업 XR 파이프라인으로 통합했습니다."
       b) WatchBIM — chips: BIM / Runtime / Tooling — "Unity BIM 런타임을 위한 커스텀 히트 엔진, 단면 생성, 2D 분석 뷰어, 카메라 시스템을 자체 설계했습니다."
       c) Neostalgia — chips: XR / AI Pipeline / Exhibition, badges: `BIFAN Selection` `MSIT 장관표창` — "관람객 인터뷰 기반 콘텐츠 생성과 실 전시 운영을 함께 책임진 XR 경험 파이프라인입니다."
       d) DX Center / VR Simulators — chips: Industrial / Safety — "Samsung·LG·POSCO 안전체험관에 납품된 멀티유닛 시뮬레이터, 듀얼 액시스 비계 장치까지 직접 설계·납품했습니다."

5) CH.02 — AI EXPERIMENTS
   - Card style: same as Ch.01 but with a hairline accent-amber line at the top of each card to signal "experiment."
   - Section intro:
       mono kicker "AI · experiments"
       heading: "AI 한 번 빠지자, 멈출 수 없었습니다."
       paragraph: "지난 1년, 생성형·로컬 LLM·에이전트 워크플로우를 직접 빌드하며 실험을 반복했습니다. 데모가 아니라 운용 가능한 형태로 끝맺는 것을 목표로 했습니다."
   - 3 cards row:
       a) GenWorld (Ollama) — "로컬 LLM 기반 NPC 다이얼로그·스킬·월드 생성 시스템."
       b) Ops-Cure — "에이전트가 다이얼로그와 워크플로우를 함께 다루는 운영형 LLM 커널."
       c) Industrial AI Prototypes — "현장 데이터를 LLM 워크플로우에 연결한 사내 실험들."

6) CH.03 — DESKRELAY (CLIMAX) — full-bleed product showcase, bg-elevated with subtle inner cyan glow + dotted grid:
   2-col desktop (8/4 split), stacks on mobile.
   LEFT column (8 cols):
     - mono kicker (accent-cyan): `// flagship — developer tool grade`
     - "DeskRelay" wordmark (Space Grotesk 700, 56–72px, slight cyan underline tick)
     - One-sentence positioning (KR 격식체): "로컬에서 돌아가는 Claude·Codex 세션을, 모바일과 브라우저에서 안전하게 원격으로 조작합니다."
     - Capability bullet list (each one-liner with mono [x]):
         `[x] self-host  — 로컬 PC 자체가 서버`
         `[x] mobile     — Android / iOS 브라우저 + Play Store 앱`
         `[x] multi-pc   — 여러 PC 세션을 한 화면에서 스위치`
         `[x] secure     — 사용자별 토큰·세션·로그`
     - Two CTAs:
         Primary cyan filled: "DeskRelay 전체 케이스 →"
         Ghost mono: "Play Store ↗"
     - Hairline mono metric chips strip:
         `version: stable · users: shipping · uptime: 24/7 · repo: open`
   RIGHT column (4 cols): two phone frames overlapping at slight angle (one showing session list, one showing active terminal session), with a partial dark desktop window behind them. All dark theme. One cyan highlight per screen. Phone frames have thin amber corner outlines.
   Below the 2-col block: horizontal scroller of 4–6 actual DeskRelay screenshots (use assets/images/v2_dashboard_1.png, v2_dashboard_2.png, v2_dashboard_3.png, v2_launcher.png), framed as thin dark cards with mono captions.

7) PROFILE SNAPSHOT (compact, 2-col desktop):
   Left (mono kicker `// profile`, KR 격식체): "Unity 10년차. XR·BIM·로보틱스·전시 시스템을 현장 납품 단위로 책임져 왔으며, 지금은 AI 개발자 도구를 만드는 데 몰두하고 있습니다."
   Right (mono 3-row stat strip):
     `unity · 10y`
     `ai-systems · shipping`
     `field-delivery · samsung / lg / posco / lockheed brief`

8) CONTACT / CTA STRIP (full-width band):
   mono kicker `// next`
   line: "DeskRelay 라이브 데모나 채용 미팅이 필요하시면 바로 연결합니다."
   mono buttons: `mail · darkhtk@gmail.com` `github ↗` `linkedin ↗` `한국어 · english 토글`

9) FOOTER (thin hairline top border, mono only):
   Left: "daeki.hong · 2026" + caret cursor. Right: lowercase mono nav repeat.

────────────────────────────────────────
ACCESSIBILITY:
- ≥ 4.5:1 contrast for body text
- cyan accents need a non-color cue (icon, underline, or border)
- Korean body always uses Pretendard / Noto Sans KR

DELIVERABLES:
- Desktop 1440 home (full page)
- Mobile 390 home (full page)
- Close-up of Ch.03 DeskRelay showcase (desktop)
- Close-up of one project card hover state

DO NOT:
- use stock illustrations or 3D characters
- introduce a third accent color
- use full-width hero photos
- use pill buttons for primary CTAs (only chips are pills)
- center-align body text
- write English headlines longer than 4 words
```

---

## 2. DESKRELAY 케이스 페이지 (`/deskrelay/` 또는 `/ai-systems/remote-for-claude/`)

목적: 홈 Ch.03 의 클릭을 받아서 "이게 진짜 개발자 도구 수준이다" 를 증명. 제품 랜딩 + 엔지니어링 케이스 스터디 하이브리드.

```
Design a deep-dive product case-study page for "DeskRelay" — a remote-session control tool that lets developers operate their local Claude/Codex/Cursor sessions from mobile browsers and a Play Store Android app. This page is part of a Korean engineer's portfolio aimed at AI-team recruiters at Korean enterprises. Treat it as a hybrid: half product landing (download / try it), half engineering case study (architecture, decisions, depth).

Use the exact same dark / developer-console design system as the parent portfolio:
- bg-primary #0B0F14 / bg-elevated #11161D / dotted grid overlay
- text-primary #E6EDF3 / text-secondary #8A94A6 / text-muted #5B6573
- accent-cyan #6FE3FF / accent-amber #F5C26B
- border-hairline rgba(230,237,243,0.08)
- Space Grotesk display, Pretendard/Noto Sans KR body, JetBrains Mono labels
- Korean formal tone (격식체), no English headlines longer than 4 words

Page composition (top → bottom):

1) NAV — same sticky nav as home, but `deskrelay` link is active state (cyan underline tick).

2) HERO (min-height 92vh, dotted grid bg, subtle cyan inner glow):
   - Mono kicker (accent-cyan): `// ai dev tool · shipping`
   - Brand wordmark "DeskRelay" — Space Grotesk 700, 96–120px desktop, with a small mono tagline below: `remote your local AI dev session`
   - Two-line KR sub-headline (text-primary, 700, 28–36px):
       "노트북을 열지 않고도,"
       "로컬 Claude·Codex 세션을 그대로 이어 갑니다."
   - Two CTAs row:
       Primary cyan filled: "Play Store 에서 받기 ↗"
       Ghost mono: "GitHub 저장소 ↗"
       Tertiary text link: "셀프 호스트 가이드 →"
   - To the right (desktop, 5 of 12 cols): a layered hero composition — one Android phone showing a clean DeskRelay session list, partially overlapping a second phone showing an active terminal stream, with a thin dotted cyan line connecting them to a small dark desktop window in the background. All dark. The dotted line subtly animates.
   - Below CTAs, mono metric strip:
       `version: stable · platforms: web / android · auth: per-user · uptime: 24/7`

3) "WHAT IT DOES" — three-up capability blocks, full width, each ~50vh:
   Each block is a 2-col layout (alternating: media left/copy right, then copy left/media right):
   a) MOBILE — copy: mono kicker "// 01 · mobile", heading "출퇴근 중에도 같은 세션."
      body (KR 격식체): "Android 브라우저와 Play Store 앱에서 동일한 세션을 그대로 이어 받습니다. 자동 재연결, 입력 보존, 토큰 분리까지 모바일을 우선으로 설계했습니다."
      media: phone screen close-up with cyan tap-feedback highlight
   b) SELF-HOST — mono kicker "// 02 · self-host", heading "내 PC 가 서버."
      body: "별도 서버 없이 본인 데스크톱을 호스트로 사용합니다. 외부 서비스에 세션 토큰이나 키를 위탁할 필요가 없습니다."
      media: small architecture diagram — phone → HTTPS → local-PC daemon → Claude / Codex / Cursor processes
   c) MULTI-PC — mono kicker "// 03 · multi-pc", heading "여러 PC, 한 화면."
      body: "집·사무실·노트북 PC 의 세션을 한 화면에서 전환합니다. 각 PC 는 독립된 호스트로 등록되며, 인증과 로그는 사용자 단위로 분리됩니다."
      media: dashboard-style screenshot with multiple PC entries listed

4) ARCHITECTURE DIAGRAM — full-width section, bg-elevated:
   mono kicker "// architecture"
   heading: "개발자 도구로 설계했습니다."
   A clean wireframe diagram with three vertical lanes (client / relay / host), all rendered with hairline strokes and cyan/amber accents. Annotate with mono labels: `mobile browser`, `Play Store app`, `relay daemon`, `auth · session · log`, `local host service`, `Claude / Codex / Cursor`.
   Right side: a 4-bullet list of engineering decisions (mono labeled):
     `[t] transport   — WebSocket over HTTPS, auto-reconnect`
     `[s] session     — per-user token, isolated process scope`
     `[l] logging     — local-first, redacted by default`
     `[u] update      — Play Store + self-host release channel`

5) SCREENSHOT GALLERY — full-bleed horizontal scroller with 6–10 actual screenshots in thin dark frames, mono captions below each:
   - session list, active terminal, settings panel, mobile portrait, mobile landscape, dashboard, etc.

6) ENGINEERING DEPTH — 2-col, copy-heavy:
   mono kicker "// notes"
   heading: "왜 '도구 수준'까지 끌어올렸나."
   body (KR 격식체, 3–4 paragraphs):
     "처음에는 작은 원격 컨트롤러였습니다. 그러나 매일 본인 워크플로우에 쓰다 보니, 안정성·복구·인증·로그처럼 도구를 도구답게 만드는 부분이 곧 본문이 되었습니다."
     "Android 앱은 Play Store 심사를 통과시키며 권한 모델·서명·릴리스 채널을 정리했고, 셀프 호스트는 비개발자도 30분 안에 띄울 수 있도록 가이드를 완성했습니다."
     "결과적으로 DeskRelay 는 '시연용 데모'가 아니라, 일상 워크플로우에 끼워 쓰는 개발자 도구가 되었습니다."
   Right column: pull-quote in Space Grotesk italic, oversized accent-cyan colon: "데모가 아니라 매일 쓰는 도구."

7) ROADMAP / STATUS — mono table-like strip:
   `[x] mobile web        shipping`
   `[x] android (play)    shipping`
   `[x] self-host guide   shipping`
   `[ ] team sessions     planned`
   `[ ] desktop overlay   planned`

8) CTA BAND — full-width, hairline border top + bottom:
   line: "DeskRelay 를 한 번 써 보시면, 이력서보다 명확합니다."
   buttons: `Play Store ↗` (cyan filled), `GitHub ↗` (ghost mono), `darkhtk@gmail.com` (text link)

9) RELATED — small footer-row of 2 cards: "Ops-Cure" and "GenWorld" (other AI Systems), then "Industrial Projects" link.

10) FOOTER — same as home.

Negative constraints same as home (no stock illustration, no third accent color, no rounded-pill primary buttons, no English headlines > 4 words).

Deliverables: desktop 1440 + mobile 390 + close-up of architecture diagram + close-up of screenshot gallery.
```

---

## 3. AI SYSTEMS 인덱스 (`/ai-systems/`)

목적: AI 카테고리 진입점. DeskRelay 가 flagship 으로 가장 크게, 나머지는 그리드.

```
Design an "AI Systems" index page for the same Korean dark / developer-console portfolio. This page lists the engineer's AI work, with DeskRelay as a flagship (2x size card or top-row spotlight), followed by Ops-Cure, GenWorld (Ollama), and a small "lab notebook" strip of smaller experiments. Korean formal tone (격식체); English allowed only for technical labels.

Reuse the exact design system from the portfolio HOME (bg #0B0F14, accent cyan #6FE3FF + amber #F5C26B, Space Grotesk + Pretendard + JetBrains Mono, hairline dividers, dotted grid). Active nav state on `ai`.

Page composition:

1) STICKY NAV — same as home, `ai` active.

2) PAGE HEADER (no full-height hero — this is an index):
   mono kicker "// ai systems"
   heading (text-primary, 700, 48–64px desktop): "AI 를 데모로 두지 않습니다."
   sub (text-secondary, max 64ch, KR 격식체): "산업 현장에서 다져진 엔지니어링을 토대로, 운영 가능한 형태로 끝맺는 AI 시스템을 만듭니다. 도구는 일상 워크플로우에 끼워 써야 의미가 있다고 믿습니다."

3) FLAGSHIP — DeskRelay 큰 카드 (2x size of regular card, full or 2/3 width):
   Layout: 2-col card. Left: mono kicker "// flagship", "DeskRelay" wordmark (Space Grotesk 700, 56px), one-line KR positioning, 4 capability chips (`self-host`, `mobile`, `multi-pc`, `secure`), primary CTA "전체 케이스 →".
   Right: composite mockup (two phones + desktop window, same as home).
   Card surface: bg-elevated, 1px cyan hairline (slightly stronger than other cards), 12px radius, soft inner cyan glow.

4) AI SYSTEMS GRID — 2 cards row, regular size:
   - Ops-Cure — chips: Agent / Kernel / Workflow — "에이전트가 다이얼로그와 워크플로우를 함께 다루는 운영형 LLM 커널." — image: `assets/images/orchestration-v1-loop.png`
   - GenWorld (Ollama) — chips: Local LLM / NPC / Pipeline — "로컬 LLM 기반 NPC 다이얼로그·스킬·월드 생성 시스템." — image: `assets/images/genworld-world.png`

5) LAB NOTEBOOK — mono kicker "// experiments", heading "작게 시작한 것들."
   A list (not cards) of 4–6 smaller experiments, each as one row:
     `2025-11  industrial-llm-bridge   현장 데이터를 LLM 워크플로우에 연결한 사내 실험      ↗`
     `2025-09  voice-ops-cure-v0       Whisper + Ollama 로 운영 보조 데모                  ↗`
     `2025-07  prompt-tooling-cli      반복 프롬프트를 CLI 로 묶은 작은 도구                ↗`
     (etc.)
   Style: mono, hairline rules between rows, date in text-muted, title in text-primary, description in text-secondary, hover shows cyan arrow.

6) CTA BAND — "AI 직군 채용 또는 데모가 필요하시면 연결해 주세요." + email + linkedin + github.

7) FOOTER — same as home.

Deliverables: desktop 1440 + mobile 390 + close-up of flagship card.
```

---

## 4. INDUSTRIAL PROJECTS 인덱스 (`/projects/`)

목적: 10년 산업 Unity 작업 아카이브. 그리드 풍부하게, 신뢰감 위주.

```
Design an "Industrial Projects" archive index for the same Korean dark / developer-console portfolio. This page is the engineering archive — 10 years of Unity work in industrial real-time systems, XR, BIM, robotics, exhibition. Korean formal tone (격식체). Reuse the portfolio design system. Active nav state on `industrial`.

Page composition:

1) STICKY NAV — `industrial` active.

2) PAGE HEADER:
   mono kicker "// industrial · 10 years"
   heading: "현장에 납품된 것만 모았습니다."
   sub: "전시 운영, 안전체험, BIM 런타임, 로보틱스 원격 조작 — 모두 실제 운영 환경에서 검증된 작업입니다."

3) FILTER BAR (mono pill chips, active state in cyan):
   `all` `xr` `robotics` `bim` `simulation` `exhibition` `safety`

4) PROJECT GRID — 3 cols desktop / 1 col mobile, 24px gap. Cards in bg-elevated, 1px hairline, 8–12px radius. Each card:
   - 4/3 dark media with thin cyan corner ticks (use the existing assets/images/* files)
   - mono row of chips
   - Space Grotesk 700 22px title
   - 3-line KR description (격식체)
   - mono tail link "케이스 열기 ↗"
   - optional badge row (e.g. BIFAN, MSIT)

   Cards to include (use these titles, chips, copy seeds, and image paths):
   a) VR Robot Teleoperation
      chips: XR / Robotics / IK
      image: assets/images/vr_robot_expo2.png
      copy: "Quest 3 입력, Unity 런타임, Flask 브리지, RoboDK, 사내 자코비안 IK 확장을 하나의 산업 XR 파이프라인으로 통합했습니다."
   b) WatchBIM
      chips: BIM / Runtime / Tooling
      image: assets/images/watchbim_generated_crosssection.png
      copy: "Unity BIM 런타임을 위한 커스텀 히트 엔진, 단면 생성, 2D 분석 뷰어, 카메라 시스템을 자체 설계했습니다."
   c) Neostalgia
      chips: XR / AI Pipeline / Exhibition
      badges: BIFAN Selection · MSIT 장관표창
      image: assets/images/neostalgia_skybox.png
      copy: "관람객 인터뷰 기반 콘텐츠 생성과 실 전시 운영을 함께 책임진 XR 경험 파이프라인입니다."
   d) DX Center
      chips: Industrial / Exhibition
      image: assets/images/vr_robot_expo1.png
      copy: "DX 센터 전시 운영을 위한 멀티유닛 시뮬레이터·콘텐츠 라인업 — 운영 비용과 유지보수까지 책임진 납품 단위 작업입니다."
   e) VR LG-Haus / Safety
      chips: Safety / Simulation
      image: assets/images/vr_lghaus_safety.png
      copy: "LG·POSCO 안전체험관에 납품된 VR 시뮬레이터. 듀얼 액시스 비계 장치는 직접 설계·납품했습니다."
   f) LCM Cockpit
      chips: XR / Hardware
      image: assets/images/vr_lcm_cockpit.png
      copy: "LCM 콕핏 시뮬레이터. 하드웨어와 Unity 입력 동기, 운영자 안전 로직을 함께 책임졌습니다."

5) DELIVERY CONTEXT STRIP (below grid):
   mono kicker "// delivery"
   2-col: left heading "납품 단위로 일합니다.", right paragraph (KR 격식체):
     "전시 설치·운영·철수, 공장·건설현장 방문, 장비 설치·제작·출고를 반복해 왔습니다. 그래서 시스템을 '완벽한 개발 환경' 이 아니라, '운영자 제약·검증·유지보수 비용' 을 기준으로 설계합니다."
   Bullets:
     `4 rounds — 시뮬레이터 설치·운영·철수`
     `samsung · lg · posco — 안전체험관 납품`
     `lockheed martin — 영문 제품 라인업 브리핑`

6) CTA BAND — "더 보고 싶으시면 채용 미팅에서 자세히 보여 드립니다." + email + github + linkedin.

7) FOOTER — same as home.

Deliverables: desktop 1440 + mobile 390 + close-up of one card hover.
```

---

## 5. PROFILE (`/about/`)

목적: 타임라인으로 서사 척추를 재확인 + 스킬 매트릭스 + 수상·납품 이력 + PDF 다운로드.

```
Design a "Profile" page for the same Korean dark / developer-console portfolio. Korean formal tone (격식체). Reuse the portfolio design system. Active nav state on `profile`.

Page composition:

1) STICKY NAV — `profile` active.

2) PAGE HEADER (compact, no full hero):
   mono kicker "// profile"
   name (Space Grotesk 700, 56–72px): "Daeki Hong · 홍대기"
   role (text-secondary): "Senior Unity Engineer → AI Systems Builder"
   meta strip (mono, text-muted): `seoul, kr · 10y unity · ai-systems shipping`

3) NARRATIVE TIMELINE — vertical timeline on left rail (thin cyan line with amber tick marks), copy on right. Each entry is mono date + Space Grotesk title + 2-line KR paragraph. Order: oldest → newest, ending with DeskRelay as the climactic last entry highlighted in accent-cyan.
   Entries (use these year markers and seeds):
     2014  · First Unity work — "Unity 3 시절, 작은 게임 프로젝트로 시작했습니다."
     2017  · Industrial XR  — "안전체험·전시용 VR 시뮬레이터 개발에 합류했습니다."
     2019  · Field delivery — "전시 설치·운영·철수, 현장 납품 사이클을 직접 책임지기 시작했습니다."
     2021  · WatchBIM      — "Unity 런타임으로 BIM 도구를 만드는 일에 들어갔습니다."
     2022  · Lockheed brief — "Lockheed Martin 방문 시 전체 제품 라인업을 영어로 브리핑했습니다."
     2023  · VR robot + Neostalgia — "Quest 3 기반 로봇 원격 조작과, BIFAN 선정·MSIT 장관표창을 받은 Neostalgia 를 동시에 진행했습니다."
     2024  · AI 몰입 시작 — "GenWorld(Ollama), Ops-Cure 등 AI 시스템을 직접 빌드하기 시작했습니다."
     2025  · Ops-Cure / GenWorld 출하 — "에이전트 커널과 NPC 시스템을 운영 가능한 수준으로 끌어올렸습니다."
     2026  · DeskRelay ★ — "로컬 Claude·Codex 세션을 모바일에서 안전하게 원격 조작하는 개발자 도구. 현재 Play Store 출시, 셀프 호스트 가이드까지 정비된 상태입니다."

4) SKILLS MATRIX — 4 columns of mono labeled skill stacks, each column with hairline divider:
   ENGINEERING       AI SYSTEMS         XR · ROBOTICS         FIELD
   unity · c#        ollama / local-llm  quest 3 · openxr      delivery
   editor tooling    agent kernels       jacobian ik           safety
   shaders · jobs    workflow design     robodk · ros bridge   exhibition
   profiling         prompt tooling      hand-input            samsung / lg / posco
   ci / build        play store ship     hardware integration  english briefing

5) HONORS — horizontal mono strip with thin amber tick on each:
   `BIFAN Selection — Neostalgia`
   `MSIT 장관표창 — XR Content`
   `Samsung · LG · POSCO — 안전체험관 납품`
   `Lockheed Martin — 영문 제품 라인업 브리핑`

6) PDF / DOWNLOADS — 3 cards row:
   - "이력서 (Resume PDF)" — mono kicker `// pdf · resume`
   - "포트폴리오 (Portfolio PDF)" — mono kicker `// pdf · portfolio`
   - "자기소개서 (Cover Letter)" — mono kicker `// pdf · cover letter`
   Each card has a small file icon, file size, "다운로드 ↓" button (cyan filled).

7) CONTACT BAND — same style as home: mono kicker `// next`, line "AI 직군 채용·데모 미팅이 필요하시면 바로 연결합니다.", buttons row.

8) FOOTER — same as home.

Deliverables: desktop 1440 + mobile 390 + close-up of timeline section.
```

---

## 사용 순서 권장

1. **HOME 먼저** — 톤이 가장 많이 노출되는 화면이라 톤 검증 1순위.
2. HOME 결과가 만족스러우면 → **DeskRelay 케이스** (클라이맥스 검증).
3. **AI Systems / Industrial / Profile** 은 동일 토큰을 그대로 가져가므로 한 번에 묶어서 진행 가능.
4. Stitch 결과는 스크린샷으로 저장 → 이후 구현 단계의 시각 참조 자료로 사용 (HTML 변환은 직접 합니다).

## 메모

- Stitch 가 한 프롬프트당 받아들이는 길이가 길어서 위 코드 블록은 그대로 한 번에 넣을 수 있습니다. 잘리는 경우 `PAGE COMPOSITION` 위까지 먼저 넣고, 이후 섹션부터 follow-up 으로 이어 보내세요.
- 카피는 모두 임시 시드입니다. 구현 단계에서 다듬되, 격식체/4단어-영어-헤드라인-금지 같은 톤 규칙은 유지합니다.
- 이미지 경로는 현재 저장소의 `assets/images/` 파일을 그대로 참조했어요. DeskRelay 스크린샷은 `v2_*.png` 시리즈, 산업 프로젝트는 기존에 정리된 파일을 그대로 사용.
