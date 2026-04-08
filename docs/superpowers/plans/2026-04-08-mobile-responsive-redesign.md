# Mobile-Responsive Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `darkhtk/portfolio` 정적 HTML 8 페이지 사이트가 모바일 viewport(360–414px)에서 정상 동작하도록 햄버거 nav 컴포넌트 추가 및 5개 공통 반응형 토큰 일괄 적용. 데스크톱 회귀 0.

**Architecture:** 정적 HTML × Tailwind CDN. 빌드 시스템 없음. 모바일 nav HTML/JS 스니펫을 8개 파일에 수동 동기화. 각 파일은 4가지 nav 구조 패턴 중 하나에서 동일한 구조로 통일됨.

**Tech Stack:** HTML5, Tailwind CSS (CDN, plugins=forms,container-queries), Vanilla JavaScript, Material Symbols Outlined 아이콘 폰트.

**Spec Reference:** `docs/superpowers/specs/2026-04-08-mobile-responsive-redesign-design.md`

---

## File Structure

**Modified files** (no new files created):
- `index.html` (287 lines) — Reference implementation. nav Pattern A.
- `projects.html` (497 lines) — nav Pattern A.
- `about.html` (283 lines) — nav Pattern A-variant (uses `space-x-*`).
- `cover-letter.html` (219 lines) — nav Pattern A.
- `case-study-vr-robot.html` (526 lines) — nav Pattern B (Connect 버튼이 메뉴 div 안에).
- `case-study-dxcenter.html` (445 lines) — nav Pattern B.
- `case-study-orchestration-ts.html` (876 lines) — nav Pattern B + 코드 블록 CSS.
- `resume.html` (783 lines) — nav Pattern C (사이드바 + TopAppBar). 가장 복잡.
- `README.md` (29 lines) — cover-letter 내용 반영 (후속 작업).

**Modified directories**:
- `docs/superpowers/plans/` (이 plan 파일)

**No build/test infrastructure changes.**

---

## Reusable Snippets

이 섹션은 모든 task에서 참조됩니다. 작업 중 스크롤해서 다시 보세요.

### SNIPPET A: Hamburger Button (top bar 안에 들어감)

```html
<button id="mobile-menu-toggle"
        class="md:hidden p-2 text-on-surface hover:text-primary transition-colors"
        aria-label="메뉴 열기"
        aria-expanded="false"
        aria-controls="mobile-menu">
  <span class="material-symbols-outlined">menu</span>
</button>
```

### SNIPPET B: Mobile Menu Overlay (`</nav>` 닫는 태그 직후에 삽입)

페이지마다 한 줄만 다름 — 현재 페이지 링크에 active 클래스 적용. `<!-- ACTIVE: home -->` 같은 주석으로 어느 링크가 active인지 표시.

```html
<!-- Mobile menu overlay -->
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

**Active 링크 표시 규칙**: 현재 페이지 링크의 클래스를
```
font-headline text-3xl font-bold text-on-surface hover:text-primary transition-colors
```
에서
```
font-headline text-3xl font-bold text-primary border-l-4 border-primary pl-3
```
으로 교체.

### SNIPPET C: Mobile Menu JS (`</body>` 직전에 삽입)

```html
<script>
(function() {
  const toggle = document.getElementById('mobile-menu-toggle');
  const close  = document.getElementById('mobile-menu-close');
  const menu   = document.getElementById('mobile-menu');
  if (!toggle || !menu) return;

  function openMenu() {
    menu.classList.remove('hidden');
    menu.classList.add('flex');
    document.body.style.overflow = 'hidden';
    toggle.setAttribute('aria-expanded', 'true');
  }
  function closeMenu() {
    menu.classList.add('hidden');
    menu.classList.remove('flex');
    document.body.style.overflow = '';
    toggle.setAttribute('aria-expanded', 'false');
  }
  toggle.addEventListener('click', openMenu);
  if (close) close.addEventListener('click', closeMenu);
  document.addEventListener('keydown', function(e) { if (e.key === 'Escape') closeMenu(); });
  menu.querySelectorAll('a').forEach(function(a) { a.addEventListener('click', closeMenu); });
})();
</script>
```

### TOKEN MAP: 공통 토큰 변환표

| Token | Before | After |
|---|---|---|
| **T1** Container 가로 패딩 | `mx-auto px-8` | `mx-auto px-4 sm:px-6 md:px-8` |
| **T1b** Nav inner 패딩 | `flex justify-between items-center px-8 py-4 max-w-7xl mx-auto` | `flex justify-between items-center px-4 sm:px-6 md:px-8 py-4 max-w-7xl mx-auto` |
| **T2** Section 세로 패딩 | `class="py-32` (단독) | `class="py-16 sm:py-20 md:py-32` |
| **T3a** H1 (text-5xl→7xl) | `text-5xl md:text-7xl` | `text-4xl sm:text-5xl md:text-7xl` |
| **T3b** H2 (text-4xl→5xl) | `text-4xl md:text-5xl` | `text-3xl sm:text-4xl md:text-5xl` |
| **T3c** H1 거대 (text-6xl→8xl) | `text-6xl md:text-8xl` | `text-4xl sm:text-6xl md:text-8xl` |
| **T3d** H1 lg 분기 (text-5xl→7xl) | `text-5xl lg:text-7xl` | `text-4xl sm:text-5xl lg:text-7xl` |

**T1 적용 주의**: `px-8`은 컨테이너뿐 아니라 버튼·카드 패딩에서도 사용됩니다. **반드시 `mx-auto px-8` 패턴이거나 nav inner div(`flex ... px-8 py-4 max-w-7xl mx-auto`) 패턴인 곳만** 변환. 버튼의 `px-8 py-4`는 그대로 둡니다.

---

## Task 1: Setup — Verify environment & create reference branch

**Goal**: 작업 시작 전 git 상태와 디렉토리 확인.

**Files**: 없음 (검증만).

- [ ] **Step 1: Verify working directory and git status**

Run:
```bash
cd /c/sourcetree/portfolio && git status && git log --oneline -5
```

Expected: working tree clean, recent commits include `docs: clarify spec placeholders` and `docs: add mobile-responsive redesign design spec`.

- [ ] **Step 2: Verify Tailwind CDN URL is consistent across all 8 files**

Run:
```bash
cd /c/sourcetree/portfolio
```

Then use Grep tool with pattern `cdn.tailwindcss.com` and output_mode `content`.

Expected: all 8 HTML files use `https://cdn.tailwindcss.com?plugins=forms,container-queries` (identical). If any differ, note it — the JS/HTML still works but worth flagging.

- [ ] **Step 3: Confirm spec is committed and readable**

Use Read tool on `C:\sourcetree\portfolio\docs\superpowers\specs\2026-04-08-mobile-responsive-redesign-design.md`.

Expected: file exists, latest commit `9dc0127` ("docs: clarify spec placeholders") visible in `git log`.

---

## Task 2: index.html — Reference Implementation

**Goal**: Reference implementation. 모든 패턴을 처음 적용. 이후 task들이 이 결과를 베이스로 함.

**Files**:
- Modify: `C:\sourcetree\portfolio\index.html`

### Step 2.1: Read full file to refresh context

- [ ] **Step 2.1: Read index.html**

Use Read tool on `C:\sourcetree\portfolio\index.html`. Note current state of nav (lines 74-93), Hero section (95-145), 3 Pillars section (147-204), Featured Project section (206-267), Footer (270-283).

### Step 2.2: Replace nav block (Pattern A)

- [ ] **Step 2.2: Edit nav block to add Connect icon-only mobile mode + hamburger button**

Use Edit tool. `old_string`:

```
<nav class="fixed top-0 w-full z-50 bg-[#0c1324]/60 backdrop-blur-xl shadow-[0px_24px_48px_rgba(0,0,0,0.4)]">
  <div class="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto">
    <a href="index.html" class="flex flex-col">
      <div class="text-xl font-bold tracking-tighter text-primary font-headline">DAEKI HONG</div>
      <div class="font-label text-[10px] text-slate-500 uppercase tracking-[0.2em]">INDUSTRIAL UNITY × AI AGENT</div>
    </a>
    <div class="hidden md:flex items-center gap-8 font-headline tracking-tight text-sm uppercase">
      <a class="text-primary border-b-2 border-primary pb-1" href="index.html">Home</a>
      <a class="text-slate-400 hover:text-primary transition-colors" href="projects.html">Projects</a>
      <a class="text-slate-400 hover:text-primary transition-colors" href="about.html">About</a>
      <a class="text-slate-400 hover:text-primary transition-colors" href="resume.html">Resume</a>
      <a class="text-slate-400 hover:text-primary transition-colors" href="cover-letter.html">Cover Letter</a>
    </div>
    <div class="flex items-center gap-4">
      <a href="mailto:darkhtk@gmail.com" class="px-6 py-2 rounded-md bg-gradient-to-r from-primary to-primary-container text-on-primary font-headline font-bold text-sm tracking-wide hover:scale-95 active:scale-90 transition-transform">
        Connect
      </a>
    </div>
  </div>
</nav>
```

