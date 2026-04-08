# GenWorld + Ollama Case Study Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `darkhtk/portfolio` 사이트에 GenWorld + Ollama 프로젝트를 R&D · 자사 기술 실증 사례로 추가. 신규 case study 페이지 1개 + 7개 파일 통합 업데이트.

**Architecture:** 정적 HTML × Tailwind CDN × Vanilla JS. 기존 case study 패턴(특히 case-study-orchestration-ts.html의 코드 블록 스타일과 nav Pattern B)을 그대로 따르며, 처음부터 모바일 반응형 토큰 T1/T2/T3 + 햄버거 컴포넌트 적용. 빌드 시스템 없음.

**Tech Stack:** HTML5, Tailwind CSS (CDN, plugins=forms,container-queries), Vanilla JavaScript, Material Symbols Outlined, GitHub Pages.

**Spec Reference:** `docs/superpowers/specs/2026-04-08-genworld-ollama-case-study-design.md`

**Branch:** `genworld-ollama-case-study` (이미 체크아웃됨)

---

## File Structure

**Files to create**:
- `case-study-genworld-ollama.html` (~600줄 신규)

**Files to modify** (7개):
- `projects.html` — 카드 1개 + 'local-llm' 필터 1개 추가
- `cover-letter.html` — 섹션 #2 끝에 단락 1개 추가
- `resume.html` — OSS & Awards 섹션(`#oss`) 안에 R&D 항목 추가
- `README.md` — Pages 목록에 1줄 추가
- `case-study-vr-robot.html` — 하단 cross-ref 그리드에 GenWorld 카드 1개 + grid-cols 변경
- `case-study-dxcenter.html` — 동일
- `case-study-orchestration-ts.html` — 상단(line ~155) 텍스트 링크 + 하단(line ~871) 카드 추가

**No build/test infrastructure changes.**

---

## Reusable Snippets

이 섹션은 모든 task에서 참조됩니다. 본 plan을 위에서 아래로 읽지 않고 task를 직접 수행하더라도 이 스니펫을 먼저 확인해야 합니다.

### SNIPPET A: Mobile menu overlay HTML (PROJECTS active)

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
    <a href="projects.html" class="font-headline text-3xl font-bold text-primary border-l-4 border-primary pl-3">PROJECTS</a>
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

### SNIPPET B: Mobile menu JavaScript IIFE

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

### SNIPPET C: nav (Pattern B with mobile hamburger)

```html
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

### SNIPPET D: footer (existing portfolio pattern)

```html
<footer class="w-full bg-[#0c1324]">
  <div class="flex flex-col md:flex-row justify-between items-center px-4 sm:px-6 md:px-8 py-12 max-w-7xl mx-auto">
    <div class="mb-8 md:mb-0">
      <div class="font-headline font-bold text-primary text-xl mb-2">DAEKI HONG</div>
      <div class="text-slate-500 font-body text-sm uppercase tracking-widest">© 2026 · INDUSTRIAL UNITY × AI AGENT</div>
    </div>
    <div class="flex gap-8">
      <a class="text-slate-500 font-body text-sm uppercase tracking-widest hover:text-primary underline decoration-primary underline-offset-4 transition-all duration-200" href="https://github.com/darkhtk" target="_blank" rel="noopener noreferrer">GitHub</a>
      <a class="text-slate-500 font-body text-sm uppercase tracking-widest hover:text-primary underline decoration-primary underline-offset-4 transition-all duration-200" href="https://www.linkedin.com/in/daeki-hong-041947182" target="_blank" rel="noopener noreferrer">LinkedIn</a>
      <a class="text-slate-500 font-body text-sm uppercase tracking-widest hover:text-primary underline decoration-primary underline-offset-4 transition-all duration-200" href="mailto:darkhtk@gmail.com">Email</a>
    </div>
  </div>
</footer>
```

### SNIPPET E: Cross-reference card (GenWorld) — for use in existing case studies

```html
<a href="case-study-genworld-ollama.html" class="p-8 bg-surface-container-low hover:bg-surface-container-highest rounded-xl transition-all group">
  <div class="font-label text-xs text-primary uppercase tracking-widest mb-2">Case Study 04 · R&amp;D</div>
  <h4 class="text-2xl font-headline font-bold mb-3">GenWorld + Ollama</h4>
  <p class="text-sm text-on-surface-variant mb-4">Phaser 3 TS RPG → Unity 2D + 로컬 LLM 기반 NPC 인지 시스템</p>
  <span class="text-primary text-xs font-label uppercase tracking-widest group-hover:underline">자세히 →</span>
</a>
```

---

## Task 1: Create case-study-genworld-ollama.html — Boilerplate + Hero

**Goal**: 새 case study 파일 생성. `<head>`, `<style>` block, `<body>`, nav (Pattern B + 모바일), 모바일 overlay, `<main class="pt-24">` 시작, Hero 섹션, 그리고 `<main>` 종료, footer, JS 까지의 골격. 본문 섹션 (§ 1-7)은 후속 task에서 채움.

**Files**:
- Create: `C:\sourcetree\portfolio\case-study-genworld-ollama.html`

- [ ] **Step 1.1: Create the file with boilerplate using Write tool**

Write the following content to `C:\sourcetree\portfolio\case-study-genworld-ollama.html`:

```html
<!DOCTYPE html>
<html class="dark" lang="ko">
<head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<link rel="icon" type="image/png" sizes="32x32" href="assets/favicon-32.png"/>
<link rel="icon" type="image/png" sizes="16x16" href="assets/favicon-16.png"/>
<link rel="apple-touch-icon" sizes="180x180" href="assets/apple-touch-icon.png"/>
<title>GenWorld + Ollama — Local LLM NPC Cognition · Case Study · 홍대기</title>
<meta name="description" content="Phaser 3 TS RPG (testgame2)를 Unity 2D C#으로 포팅하면서 로컬 Ollama LLM(gemma3) 기반 NPC 인지·대화 시스템을 직접 설계·구현. 클라우드 API 의존 없이 오프라인 우선 + graceful fallback. 4 CLI 멀티 페르소나 orchestration."/>
<meta property="og:title" content="GenWorld + Ollama · Local LLM NPC Cognition · Case Study"/>
<meta property="og:description" content="Phaser 3 TS RPG → Unity 2D 포팅 + 로컬 LLM 기반 NPC 인지 시스템. R&D · 자사 기술 실증."/>
<meta property="og:type" content="article"/>
<meta property="og:image" content="https://darkhtk.github.io/portfolio/assets/profile.jpg"/>
<meta property="og:url" content="https://darkhtk.github.io/portfolio/case-study-genworld-ollama.html"/>
<meta property="og:locale" content="ko_KR"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:title" content="GenWorld + Ollama · Case Study"/>
<meta name="twitter:description" content="Local LLM NPC Cognition · R&D 자사 기술 실증."/>
<meta name="twitter:image" content="https://darkhtk.github.io/portfolio/assets/profile.jpg"/>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&amp;family=Inter:wght@300;400;500;600&amp;family=Manrope:wght@400;500;600&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<script id="tailwind-config">
  tailwind.config = {
    darkMode: "class",
    theme: {
      extend: {
        colors: {
          "outline": "#8d90a2", "on-background": "#dce1fb", "primary-fixed-dim": "#b7c4ff",
          "primary": "#b7c4ff", "tertiary": "#b7c8e1", "on-surface-variant": "#c3c5d9",
          "primary-fixed": "#dde1ff", "on-primary": "#002682", "primary-container": "#0052ff",
          "surface-variant": "#2e3447", "secondary-container": "#3f465c", "surface": "#0c1324",
          "background": "#0c1324", "surface-container-highest": "#2e3447",
          "surface-container-lowest": "#070d1f", "on-surface": "#dce1fb",
          "surface-container": "#191f31", "secondary": "#bec6e0",
          "outline-variant": "#434656", "surface-container-low": "#151b2d"
        },
        borderRadius: { DEFAULT: "0.125rem", lg: "0.25rem", xl: "0.5rem", full: "0.75rem" },
        fontFamily: { headline: ["Space Grotesk"], body: ["Inter"], label: ["Manrope"] }
      }
    }
  }
