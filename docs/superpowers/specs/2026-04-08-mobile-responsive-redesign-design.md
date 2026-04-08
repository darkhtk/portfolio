# Mobile-Responsive Redesign — Design Spec

- **Date**: 2026-04-08
- **Author**: 홍대기 (with Claude Code)
- **Status**: Draft → Awaiting user review

## 1. Goal

`darkhtk/portfolio` 정적 사이트(8 페이지)가 모바일 viewport(360–414px)에서 정상 동작하도록 전체 모바일 재설계. 핵심 동기:

- 현재 8개 페이지 모두 데스크톱 nav를 `hidden md:flex`로 숨기지만 **햄버거 메뉴 대체가 없음** → 모바일 방문자는 페이지 간 이동 불가.
- 일부 그리드(`grid-cols-4`, `grid-cols-3`)가 반응형 처리되지 않아 모바일에서 칸이 깨짐.
- 섹션 세로 패딩 `py-32`, 컨테이너 좌우 패딩 `px-8`이 모바일에서 과도해 가독성·스크롤 피로 유발.
- 데스크톱 디자인은 만족스러운 상태 — 모바일만 보강, 데스크톱 회귀 0.

## 2. Scope

**In scope**:
- 8개 HTML 페이지 모바일 반응형 처리
  - `index.html`, `projects.html`, `about.html`, `resume.html`, `cover-letter.html`
  - `case-study-vr-robot.html`, `case-study-dxcenter.html`, `case-study-orchestration-ts.html`
- 모바일 햄버거 nav 컴포넌트 신규 도입 (전체화면 오버레이)
- 5개 공통 반응형 토큰 수립 및 일괄 적용
- README.md에 cover-letter 내용 반영 (후속 작업)

**Out of scope**:
- 빌드 시스템·번들러 도입
- nav HTML 컴포넌트화 (JS include / 템플릿 엔진)
- 다크모드 토글 (이미 다크 고정)
- 접근성 전반 audit (nav 컴포넌트만 a11y 챙김)
- 이미지 최적화 / WebP 변환
- 새 콘텐츠 추가 / 카피 수정

## 3. Architecture & Constraints

| 항목 | 결정 |
|---|---|
| 호스팅 | GitHub Pages 정적 (변경 없음) |
| CSS | Tailwind CSS CDN — 이미 로드, 변경 없음 |
| JS | Vanilla JS, 모바일 nav 토글 함수 1개 신규 추가 |
| nav 중복 처리 | **수동 동기화** — 8개 파일에 nav HTML 복제. JS include 미도입 (FOUC·SEO 손실 회피) |
| 검증 | Chrome/Firefox DevTools device toolbar — 4개 viewport 시각 검증. 작업 종료 시 실기기 1회 |
| 빌드 | 없음 (Tailwind CDN이 런타임 처리) |

### Target Viewports

| Viewport | 폭 | 우선순위 |
|---|---|---|
| Galaxy S20 | 360px | 1차 (가장 좁은 폰) |
| iPhone 14 Pro | 390px | 1차 |
| iPad | 768px | 2차 |
| Desktop | 1280px | 회귀 검증 (변화 0이 목표) |

## 4. Common Responsive Tokens

8개 파일에 일괄 적용할 5개 공통 패턴.

### Token 1. Container Horizontal Padding
```
Before:  px-8                    (32px 고정)
After:   px-4 sm:px-6 md:px-8    (16/24/32 단계)
```
**Rationale**: 360-390px 모바일에서 `px-8`은 본문 폭이 양쪽 합쳐 64px 깎여 너무 좁음. 16px가 모바일 표준.

### Token 2. Section Vertical Padding
```
Before:  py-32                       (128px 고정)
After:   py-16 sm:py-20 md:py-32     (64/80/128 단계)
```
**Rationale**: 모바일에서 `py-32`는 한 화면이 통째로 빈 공간. 스크롤 피로 유발. 64px로 줄여도 섹션 구분은 충분.

### Token 3. Typography Scale
```
H1 (Hero):  text-4xl sm:text-5xl md:text-7xl lg:text-[5.5rem]
H2:         text-3xl sm:text-4xl md:text-5xl
H3:         text-xl sm:text-2xl
본문:        text-base sm:text-lg   (현재 text-lg 고정인 곳)
```
**Rationale**: Korean+English 혼용이라 영문 단독 사이트보다 한 단계 작아도 가독성 유지. 360px에서 `text-5xl` (48px) 두 줄 깨짐 방지.