`new_string`:

```
<nav class="fixed top-0 w-full z-50 bg-[#0c1324]/60 backdrop-blur-xl shadow-[0px_24px_48px_rgba(0,0,0,0.4)]">
  <div class="flex justify-between items-center px-4 sm:px-6 md:px-8 py-4 max-w-7xl mx-auto">
    <a href="index.html" class="flex flex-col">
      <div class="text-xl font-bold tracking-tighter text-primary font-headline">DAEKI HONG</div>
      <div class="font-label text-[10px] text-slate-500 uppercase tracking-[0.2em]">INDUSTRIAL UNITY × AI AGENT</div>
    </a>
    <div class="hidden md:flex items-center gap-8 font-headline tracking-tight text-sm uppercase">
      <a class="text-primary border-b-2 border-primary pb-1" href="index.html">Home</a>
      <a class="text-slate-400 hover:text-primary transition-colors" href="projects.html">Projects</a>
      <a class="text-slate-400 hover:text-primary transition-colors" href="about.html">About</a>
      <a class="text-slate-400 hover:text-primary transition-colors" href="resume.html">Resume</a>
      <a class="text-slate-400 hover:text-primary transition-colors" href="cover-letter.html">Cover Letter</a>
    </div>
    <div class="flex items-center gap-3">
      <a href="mailto:darkhtk@gmail.com" class="px-4 sm:px-6 py-2 rounded-md bg-gradient-to-r from-primary to-primary-container text-on-primary font-headline font-bold text-sm tracking-wide hover:scale-95 active:scale-90 transition-transform">
        <span class="hidden sm:inline">Connect</span>
        <span class="sm:hidden material-symbols-outlined text-lg align-middle">mail</span>
      </a>
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
```

**Verify after edit**: nav inner div now uses `px-4 sm:px-6 md:px-8` (T1b), Connect 버튼이 모바일에서 아이콘만, 햄버거 버튼이 추가됨.

### Step 2.3: Insert mobile menu overlay after nav

- [ ] **Step 2.3: Add mobile overlay div immediately after `</nav>`**

Use Edit tool. `old_string`:

```
</nav>

<!-- Hero Section -->
```

`new_string`:

```
</nav>

<!-- Mobile menu overlay -->
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
    <a href="index.html" class="font-headline text-3xl font-bold text-primary border-l-4 border-primary pl-3">HOME</a>
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

<!-- Hero Section -->
```

**Note**: index.html이므로 HOME 링크에 active 클래스 (`text-primary border-l-4 border-primary pl-3`) 적용됨.

### Step 2.4: Insert mobile menu JS before `</body>`

- [ ] **Step 2.4: Add JS script tag immediately before closing body tag**

Use Edit tool. `old_string`:

```
</footer>

</body>
```

`new_string`:

```
</footer>

<script>
(function() {
  const toggle = document.getElementById('mobile-menu-toggle');
  const close  = document.getElementById('mobile-menu-close');
  const menu   = document.getElementById('mobile-menu');
  if (!toggle || !menu) return;

  function openMenu() {
    menu.classList.remove('hidden');
    menu.classList.add('flex');
    document.body.style.overflow = 'hidden';
    toggle.setAttribute('aria-expanded', 'true');
  }
  function closeMenu() {
    menu.classList.add('hidden');
    menu.classList.remove('flex');
    document.body.style.overflow = '';
    toggle.setAttribute('aria-expanded', 'false');
  }
  toggle.addEventListener('click', openMenu);
  if (close) close.addEventListener('click', closeMenu);
  document.addEventListener('keydown', function(e) { if (e.key === 'Escape') closeMenu(); });
  menu.querySelectorAll('a').forEach(function(a) { a.addEventListener('click', closeMenu); });
})();
</script>

</body>
```

### Step 2.5: Apply Token T1 (container padding) — Hero section

- [ ] **Step 2.5: Hero section container padding**

Use Edit tool. `old_string`:
```
  <div class="max-w-7xl mx-auto px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
```
`new_string`:
```
  <div class="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
```

### Step 2.6: Apply Token T2 (section padding) — 3 Pillars section

- [ ] **Step 2.6: 3 Pillars section py-32 → responsive**

Use Edit tool. `old_string`:
```
<!-- Structural Domains (3 Pillars) -->
<section class="py-32 bg-surface-container-low relative">
  <div class="max-w-7xl mx-auto px-8">
```
`new_string`:
```
<!-- Structural Domains (3 Pillars) -->
<section class="py-16 sm:py-20 md:py-32 bg-surface-container-low relative">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
```

### Step 2.7: Apply Token T2 + T1 — Featured Project section

- [ ] **Step 2.7: Featured Project section padding**

Use Edit tool. `old_string`:
```
<!-- Featured Project: VR 로봇 원격 조종 -->
<section class="py-32 bg-surface">
  <div class="max-w-7xl mx-auto px-8">
```
`new_string`:
```
<!-- Featured Project: VR 로봇 원격 조종 -->
<section class="py-16 sm:py-20 md:py-32 bg-surface">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
```

### Step 2.8: Apply Token T1 — Footer

- [ ] **Step 2.8: Footer container padding**

Use Edit tool. `old_string`:
```
  <div class="flex flex-col md:flex-row justify-between items-center px-8 py-12 max-w-7xl mx-auto">
```
`new_string`:
```
  <div class="flex flex-col md:flex-row justify-between items-center px-4 sm:px-6 md:px-8 py-12 max-w-7xl mx-auto">
```

### Step 2.9: Apply Token T3a — H1 hero font scale

- [ ] **Step 2.9: H1 hero responsive font**

Use Edit tool. `old_string`:
```
      <h1 class="font-headline text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tighter leading-[0.95] text-on-surface">
```
`new_string`:
```
      <h1 class="font-headline text-4xl sm:text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tighter leading-[0.95] text-on-surface">
```

### Step 2.10: Apply Token T3b — H2 (3 Pillars header)

- [ ] **Step 2.10: 3 Pillars H2**

Use Edit tool. `old_string`:
```
        <h2 class="font-headline text-4xl md:text-5xl font-bold tracking-tight mb-6">전문 영역</h2>
```
`new_string`:
```
        <h2 class="font-headline text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-6">전문 영역</h2>
```

### Step 2.11: Apply Token T3b — H2 (Featured Project)

- [ ] **Step 2.11: Featured Project H2**

Use Edit tool. `old_string`:
```
        <h2 class="font-headline text-4xl md:text-5xl font-bold tracking-tight mb-6">VR 로봇 원격 조종 시스템</h2>
```
`new_string`:
```
        <h2 class="font-headline text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-6">VR 로봇 원격 조종 시스템</h2>
```

### Step 2.12: Page-specific — Featured Project stats grid (Token T4)

- [ ] **Step 2.12: 4-cell stats grid responsive**

Use Edit tool. `old_string`:
```
        <div class="grid grid-cols-4 gap-4 mb-10">
```
`new_string`:
```
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
```

### Step 2.13: Page-specific — Featured Project card padding

- [ ] **Step 2.13: Featured card min-height & padding**

Use Edit tool. `old_string`:
```
    <div class="relative rounded-2xl overflow-hidden min-h-[600px] flex items-center p-8 md:p-16">
```
`new_string`:
```
    <div class="relative rounded-2xl overflow-hidden min-h-[480px] sm:min-h-[600px] flex items-center p-6 sm:p-8 md:p-16">
```

Use Edit tool. `old_string`:
```
      <div class="relative z-10 lg:max-w-2xl bg-surface-container-highest/60 backdrop-blur-xl p-8 md:p-12 rounded-xl shadow-[0px_24px_48px_rgba(0,0,0,0.6)]">
```
`new_string`:
```
      <div class="relative z-10 lg:max-w-2xl bg-surface-container-highest/60 backdrop-blur-xl p-6 sm:p-8 md:p-12 rounded-xl shadow-[0px_24px_48px_rgba(0,0,0,0.6)]">
```

### Step 2.14: Page-specific — 3 Pillars card padding

- [ ] **Step 2.14: 3 Pillars cards p-10 → responsive**

Use Edit tool with `replace_all: true`. `old_string`:
```
      <div class="bg-surface-container-highest/40 p-10 rounded-xl hover:bg-surface-container-highest/70 transition-all duration-300">
```
`new_string`:
```
      <div class="bg-surface-container-highest/40 p-6 sm:p-8 md:p-10 rounded-xl hover:bg-surface-container-highest/70 transition-all duration-300">
```

(3개 카드 동시 변환)