</script>
<style>
  body { background-color: #0c1324; color: #dce1fb; font-family: 'Inter', sans-serif; }
  .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
  .neural-bg { background-image: radial-gradient(circle at 2px 2px, #434656 1px, transparent 0); background-size: 40px 40px; opacity: 0.15; }
  .text-glow { text-shadow: 0 0 32px rgba(183, 196, 255, 0.4); }
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
</style>
</head>
<body class="bg-background text-on-background">

<!-- TopNavBar -->
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
    <a href="projects.html" class="font-headline text-3xl font-bold text-primary border-l-4 border-primary pl-3">PROJECTS</a>
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

<main class="pt-24">

  <!-- Hero Section -->
  <section class="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mb-16 sm:mb-20 md:mb-32">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
      <div class="lg:col-span-8">

        <div class="flex flex-wrap items-center gap-4 mb-6">
          <span class="px-3 py-1 bg-surface-container-highest text-primary-fixed rounded-md text-xs font-label uppercase tracking-widest">Case Study 04</span>
          <span class="text-outline text-xs font-label uppercase tracking-widest">Local LLM · Game Runtime · R&amp;D</span>
          <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-primary-fixed/15 text-primary-fixed text-[10px] uppercase tracking-widest font-label">
            <span class="material-symbols-outlined text-[10px]">science</span>
            R&amp;D · Tech Validation
          </span>
        </div>

        <h1 class="text-4xl sm:text-5xl lg:text-7xl font-headline font-bold text-on-surface tracking-tighter leading-none mb-8">
          <span class="text-primary">GenWorld</span><br/>+ Ollama<br/><span class="text-2xl sm:text-3xl text-slate-400">Local LLM NPC Cognition</span>
        </h1>

        <p class="text-base sm:text-lg text-on-surface-variant leading-relaxed mb-8 max-w-3xl">
          Phaser 3 TypeScript RPG (<span class="text-on-surface">testgame2</span>)를 <span class="text-on-surface">Unity 2D C#</span>로 포팅하면서, 게임 런타임에 <span class="text-primary-fixed">로컬 Ollama LLM(gemma3)</span> 기반 <span class="text-on-surface">NPC 인지·대화 시스템</span>을 직접 설계·구현. 클라우드 API 의존 없이 <span class="text-primary-fixed">오프라인 우선 + graceful fallback</span> 구조로, 산업 환경의 보안·비용 제약에서도 동일 패턴 적용 가능함을 검증.
        </p>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div>
            <div class="font-headline text-xl sm:text-2xl font-bold text-primary">Local LLM</div>
            <div class="font-label text-[10px] uppercase tracking-widest text-slate-500 mt-1">Stack Core</div>
          </div>
          <div>
            <div class="font-headline text-xl sm:text-2xl font-bold text-primary">gemma3 4B/12B</div>
            <div class="font-label text-[10px] uppercase tracking-widest text-slate-500 mt-1">Models</div>
          </div>
          <div>
            <div class="font-headline text-xl sm:text-2xl font-bold text-primary">4 CLI</div>
            <div class="font-label text-[10px] uppercase tracking-widest text-slate-500 mt-1">Multi-Persona Dev</div>
          </div>
          <div>
            <div class="font-headline text-xl sm:text-2xl font-bold text-primary">100%</div>
            <div class="font-label text-[10px] uppercase tracking-widest text-slate-500 mt-1">Offline Capable</div>
          </div>
        </div>

        <div class="flex flex-wrap gap-3">
          <a href="https://github.com/darkhtk/game-GenWorld" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 px-5 py-2.5 bg-surface-container-low hover:bg-surface-container-highest rounded-md text-sm font-headline font-bold transition-all">
            <span class="material-symbols-outlined text-base">hub</span>
            GitHub Repository
          </a>
          <a href="projects.html" class="inline-flex items-center gap-2 px-5 py-2.5 bg-surface-container-low hover:bg-surface-container-highest rounded-md text-sm font-headline font-bold transition-all">
            <span class="material-symbols-outlined text-base">arrow_back</span>
            All Projects
          </a>
        </div>

      </div>
    </div>
  </section>

  <!-- SECTIONS GO HERE — added by subsequent tasks -->

</main>

<!-- Footer -->
<footer class="w-full bg-[#0c1324]">
  <div class="flex flex-col md:flex-row justify-between items-center px-4 sm:px-6 md:px-8 py-12 max-w-7xl mx-auto">
    <div class="mb-8 md:mb-0">
      <div class="font-headline font-bold text-primary text-xl mb-2">DAEKI HONG</div>
      <div class="text-slate-500 font-body text-sm uppercase tracking-widest">© 2026 · INDUSTRIAL UNITY × AI AGENT</div>
    </div>
    <div class="flex gap-8">
      <a class="text-slate-500 font-body text-sm uppercase tracking-widest hover:text-primary underline decoration-primary underline-offset-4 transition-all duration-200" href="https://github.com/darkhtk" target="_blank" rel="noopener noreferrer">GitHub</a>
      <a class="text-slate-500 font-body text-sm uppercase tracking-widest hover:text-primary underline decoration-primary underline-offset-4 transition-all duration-200" href="https://www.linkedin.com/in/daeki-hong-041947182" target="_blank" rel="noopener noreferrer">LinkedIn</a>
      <a class="text-slate-500 font-body text-sm uppercase tracking-widest hover:text-primary underline decoration-primary underline-offset-4 transition-all duration-200" href="mailto:darkhtk@gmail.com">Email</a>
    </div>
  </div>
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
</html>
```

- [ ] **Step 1.2: Verify file exists and basic structure**

Run:
```bash
cd /c/sourcetree/portfolio && wc -l case-study-genworld-ollama.html
```
Expected: ~225 줄.

Use Grep tool on `case-study-genworld-ollama.html` for pattern `mobile-menu` to confirm 7+ matches (nav button, overlay div, JS references).

Use Grep for `Case Study 04` to confirm 1 match (Hero label).

- [ ] **Step 1.3: Commit boilerplate**

Run:
```bash
cd /c/sourcetree/portfolio && git add case-study-genworld-ollama.html && git commit -m "$(cat <<'EOF'
feat(case-study): create GenWorld+Ollama page boilerplate + Hero

신규 case study 페이지 골격 — head, style block (code-block CSS),
nav (Pattern B + 모바일 햄버거), 모바일 overlay (PROJECTS active),
Hero 섹션 (Case Study 04 라벨, R&D 배지, H1, 통계 4칸, CTA),
footer, 모바일 메뉴 IIFE.

본문 섹션 (§ 1-7)은 후속 task에서 추가.

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: § 1 The Challenge + § 2 Local LLM Operation

**Goal**: 본문 첫 두 섹션 추가. § 1은 "왜 로컬 LLM"의 동기를, § 2는 OllamaClient 의 운영 메커니즘과 graceful fallback을 다룸. 코드 스니펫 1개 포함.

**Files**:
- Modify: `C:\sourcetree\portfolio\case-study-genworld-ollama.html`

- [ ] **Step 2.1: Insert § 1 + § 2 sections after Hero**

Use Edit tool. `old_string`:
```
  <!-- SECTIONS GO HERE — added by subsequent tasks -->

</main>
```

`new_string`:
```
  <!-- § 1. The Challenge -->
  <section class="py-16 sm:py-20 md:py-32 bg-surface-container-low relative">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
      <div class="font-label text-xs text-primary tracking-[0.3em] uppercase mb-4">§ 1 · The Challenge</div>
      <h2 class="font-headline text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-8 max-w-3xl">왜 로컬 LLM인가</h2>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        <div class="bg-surface-container-highest/40 p-6 sm:p-8 rounded-xl">
          <span class="material-symbols-outlined text-primary text-3xl mb-4">paid</span>
          <h3 class="font-headline text-xl font-bold mb-3">비용</h3>
          <p class="text-on-surface-variant leading-relaxed text-sm">인디 게임 NPC 대화에 클라우드 LLM API를 쓰면 플레이어 1인당 분당 API 비용이 발생. 동시 접속자 증가 시 수익 모델이 무너짐.</p>
        </div>
        <div class="bg-surface-container-highest/40 p-6 sm:p-8 rounded-xl">
          <span class="material-symbols-outlined text-primary text-3xl mb-4">lock</span>
          <h3 class="font-headline text-xl font-bold mb-3">프라이버시</h3>
          <p class="text-on-surface-variant leading-relaxed text-sm">게임 안 자유 대화가 외부 서버를 통과. 산업 환경에 같은 패턴을 적용한다면 보안 정책상 클라우드 우회 자체가 차단됨.</p>
        </div>
        <div class="bg-surface-container-highest/40 p-6 sm:p-8 rounded-xl">
          <span class="material-symbols-outlined text-primary text-3xl mb-4">cloud_off</span>
          <h3 class="font-headline text-xl font-bold mb-3">오프라인 동작</h3>
          <p class="text-on-surface-variant leading-relaxed text-sm">네트워크가 없어도 게임은 굴러야 함. 클라우드 의존은 곧 가용성 의존. 산업 현장에서도 동일 — 망 분리 환경에서 LLM 활용 가능한가.</p>
        </div>
      </div>

      <p class="text-on-surface-variant text-base sm:text-lg leading-relaxed max-w-4xl">
        Ollama 는 <span class="text-on-surface">gemma3:4b ~ 12b</span> 같은 소·중형 모델을 로컬에서 합리적인 응답 시간(<span class="text-primary-fixed">~3-5초</span>)으로 실행. HTTP API 인터페이스로 Unity에서 직접 호출 가능. 사용자 환경에 따라 모델 교체 가능. <span class="text-on-surface">'너'스탤지아 프로젝트의 클라우드 5종 API 통합</span> 다음 단계로, 같은 "AI를 제품 파이프라인에 통합" 패턴을 <span class="text-primary-fixed">온디바이스 로컬 LLM</span> 환경으로 확장한 R&amp;D 사례.
      </p>
    </div>
  </section>

  <!-- § 2. Local LLM Operation -->
  <section class="py-16 sm:py-20 md:py-32 bg-surface relative">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
      <div class="font-label text-xs text-primary tracking-[0.3em] uppercase mb-4">§ 2 · Local LLM Operation</div>
      <h2 class="font-headline text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-8 max-w-3xl">OllamaClient 운영 + Graceful Fallback</h2>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <div class="space-y-6">
          <div>
            <h3 class="font-headline text-lg font-bold text-on-surface mb-2"><span class="text-primary">01</span> · HTTP 클라이언트</h3>
            <p class="text-on-surface-variant text-sm leading-relaxed"><code class="text-primary-fixed">http://localhost:11434/api/generate</code> 엔드포인트로 fast(<code>gemma3:4b</code>) / large(<code>gemma3:12b</code>) 모델 호출. <code>UnityWebRequest</code> 기반 비동기.</p>
          </div>
          <div>
            <h3 class="font-headline text-lg font-bold text-on-surface mb-2"><span class="text-primary">02</span> · 가용성 체크 + Warm-up</h3>
            <p class="text-on-surface-variant text-sm leading-relaxed">게임 시작 시 3초 가용성 체크 → 성공 시 fast 모델 warm-up 호출 (첫 응답 지연 제거). 실패 시 <code>AiEnabled = false</code> 분기로 오프라인 모드 진입.</p>
          </div>
          <div>
            <h3 class="font-headline text-lg font-bold text-on-surface mb-2"><span class="text-primary">03</span> · 타임아웃 + 재시도</h3>
            <p class="text-on-surface-variant text-sm leading-relaxed">30초 <code>UnityWebRequest.timeout</code> + AIManager 단의 <code>CancellationTokenSource</code> 2회 재시도. 최악의 경우 60초 후 fallback 분기.</p>
          </div>
          <div>
            <h3 class="font-headline text-lg font-bold text-on-surface mb-2"><span class="text-primary">04</span> · Graceful Fallback</h3>
            <p class="text-on-surface-variant text-sm leading-relaxed">Ollama 미가동 시 <code>BuildOfflineResponse()</code> 가 NPC mood/relationship 기반 템플릿 응답 생성. 게임 진행 끊김 없음. <span class="text-primary-fixed">100% offline-capable</span>.</p>
          </div>
        </div>

        <div>
          <div class="font-label text-[10px] text-slate-500 uppercase tracking-widest mb-2">OllamaClient.cs · GenerateDialogue</div>
          <div class="code-block"><span class="kw">public async</span> Task&lt;<span class="kw">string</span>&gt; GenerateDialogue(<span class="kw">string</span> prompt,
    CancellationToken cancellationToken = <span class="kw">default</span>)
{
    <span class="kw">var</span> payload = <span class="kw">new</span> OllamaRequest
    {
        model = _fastModel,
        prompt = prompt,
        stream = <span class="kw">false</span>,
        format = <span class="str">"json"</span>,
        options = <span class="kw">new</span> OllamaOptions
        {
            temperature = <span class="num">0.8f</span>,
            top_p = <span class="num">0.9f</span>,
            repeat_penalty = <span class="num">1.3f</span>
        }
    };
    <span class="com">// UnityWebRequest POST + cancellationToken handling</span>
    <span class="com">// ...</span>
    <span class="kw">return</span> response?.response;
}</div>
        </div>
      </div>
    </div>
  </section>

  <!-- SECTIONS GO HERE — added by subsequent tasks -->

</main>
```

- [ ] **Step 2.2: Verify sections inserted**

Use Grep on `case-study-genworld-ollama.html` for pattern `§ 1` and `§ 2` — should find 1 match each.

Use Grep for `code-block` (the CSS class usage) — should find 1+ matches.

- [ ] **Step 2.3: Commit**

```bash
cd /c/sourcetree/portfolio && git add case-study-genworld-ollama.html && git commit -m "feat(case-study): add § 1 The Challenge + § 2 Local LLM Operation

§ 1: 비용·프라이버시·오프라인 3 카드 + 로컬 LLM 선택 근거.
§ 2: OllamaClient 4단계 (HTTP / warm-up / timeout / fallback) +
GenerateDialogue 코드 스니펫.

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: § 3 NPC Cognitive Architecture + § 4 Phaser Port + AI Augmentation

**Goal**: § 3 (NPCBrain + AIManager + ASCII 다이어그램), § 4 (Phaser TS → Unity 2D 포팅 + AI 증설) 추가.

**Files**:
- Modify: `C:\sourcetree\portfolio\case-study-genworld-ollama.html`

- [ ] **Step 3.1: Insert § 3 + § 4 sections**

Use Edit tool. `old_string`:
```
  <!-- SECTIONS GO HERE — added by subsequent tasks -->

</main>
```

`new_string`:
```
  <!-- § 3. NPC Cognitive Architecture -->
  <section class="py-16 sm:py-20 md:py-32 bg-surface-container-low relative">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
      <div class="font-label text-xs text-primary tracking-[0.3em] uppercase mb-4">§ 3 · NPC Cognitive Architecture</div>
      <h2 class="font-headline text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-8 max-w-3xl">NPCBrain — mood · relationship · memory · triggers</h2>

      <p class="text-on-surface-variant text-base sm:text-lg leading-relaxed mb-10 max-w-4xl">
        Ollama 는 단순한 텍스트 생성기. <span class="text-on-surface">진짜 흥미로운 부분은 NPC 인지 상태를 어떻게 모델링하느냐</span>에 있습니다. 각 NPC 에 per-instance <code class="text-primary-fixed">NPCBrain</code> 을 부여하고, AIManager 가 게임 진행에 따라 brain 상태를 갱신·직렬화·복원합니다.
      </p>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <div class="space-y-5">
          <div class="bg-surface-container-highest/40 p-5 rounded-lg">
            <h3 class="font-headline text-base font-bold text-on-surface mb-2"><span class="text-primary">NPCBrain</span> 구조</h3>
            <p class="text-on-surface-variant text-sm leading-relaxed">id, name, personality, mood (Happy/Neutral/Angry/Scared), relationship (대상별 -100~+100), memory (최근 N개 대화), wantToTalk 플래그, 트리거 발동 이력.</p>
          </div>
          <div class="bg-surface-container-highest/40 p-5 rounded-lg">
            <h3 class="font-headline text-base font-bold text-on-surface mb-2"><span class="text-primary">AIManager</span> 오케스트레이션</h3>
            <p class="text-on-surface-variant text-sm leading-relaxed">per-NPC brain 등록. 10초 주기로 NPC 1명씩 순환하여 mood 갱신 (관계도 임계값 기반). 플레이어 근처 + 친밀도 ≥ 5 시 wantToTalk 자동 트리거.</p>
          </div>
          <div class="bg-surface-container-highest/40 p-5 rounded-lg">
            <h3 class="font-headline text-base font-bold text-on-surface mb-2">JSON 구조화 응답</h3>
            <p class="text-on-surface-variant text-sm leading-relaxed">Ollama <code>format=json</code> + temperature 0.8 + top_p 0.9 + repeat_penalty 1.3 으로 자유도와 일관성 균형. 응답 schema: <code>{ dialogue, options[], action, relationshipChange, newMemory, offerQuest }</code>.</p>
          </div>
          <div class="bg-surface-container-highest/40 p-5 rounded-lg">
            <h3 class="font-headline text-base font-bold text-on-surface mb-2">Save/Load 통합</h3>
            <p class="text-on-surface-variant text-sm leading-relaxed"><code>SerializeAllBrains()</code> / <code>RestoreAllBrains()</code> 로 모든 NPC 인지 상태(관계도·memory·트리거 이력)를 SaveSystem 에 통합. 게임 재개 시 NPC 가 플레이어를 "기억"함.</p>
          </div>
        </div>

        <div>
          <div class="font-label text-[10px] text-slate-500 uppercase tracking-widest mb-2">AIManager.cs · UpdateBehavior (요약)</div>
          <div class="code-block"><span class="kw">public void</span> UpdateBehavior(<span class="kw">string</span> playerRegion,
    <span class="kw">float</span> playerX, <span class="kw">float</span> playerY,
    Dictionary&lt;<span class="kw">string</span>, Vector2&gt; npcPositions)
{
    <span class="com">// 10s cycle — rotate one NPC at a time</span>
    <span class="kw">int</span> rel = brain.GetRelationship(<span class="str">"player"</span>);

    <span class="kw">if</span> (rel &gt;= <span class="num">10</span>) brain.CurrentMood = Mood.Happy;
    <span class="kw">else if</span> (rel &gt;= <span class="num">0</span>)  brain.CurrentMood = Mood.Neutral;
    <span class="kw">else if</span> (rel &gt;= -<span class="num">10</span>) brain.CurrentMood = Mood.Angry;
    <span class="kw">else</span>             brain.CurrentMood = Mood.Scared;

    <span class="kw">bool</span> isNearPlayer = npcPositions != <span class="kw">null</span>
        &amp;&amp; npcPositions.TryGetValue(npcId, <span class="kw">out var</span> pos)
        &amp;&amp; Vector2.Distance(pos, <span class="kw">new</span> Vector2(playerX, playerY)) &lt; <span class="num">200f</span>;

    <span class="kw">if</span> (isNearPlayer &amp;&amp; rel &gt;= <span class="num">5</span> &amp;&amp; !brain.WantToTalk)
    {
        brain.WantToTalk = <span class="kw">true</span>;
        brain.TalkReason = <span class="str">"nearby_friend"</span>;
    }
}</div>
        </div>
      </div>

      <div class="bg-surface-container-highest/40 p-6 sm:p-8 rounded-xl">
        <div class="font-label text-[10px] text-slate-500 uppercase tracking-widest mb-3">Player → NPC AI Flow</div>
        <div class="code-block">Player approaches NPC
       ↓
GameManager.Update() ──→ AIManager.UpdateBehavior(npcPositions)
                              ↓
                       per-NPC NPCBrain
                       (mood / relationship / memory)
                              ↓
       relationship &gt;= 5 &amp;&amp; nearby ──→ wantToTalk = true
                              ↓
Player initiates dialogue
       ↓
DialogueController.HandleDialogueResponse(playerInput)
       ↓
AIManager.GenerateDialogue(npcId, input, history, ...)
       ↓
       ┌──────── Ollama available? ────────┐
       ↓                                    ↓
   YES: PromptBuilder → OllamaClient    NO: BuildOfflineResponse
       ↓                                    ↓
   gemma3:4b inference (JSON)           Template by mood
       ↓                                    ↓
   parse DialogueResponse               same DialogueResponse
       ↓                                    ↓
   ApplyResponse(brain, response) ←───────┘
   - update relationship
   - add memory
   - evaluate triggers
       ↓
DialogueUI shows text + option buttons</div>
      </div>
    </div>
  </section>

  <!-- § 4. Phaser TS → Unity 2D Port + AI Augmentation -->
  <section class="py-16 sm:py-20 md:py-32 bg-surface relative">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
      <div class="font-label text-xs text-primary tracking-[0.3em] uppercase mb-4">§ 4 · Port + AI Augmentation</div>
      <h2 class="font-headline text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-8 max-w-3xl">Phaser 3 TS RPG → Unity 2D + Local LLM</h2>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <div>
          <div class="font-label text-xs text-slate-500 uppercase tracking-widest mb-3">Original</div>
          <div class="bg-surface-container-highest/40 p-6 rounded-xl">
            <h3 class="font-headline text-lg font-bold text-on-surface mb-3">testgame2 (Phaser 3 + TypeScript)</h3>
            <ul class="text-on-surface-variant text-sm space-y-2 leading-relaxed">
              <li>• Top-down 판타지 RPG, 2D 픽셀 아트 (32×32 PPU)</li>
              <li>• 전투 / 스킬 / 인벤토리 / 퀘스트 / 대화 / 저장 시스템</li>
              <li>• Phaser Tilemap, Y축 ↓, 시간 단위 ms</li>
              <li><span class="text-on-surface">NPC 대화는 정적 스크립트 기반</span></li>
            </ul>
          </div>
        </div>

        <div>
          <div class="font-label text-xs text-slate-500 uppercase tracking-widest mb-3">Ported + Augmented</div>
          <div class="bg-surface-container-highest/40 p-6 rounded-xl">
            <h3 class="font-headline text-lg font-bold text-on-surface mb-3">GenWorld (Unity 6 + C#)</h3>
            <ul class="text-on-surface-variant text-sm space-y-2 leading-relaxed">
              <li>• Unity 6 LTS + URP, 같은 게임 루프 네이티브 재구현</li>
              <li>• Tilemap 마이그레이션, Y축 ↑, 시간 단위 sec, Rigidbody2D 신 API</li>
              <li>• <span class="text-primary-fixed">로컬 LLM NPC 대화 시스템 신규 도입</span> (원본에 없던 기능)</li>
              <li>• 4 CLI 멀티 페르소나 orchestration 으로 개발</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-surface-container-highest/40 p-6 rounded-xl">
          <span class="material-symbols-outlined text-primary text-3xl mb-3">swap_vert</span>
          <h3 class="font-headline text-lg font-bold mb-2">포팅 챌린지</h3>
          <p class="text-on-surface-variant text-sm leading-relaxed">Y축 반전(Phaser Y↓ → Unity Y↑)과 시간 단위 변환(ms → seconds), Tilemap 자료구조 마이그레이션, Phaser Scene 라이프사이클을 Unity Scene + GameManager 로 재매핑.</p>
        </div>
        <div class="bg-surface-container-highest/40 p-6 rounded-xl">
          <span class="material-symbols-outlined text-primary text-3xl mb-3">groups</span>
          <h3 class="font-headline text-lg font-bold mb-2">4 CLI 멀티 페르소나</h3>
          <p class="text-on-surface-variant text-sm leading-relaxed">Director / Dev-Backend / Dev-Frontend / Asset+QA. 폴더 소유권 기반 충돌 방지. <span class="text-primary-fixed">DXCenter 에서 정형화한 멀티 페르소나 패턴을 산업 외 프로젝트로 확장한 사례</span>.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- SECTIONS GO HERE — added by subsequent tasks -->

</main>
```

- [ ] **Step 3.2: Verify**

Use Grep for `§ 3` and `§ 4` — should find 1 each. Use Grep for `Player approaches NPC` — should find 1 (the ASCII diagram).

- [ ] **Step 3.3: Commit**

```bash
cd /c/sourcetree/portfolio && git add case-study-genworld-ollama.html && git commit -m "feat(case-study): add § 3 NPC Cognitive Architecture + § 4 Port

§ 3: NPCBrain 4 카드 + UpdateBehavior 코드 스니펫 + Player→NPC ASCII flow.
§ 4: testgame2 vs GenWorld 비교 + 포팅 챌린지 + 4 CLI 멀티 페르소나.

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Task 4: § 5 Result + § 6 Cross-Reference + § 7 CTA

**Goal**: 마지막 3 섹션 추가 + sections placeholder 제거.

**Files**:
- Modify: `C:\sourcetree\portfolio\case-study-genworld-ollama.html`

- [ ] **Step 4.1: Insert § 5, § 6, § 7 sections (replace placeholder)**

Use Edit tool. `old_string`:
```
  <!-- SECTIONS GO HERE — added by subsequent tasks -->

</main>
```

`new_string`:
```
  <!-- § 5. Result & Verification -->
  <section class="py-16 sm:py-20 md:py-32 bg-surface-container-low relative">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
      <div class="font-label text-xs text-primary tracking-[0.3em] uppercase mb-4">§ 5 · Result &amp; Verification</div>
      <h2 class="font-headline text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-8 max-w-3xl">동작 검증 + 안정성 개선 진행 중</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div class="bg-surface-container-highest/40 p-6 rounded-xl">
          <div class="flex items-center gap-3 mb-3">
            <span class="material-symbols-outlined text-primary text-2xl">check_circle</span>
            <h3 class="font-headline text-lg font-bold">동작 검증</h3>
          </div>
          <p class="text-on-surface-variant text-sm leading-relaxed">NPC 와 대화 시 personality / mood / relationship 기반 자연스러운 응답 생성. JSON 응답에서 action 추출 → quest 제안 등 게임 행동 수행. <span class="text-on-surface">gemma3:4b 응답 시간 평균 ~3-5초</span>.</p>
        </div>
        <div class="bg-surface-container-highest/40 p-6 rounded-xl">
          <div class="flex items-center gap-3 mb-3">
            <span class="material-symbols-outlined text-primary text-2xl">cloud_off</span>
            <h3 class="font-headline text-lg font-bold">오프라인 Fallback</h3>
          </div>
          <p class="text-on-surface-variant text-sm leading-relaxed">Ollama 종료 후 게임 실행 → 가용성 체크 3s 타임아웃 → <code>AiEnabled = false</code> → <code>BuildOfflineResponse</code> 분기. 게임 끊김 없이 진행.</p>
        </div>
        <div class="bg-surface-container-highest/40 p-6 rounded-xl">
          <div class="flex items-center gap-3 mb-3">
            <span class="material-symbols-outlined text-primary text-2xl">save</span>
            <h3 class="font-headline text-lg font-bold">Brain Serialize 무손실</h3>
          </div>
          <p class="text-on-surface-variant text-sm leading-relaxed">SaveSystem 통합 — <code>SerializeAllBrains()</code> 로 player 와의 관계도 / 트리거 이력 / mood / memory 모두 JSON 직렬화 → 게임 재개 시 복원.</p>
        </div>
        <div class="bg-surface-container-highest/40 p-6 rounded-xl">
          <div class="flex items-center gap-3 mb-3">
            <span class="material-symbols-outlined text-primary text-2xl">build</span>
            <h3 class="font-headline text-lg font-bold">안정성 개선 진행 중</h3>
          </div>
          <p class="text-on-surface-variant text-sm leading-relaxed">SPEC-S-078 (DialogueSystem AI 응답 타임아웃) 작업으로 <code>CancellationTokenSource</code> 도입, 로딩 UI 시각 피드백 강화. P2 우선순위로 <span class="text-on-surface">review queue 진행 중</span>.</p>
        </div>
      </div>

      <p class="text-on-surface-variant text-base sm:text-lg leading-relaxed max-w-4xl">
        이 case study 는 산업 환경 외에서도 동일한 시니어 레벨 AI Agent 활용 패턴이 작동함을 보여주는 R&amp;D 사례입니다. 게임이라는 도메인을 통해 검증된 <span class="text-on-surface">로컬 LLM 운영 + 인지 아키텍처 + AI 증설 포팅</span> 패턴은 산업 트레이닝 시뮬레이터, 고객 세션 대화, 설비 매뉴얼 상호작용 등 산업 응용으로 확장 가능합니다.
      </p>
    </div>
  </section>

  <!-- § 6. Cross-Reference -->
  <section class="py-16 sm:py-20 md:py-32 bg-surface relative">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
      <div class="font-label text-xs text-primary tracking-[0.3em] uppercase mb-4">§ 6 · Related Case Studies</div>
      <h2 class="font-headline text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-10 max-w-3xl">Other Case Studies</h2>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <a href="case-study-vr-robot.html" class="p-8 bg-surface-container-low hover:bg-surface-container-highest rounded-xl transition-all group">
          <div class="font-label text-xs text-primary uppercase tracking-widest mb-2">Case Study 01</div>
          <h4 class="text-2xl font-headline font-bold mb-3">VR 로봇 원격 조종 + 자체 IK 솔버</h4>
          <p class="text-sm text-on-surface-variant mb-4">Quest 3로 산업용 로봇 실시간 조종 — 엑스포 시연 성공</p>
          <span class="text-primary text-xs font-label uppercase tracking-widest group-hover:underline">자세히 →</span>
        </a>
        <a href="case-study-dxcenter.html" class="p-8 bg-surface-container-low hover:bg-surface-container-highest rounded-xl transition-all group">
          <div class="font-label text-xs text-primary uppercase tracking-widest mb-2">Case Study 02</div>
          <h4 class="text-2xl font-headline font-bold mb-3">DXCenter — LG에너지솔루션</h4>
          <p class="text-sm text-on-surface-variant mb-4">3 CLI 멀티 페르소나로 43개 C# 파일 단독 구현</p>
          <span class="text-primary text-xs font-label uppercase tracking-widest group-hover:underline">자세히 →</span>
        </a>
        <a href="case-study-orchestration-ts.html" class="p-8 bg-surface-container-low hover:bg-surface-container-highest rounded-xl transition-all group">
          <div class="font-label text-xs text-primary uppercase tracking-widest mb-2">Open Source · Self-Built</div>
          <h4 class="text-2xl font-headline font-bold mb-3">Multi-Agent Orchestration Framework</h4>
          <p class="text-sm text-on-surface-variant mb-4">멀티 페르소나 방법론을 framework로 추출. 산업 프로젝트의 메타 베이스</p>
          <span class="text-primary text-xs font-label uppercase tracking-widest group-hover:underline">자세히 →</span>
        </a>
      </div>
    </div>
  </section>

  <!-- § 7. CTA -->
  <section class="py-16 sm:py-20 md:py-24 bg-surface-container-low relative">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 text-center">
      <h2 class="font-headline text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-6">전체 코드는 GitHub 에서 확인하세요</h2>
      <p class="text-on-surface-variant text-base sm:text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
        OllamaClient · AIManager · NPCBrain · PromptBuilder · DialogueController 까지 전체 구현 + 4 CLI 멀티 페르소나 orchestration 보드.
      </p>
      <div class="flex flex-wrap justify-center gap-4">
        <a href="https://github.com/darkhtk/game-GenWorld" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-md font-headline font-bold hover:scale-95 active:scale-90 transition-transform">
          <span class="material-symbols-outlined">hub</span>
          GitHub Repository
        </a>
        <a href="projects.html" class="inline-flex items-center gap-2 px-6 py-3 bg-surface-container-highest hover:bg-surface-container rounded-md font-headline font-bold transition-all">
          <span class="material-symbols-outlined">arrow_back</span>
          All Projects
        </a>
      </div>
    </div>
  </section>

</main>
```

- [ ] **Step 4.2: Verify all 7 sections + placeholder removed**

Use Grep for `SECTIONS GO HERE` — should return 0 matches.

Use Grep with pattern `§` (literal section symbol) on the file — should find 7 matches (§ 1 through § 7).

Run:
```bash
cd /c/sourcetree/portfolio && wc -l case-study-genworld-ollama.html
```
Expected: ~600 줄 정도.

- [ ] **Step 4.3: Commit**

```bash
cd /c/sourcetree/portfolio && git add case-study-genworld-ollama.html && git commit -m "feat(case-study): add § 5 Result + § 6 Cross-Ref + § 7 CTA

§ 5: 4 카드 (동작 검증 / 오프라인 fallback / brain serialize / 안정성 진행 중).
§ 6: 3 카드 cross-reference (vr-robot / dxcenter / orchestration-ts).
§ 7: GitHub repository CTA + All Projects 링크.

Case study 페이지 완성.

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Task 5: User Verification Checkpoint — case study 페이지 단독

**Goal**: 사용자가 새 case study 페이지를 직접 검토. 통과 시 Phase 3 (통합) 시작.

- [ ] **Step 5.1: Pause and request user review**

Stop and ask the user:

> "case-study-genworld-ollama.html 작성 완료 (commits: Task 1-4). 브라우저에서 다음 viewport로 확인 부탁드립니다:
> - 1280px (Desktop): 기존 case study 3개와 시각적 결 일치, 회귀 0
> - 768px (iPad): 그리드 단계 정상
> - 390px (iPhone 14 Pro): 햄버거 동작, 코드 블록 모바일 가로 스크롤
> - 360px (Galaxy S20): 통계 4칸 2×2, 가로 스크롤 없음
>
> 본문 내용·코드 스니펫·ASCII 다이어그램·R&D 톤 모두 OK인지 확인 후 'OK' 또는 'X (이슈)'로 응답해주세요."

- [ ] **Step 5.2: Wait for user response**

If user reports issues → describe fix → fix inline → re-verify → re-request approval.
If user approves → proceed to Task 6 (Phase 3 integration).

---

## Task 6: projects.html — Add 'local-llm' filter + Gen card

**Goal**: 새 필터 버튼 1개 + Gen 카드 1개 추가. 기존 카드 변경 없음. 필터 JS 변경 없음 (data-category 기반).

**Files**:
- Modify: `C:\sourcetree\portfolio\projects.html`

- [ ] **Step 6.1: Read filter bar and bento grid structure**

Use Read tool on `C:\sourcetree\portfolio\projects.html` (offset 130, limit 80) to refresh context — confirm filter bar at line ~133-141 and bento grid starts ~144.

- [ ] **Step 6.2: Add 'Local LLM' filter button**

Use Edit tool. `old_string`:
```
    <button data-filter="oss" class="filter-btn px-5 py-2 bg-surface-container-low hover:bg-surface-container-highest text-on-surface-variant font-label text-sm transition-all rounded-md">Open Source</button>
  </div>
```
`new_string`:
```
    <button data-filter="oss" class="filter-btn px-5 py-2 bg-surface-container-low hover:bg-surface-container-highest text-on-surface-variant font-label text-sm transition-all rounded-md">Open Source</button>
    <button data-filter="local-llm" class="filter-btn px-5 py-2 bg-surface-container-low hover:bg-surface-container-highest text-on-surface-variant font-label text-sm transition-all rounded-md">Local LLM</button>
  </div>
```

- [ ] **Step 6.3: Add Gen + Ollama card to bento grid**

The bento grid uses `md:col-span-X` for sizing. Insert the new card AT THE END of the grid (just before `</div>` closing the `grid grid-cols-1 md:grid-cols-12`).

Use Read tool first to find the exact closing of the bento grid. Use Grep for `<!-- Bento Grid for Projects -->` to locate the grid start, then read forward to find the matching closing `</div>` (the one that closes the `grid grid-cols-1 md:grid-cols-12` div, NOT a project card's inner div).

Then use Edit tool to insert the new card. The `old_string` should be the last project card's closing pattern + the bento grid closing `</div>`. Make `old_string` unique by including enough context.

The card to insert:

```html
    <!-- 9. R&D: GenWorld + Ollama (Local LLM NPC) -->
    <div data-category="ai-agent local-llm" class="project-card md:col-span-6 group relative overflow-hidden rounded-xl glass-card hover:bg-surface-container-low/95 transition-all duration-500">
      <div class="aspect-video w-full overflow-hidden relative bg-gradient-to-br from-primary/20 via-surface-container-low to-surface flex items-center justify-center">
        <span class="material-symbols-outlined text-primary text-7xl opacity-60">psychology</span>
        <div class="absolute bottom-4 left-4 right-4 flex justify-between items-end">
          <div>
            <div class="font-label text-[10px] text-primary-fixed uppercase tracking-widest opacity-90">Ollama · gemma3 4B/12B</div>
            <div class="font-label text-[9px] text-slate-400 uppercase tracking-widest mt-0.5">Local LLM · Game Runtime · R&amp;D</div>
          </div>
          <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-primary-fixed/15 text-primary-fixed text-[10px] uppercase tracking-widest font-label">
            <span class="material-symbols-outlined text-[10px]">science</span>
            R&amp;D
          </span>
        </div>
      </div>
      <div class="p-8">
        <div class="flex justify-between items-start mb-4">
          <div>
            <div class="flex items-center gap-2 mb-2 flex-wrap">
              <span class="font-label text-xs font-bold uppercase tracking-widest text-primary">Local LLM · NPC AI · Side Project</span>
            </div>
            <h3 class="text-2xl font-headline font-bold text-on-surface tracking-tight">GenWorld + Ollama</h3>
            <div class="text-xs text-slate-500 font-label uppercase tracking-widest mt-1">Phaser 3 TS RPG → Unity 2D</div>
          </div>
          <span class="material-symbols-outlined text-primary text-3xl">forum</span>
        </div>
        <p class="text-on-surface-variant mb-6 text-base max-w-2xl">
          Phaser 3 TS RPG (testgame2)를 Unity 2D C#로 포팅하면서 <span class="text-on-surface">로컬 Ollama LLM(gemma3) 기반 NPC 인지·대화 시스템</span>을 직접 설계·구현. 클라우드 API 의존 없이 <span class="text-primary-fixed">오프라인 우선 + graceful fallback</span> 구조. 4 CLI 멀티 페르소나 orchestration.
        </p>
        <div class="flex flex-wrap gap-3 mb-6">
          <div class="flex items-center gap-2 px-3 py-1 bg-surface-container-highest rounded-md">
            <span class="material-symbols-outlined text-sm">videogame_asset</span>
            <span class="font-label text-xs">Unity 6 · C#</span>
          </div>
          <div class="flex items-center gap-2 px-3 py-1 bg-surface-container-highest rounded-md">
            <span class="material-symbols-outlined text-sm">smart_toy</span>
            <span class="font-label text-xs">Ollama · gemma3</span>
          </div>
          <div class="flex items-center gap-2 px-3 py-1 bg-surface-container-highest rounded-md">
            <span class="material-symbols-outlined text-sm">memory</span>
            <span class="font-label text-xs">NPC Cognitive Arch</span>
          </div>
          <div class="flex items-center gap-2 px-3 py-1 bg-surface-container-highest rounded-md">
            <span class="material-symbols-outlined text-sm">groups</span>
            <span class="font-label text-xs">4-CLI Orchestration</span>
          </div>
        </div>
        <div class="flex flex-wrap gap-3">
          <a href="case-study-genworld-ollama.html" class="inline-flex items-center gap-2 text-primary text-sm font-headline font-bold group/btn">
            Read Case Study
            <span class="material-symbols-outlined text-base group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
          </a>
          <a href="https://github.com/darkhtk/game-GenWorld" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 text-slate-400 hover:text-primary text-sm font-headline font-bold transition-colors">
            <span class="material-symbols-outlined text-base">hub</span>
            GitHub
          </a>
        </div>
      </div>
    </div>
```

The exact insertion approach: use Grep on `projects.html` for `Bento Grid for Projects` to find the start of the grid (line ~143). Then read to find where the grid ends (look for the `</div>` matching the `<div class="grid grid-cols-1 md:grid-cols-12 gap-6">` opener at line 144).

Once you find the grid closing `</div>`, use Edit with old_string = "<last card's closing>\n  </div>\n\n</main>" or similar pattern that includes enough context to be unique. Then new_string = "<last card's closing>\n\n[GEN CARD HTML ABOVE]\n  </div>\n\n</main>".

If the grid closes with just `</div>` (no main wrapper directly after), find a unique identifier like the very last card's tag list closing.

**Fallback approach**: If finding the exact grid closing is hard, locate the LAST `</div>` of the LAST project card by reading the file in chunks. The bento grid pattern is consistent — each card ends with `</div>` (closes the inner padding div), then `</div>` (closes the outer card div). The grid itself closes after the last card with another `</div>`.

- [ ] **Step 6.4: Verify card and filter inserted**

Use Grep on `projects.html` for:
- `data-filter="local-llm"` — should find 1 match
- `data-category="ai-agent local-llm"` — should find 1 match
- `case-study-genworld-ollama.html` — should find 1+ matches

- [ ] **Step 6.5: Commit**

```bash
cd /c/sourcetree/portfolio && git add projects.html && git commit -m "feat(projects): add GenWorld + Ollama card + 'Local LLM' filter

새 'Local LLM' 필터 버튼 추가. GenWorld + Ollama 카드 1개 추가
(data-category='ai-agent local-llm'). 기존 카드 변경 없음.
필터 JS 변경 없음 (data-category 기반).

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Task 7: cover-letter.html — Add Gen paragraph in section #2

**Goal**: 섹션 #2 ("AI Agent를 개발 도구 자체로 활용") 안의 기존 단락 뒤에 Gen 관련 새 단락 1개 추가.

**Files**:
- Modify: `C:\sourcetree\portfolio\cover-letter.html`

- [ ] **Step 7.1: Insert new paragraph at end of section #2's content div**

Use Edit tool. `old_string`:
```
            저는 <strong>AI Agent를 개발 도구 자체로 활용</strong>하는 것입니다. VR 로봇 원격 조종 프로젝트에서 저는 AI 협업을 두 단계로 나누어 실행했습니다. 먼저 엑스포 전시 프로젝트에서는 Quest 3 컨트롤러 좌표를 EMA 필터로 안정화하고 Flask API를 통해 RoboDK에 전달하는 전체 파이프라인, 4-스레드 UDP 실시간 브릿지, 안전 로직까지를 <strong>Claude Code AI Agent 활용으로 단독 구현</strong>하여 <strong>실제 Doosan A0912 산업용 로봇을 조종하고 2025 해양 모빌리티 안전 엑스포에서 전시를 성공</strong>시켰습니다. 이 프로젝트에서는 RoboDK Python API에 IK 해석을 위임했습니다. 그 다음 단계로, <strong>RoboDK 의존 없이 IK 알고리즘 자체부터 전체를 AI Agent 활용으로 단독 구현</strong>하는 R&amp;D 프로젝트를 진행했습니다. Jacobian 기반 6DOF IK 솔버, 관절별 Weight Override, 특이점 감지, 모션 녹화·재생 Teaching 시스템까지 수학적 제약과 실시간 통신 아키텍처를 AI에게 정확히 전달하여 산업용 수준의 코드를 구축했습니다. 같은 전시에서 Arduino·라즈베리파이·센서 기반의 실물 로봇 연동 콘텐츠도 담당하여, 물리 시뮬레이션 영상 출력과 실물 동작 간 오차를 0.2초 이내로 맞추고, 시나리오/동작 기반 모듈화 구조와 런타임 상태 모니터링 도구까지 구현했습니다. 디지털트윈 에디터(DXCenter) 프로젝트에서는 <strong>Claude Code 3개 CLI를 감독관·개발자·고객저작자 페르소나로 분리 운용</strong>하는 멀티 페르소나 방법론으로 9개 커스텀 EditorWindow + 5가지 아키텍처 패턴 + 43개 C# 파일을 체계적으로 구현했습니다. 이는 10년간의 도메인 지식으로 AI에게 정확한 기술 제약과 아키텍처를 전달할 수 있기에 가능한 방식이며, 단순한 코드 생성이 아닌 <strong>AI Agent를 설계·통제하는 시니어 레벨의 역량</strong>이라고 생각합니다.
          </p>
        </div>
```
`new_string`:
```
            저는 <strong>AI Agent를 개발 도구 자체로 활용</strong>하는 것입니다. VR 로봇 원격 조종 프로젝트에서 저는 AI 협업을 두 단계로 나누어 실행했습니다. 먼저 엑스포 전시 프로젝트에서는 Quest 3 컨트롤러 좌표를 EMA 필터로 안정화하고 Flask API를 통해 RoboDK에 전달하는 전체 파이프라인, 4-스레드 UDP 실시간 브릿지, 안전 로직까지를 <strong>Claude Code AI Agent 활용으로 단독 구현</strong>하여 <strong>실제 Doosan A0912 산업용 로봇을 조종하고 2025 해양 모빌리티 안전 엑스포에서 전시를 성공</strong>시켰습니다. 이 프로젝트에서는 RoboDK Python API에 IK 해석을 위임했습니다. 그 다음 단계로, <strong>RoboDK 의존 없이 IK 알고리즘 자체부터 전체를 AI Agent 활용으로 단독 구현</strong>하는 R&amp;D 프로젝트를 진행했습니다. Jacobian 기반 6DOF IK 솔버, 관절별 Weight Override, 특이점 감지, 모션 녹화·재생 Teaching 시스템까지 수학적 제약과 실시간 통신 아키텍처를 AI에게 정확히 전달하여 산업용 수준의 코드를 구축했습니다. 같은 전시에서 Arduino·라즈베리파이·센서 기반의 실물 로봇 연동 콘텐츠도 담당하여, 물리 시뮬레이션 영상 출력과 실물 동작 간 오차를 0.2초 이내로 맞추고, 시나리오/동작 기반 모듈화 구조와 런타임 상태 모니터링 도구까지 구현했습니다. 디지털트윈 에디터(DXCenter) 프로젝트에서는 <strong>Claude Code 3개 CLI를 감독관·개발자·고객저작자 페르소나로 분리 운용</strong>하는 멀티 페르소나 방법론으로 9개 커스텀 EditorWindow + 5가지 아키텍처 패턴 + 43개 C# 파일을 체계적으로 구현했습니다. 이는 10년간의 도메인 지식으로 AI에게 정확한 기술 제약과 아키텍처를 전달할 수 있기에 가능한 방식이며, 단순한 코드 생성이 아닌 <strong>AI Agent를 설계·통제하는 시니어 레벨의 역량</strong>이라고 생각합니다.
          </p>
          <p>
            같은 멀티 페르소나 방법론을 산업 외 영역까지 확장한 사례로, <strong>GenWorld(Phaser 3 TS RPG의 Unity 2D 포팅)</strong> 프로젝트를 4개 CLI 페르소나(Director / Dev-Backend / Dev-Frontend / Asset+QA)로 진행하면서, 게임 런타임에는 <strong>로컬 Ollama LLM(gemma3)</strong> 기반 NPC 인지·대화 시스템을 직접 설계·구현했습니다. 클라우드 API 의존 없이 오프라인 우선 + graceful fallback 구조로, 산업 환경의 보안·비용 제약에서도 동일 패턴 적용 가능함을 검증했습니다. 자세한 기술 내용은 <a class="text-primary hover:underline" href="case-study-genworld-ollama.html">Case Study 04</a> 참조.
          </p>
        </div>
```

- [ ] **Step 7.2: Verify**

Use Grep on `cover-letter.html` for `GenWorld(Phaser 3 TS RPG` — should find 1 match.
Use Grep for `case-study-genworld-ollama.html` — should find 1 match.

- [ ] **Step 7.3: Commit**

```bash
cd /c/sourcetree/portfolio && git add cover-letter.html && git commit -m "feat(cover-letter): add GenWorld + Ollama paragraph in AI section #2

섹션 #2 'AI Agent를 개발 도구 자체로 활용' 끝에 GenWorld 사례 단락
추가. 4 CLI 멀티 페르소나 + 로컬 Ollama LLM. case study 04 링크.

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Task 8: resume.html — Add R&D Side Project entry

**Goal**: resume.html 의 OSS & Awards 섹션(`#oss`) 안에 GenWorld R&D 항목 추가. 기존 카드 디자인 패턴 따름.

**Files**:
- Modify: `C:\sourcetree\portfolio\resume.html`

- [ ] **Step 8.1: Read OSS section to find insertion point**

Use Read tool on `C:\sourcetree\portfolio\resume.html` (offset 720, limit 80) to see the OSS section structure and find a good insertion point. The section has `id="oss"` at line 726 with `glass-card` styling.

Note the existing pattern of OSS items (heading style, content layout). The new R&D entry should follow the same pattern.

- [ ] **Step 8.2: Add R&D · Side Project entry**

The exact insertion location depends on the file structure read in Step 8.1. The general approach:

Find the closing of the last existing OSS item or the section's end. Use Edit tool with old_string capturing the last OSS item's closing structure + section close, and new_string adding the new entry before the closing.

The new entry HTML (adapt to match existing style after reading the file):

```html
            <div class="mb-6">
              <div class="flex items-center gap-3 mb-2">
                <span class="material-symbols-outlined text-primary text-xl">science</span>
                <h6 class="font-headline text-base font-bold text-on-surface">GenWorld + Ollama <span class="text-xs text-slate-500 font-label uppercase tracking-widest">R&amp;D · Side Project · 2026</span></h6>
              </div>
              <ul class="text-sm text-on-surface-variant space-y-1 ml-8 list-disc">
                <li>Phaser 3 TS RPG (testgame2) → Unity 2D C# 포팅</li>
                <li>로컬 Ollama LLM (gemma3:4b/12b) 기반 NPC 인지·대화 시스템</li>
                <li>NPCBrain (mood·relationship·memory·triggers) + JSON 구조화 응답</li>
                <li>4 CLI 멀티 페르소나 orchestration 으로 진행</li>
                <li>Stack: Unity 6 · C# · Ollama · Newtonsoft.Json</li>
                <li>GitHub: <a class="text-primary hover:underline" href="https://github.com/darkhtk/game-GenWorld" target="_blank" rel="noopener noreferrer">github.com/darkhtk/game-GenWorld</a></li>
                <li><a class="text-primary hover:underline" href="case-study-genworld-ollama.html">Case Study →</a></li>
              </ul>
            </div>
```

**Adapt the HTML** to match the OSS section's existing styling — class names like `glass-card`, `font-headline`, heading levels (`h5`/`h6`), spacing all should match neighboring OSS entries. Read carefully and follow patterns.

- [ ] **Step 8.3: Verify**

Use Grep on `resume.html` for `GenWorld + Ollama` — should find 1 match.
Use Grep for `case-study-genworld-ollama.html` — should find 1 match.

- [ ] **Step 8.4: Commit**

```bash
cd /c/sourcetree/portfolio && git add resume.html && git commit -m "feat(resume): add GenWorld + Ollama R&D side project entry

OSS & Awards 섹션 안에 GenWorld R&D 항목 추가. Phaser → Unity 포팅,
로컬 Ollama LLM, NPCBrain, 4 CLI orchestration. case study 링크.

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Task 9: README.md — Add new case study to Pages list

**Goal**: README.md 의 `## Pages` 섹션에 case-study-genworld-ollama 1줄 추가.

**Files**:
- Modify: `C:\sourcetree\portfolio\README.md`

- [ ] **Step 9.1: Add new line to Pages section**

Use Edit tool. `old_string`:
```
- `case-study-orchestration-ts.html` — Multi-Agent Orchestration Framework (v1 → v2)
- `about.html` — About + Tech Ecosystem
```
`new_string`:
```
- `case-study-orchestration-ts.html` — Multi-Agent Orchestration Framework (v1 → v2)
- `case-study-genworld-ollama.html` — GenWorld · Local Ollama LLM 기반 NPC 인지 시스템 (R&D)
- `about.html` — About + Tech Ecosystem
```

- [ ] **Step 9.2: Verify**

Use Grep on `README.md` for `case-study-genworld-ollama` — should find 1 match.

- [ ] **Step 9.3: Commit**

```bash
cd /c/sourcetree/portfolio && git add README.md && git commit -m "docs(readme): add GenWorld + Ollama case study to Pages list

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Task 10: case-study-vr-robot.html — Add cross-reference card

**Goal**: vr-robot 의 하단 cross-reference 그리드 (line ~537-554) 에 GenWorld 카드 1개 추가. 기존 grid-cols-2 → grid-cols-3 변경.

**Files**:
- Modify: `C:\sourcetree\portfolio\case-study-vr-robot.html`

- [ ] **Step 10.1: Update grid layout + add Gen card**

Use Edit tool. `old_string`:
```
    <h3 class="font-headline text-2xl font-bold text-center mb-8">Other Case Studies</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <a href="case-study-dxcenter.html" class="p-8 bg-surface-container-low hover:bg-surface-container-highest rounded-xl transition-all group">
        <div class="font-label text-xs text-primary uppercase tracking-widest mb-2">Case Study 02</div>
        <h4 class="text-2xl font-headline font-bold mb-3">DXCenter — LG에너지솔루션</h4>
        <p class="text-sm text-on-surface-variant mb-4">9 EditorWindow + 5 패턴 + 멀티 페르소나 AI 협업</p>
        <span class="text-primary text-xs font-label uppercase tracking-widest group-hover:underline">자세히 →</span>
      </a>
      <a href="case-study-orchestration-ts.html" class="p-8 bg-surface-container-low hover:bg-surface-container-highest rounded-xl transition-all group">
        <div class="font-label text-xs text-primary uppercase tracking-widest mb-2">Open Source · Self-Built</div>
        <h4 class="text-2xl font-headline font-bold mb-3">Multi-Agent Orchestration Framework</h4>
        <p class="text-sm text-on-surface-variant mb-4">본인 AI 협업 방법론을 framework로 추출. 산업 프로젝트의 메타 베이스</p>
        <span class="text-primary text-xs font-label uppercase tracking-widest group-hover:underline">자세히 →</span>
      </a>
    </div>
```
`new_string`:
```
    <h3 class="font-headline text-2xl font-bold text-center mb-8">Other Case Studies</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <a href="case-study-dxcenter.html" class="p-8 bg-surface-container-low hover:bg-surface-container-highest rounded-xl transition-all group">
        <div class="font-label text-xs text-primary uppercase tracking-widest mb-2">Case Study 02</div>
        <h4 class="text-2xl font-headline font-bold mb-3">DXCenter — LG에너지솔루션</h4>
        <p class="text-sm text-on-surface-variant mb-4">9 EditorWindow + 5 패턴 + 멀티 페르소나 AI 협업</p>
        <span class="text-primary text-xs font-label uppercase tracking-widest group-hover:underline">자세히 →</span>
      </a>
      <a href="case-study-orchestration-ts.html" class="p-8 bg-surface-container-low hover:bg-surface-container-highest rounded-xl transition-all group">
        <div class="font-label text-xs text-primary uppercase tracking-widest mb-2">Open Source · Self-Built</div>
        <h4 class="text-2xl font-headline font-bold mb-3">Multi-Agent Orchestration Framework</h4>
        <p class="text-sm text-on-surface-variant mb-4">본인 AI 협업 방법론을 framework로 추출. 산업 프로젝트의 메타 베이스</p>
        <span class="text-primary text-xs font-label uppercase tracking-widest group-hover:underline">자세히 →</span>
      </a>
      <a href="case-study-genworld-ollama.html" class="p-8 bg-surface-container-low hover:bg-surface-container-highest rounded-xl transition-all group">
        <div class="font-label text-xs text-primary uppercase tracking-widest mb-2">Case Study 04 · R&amp;D</div>
        <h4 class="text-2xl font-headline font-bold mb-3">GenWorld + Ollama</h4>
        <p class="text-sm text-on-surface-variant mb-4">Phaser 3 TS RPG → Unity 2D + 로컬 LLM 기반 NPC 인지 시스템</p>
        <span class="text-primary text-xs font-label uppercase tracking-widest group-hover:underline">자세히 →</span>
      </a>
    </div>
```

- [ ] **Step 10.2: Verify**

Use Grep on `case-study-vr-robot.html` for `case-study-genworld-ollama.html` — should find 1 match.
Use Grep for `lg:grid-cols-3` — should find 1+ matches (the cross-ref grid).

- [ ] **Step 10.3: Commit**

```bash
cd /c/sourcetree/portfolio && git add case-study-vr-robot.html && git commit -m "feat(case-study-vr-robot): add GenWorld + Ollama cross-reference

하단 cross-reference 그리드에 GenWorld + Ollama 카드 1개 추가.
md:grid-cols-2 → md:grid-cols-2 lg:grid-cols-3 (3 카드 노출).

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Task 11: case-study-dxcenter.html — Add cross-reference card

**Goal**: dxcenter 의 하단 cross-reference 그리드 (line ~456) 에 GenWorld 카드 1개 추가.

**Files**:
- Modify: `C:\sourcetree\portfolio\case-study-dxcenter.html`

- [ ] **Step 11.1: Read cross-reference section**

Use Read tool on `C:\sourcetree\portfolio\case-study-dxcenter.html` (offset 454, limit 25) to see the existing cross-ref structure (line ~456-473).

- [ ] **Step 11.2: Add GenWorld cross-reference card + grid update**

Use Edit tool. The exact `old_string` depends on what was found in Step 11.1, but should be the existing cross-ref grid with 2 cards. Pattern (verify with read):

`old_string`:
```
    <h3 class="font-headline text-2xl font-bold text-center mb-8">Other Case Studies</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <a href="case-study-vr-robot.html" class="p-8 bg-surface-container-low hover:bg-surface-container-highest rounded-xl transition-all group">
```
`new_string`:
```
    <h3 class="font-headline text-2xl font-bold text-center mb-8">Other Case Studies</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <a href="case-study-vr-robot.html" class="p-8 bg-surface-container-low hover:bg-surface-container-highest rounded-xl transition-all group">
```

Then a SECOND Edit to insert the GenWorld card before the closing `</div>` of the grid. Use Edit with `old_string` matching the orchestration-ts card's closing `</a>` followed by `    </div>` (the grid's closing).

Likely orchestration-ts card closing pattern (verify with Read):

`old_string`:
```
      <a href="case-study-orchestration-ts.html" class="p-8 bg-surface-container-low hover:bg-surface-container-highest rounded-xl transition-all group">
        <div class="font-label text-xs text-primary uppercase tracking-widest mb-2">Open Source · Self-Built</div>
        <h4 class="text-2xl font-headline font-bold mb-3">Multi-Agent Orchestration Framework</h4>
        <p class="text-sm text-on-surface-variant mb-4">본인 AI 협업 방법론을 framework로 추출. 산업 프로젝트의 메타 베이스</p>
        <span class="text-primary text-xs font-label uppercase tracking-widest group-hover:underline">자세히 →</span>
      </a>
    </div>
```

If the actual content differs (different summary text), use Read to find the exact text and use that as `old_string`.

`new_string`:
```
      <a href="case-study-orchestration-ts.html" class="p-8 bg-surface-container-low hover:bg-surface-container-highest rounded-xl transition-all group">
        <div class="font-label text-xs text-primary uppercase tracking-widest mb-2">Open Source · Self-Built</div>
        <h4 class="text-2xl font-headline font-bold mb-3">Multi-Agent Orchestration Framework</h4>
        <p class="text-sm text-on-surface-variant mb-4">본인 AI 협업 방법론을 framework로 추출. 산업 프로젝트의 메타 베이스</p>
        <span class="text-primary text-xs font-label uppercase tracking-widest group-hover:underline">자세히 →</span>
      </a>
      <a href="case-study-genworld-ollama.html" class="p-8 bg-surface-container-low hover:bg-surface-container-highest rounded-xl transition-all group">
        <div class="font-label text-xs text-primary uppercase tracking-widest mb-2">Case Study 04 · R&amp;D</div>
        <h4 class="text-2xl font-headline font-bold mb-3">GenWorld + Ollama</h4>
        <p class="text-sm text-on-surface-variant mb-4">Phaser 3 TS RPG → Unity 2D + 로컬 LLM 기반 NPC 인지 시스템</p>
        <span class="text-primary text-xs font-label uppercase tracking-widest group-hover:underline">자세히 →</span>
      </a>
    </div>
```

If the orchestration-ts card text differs from above, USE THE ACTUAL TEXT FROM THE FILE (read first), but keep the GenWorld card additions identical.

- [ ] **Step 11.3: Verify**

Use Grep on `case-study-dxcenter.html` for `case-study-genworld-ollama.html` — should find 1 match.
Use Grep for `lg:grid-cols-3` — should find 1 match.

- [ ] **Step 11.4: Commit**

```bash
cd /c/sourcetree/portfolio && git add case-study-dxcenter.html && git commit -m "feat(case-study-dxcenter): add GenWorld + Ollama cross-reference

하단 cross-reference 그리드에 GenWorld + Ollama 카드 1개 추가.
md:grid-cols-2 → md:grid-cols-2 lg:grid-cols-3.

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Task 12: case-study-orchestration-ts.html — Add cross-references (top + bottom)

**Goal**: orchestration-ts 의 두 곳 업데이트 — 상단 meta-base intro 의 텍스트 링크 목록 (line ~155-156) + 하단 cross-reference 그리드 (line ~871).

**Files**:
- Modify: `C:\sourcetree\portfolio\case-study-orchestration-ts.html`

- [ ] **Step 12.1: Add GenWorld text link to top meta-base intro**

Use Edit tool. `old_string`:
```
        <a href="case-study-vr-robot.html" class="text-xs text-primary hover:underline font-label uppercase tracking-widest">→ VR 로봇 케이스 보기</a>
        <a href="case-study-dxcenter.html" class="text-xs text-primary hover:underline font-label uppercase tracking-widest">→ DXCenter 케이스 보기</a>
        <a href="projects.html" class="text-xs text-primary hover:underline font-label uppercase tracking-widest">→ 모든 산업 프로젝트</a>
```
`new_string`:
```
        <a href="case-study-vr-robot.html" class="text-xs text-primary hover:underline font-label uppercase tracking-widest">→ VR 로봇 케이스 보기</a>
        <a href="case-study-dxcenter.html" class="text-xs text-primary hover:underline font-label uppercase tracking-widest">→ DXCenter 케이스 보기</a>
        <a href="case-study-genworld-ollama.html" class="text-xs text-primary hover:underline font-label uppercase tracking-widest">→ GenWorld + Ollama (R&amp;D)</a>
        <a href="projects.html" class="text-xs text-primary hover:underline font-label uppercase tracking-widest">→ 모든 산업 프로젝트</a>
```

- [ ] **Step 12.2: Update bottom cross-reference grid**

Use Edit tool. `old_string`:
```
    <h3 class="font-headline text-2xl font-bold text-center mb-8">Other Case Studies</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <a href="case-study-vr-robot.html" class="p-8 bg-surface-container-low hover:bg-surface-container-highest rounded-xl transition-all group">
        <div class="font-label text-xs text-primary uppercase tracking-widest mb-2">Case Study 01</div>
        <h4 class="text-2xl font-headline font-bold mb-3">VR 로봇 원격 조종 + 자체 IK 솔버</h4>
        <p class="text-sm text-on-surface-variant mb-4">이 framework를 메타 베이스로 활용한 첫 산업 프로젝트 — 엑스포 시연 성공</p>
        <span class="text-primary text-xs font-label uppercase tracking-widest group-hover:underline">자세히 →</span>
      </a>
      <a href="case-study-dxcenter.html" class="p-8 bg-surface-container-low hover:bg-surface-container-highest rounded-xl transition-all group">
        <div class="font-label text-xs text-primary uppercase tracking-widest mb-2">Case Study 02</div>
        <h4 class="text-2xl font-headline font-bold mb-3">DXCenter — LG에너지솔루션</h4>
        <p class="text-sm text-on-surface-variant mb-4">3 CLI 멀티 페르소나 운용으로 43개 C# 파일 단독 구현</p>
        <span class="text-primary text-xs font-label uppercase tracking-widest group-hover:underline">자세히 →</span>
      </a>
    </div>
```
`new_string`:
```
    <h3 class="font-headline text-2xl font-bold text-center mb-8">Other Case Studies</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <a href="case-study-vr-robot.html" class="p-8 bg-surface-container-low hover:bg-surface-container-highest rounded-xl transition-all group">
        <div class="font-label text-xs text-primary uppercase tracking-widest mb-2">Case Study 01</div>
        <h4 class="text-2xl font-headline font-bold mb-3">VR 로봇 원격 조종 + 자체 IK 솔버</h4>
        <p class="text-sm text-on-surface-variant mb-4">이 framework를 메타 베이스로 활용한 첫 산업 프로젝트 — 엑스포 시연 성공</p>
        <span class="text-primary text-xs font-label uppercase tracking-widest group-hover:underline">자세히 →</span>
      </a>
      <a href="case-study-dxcenter.html" class="p-8 bg-surface-container-low hover:bg-surface-container-highest rounded-xl transition-all group">
        <div class="font-label text-xs text-primary uppercase tracking-widest mb-2">Case Study 02</div>
        <h4 class="text-2xl font-headline font-bold mb-3">DXCenter — LG에너지솔루션</h4>
        <p class="text-sm text-on-surface-variant mb-4">3 CLI 멀티 페르소나 운용으로 43개 C# 파일 단독 구현</p>
        <span class="text-primary text-xs font-label uppercase tracking-widest group-hover:underline">자세히 →</span>
      </a>
      <a href="case-study-genworld-ollama.html" class="p-8 bg-surface-container-low hover:bg-surface-container-highest rounded-xl transition-all group">
        <div class="font-label text-xs text-primary uppercase tracking-widest mb-2">Case Study 04 · R&amp;D</div>
        <h4 class="text-2xl font-headline font-bold mb-3">GenWorld + Ollama</h4>
        <p class="text-sm text-on-surface-variant mb-4">Phaser 3 TS RPG → Unity 2D + 로컬 LLM 기반 NPC 인지 시스템</p>
        <span class="text-primary text-xs font-label uppercase tracking-widest group-hover:underline">자세히 →</span>
      </a>
    </div>
```

- [ ] **Step 12.3: Verify**

Use Grep on `case-study-orchestration-ts.html` for `case-study-genworld-ollama.html` — should find 2 matches (one in top text link, one in bottom card).
Use Grep for `lg:grid-cols-3` — should find 1 match (bottom cross-ref grid).

- [ ] **Step 12.4: Commit**

```bash
cd /c/sourcetree/portfolio && git add case-study-orchestration-ts.html && git commit -m "feat(case-study-orchestration-ts): add GenWorld + Ollama cross-references

상단 meta-base intro 텍스트 링크 + 하단 cross-reference 그리드 카드.
md:grid-cols-2 → md:grid-cols-2 lg:grid-cols-3.

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Task 13: User Verification Checkpoint — 통합 후 전체 검증

**Goal**: 8개 파일 변경 후 사용자 검증.

- [ ] **Step 13.1: Run final git status**

Run:
```bash
cd /c/sourcetree/portfolio && git status && git log --oneline genworld-ollama-case-study ^main 2>/dev/null || git log --oneline -15
```

Expected: working tree clean. 12+ commits on `genworld-ollama-case-study` branch (4 case study creation + 7 integration + spec docs).

- [ ] **Step 13.2: Pause and request user review**

Stop and ask user:

> "통합 작업 완료 (Task 6-12). 8개 파일 변경 commit 됨. 브라우저에서 다음 확인 부탁드립니다:
> 1. **projects.html**: 'Local LLM' 필터 클릭 → GenWorld 카드만 노출. 'AI Agent' 필터 → GenWorld 도 포함. '전체' → 모든 카드.
> 2. **cover-letter.html**: 섹션 #2 (AI Agent를 개발 도구) 끝에 GenWorld 단락 추가. case study 04 링크 클릭 동작.
> 3. **resume.html**: OSS & Awards 섹션에 GenWorld R&D 항목 표시.
> 4. **README.md**: GitHub 에서 보면 Pages 목록에 새 줄 추가됨 (로컬 확인은 markdown viewer).
> 5. **case-study-vr-robot / dxcenter / orchestration-ts**: 각 페이지 하단 'Other Case Studies' 그리드에 GenWorld 카드 추가됨. 클릭 → 새 case study 이동.
> 6. **모바일 360px**: 모든 페이지 가로 스크롤 없음, 회귀 0.
> 7. **데스크톱 1280px**: 모든 페이지 회귀 0.
>
> 이슈 있으면 페이지/현상 알려주세요. 없으면 'OK'."

- [ ] **Step 13.3: Wait for user response**

If issues → fix inline → re-verify. If OK → proceed to Task 14.

---

## Task 14: Push & Merge

**Goal**: feature branch → main fast-forward → origin push. GitHub Pages 자동 배포 트리거.

**Files**: 없음 (git operations).

- [ ] **Step 14.1: Push feature branch**

Run:
```bash
cd /c/sourcetree/portfolio && git push -u origin genworld-ollama-case-study
```

Expected: branch가 origin에 push됨. GitHub PR 생성 URL 안내 메시지.

- [ ] **Step 14.2: Switch to main and fast-forward merge**

Run:
```bash
cd /c/sourcetree/portfolio && git checkout main && git merge --ff-only genworld-ollama-case-study
```

Expected: `Updating XXXX..YYYY` followed by Fast-forward + 변경 파일 목록.

- [ ] **Step 14.3: Push main**

Run:
```bash
cd /c/sourcetree/portfolio && git push origin main
```

Expected: `XXXX..YYYY  main -> main`. GitHub Pages 자동 배포 (1-2분 후 적용).

- [ ] **Step 14.4: Final verification**

Run:
```bash
cd /c/sourcetree/portfolio && git log --oneline -15 && git status && git branch -a
```

Expected:
- 새 commits이 main 에 모두 적용됨
- working tree clean
- main 이 origin/main 과 동기화됨
- feature branch 보존됨 (필요 시 삭제 가능)

- [ ] **Step 14.5: Report to user**

Report to user:

> "전체 작업 완료. 8 파일 변경, 12+ commits, main push 완료. GitHub Pages 자동 배포 진행 중. 1-2분 후 https://darkhtk.github.io/portfolio/case-study-genworld-ollama.html 로 접속 가능."

---

## Self-Review Checklist (Plan-time)

이 plan을 spec과 비교했을 때:

| Spec 요구사항 | 이 plan에서 구현되는 task |
|---|---|
| Goal: GenWorld + Ollama R&D 사례 추가 | Task 1-4 (case study) + Task 6-12 (통합) |
| Spec § 2 In Scope: case-study-genworld-ollama.html 신규 | Task 1-4 |
| Spec § 2 In Scope: projects.html 카드 + 필터 | Task 6 |
| Spec § 2 In Scope: cover-letter.html 단락 | Task 7 |
| Spec § 2 In Scope: resume.html 항목 | Task 8 |
| Spec § 2 In Scope: README.md Pages | Task 9 |
| Spec § 2 In Scope: 3개 case study cross-ref | Task 10, 11, 12 |
| Spec § 4.2 Hero (R&D 배지, 통계 4칸) | Task 1.1 |
| Spec § 4.3 § 1 The Challenge | Task 2.1 |
| Spec § 4.4 § 2 Local LLM Operation (코드 스니펫 1) | Task 2.1 |
| Spec § 4.5 § 3 NPC Cognition (코드 스니펫 2 + ASCII) | Task 3.1 |
| Spec § 4.6 § 4 Port + AI Augmentation | Task 3.1 |
| Spec § 4.7 § 5 Result | Task 4.1 |
| Spec § 4.8 § 6 Cross-Reference | Task 4.1 |
| Spec § 4.9 § 7 CTA | Task 4.1 |
| Spec § 5 projects.html 'local-llm' filter | Task 6.2 |
| Spec § 5 projects.html data-category="ai-agent local-llm" | Task 6.3 |
| Spec § 9.5 grid-cols-2 → grid-cols-3 | Task 10.1, 11.2, 12.2 |
| Spec § 11 Verification Phase 2 (단독) | Task 5 |
| Spec § 11 Verification Phase 4 (통합) | Task 13 |
| Spec § 10 Phase 5 Push & Merge | Task 14 |

**커버리지 OK**. 모든 spec 요구사항이 task로 매핑됨.

**Type/method 일관성**:
- SNIPPET A/B/C 의 ID (`mobile-menu-toggle`, `mobile-menu-close`, `mobile-menu`) 일관됨
- JS 함수 (`openMenu`, `closeMenu`) 일관됨
- 카드 클래스 (`p-8 bg-surface-container-low`) 일관됨
- 케이스 스터디 라벨 (`Case Study 04 · R&D`) 일관됨

**Placeholder 검사**: 본 plan에는 TBD/TODO 없음. 각 step에 구체 코드 또는 명령 포함. 단, Task 6.3, Task 8.2, Task 11.2 은 "기존 파일 read 후 결정" 부분이 있어 implementer subagent 가 read 후 정확한 위치를 잡아야 함. 이는 placeholder 가 아니라 적응형 instruction.