### Token 4. Grid Column Count
```
Before:  grid-cols-4              (index.html:234, 통계 4칸)
After:   grid-cols-2 md:grid-cols-4

Before:  grid-cols-3              (case-study-vr-robot.html:255)
After:   grid-cols-2 sm:grid-cols-3
```
**Rationale**: 모바일에서 4칸은 칸당 80px 미만 → 숫자/라벨 깨짐. 2×2 배치가 안정.

### Token 5. Flex Direction
이미 모든 주요 flex 컨테이너가 `flex-col md:flex-row` / `grid-cols-1 lg:grid-cols-12` 패턴 사용 중. **신규 토큰 없음 — 검증 항목으로만 유지**.

## 5. Mobile Navigation Component

가장 큰 신규 컴포넌트. 8개 파일에 동일하게 삽입.

### HTML Structure

```html
<!-- Top bar (모든 viewport 공통) -->
<nav class="fixed top-0 w-full z-50 bg-[#0c1324]/60 backdrop-blur-xl shadow-[0px_24px_48px_rgba(0,0,0,0.4)]">
  <div class="flex justify-between items-center px-4 sm:px-6 md:px-8 py-4 max-w-7xl mx-auto">
    <a href="index.html" class="flex flex-col">
      <div class="text-xl font-bold tracking-tighter text-primary font-headline">DAEKI HONG</div>
      <div class="font-label text-[10px] text-slate-500 uppercase tracking-[0.2em]">INDUSTRIAL UNITY × AI AGENT</div>
    </a>

    <!-- Desktop links: md 이상 -->
    <div class="hidden md:flex items-center gap-8 font-headline tracking-tight text-sm uppercase">
      <a class="[active 클래스 페이지마다 다름]" href="index.html">Home</a>
      <a class="text-slate-400 hover:text-primary transition-colors" href="projects.html">Projects</a>
      <a class="text-slate-400 hover:text-primary transition-colors" href="about.html">About</a>
      <a class="text-slate-400 hover:text-primary transition-colors" href="resume.html">Resume</a>
      <a class="text-slate-400 hover:text-primary transition-colors" href="cover-letter.html">Cover Letter</a>
    </div>

    <div class="flex items-center gap-3">
      <!-- Connect: 모바일 아이콘만, 데스크톱 텍스트 -->
      <a href="mailto:darkhtk@gmail.com" class="px-4 sm:px-6 py-2 rounded-md bg-gradient-to-r from-primary to-primary-container text-on-primary font-headline font-bold text-sm tracking-wide hover:scale-95 active:scale-90 transition-transform">
        <span class="hidden sm:inline">Connect</span>
        <span class="sm:hidden material-symbols-outlined text-lg align-middle">mail</span>
      </a>

      <!-- 햄버거: md 미만 -->
      <button id="mobile-menu-toggle"
              class="md:hidden p-2 text-on-surface hover:text-primary transition-colors"
              aria-label="메뉴 열기"
              aria-expanded="false"
              aria-controls="mobile-menu">
        <span class="material-symbols-outlined">menu</span>
      </button>
    </div>
  </div>
</nav>

<!-- Full-screen overlay menu: md 미만, 기본 hidden -->
<div id="mobile-menu"
     class="fixed inset-0 z-[60] bg-[#0c1324]/95 backdrop-blur-2xl hidden flex-col md:hidden"
     role="dialog"
     aria-modal="true"
     aria-label="메인 메뉴">
  <div class="flex justify-between items-center px-4 sm:px-6 py-4">
    <div class="text-xl font-bold tracking-tighter text-primary font-headline">DAEKI HONG</div>
    <button id="mobile-menu-close"
            class="p-2 text-on-surface hover:text-primary transition-colors"
            aria-label="메뉴 닫기">
      <span class="material-symbols-outlined">close</span>
    </button>
  </div>

  <div class="flex-1 flex flex-col justify-center px-8 gap-6">
    <a href="index.html" class="font-headline text-3xl font-bold text-on-surface hover:text-primary transition-colors">HOME</a>
    <a href="projects.html" class="font-headline text-3xl font-bold text-on-surface hover:text-primary transition-colors">PROJECTS</a>
    <a href="about.html" class="font-headline text-3xl font-bold text-on-surface hover:text-primary transition-colors">ABOUT</a>
    <a href="resume.html" class="font-headline text-3xl font-bold text-on-surface hover:text-primary transition-colors">RESUME</a>
    <a href="cover-letter.html" class="font-headline text-3xl font-bold text-on-surface hover:text-primary transition-colors">COVER LETTER</a>

    <hr class="border-outline-variant my-4"/>

    <a href="mailto:darkhtk@gmail.com" class="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-gradient-to-r from-primary to-primary-container text-on-primary font-headline font-bold w-fit">
      <span class="material-symbols-outlined">mail</span> CONNECT
    </a>

    <div class="flex gap-6 mt-2 text-sm font-body uppercase tracking-widest text-slate-400">
      <a href="https://github.com/darkhtk" target="_blank" rel="noopener noreferrer" class="hover:text-primary">GitHub</a>
      <a href="https://www.linkedin.com/in/daeki-hong-041947182" target="_blank" rel="noopener noreferrer" class="hover:text-primary">LinkedIn</a>
    </div>
  </div>
</div>
```