### Step 2.15: Page-specific — Hero image moves below text on mobile

- [ ] **Step 2.15: Add mobile-only hero image block**

The current hero has `lg:col-span-4 hidden lg:block` div for the image. Add a NEW block that shows ONLY on mobile/tablet (below lg).

Use Edit tool. `old_string`:
```
      <div class="flex flex-wrap gap-4 pt-4">
        <a href="projects.html" class="group flex items-center gap-2 px-8 py-4 rounded-md bg-gradient-to-br from-primary to-primary-container text-on-primary font-headline font-bold transition-transform active:scale-95">
          프로젝트 보기
          <span class="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </a>
        <a href="resume.html" class="px-8 py-4 rounded-md bg-surface-container-low text-on-surface font-headline font-bold hover:bg-surface-container-highest transition-colors active:scale-95">
          이력서 보기
        </a>
      </div>
    </div>

    <div class="lg:col-span-4 hidden lg:block">
```
`new_string`:
```
      <div class="flex flex-wrap gap-4 pt-4">
        <a href="projects.html" class="group flex items-center gap-2 px-8 py-4 rounded-md bg-gradient-to-br from-primary to-primary-container text-on-primary font-headline font-bold transition-transform active:scale-95">
          프로젝트 보기
          <span class="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </a>
        <a href="resume.html" class="px-8 py-4 rounded-md bg-surface-container-low text-on-surface font-headline font-bold hover:bg-surface-container-highest transition-colors active:scale-95">
          이력서 보기
        </a>
      </div>

      <!-- Mobile-only hero image (lg 미만에서만 노출) -->
      <div class="lg:hidden mt-8">
        <div class="aspect-[4/3] sm:aspect-square relative rounded-xl overflow-hidden shadow-2xl">
          <img loading="lazy" src="assets/images/vr_robot_expo2.png" alt="VR 로봇 원격 조종 — 엑스포 시연" class="w-full h-full object-cover"/>
          <div class="absolute inset-0 bg-gradient-to-t from-surface via-surface/30 to-transparent"></div>
          <div class="absolute bottom-4 left-4 right-4">
            <div class="font-label text-[10px] text-primary-fixed tracking-widest uppercase opacity-90">VR 로봇 원격 조종</div>
            <div class="font-label text-[9px] text-slate-400 tracking-widest uppercase mt-0.5">2025 해양 모빌리티 안전 엑스포 · 부산 벡스코</div>
          </div>
        </div>
      </div>
    </div>

    <div class="lg:col-span-4 hidden lg:block">
```

**Note**: 데스크톱(`lg:`)용 기존 이미지 블록은 그대로 유지. 모바일/태블릿용 새 블록은 텍스트 div 안 마지막에 추가됨.

### Step 2.16: Visual verification

- [ ] **Step 2.16: Open index.html in browser DevTools and verify 4 viewports**

Run:
```bash
cd /c/sourcetree/portfolio && start index.html
```
(또는 사용자가 직접 브라우저에서 파일 열기)

DevTools device toolbar (Ctrl+Shift+M)에서 다음 viewport로 확인:

1. **Galaxy S20 (360px)**:
   - [ ] 가로 스크롤 없음
   - [ ] 햄버거 버튼 우상단에 보임
   - [ ] Connect 버튼이 메일 아이콘으로 표시됨
   - [ ] H1 hero 텍스트가 viewport 안에 들어감
   - [ ] Hero 이미지가 텍스트 아래에 노출
   - [ ] Featured Project 통계 4개가 2×2 grid로 표시
   - [ ] 3 Pillars 카드 패딩이 적당함

2. **iPhone 14 Pro (390px)**: 동일 항목 확인

3. **iPad (768px)**:
   - [ ] 햄버거 버튼 사라지고 데스크톱 nav 등장
   - [ ] Connect 버튼이 텍스트로 다시 보임
   - [ ] Hero 이미지는 여전히 텍스트 아래
   - [ ] 3 Pillars `md:grid-cols-3` 정상

4. **Desktop (1280px)**:
   - [ ] 기존 디자인 100% 동일 (회귀 0)
   - [ ] Hero 이미지가 우측에 표시
   - [ ] Hero 이미지 모바일 블록은 보이지 않음 (`lg:hidden`)

5. **햄버거 5가지 동작 (360px에서)**:
   - [ ] 햄버거 클릭 → overlay 열림
   - [ ] 닫기 X 클릭 → overlay 닫힘
   - [ ] ESC 키 → overlay 닫힘
   - [ ] 메뉴 안 PROJECTS 클릭 → projects.html로 이동
   - [ ] overlay 열려있는 동안 배경 스크롤 잠금 (overlay 위로 스크롤 시도 시 아래 페이지 안 움직임)

### Step 2.17: Commit

- [ ] **Step 2.17: Commit reference implementation**

Run:
```bash
cd /c/sourcetree/portfolio && git add index.html && git commit -m "$(cat <<'EOF'
feat(mobile): index.html reference implementation

- 햄버거 nav 컴포넌트 + JS 추가 (모든 페이지 공통 패턴)
- Container 패딩 토큰 px-4 sm:px-6 md:px-8 적용
- Section 패딩 토큰 py-16 sm:py-20 md:py-32 적용
- H1 hero 폰트 스케일 text-4xl sm:text-5xl md:text-7xl
- Featured Project 통계 grid-cols-2 md:grid-cols-4
- 3 Pillars 카드 패딩 p-6 sm:p-8 md:p-10
- 모바일에서 hero 이미지를 텍스트 아래로 노출

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
EOF
)"
```

Expected: 1 file changed, commit hash 생성됨.

---

## Task 3: User Verification Checkpoint — index.html

**Goal**: 사용자가 reference 구현을 직접 검토. 패턴이 OK이면 나머지 7개 페이지 일괄 적용.

- [ ] **Step 3.1: Pause and request user review**

Stop and ask the user:

> "index.html reference 구현 완료. 브라우저에서 다음 viewport로 확인 부탁드립니다:
> - 360px (Galaxy S20)
> - 390px (iPhone 14 Pro)
> - 768px (iPad)
> - 1280px (Desktop)
>
> 햄버거 메뉴 동작, 가로 스크롤 부재, 폰트 가독성, 데스크톱 회귀 0 확인 후 'OK' 또는 'X (이슈)'로 응답해주세요."

- [ ] **Step 3.2: Wait for user response**

If user reports issues → fix inline → re-verify → re-request approval.
If user approves → proceed to Task 4.

---

## Task 4: projects.html

**Goal**: index.html에서 검증된 패턴을 projects.html에 적용. nav Pattern A.

**Files**:
- Modify: `C:\sourcetree\portfolio\projects.html`

- [ ] **Step 4.1: Read projects.html nav and main sections**

Use Read tool on `C:\sourcetree\portfolio\projects.html` (limit 200).

- [ ] **Step 4.2: Replace nav block (Pattern A)**

Use Edit tool. `old_string`:

```
<nav class="fixed top-0 w-full z-50 bg-[#0c1324]/60 backdrop-blur-xl shadow-[0px_24px_48px_rgba(0,0,0,0.4)]">
  <div class="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto">
    <a href="index.html" class="flex flex-col">
      <div class="text-xl font-bold tracking-tighter text-primary font-headline">DAEKI HONG</div>
      <div class="font-label text-[10px] text-slate-500 uppercase tracking-[0.2em]">INDUSTRIAL UNITY × AI AGENT</div>
    </a>
    <div class="hidden md:flex items-center gap-8 font-headline tracking-tight text-sm uppercase">
      <a class="text-slate-400 hover:text-primary transition-colors" href="index.html">Home</a>
      <a class="text-primary border-b-2 border-primary pb-1" href="projects.html">Projects</a>
      <a class="text-slate-400 hover:text-primary transition-colors" href="about.html">About</a>
      <a class="text-slate-400 hover:text-primary transition-colors" href="resume.html">Resume</a>
      <a class="text-slate-400 hover:text-primary transition-colors" href="cover-letter.html">Cover Letter</a>
    </div>
    <div class="flex items-center gap-4">
      <a href="mailto:darkhtk@gmail.com" class="px-6 py-2 bg-gradient-to-br from-primary to-primary-container text-on-primary font-headline font-medium rounded-md hover:scale-95 active:scale-90 transition-transform text-sm">
        Connect
      </a>
    </div>
  </div>
</nav>
```

`new_string`:

```
<nav class="fixed top-0 w-full z-50 bg-[#0c1324]/60 backdrop-blur-xl shadow-[0px_24px_48px_rgba(0,0,0,0.4)]">
  <div class="flex justify-between items-center px-4 sm:px-6 md:px-8 py-4 max-w-7xl mx-auto">
    <a href="index.html" class="flex flex-col">
      <div class="text-xl font-bold tracking-tighter text-primary font-headline">DAEKI HONG</div>
      <div class="font-label text-[10px] text-slate-500 uppercase tracking-[0.2em]">INDUSTRIAL UNITY × AI AGENT</div>
    </a>
    <div class="hidden md:flex items-center gap-8 font-headline tracking-tight text-sm uppercase">
      <a class="text-slate-400 hover:text-primary transition-colors" href="index.html">Home</a>
      <a class="text-primary border-b-2 border-primary pb-1" href="projects.html">Projects</a>
      <a class="text-slate-400 hover:text-primary transition-colors" href="about.html">About</a>
      <a class="text-slate-400 hover:text-primary transition-colors" href="resume.html">Resume</a>
      <a class="text-slate-400 hover:text-primary transition-colors" href="cover-letter.html">Cover Letter</a>
    </div>
    <div class="flex items-center gap-3">
      <a href="mailto:darkhtk@gmail.com" class="px-4 sm:px-6 py-2 bg-gradient-to-br from-primary to-primary-container text-on-primary font-headline font-medium rounded-md hover:scale-95 active:scale-90 transition-transform text-sm">
        <span class="hidden sm:inline">Connect</span>
        <span class="sm:hidden material-symbols-outlined text-lg align-middle">mail</span>
      </a>
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
```

- [ ] **Step 4.3: Insert mobile overlay (active link = PROJECTS)**

Use Edit tool. `old_string`: `</nav>\n\n<main class="pt-32`

`new_string`: 위 SNIPPET B의 전체 overlay div + 빈 줄 + `<main class="pt-32`. PROJECTS 링크에 active 클래스 적용. 즉, 다음 두 줄:
```
    <a href="projects.html" class="font-headline text-3xl font-bold text-on-surface hover:text-primary transition-colors">PROJECTS</a>
```
을
```
    <a href="projects.html" class="font-headline text-3xl font-bold text-primary border-l-4 border-primary pl-3">PROJECTS</a>
```
으로 교체한 SNIPPET B 사용.

(전체 overlay HTML은 SNIPPET B 참조 — Task 2.3 step 참조해서 동일한 구조 사용. PROJECTS 링크 한 줄만 active 변형.)

- [ ] **Step 4.4: Apply Token T1 — Main container**

Use Edit tool. `old_string`:
```
<main class="pt-32 pb-20 px-8 max-w-7xl mx-auto">
```
`new_string`:
```
<main class="pt-32 pb-20 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
```

- [ ] **Step 4.5: Apply Token T3c — H1 (text-6xl md:text-8xl)**

Use Edit tool. `old_string`:
```
    <h1 class="text-6xl md:text-8xl font-headline font-bold tracking-tighter text-on-surface mb-6">
```
`new_string`:
```
    <h1 class="text-4xl sm:text-6xl md:text-8xl font-headline font-bold tracking-tighter text-on-surface mb-6">
```

- [ ] **Step 4.6: Apply T1 to other containers in the file**

Use Grep tool on `C:\sourcetree\portfolio\projects.html` for pattern `mx-auto px-8`. For each match (excluding the nav inner div which is already done):
- Use Edit tool to replace `mx-auto px-8` with `mx-auto px-4 sm:px-6 md:px-8`

Expected: 1-2 additional matches (footer and possibly other containers). Verify each is a top-level container, not button padding.

- [ ] **Step 4.7: Insert mobile menu JS before `</body>`**

Use Edit tool. `old_string`:
```
</body>
```
`new_string`: SNIPPET C 전체 + `\n</body>`. 즉, Task 2.4 step과 동일한 `<script>...</script>` 블록을 `</body>` 직전에 삽입.

(만약 projects.html에 기존 `<script>` 블록이 이미 있다면(필터 JS) 그 다음에 mobile menu script를 추가. 두 script 블록이 공존 가능.)

- [ ] **Step 4.8: Visual verification (4 viewports)**

Open `projects.html` in browser. Verify:
- [ ] 360px / 390px: 햄버거 동작, 카드 그리드 자연스러움, 가로 스크롤 없음
- [ ] 768px: md:grid-cols-12 정상
- [ ] 1280px: 회귀 0
- [ ] PROJECTS 링크가 mobile overlay에서 active 표시 (왼쪽 파란 border)

- [ ] **Step 4.9: Commit**

Run:
```bash
cd /c/sourcetree/portfolio && git add projects.html && git commit -m "$(cat <<'EOF'
feat(mobile): apply mobile patterns to projects.html

햄버거 nav + 토큰 T1/T3 적용. PROJECTS 링크 active.

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: about.html

**Goal**: about.html에 패턴 적용. nav Pattern A-variant (`space-x-*`).

**Files**:
- Modify: `C:\sourcetree\portfolio\about.html`

- [ ] **Step 5.1: Read about.html nav and main sections**

Use Read tool on `C:\sourcetree\portfolio\about.html` (lines 1-100, 240-283).

- [ ] **Step 5.2: Replace nav block (note `space-x-8` → `gap-8`)**

Use Edit tool. `old_string`:

```
<nav class="fixed top-0 w-full z-50 bg-[#0c1324]/60 backdrop-blur-xl shadow-[0px_24px_48px_rgba(0,0,0,0.4)]">
  <div class="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto">
    <a href="index.html" class="flex flex-col">
      <div class="text-xl font-bold tracking-tighter text-primary font-headline">DAEKI HONG</div>
      <div class="font-label text-[10px] text-slate-500 uppercase tracking-[0.2em]">INDUSTRIAL UNITY × AI AGENT</div>
    </a>
    <div class="hidden md:flex items-center space-x-8 font-headline tracking-tight text-sm uppercase">
      <a class="text-slate-400 hover:text-primary transition-colors" href="index.html">Home</a>
      <a class="text-slate-400 hover:text-primary transition-colors" href="projects.html">Projects</a>
      <a class="text-primary border-b-2 border-primary pb-1" href="about.html">About</a>
      <a class="text-slate-400 hover:text-primary transition-colors" href="resume.html">Resume</a>
      <a class="text-slate-400 hover:text-primary transition-colors" href="cover-letter.html">Cover Letter</a>
    </div>
    <div class="flex items-center space-x-6">
      <a href="mailto:darkhtk@gmail.com" class="px-5 py-2 rounded-md hero-gradient text-on-primary font-medium transition-transform hover:scale-95 active:scale-90 font-headline text-sm">Connect</a>
    </div>
  </div>
</nav>
```

`new_string`:

```
<nav class="fixed top-0 w-full z-50 bg-[#0c1324]/60 backdrop-blur-xl shadow-[0px_24px_48px_rgba(0,0,0,0.4)]">
  <div class="flex justify-between items-center px-4 sm:px-6 md:px-8 py-4 max-w-7xl mx-auto">
    <a href="index.html" class="flex flex-col">
      <div class="text-xl font-bold tracking-tighter text-primary font-headline">DAEKI HONG</div>
      <div class="font-label text-[10px] text-slate-500 uppercase tracking-[0.2em]">INDUSTRIAL UNITY × AI AGENT</div>
    </a>
    <div class="hidden md:flex items-center gap-8 font-headline tracking-tight text-sm uppercase">
      <a class="text-slate-400 hover:text-primary transition-colors" href="index.html">Home</a>
      <a class="text-slate-400 hover:text-primary transition-colors" href="projects.html">Projects</a>
      <a class="text-primary border-b-2 border-primary pb-1" href="about.html">About</a>
      <a class="text-slate-400 hover:text-primary transition-colors" href="resume.html">Resume</a>
      <a class="text-slate-400 hover:text-primary transition-colors" href="cover-letter.html">Cover Letter</a>
    </div>
    <div class="flex items-center gap-3">
      <a href="mailto:darkhtk@gmail.com" class="px-4 sm:px-5 py-2 rounded-md hero-gradient text-on-primary font-medium transition-transform hover:scale-95 active:scale-90 font-headline text-sm">
        <span class="hidden sm:inline">Connect</span>
        <span class="sm:hidden material-symbols-outlined text-lg align-middle">mail</span>
      </a>
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
```

**Note**: about.html은 `hero-gradient` 커스텀 CSS 클래스 사용 → Connect 버튼은 그 클래스 유지. `space-x-8`/`space-x-6` → `gap-8`/`gap-3`로 변경 (Tailwind 신 표준).

- [ ] **Step 5.3: Insert mobile overlay (active = ABOUT)**

SNIPPET B 삽입. ABOUT 링크에 active 클래스. Use Edit tool. `old_string`:
```
</nav>

<main class="pt-32 pb-20 max-w-7xl mx-auto px-8">
```
`new_string`: SNIPPET B (with ABOUT active) + `\n\n<main class="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 md:px-8">` (T1 동시 적용).

ABOUT 링크 active 줄:
```
    <a href="about.html" class="font-headline text-3xl font-bold text-primary border-l-4 border-primary pl-3">ABOUT</a>