### JS (8개 파일에 동일하게 삽입)

```html
<script>
(function() {
  const toggle = document.getElementById('mobile-menu-toggle');
  const close  = document.getElementById('mobile-menu-close');
  const menu   = document.getElementById('mobile-menu');
  if (!toggle || !menu) return;

  function open() {
    menu.classList.remove('hidden');
    menu.classList.add('flex');
    document.body.style.overflow = 'hidden';
    toggle.setAttribute('aria-expanded', 'true');
  }
  function shut() {
    menu.classList.add('hidden');
    menu.classList.remove('flex');
    document.body.style.overflow = '';
    toggle.setAttribute('aria-expanded', 'false');
  }
  toggle.addEventListener('click', open);
  close && close.addEventListener('click', shut);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') shut(); });
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', shut));
})();
</script>
```

### Active 링크 표시 (페이지마다 1줄 차이)

각 파일의 nav 안 해당 링크에:
```
class="text-primary border-b-2 border-primary pb-1"
```
desktop은 위 클래스 그대로 (현 코드와 동일). 모바일 overlay 메뉴 안에서는:
```
class="font-headline text-3xl font-bold text-primary border-l-4 border-primary pl-3"
```

### Accessibility / UX 디테일
- `aria-expanded`, `aria-controls`, `aria-modal`, `aria-label` 명시
- ESC 키, 닫기 버튼, 메뉴 링크 클릭 — 3가지 닫기 트리거
- `body.style.overflow = 'hidden'` — 메뉴 열린 동안 배경 스크롤 잠금
- 햄버거 우측 배치 (한국 사용자 익숙)
- 메뉴 링크 폰트 `text-3xl` — 손가락 탭 영역 충분 (44px+)
- z-index: nav `z-50`, overlay `z-[60]`

## 6. Per-Page Changes

토큰 1~5 + nav 컴포넌트는 **8개 파일 공통 적용**. 그 외 페이지별 추가 작업:

### `index.html` — Reference 구현
- Hero 그리드: `lg:col-span-4 hidden lg:block` 이미지를 별도 `lg:hidden` 블록으로 텍스트 아래 추가, `aspect-[4/3] sm:aspect-square` 비율로 모바일 노출
- Featured Project 통계 (line 234): `grid-cols-4` → `grid-cols-2 md:grid-cols-4`
- Featured Project 카드: `min-h-[600px] p-8 md:p-16` → `min-h-[480px] sm:min-h-[600px] p-6 sm:p-8 md:p-16`
- 3 Pillars 카드 패딩: `p-10` → `p-6 sm:p-8 md:p-10`

### `projects.html`
- 토큰 1~3 + nav 적용
- 필터 칩 그리드(`grid-cols-1 md:grid-cols-3`) 그대로 유지
- 카드 내부 패딩만 토큰 1 적용
- 필터 vanilla JS 변경 없음

### `about.html`
- 토큰 1~3 + nav 적용
- 통계 섹션(`grid-cols-2 md:grid-cols-4`) 이미 OK
- Tech Ecosystem 섹션 py 토큰 2 적용

### `resume.html`
- 토큰 1~3 + nav 적용
- 경력 타임라인 indent: `pl-12` → `pl-6 sm:pl-8 md:pl-12`
- `body class="antialiased overflow-x-hidden"` 유지

### `cover-letter.html`
- 토큰 1~3 + nav 적용 (가장 단순)

### `case-study-vr-robot.html`
- 토큰 1~3 + nav 적용
- Line 255 `grid-cols-3 gap-2` → `grid-cols-2 sm:grid-cols-3 gap-2`
- Line 215 `grid-cols-1 md:grid-cols-4 grid-rows-2 h-auto md:h-[600px]` 이미 OK
- Line 402 `grid-cols-2 md:grid-cols-3 lg:grid-cols-5` 이미 OK