```

- [ ] **Step 5.4: Apply T1 — remaining `mx-auto px-8` containers**

Use Grep on about.html for `mx-auto px-8`. For each remaining match (Step 5.3에서 main 컨테이너는 이미 처리됨), use Edit to apply T1.

- [ ] **Step 5.5: Apply T2 — section py-32 (about에서 사용 여부 확인)**

Use Grep on about.html for `py-32`. If any match: replace `py-32` with `py-16 sm:py-20 md:py-32`. (about.html은 py-32 사용 안 함 가능성 — 그러면 skip)

- [ ] **Step 5.6: Apply T3a — Hero H1**

Use Edit tool. `old_string`:
```
      <h1 class="font-headline text-5xl md:text-7xl font-bold tracking-tighter leading-none mb-8 text-on-background">
```
`new_string`:
```
      <h1 class="font-headline text-4xl sm:text-5xl md:text-7xl font-bold tracking-tighter leading-none mb-8 text-on-background">
```

- [ ] **Step 5.7: Insert mobile menu JS before `</body>`**

Use Edit tool to insert SNIPPET C immediately before `</body>` (Task 2.4 step과 동일 패턴).

- [ ] **Step 5.8: Visual verification (4 viewports)**

Open `about.html` in browser. Same checklist as Task 2.16/4.8.

- [ ] **Step 5.9: Commit**

```bash
cd /c/sourcetree/portfolio && git add about.html && git commit -m "feat(mobile): apply mobile patterns to about.html

햄버거 nav + 토큰 T1/T3 적용. ABOUT 링크 active.
space-x-* → gap-* 정규화.

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Task 6: cover-letter.html

**Goal**: cover-letter.html에 패턴 적용. nav Pattern A.

**Files**:
- Modify: `C:\sourcetree\portfolio\cover-letter.html`

- [ ] **Step 6.1: Read cover-letter.html**

Use Read tool on `C:\sourcetree\portfolio\cover-letter.html`.

- [ ] **Step 6.2: Replace nav block**

Use Edit tool. `old_string`:

```
<nav class="fixed top-0 w-full z-50 bg-[#0c1324]/60 backdrop-blur-xl shadow-[0px_24px_48px_rgba(0,0,0,0.4)]">
  <div class="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto">
    <a href="index.html" class="flex flex-col">
      <div class="text-xl font-bold tracking-tighter text-primary font-headline">DAEKI HONG</div>
      <div class="font-label text-[10px] text-slate-500 uppercase tracking-[0.2em]">INDUSTRIAL UNITY × AI AGENT</div>
    </a>
    <div class="hidden md:flex items-center gap-8 font-headline tracking-tight text-sm uppercase">
      <a class="text-slate-400 hover:text-primary transition-colors" href="index.html">Home</a>
      <a class="text-slate-400 hover:text-primary transition-colors" href="projects.html">Projects</a>
      <a class="text-slate-400 hover:text-primary transition-colors" href="about.html">About</a>
      <a class="text-slate-400 hover:text-primary transition-colors" href="resume.html">Resume</a>
      <a class="text-primary border-b-2 border-primary pb-1" href="cover-letter.html">Cover Letter</a>
    </div>
    <div class="flex items-center gap-4">
      <a href="mailto:darkhtk@gmail.com" class="px-6 py-2 rounded-md bg-gradient-to-r from-primary to-primary-container text-on-primary font-headline font-bold text-sm tracking-wide hover:scale-95 active:scale-90 transition-transform">
        Connect
      </a>
    </div>
  </div>
</nav>
```

`new_string`:

```
<nav class="fixed top-0 w-full z-50 bg-[#0c1324]/60 backdrop-blur-xl shadow-[0px_24px_48px_rgba(0,0,0,0.4)]">
  <div class="flex justify-between items-center px-4 sm:px-6 md:px-8 py-4 max-w-7xl mx-auto">
    <a href="index.html" class="flex flex-col">
      <div class="text-xl font-bold tracking-tighter text-primary font-headline">DAEKI HONG</div>
      <div class="font-label text-[10px] text-slate-500 uppercase tracking-[0.2em]">INDUSTRIAL UNITY × AI AGENT</div>
    </a>
    <div class="hidden md:flex items-center gap-8 font-headline tracking-tight text-sm uppercase">
      <a class="text-slate-400 hover:text-primary transition-colors" href="index.html">Home</a>
      <a class="text-slate-400 hover:text-primary transition-colors" href="projects.html">Projects</a>
      <a class="text-slate-400 hover:text-primary transition-colors" href="about.html">About</a>
      <a class="text-slate-400 hover:text-primary transition-colors" href="resume.html">Resume</a>
      <a class="text-primary border-b-2 border-primary pb-1" href="cover-letter.html">Cover Letter</a>
    </div>
    <div class="flex items-center gap-3">
      <a href="mailto:darkhtk@gmail.com" class="px-4 sm:px-6 py-2 rounded-md bg-gradient-to-r from-primary to-primary-container text-on-primary font-headline font-bold text-sm tracking-wide hover:scale-95 active:scale-90 transition-transform">
        <span class="hidden sm:inline">Connect</span>
        <span class="sm:hidden material-symbols-outlined text-lg align-middle">mail</span>
      </a>
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
```

- [ ] **Step 6.3: Insert mobile overlay (active = COVER LETTER)**

Use Edit tool. `old_string`: `</nav>\n\n<main class="pt-32 pb-20 px-8 max-w-5xl mx-auto">`

`new_string`: SNIPPET B (with COVER LETTER active) + `\n\n<main class="pt-32 pb-20 px-4 sm:px-6 md:px-8 max-w-5xl mx-auto">` (T1 동시 적용).

COVER LETTER active 줄:
```
    <a href="cover-letter.html" class="font-headline text-3xl font-bold text-primary border-l-4 border-primary pl-3">COVER LETTER</a>
```

- [ ] **Step 6.4: Apply T3a — Hero H1**

Use Edit tool. `old_string`:
```
    <h1 class="text-5xl md:text-7xl font-headline font-bold tracking-tighter text-on-surface mb-6 leading-tight">
```
`new_string`:
```
    <h1 class="text-4xl sm:text-5xl md:text-7xl font-headline font-bold tracking-tighter text-on-surface mb-6 leading-tight">
```

- [ ] **Step 6.5: Apply T3b — Section h2 headers**

cover-letter.html에는 여러 `text-3xl md:text-4xl` 형태의 h2가 있음. Use Grep to find them.

For each `text-3xl md:text-4xl` heading: 그대로 두거나 (이미 sm 단계가 자연스러우면 skip), 또는 한 단계 낮춤 `text-2xl sm:text-3xl md:text-4xl`로 변경.

**판단 기준**: 360px에서 `text-3xl` (30px)가 한 줄에 들어가면 skip. 깨지면 변경.

- [ ] **Step 6.6: Apply T1 — remaining containers**

Use Grep for `mx-auto px-8` in cover-letter.html. Apply T1 to each remaining match.

- [ ] **Step 6.7: Insert mobile menu JS before `</body>`**

SNIPPET C insertion.

- [ ] **Step 6.8: Visual verification**

4 viewports + 햄버거 5가지 동작.

- [ ] **Step 6.9: Commit**

```bash
cd /c/sourcetree/portfolio && git add cover-letter.html && git commit -m "feat(mobile): apply mobile patterns to cover-letter.html

햄버거 nav + 토큰 T1/T3 적용. COVER LETTER 링크 active.

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Task 7: case-study-vr-robot.html

**Goal**: case-study-vr-robot.html에 패턴 적용. nav Pattern B (Connect 안에). 추가: line 255 grid-cols-3 → 반응형.

**Files**:
- Modify: `C:\sourcetree\portfolio\case-study-vr-robot.html`

- [ ] **Step 7.1: Read file**

Use Read tool on `C:\sourcetree\portfolio\case-study-vr-robot.html`.

- [ ] **Step 7.2: Replace nav block (Pattern B — Connect 안에)**

Use Edit tool. `old_string`:

```
<nav class="fixed top-0 w-full z-50 bg-[#0c1324]/60 backdrop-blur-xl shadow-[0px_24px_48px_rgba(0,0,0,0.4)]">
  <div class="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto">
    <a href="index.html" class="flex flex-col">
      <div class="text-xl font-bold tracking-tighter text-primary font-headline">DAEKI HONG</div>
      <div class="font-label text-[10px] text-slate-500 uppercase tracking-[0.2em]">INDUSTRIAL UNITY × AI AGENT</div>
    </a>
    <div class="hidden md:flex items-center space-x-8 font-headline tracking-tight text-sm uppercase">
      <a class="text-slate-400 hover:text-primary transition-colors" href="index.html">Home</a>
      <a class="text-primary border-b-2 border-primary pb-1" href="projects.html">Projects</a>
      <a class="text-slate-400 hover:text-primary transition-colors" href="about.html">About</a>
      <a class="text-slate-400 hover:text-primary transition-colors" href="resume.html">Resume</a>
      <a class="text-slate-400 hover:text-primary transition-colors" href="cover-letter.html">Cover Letter</a>
      <a href="mailto:darkhtk@gmail.com" class="bg-gradient-to-br from-primary to-primary-container text-on-primary px-6 py-2 rounded-md font-bold hover:scale-95 active:scale-90 transition-transform">Connect</a>
    </div>
  </div>
</nav>
```

`new_string`:

```
<nav class="fixed top-0 w-full z-50 bg-[#0c1324]/60 backdrop-blur-xl shadow-[0px_24px_48px_rgba(0,0,0,0.4)]">
  <div class="flex justify-between items-center px-4 sm:px-6 md:px-8 py-4 max-w-7xl mx-auto">
    <a href="index.html" class="flex flex-col">
      <div class="text-xl font-bold tracking-tighter text-primary font-headline">DAEKI HONG</div>
      <div class="font-label text-[10px] text-slate-500 uppercase tracking-[0.2em]">INDUSTRIAL UNITY × AI AGENT</div>
    </a>
    <div class="hidden md:flex items-center gap-8 font-headline tracking-tight text-sm uppercase">
      <a class="text-slate-400 hover:text-primary transition-colors" href="index.html">Home</a>
      <a class="text-primary border-b-2 border-primary pb-1" href="projects.html">Projects</a>
      <a class="text-slate-400 hover:text-primary transition-colors" href="about.html">About</a>
      <a class="text-slate-400 hover:text-primary transition-colors" href="resume.html">Resume</a>
      <a class="text-slate-400 hover:text-primary transition-colors" href="cover-letter.html">Cover Letter</a>
      <a href="mailto:darkhtk@gmail.com" class="bg-gradient-to-br from-primary to-primary-container text-on-primary px-6 py-2 rounded-md font-bold hover:scale-95 active:scale-90 transition-transform">Connect</a>
    </div>
    <div class="md:hidden flex items-center gap-3">
      <a href="mailto:darkhtk@gmail.com" class="bg-gradient-to-br from-primary to-primary-container text-on-primary p-2 rounded-md hover:scale-95 active:scale-90 transition-transform" aria-label="Connect">
        <span class="material-symbols-outlined text-lg align-middle">mail</span>
      </a>
      <button id="mobile-menu-toggle"
              class="p-2 text-on-surface hover:text-primary transition-colors"
              aria-label="메뉴 열기"
              aria-expanded="false"
              aria-controls="mobile-menu">
        <span class="material-symbols-outlined">menu</span>
      </button>
    </div>
  </div>
</nav>
```

**Pattern B specific**: Connect 버튼이 desktop nav 안에 있으므로, 모바일 전용 햄버거 + Connect 아이콘을 별도 `<div class="md:hidden flex">`로 추가.

- [ ] **Step 7.3: Insert mobile overlay (no active link — case study 페이지는 Projects의 하위라 PROJECTS active)**

Use Edit tool. SNIPPET B 삽입 with PROJECTS active.

`old_string`:
```
</nav>

<main class="pt-24">
```
`new_string`: SNIPPET B (PROJECTS active) + `\n\n<main class="pt-24">`.

- [ ] **Step 7.4: Apply T1 — Hero section container**

Use Edit tool. `old_string`:
```
  <section class="max-w-7xl mx-auto px-8 mb-24 lg:mb-32">
```
`new_string`:
```
  <section class="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mb-24 lg:mb-32">
```

- [ ] **Step 7.5: Apply T1 — All other `mx-auto px-8` containers**

Use Grep on `case-study-vr-robot.html` for `mx-auto px-8`. For each remaining match (~8개 예상), use Edit to replace.

- [ ] **Step 7.6: Apply T2 — All `py-32` sections**

Use Grep on `case-study-vr-robot.html` for `py-32`. For each match: replace `py-32` with `py-16 sm:py-20 md:py-32`.

- [ ] **Step 7.7: Apply T3d — Hero H1 (text-5xl lg:text-7xl)**

Use Edit tool. `old_string`:
```
        <h1 class="text-5xl lg:text-7xl font-headline font-bold text-on-surface tracking-tighter leading-none mb-8">
```
`new_string`:
```
        <h1 class="text-4xl sm:text-5xl lg:text-7xl font-headline font-bold text-on-surface tracking-tighter leading-none mb-8">
```

- [ ] **Step 7.8: Page-specific — Fix grid-cols-3 (line ~255)**

Use Edit tool. `old_string`:
```
        <div class="mt-6 grid grid-cols-3 gap-2">
```
`new_string`:
```
        <div class="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-2">
```

- [ ] **Step 7.9: Insert mobile menu JS before `</body>`**

SNIPPET C insertion.

- [ ] **Step 7.10: Visual verification**

4 viewports + 햄버거 + grid 2칸/3칸 분기 확인.

- [ ] **Step 7.11: Commit**

```bash
cd /c/sourcetree/portfolio && git add case-study-vr-robot.html && git commit -m "feat(mobile): apply mobile patterns to case-study-vr-robot.html

햄버거 nav + 토큰 T1/T2/T3 적용. PROJECTS active.
grid-cols-3 → grid-cols-2 sm:grid-cols-3.

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Task 8: case-study-dxcenter.html

**Goal**: case-study-dxcenter.html에 패턴 적용. nav Pattern B.

**Files**:
- Modify: `C:\sourcetree\portfolio\case-study-dxcenter.html`

- [ ] **Step 8.1: Read file**

Use Read tool on `C:\sourcetree\portfolio\case-study-dxcenter.html`.

- [ ] **Step 8.2: Replace nav block (Pattern B — same as Task 7.2)**

Use Edit tool with the same `old_string`/`new_string` pattern as Task 7.2 (nav Pattern B). 이 파일도 동일한 nav 구조이므로 Task 7.2와 정확히 같은 strings 사용.

**Verify**: case-study-dxcenter.html nav도 line 53-69에 동일한 Pattern B 구조 사용 (Step 8.1에서 확인).

- [ ] **Step 8.3: Insert mobile overlay (PROJECTS active)**

Use Edit tool. `old_string`:
```
</nav>

<main class="pt-24">
```
`new_string`: SNIPPET B (PROJECTS active) + `\n\n<main class="pt-24">`.

- [ ] **Step 8.4: Apply T1 — All `mx-auto px-8` containers**

Use Grep for `mx-auto px-8` in `case-study-dxcenter.html`. For each match (~8개 예상), use Edit to replace.

- [ ] **Step 8.5: Apply T2 — All `py-32` sections**

Use Grep for `py-32`. For each match: replace `py-32` with `py-16 sm:py-20 md:py-32`.

- [ ] **Step 8.6: Apply T3d — Hero H1**

Use Edit tool. `old_string`:
```
        <h1 class="text-5xl lg:text-7xl font-headline font-bold text-on-surface tracking-tighter leading-none mb-8">
```
`new_string`:
```
        <h1 class="text-4xl sm:text-5xl lg:text-7xl font-headline font-bold text-on-surface tracking-tighter leading-none mb-8">
```

- [ ] **Step 8.7: Insert mobile menu JS before `</body>`**

SNIPPET C insertion.

- [ ] **Step 8.8: Visual verification**

4 viewports + 햄버거.

- [ ] **Step 8.9: Commit**

```bash
cd /c/sourcetree/portfolio && git add case-study-dxcenter.html && git commit -m "feat(mobile): apply mobile patterns to case-study-dxcenter.html

햄버거 nav + 토큰 T1/T2/T3 적용. PROJECTS active.

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Task 9: case-study-orchestration-ts.html

**Goal**: case-study-orchestration-ts.html에 패턴 적용. nav Pattern B + 코드 블록 모바일 미디어쿼리.

**Files**:
- Modify: `C:\sourcetree\portfolio\case-study-orchestration-ts.html`

- [ ] **Step 9.1: Read file (head + nav portions)**

Use Read tool on `C:\sourcetree\portfolio\case-study-orchestration-ts.html` (limit 200).

- [ ] **Step 9.2: Replace nav block (Pattern B)**

동일한 Pattern B 교체. Task 7.2와 같은 `old_string`/`new_string` 사용.

- [ ] **Step 9.3: Insert mobile overlay (PROJECTS active)**

Use Edit tool. `old_string`:
```
</nav>

<main class="pt-24">
```
`new_string`: SNIPPET B (PROJECTS active) + `\n\n<main class="pt-24">`.

- [ ] **Step 9.4: Add code block media query to existing `<style>` block**

Use Edit tool. `old_string`:
```
  .text-glow { text-shadow: 0 0 32px rgba(183, 196, 255, 0.4); }