### `case-study-dxcenter.html`
- 토큰 1~3 + nav 적용
- 모든 그리드가 이미 `grid-cols-1 md:...` 패턴

### `case-study-orchestration-ts.html`
- 토큰 1~3 + nav 적용
- 코드 블록 커스텀 CSS (line 55-57) — 미디어쿼리 추가:
  ```css
  @media (max-width: 640px) {
    .code-block { padding: 12px; font-size: 13px; }
  }
  ```
- `overflow-x: auto`, `white-space: pre` 유지

### Footer (8개 공통)
- 이미 `flex-col md:flex-row` — OK
- 토큰 1·2만 적용

## 7. Rollout Plan

```
Step 1. index.html — Reference 구현
   ├─ nav 컴포넌트 + JS 삽입
   ├─ 토큰 1~5 적용
   └─ 페이지별 변경 (Hero 이미지 이동, 통계 grid-cols-2)

Step 2. ▶ 사용자 검증 (DevTools 4 viewport)
        pass 시 Step 3 진행

Step 3. 일괄 적용 (7개 파일)
   ├─ projects.html
   ├─ about.html
   ├─ resume.html
   ├─ cover-letter.html
   ├─ case-study-vr-robot.html
   ├─ case-study-dxcenter.html
   └─ case-study-orchestration-ts.html
   각 파일: nav 컴포넌트 교체 → 토큰 적용 → 페이지별 추가 손질

Step 4. ▶ 사용자 검증 (8 페이지 × 4 viewport)

Step 5. README.md cover-letter 내용 반영

Step 6. Git commit (논리 단위로 분할)
   ├─ commit 1: index.html reference 구현 + nav 컴포넌트
   ├─ commit 2: 나머지 7개 페이지 모바일 패턴 일괄 적용
   ├─ commit 3: case-study-orchestration-ts 코드블록 미디어쿼리
   └─ commit 4: README cover-letter 내용 추가
```

## 8. Verification Checklist

각 페이지 × 4 viewport 공통 점검:

- [ ] 가로 스크롤 발생 안 함 (`overflow-x` 검사)
- [ ] 햄버거 메뉴 5가지 동작:
  - [ ] 햄버거 버튼 클릭 → overlay 열림
  - [ ] 닫기 버튼 클릭 → overlay 닫힘
  - [ ] ESC 키 → overlay 닫힘
  - [ ] 메뉴 안 링크 클릭 → 페이지 이동 + overlay 닫힘
  - [ ] overlay 열려있는 동안 배경 스크롤 잠금
- [ ] 8개 nav 링크가 모든 페이지에서 정상 이동
- [ ] 이미지 `loading="lazy"` 유지
- [ ] 폰트 변화 자연스러움 (브레이크포인트 경계에서 점프 X)
- [ ] 데스크톱 1280px에서 회귀 0 (기존 디자인 100% 유지)

페이지별 추가 점검:
- [ ] index.html: Hero 이미지가 모바일에서 텍스트 아래에 노출
- [ ] index.html: Featured Project 통계가 모바일에서 2×2
- [ ] case-study-vr-robot.html line 255: 2칸 grid 모바일 노출
- [ ] case-study-orchestration-ts.html: 코드 블록 모바일에서 가로 스크롤 정상

## 9. Risks & Mitigations

| 리스크 | 완화 방안 |
|---|---|
| 8 파일 중복 수정 일관성 깨짐 | index.html에서 nav 블록 완성 후 그대로 복사·붙여넣기. active 링크 1줄만 페이지마다 다름 |
| case-study-orchestration-ts 코드 블록 width 깨짐 | `@media (max-width: 640px)` 미디어쿼리 추가 후 DevTools에서 가로 스크롤 명시적 확인 |
| 모바일 햄버거 z-index 충돌 | nav `z-50`, overlay `z-[60]`으로 명시적 분리 |
| Tailwind CDN의 동적 클래스 미인식 | 모든 클래스를 정적 문자열로 작성. JS에서 `classList.add/remove`만 사용 (문자열 보간 X) |

## 10. Success Criteria

- 모바일 viewport 360px / 390px에서 8개 페이지 모두:
  - 가로 스크롤 없음
  - nav 햄버거로 모든 페이지 이동 가능
  - 본문 가독성 (폰트·패딩) 자연스러움
- 데스크톱 1280px에서 회귀 0
- HTML/CSS만 변경, 외부 의존성 추가 0
- 4개 git commit으로 변경 이력 명확