</style>
```
`new_string`:
```
  .text-glow { text-shadow: 0 0 32px rgba(183, 196, 255, 0.4); }
  @media (max-width: 640px) {
    .code-block { padding: 12px; font-size: 11px; line-height: 1.5; }
  }
</style>
```

**Note**: 기존 `.code-block`은 `padding: 20px; font-size: 12px`. 모바일에서는 패딩과 폰트를 한 단계 줄여 가로 스크롤 부담을 줄임. `overflow-x: auto`는 그대로 유지되어 긴 코드는 가로 스크롤로 노출됨.

- [ ] **Step 9.5: Apply T1 — All `mx-auto px-8` containers**

Use Grep for `mx-auto px-8` in this file. For each match (~10개 예상), use Edit.

- [ ] **Step 9.6: Apply T2 — All `py-32` sections**

Use Grep for `py-32`. For each match: replace `py-32` with `py-16 sm:py-20 md:py-32`.

- [ ] **Step 9.7: Apply T3d — Hero H1**

Use Grep for `text-5xl lg:text-7xl`. For each match (likely 1): replace with `text-4xl sm:text-5xl lg:text-7xl`.

- [ ] **Step 9.8: Insert mobile menu JS before `</body>`**

SNIPPET C insertion. **만약** 이 파일에 기존 `<script>` 블록(탭 스위칭 JS 등)이 있다면 그 다음에 추가.

- [ ] **Step 9.9: Visual verification**

4 viewports + 햄버거 + 코드 블록 모바일 가로 스크롤 확인. 360px에서 코드 블록이 viewport를 벗어나지 않고 자체 가로 스크롤로 처리되는지 확인.

- [ ] **Step 9.10: Commit**

```bash
cd /c/sourcetree/portfolio && git add case-study-orchestration-ts.html && git commit -m "feat(mobile): apply mobile patterns to case-study-orchestration-ts.html

햄버거 nav + 토큰 T1/T2/T3 + 코드 블록 모바일 미디어쿼리.
PROJECTS active.

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Task 10: resume.html (Special — Sidebar Layout)

**Goal**: resume.html은 `<aside>` 사이드바(`hidden lg:flex`) + `<header>` TopAppBar(`hidden md:flex`) 구조. 기존 구조 유지 + 햄버거를 TopAppBar에 추가.

**Files**:
- Modify: `C:\sourcetree\portfolio\resume.html`

- [ ] **Step 10.1: Read file**

Use Read tool on `C:\sourcetree\portfolio\resume.html` (limit 200).

- [ ] **Step 10.2: Add hamburger button to TopAppBar (md 미만)**

Resume.html의 TopAppBar는 line 100-124. 햄버거 버튼을 right side div에 추가.

Use Edit tool. `old_string`:
```
        <div class="flex gap-4">
          <a href="https://github.com/darkhtk" class="p-2 text-slate-400 hover:text-primary hover:bg-surface-container-highest/50 rounded-md transition-all" target="_blank" rel="noopener noreferrer">
            <span class="material-symbols-outlined">code</span>
          </a>
          <a href="mailto:darkhtk@gmail.com" class="bg-gradient-to-br from-primary to-primary-container text-on-primary px-4 py-2 font-headline font-bold rounded-md text-xs active:scale-95 transition-transform">
            Contact
          </a>
        </div>
```
`new_string`:
```
        <div class="flex gap-3 items-center">
          <a href="https://github.com/darkhtk" class="hidden sm:inline-block p-2 text-slate-400 hover:text-primary hover:bg-surface-container-highest/50 rounded-md transition-all" target="_blank" rel="noopener noreferrer">
            <span class="material-symbols-outlined">code</span>
          </a>
          <a href="mailto:darkhtk@gmail.com" class="bg-gradient-to-br from-primary to-primary-container text-on-primary px-3 sm:px-4 py-2 font-headline font-bold rounded-md text-xs active:scale-95 transition-transform">
            <span class="hidden sm:inline">Contact</span>
            <span class="sm:hidden material-symbols-outlined text-base align-middle">mail</span>
          </a>
          <button id="mobile-menu-toggle"
                  class="md:hidden p-2 text-on-surface hover:text-primary transition-colors"
                  aria-label="메뉴 열기"
                  aria-expanded="false"
                  aria-controls="mobile-menu">
            <span class="material-symbols-outlined">menu</span>
          </button>
        </div>
```

**Note**: GitHub 코드 아이콘은 모바일에서 숨김 (sm 미만). Contact 버튼은 모바일에서 메일 아이콘만.

- [ ] **Step 10.3: Fix indentation issue at line 112 (Cover Letter link)**

Use Read tool to confirm the indentation. Then use Edit tool to fix:

`old_string`:
```
          <a class="text-primary border-b-2 border-primary pb-1" href="resume.html">Resume</a>
      <a class="text-slate-400 hover:text-primary transition-colors" href="cover-letter.html">Cover Letter</a>
        </div>
```
`new_string`:
```
          <a class="text-primary border-b-2 border-primary pb-1" href="resume.html">Resume</a>
          <a class="text-slate-400 hover:text-primary transition-colors" href="cover-letter.html">Cover Letter</a>
        </div>
```

- [ ] **Step 10.4: Insert mobile overlay after `</header>`**

Resume의 header 섹션은 sticky TopAppBar. 그 닫는 `</header>` 태그 직후에 SNIPPET B 삽입. 단, RESUME 링크에 active 클래스.

Use Read tool to find the exact `</header>` location (likely around line 124). Then Use Edit tool to insert SNIPPET B (with RESUME active) immediately after `</header>`.

Active 줄:
```
    <a href="resume.html" class="font-headline text-3xl font-bold text-primary border-l-4 border-primary pl-3">RESUME</a>
```

- [ ] **Step 10.5: Apply T1 — All `mx-auto px-8` containers**

Use Grep for `mx-auto px-8` in resume.html. For each match, replace.

Also, the inline TopAppBar uses `px-8 py-4` but it's NOT a max-width container — it's `class="flex justify-between items-center px-8 py-4 w-full"`. **Replace** this px-8 too (TopAppBar should use mobile padding):

Use Edit tool. `old_string`:
```
    <div class="flex justify-between items-center px-8 py-4 w-full">
```
`new_string`:
```
    <div class="flex justify-between items-center px-4 sm:px-6 md:px-8 py-4 w-full">
```

Also, the content shell `<div class="pt-24 px-8 pb-12 max-w-7xl mx-auto">`:
Use Edit tool. `old_string`:
```
  <div class="pt-24 px-8 pb-12 max-w-7xl mx-auto">
```
`new_string`:
```
  <div class="pt-24 px-4 sm:px-6 md:px-8 pb-12 max-w-7xl mx-auto">
```

- [ ] **Step 10.6: Apply T3c — Resume H2 (text-6xl md:text-8xl)**

Use Edit tool. `old_string`:
```
        <h2 class="text-6xl md:text-8xl font-headline font-bold tracking-tighter text-on-surface leading-tight">
```
`new_string`:
```
        <h2 class="text-4xl sm:text-6xl md:text-8xl font-headline font-bold tracking-tighter text-on-surface leading-tight">
```

- [ ] **Step 10.7: Apply timeline indent reduction**

Use Grep for `pl-12` in resume.html (경력 타임라인). For each match, decide:
- If it's a timeline content indent → replace with `pl-6 sm:pl-8 md:pl-12`
- Otherwise → leave as-is

Document each change inline:

```
For each pl-12 match in timeline context:
  Old: pl-12
  New: pl-6 sm:pl-8 md:pl-12
```

- [ ] **Step 10.8: Insert mobile menu JS before `</body>`**

SNIPPET C insertion at end of file (before `</body>`).

- [ ] **Step 10.9: Visual verification (4 viewports — extra carefully)**

Resume는 사이드바가 lg에서만 등장하므로:
- [ ] 360px / 390px: 사이드바 없음, TopAppBar에 햄버거 보임, 햄버거 동작
- [ ] 768px (md): 사이드바 여전히 없음 (lg+에서만), 햄버거는 md 미만에서만 → md(768)에서 햄버거 사라지고 데스크톱 nav 등장 OK
- [ ] 1280px (lg+): 사이드바 등장, TopAppBar 정상, 햄버거 사라짐 (md:hidden)
- [ ] 회귀 0

- [ ] **Step 10.10: Commit**

```bash
cd /c/sourcetree/portfolio && git add resume.html && git commit -m "feat(mobile): apply mobile patterns to resume.html (sidebar layout)

햄버거 nav + 토큰 T1/T3 적용. RESUME active.
TopAppBar에 햄버거 추가, Contact 버튼 모바일 아이콘화.
사이드바 lg+ 유지, 모바일 overlay 신규 추가.
타임라인 indent 모바일 축소 (pl-12 → pl-6 sm:pl-8 md:pl-12).

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Task 11: Final Cross-Page Verification

**Goal**: 8개 페이지 모두 일관성 검증. nav 동작과 페이지 간 이동 확인.

- [ ] **Step 11.1: Open each page in 360px viewport and verify nav ↔ nav navigation**

Open each page in browser DevTools at 360px:

1. `index.html` → 햄버거 클릭 → PROJECTS 클릭 → projects.html 로드
2. `projects.html` → 햄버거 → ABOUT → about.html
3. `about.html` → 햄버거 → RESUME → resume.html
4. `resume.html` → 햄버거 → COVER LETTER → cover-letter.html
5. `cover-letter.html` → 햄버거 → HOME → index.html

각 단계에서:
- [ ] 페이지 이동 정상
- [ ] active 링크 표시 정확
- [ ] 가로 스크롤 없음
- [ ] 햄버거 아이콘 표시

- [ ] **Step 11.2: Open 3 case study pages individually**

`case-study-vr-robot.html`, `case-study-dxcenter.html`, `case-study-orchestration-ts.html` 각각:
- [ ] 햄버거 동작
- [ ] PROJECTS 링크가 active
- [ ] 가로 스크롤 없음
- [ ] case-study-orchestration-ts: 코드 블록이 viewport를 넘지 않고 자체 스크롤

- [ ] **Step 11.3: Open all 8 pages at 1280px and verify zero regression**

각 페이지 데스크톱에서 기존 디자인과 동일한지 확인. **회귀 0** 목표.

- [ ] **Step 11.4: Pause and request user verification**

Stop and ask user:

> "8개 페이지 모두 모바일 패턴 적용 완료. 브라우저에서 4 viewport (360/390/768/1280) × 8 페이지 = 32회 시각 확인 부탁드립니다.
> 특히 다음을 확인:
> - 모든 페이지에서 햄버거 메뉴 동작
> - 페이지 간 이동 정상
> - active 링크 정확
> - 데스크톱 회귀 0
>
> 이슈 있으면 페이지/viewport/현상 알려주세요. 없으면 'OK'."

Wait for user response. If issues → fix inline → re-verify. If OK → proceed to Task 12.

---

## Task 12: README — Cover Letter Content

**Goal**: 후속 작업. cover-letter.html 내용을 README.md에 반영.

**Files**:
- Modify: `C:\sourcetree\portfolio\README.md`
- Read (reference): `C:\sourcetree\portfolio\cover-letter.html`

- [ ] **Step 12.1: Read full cover-letter.html to extract content**

Use Read tool on `C:\sourcetree\portfolio\cover-letter.html`. Identify the section structure:
- "윤활유 같은 개발자" (intro)
- "도구로 협업 비용을 줄이다"
- 추가 섹션들 (Read로 line 120+ 확인)

- [ ] **Step 12.2: Read current README.md**

Use Read tool on `C:\sourcetree\portfolio\README.md`.

Current content (29 lines):
```
# 홍대기 — Industrial Unity × AI Agent
산업 Unity 시니어 개발자 홍대기의 포트폴리오 사이트.
- Live: https://darkhtk.github.io/portfolio/
- About: ...
- Awards: ...
## Pages
...
## Stack
...
## Contact
...
```

- [ ] **Step 12.3: Decide README structure**

새 README는 cover-letter 본문을 포함하면서 기존 메타정보(Live URL, Pages, Stack, Contact)도 유지해야 함.

**구조 결정**:
```
# 홍대기 — Industrial Unity × AI Agent

[기존 헤더 유지 — Live URL, About, Awards 한 줄 요약]

## 자기소개

[cover-letter.html 본문 섹션들을 마크다운으로 변환]
- 윤활유 같은 개발자
- 도구로 협업 비용을 줄이다
- (그 외 섹션들)

## Pages
[기존 그대로]

## Stack
[기존 그대로]

## Contact
[기존 그대로]
```

- [ ] **Step 12.4: Write new README.md**

Use Write tool to overwrite `C:\sourcetree\portfolio\README.md` with the new content. 본문은 cover-letter.html에서 추출한 한국어 텍스트를 마크다운 단락으로 변환:
- `<p>` → 빈 줄로 구분된 단락
- `<strong>` → `**텍스트**`
- `<h2>` → `## 텍스트`

기존 Pages/Stack/Contact 섹션은 한 줄도 변경하지 말 것.

**중요**: cover-letter.html의 ALL 섹션을 빠짐없이 옮겨야 함. Step 12.1에서 추출한 내용을 모두 사용.

- [ ] **Step 12.5: Verify README renders correctly**

Run:
```bash
cd /c/sourcetree/portfolio && cat README.md | head -50
```

Expected: 마크다운 구조 정상, 깨진 한글 없음, `**` `##` 정상.

- [ ] **Step 12.6: Commit**

```bash
cd /c/sourcetree/portfolio && git add README.md && git commit -m "docs: add cover-letter content to README

cover-letter.html의 전체 자기소개 본문을 README.md에 마크다운으로
반영. 기존 Pages/Stack/Contact 섹션은 그대로 유지.

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Task 13: Final State Verification

**Goal**: 전체 작업 완료 검증.

- [ ] **Step 13.1: Verify git log**

Run:
```bash
cd /c/sourcetree/portfolio && git log --oneline -15
```

Expected: 12개의 새 commit (1 reference + 7 pages + 1 final cross-page fix가 필요했다면 + 1 README + 2 spec docs).

- [ ] **Step 13.2: Verify no uncommitted changes**

Run:
```bash
cd /c/sourcetree/portfolio && git status
```

Expected: `nothing to commit, working tree clean`.

- [ ] **Step 13.3: Final 8-page DevTools sweep**

마지막으로 8개 페이지 × 4 viewport = 32회 시각 확인. 사용자에게 ready-to-push 상태 보고.

- [ ] **Step 13.4: Ask user about push**

Ask user:
> "전체 모바일 재설계 + README 업데이트 완료. 8개 페이지 모두 모바일 동작, 회귀 0. git log에 12개 commit. push 하시겠습니까?"

If yes → `git push origin main`. If no → 작업 종료.

---

## Self-Review Checklist (Plan-time, not Execution-time)

이 plan을 spec과 비교했을 때:

| Spec 요구사항 | 이 plan에서 구현되는 task |
|---|---|
| Goal: 8 페이지 모바일 정상 동작 | Task 2-10 |
| 모바일 햄버거 nav 컴포넌트 | Task 2.2-2.4, SNIPPET A/B/C |
| Token 1: Container 패딩 | Task 2.5/2.7/2.8, 4.4, 5.4, 6.6, 7.4-7.5, 8.4, 9.5, 10.5 |
| Token 2: Section 패딩 | Task 2.6/2.7, 5.5, 7.6, 8.5, 9.6 |
| Token 3: 폰트 스케일 | Task 2.9-2.11, 4.5, 5.6, 6.4, 6.5, 7.7, 8.6, 9.7, 10.6 |
| Token 4: 그리드 셀 | Task 2.12, 7.8 |
| Token 5: Flex 방향 (가이드라인) | 작업 중 새 컨테이너 추가 시 적용 — task 없음 |
| Per-page: index.html | Task 2 |
| Per-page: projects.html | Task 4 |
| Per-page: about.html | Task 5 |
| Per-page: resume.html | Task 10 |
| Per-page: cover-letter.html | Task 6 |
| Per-page: case-study-vr-robot.html | Task 7 |
| Per-page: case-study-dxcenter.html | Task 8 |
| Per-page: case-study-orchestration-ts.html (코드 블록) | Task 9, Step 9.4 |
| Footer 토큰 적용 | Step 2.8, Task 4.6 (Grep으로 발견) |
| Rollout: index reference → 7 pages | Task 2 → Task 4-10 |
| Verification: DevTools 4 viewport | Step 2.16, 4.8, 5.8, 6.8, 7.10, 8.8, 9.9, 10.9, 11.1-11.3 |
| README cover-letter 반영 | Task 12 |
| Git commit 논리 단위 | Task 2.17, 4.9, 5.9, 6.9, 7.11, 8.9, 9.10, 10.10, 12.6 (총 9개 commit) |

**커버리지 OK**. 모든 spec 요구사항이 task로 매핑됨.

**Type/method 일관성**: SNIPPET A/B/C에서 사용하는 ID (`mobile-menu-toggle`, `mobile-menu-close`, `mobile-menu`)가 모든 task에서 동일하게 참조됨. JS 함수명 `openMenu`/`closeMenu`도 일관됨.

**Placeholder 검사**: 본 plan에는 TBD/TODO/"적절히"/"비슷하게" 등의 표현 없음. 모든 step에 구체적 코드 또는 명령 포함.
