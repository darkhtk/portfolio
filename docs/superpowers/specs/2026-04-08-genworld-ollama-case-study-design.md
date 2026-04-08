# GenWorld + Ollama Case Study — Design Spec

- **Date**: 2026-04-08
- **Author**: 홍대기 (with Claude Code)
- **Status**: Draft → Awaiting user review

## 1. Goal

`darkhtk/portfolio` 사이트에 `GenWorld + Ollama` 프로젝트를 R&D · 자사 기술 실증 사례로 추가. 새 case study 페이지 1개를 신규 작성하고, 기존 7개 페이지(`projects.html`, `cover-letter.html`, `resume.html`, `README.md`, 기존 3개 case study)를 통합 업데이트하여 산업 외 환경에서도 동일한 시니어 레벨 AI Agent 활용 패턴이 작동함을 보여준다.

핵심 동기:

- Gen 프로젝트의 **로컬 Ollama LLM 운영** + **NPC 인지 아키텍처** + **Phaser TS → Unity 2D 포팅** 세 가지 각도가 모두 portfolio에 가치를 더함.
- 기존 3개 case study(VR Robot, DXCenter, Orchestration Framework)는 모두 산업 배포·외부 검증 사례. Gen은 **R&D / 기술 실증** 톤으로 산업 외 환경 확장 가능성을 입증.
- cover-letter "AI Agent를 개발 도구 자체로 활용" 섹션에 자연스러운 확장 사례 추가.
- 클라우드 5종 API 통합('너'스탤지아) 다음 단계로 **온디바이스 로컬 LLM** 사례 추가 → AI 통합 폭의 확장.

## 2. Scope

**In scope**:
- 신규 작성: `case-study-genworld-ollama.html` (~600줄, 기존 case study와 동등 구조)
- 수정: `projects.html` (카드 1개 + 'local-llm' 필터 1개 추가)
- 수정: `cover-letter.html` (AI Agent 섹션에 단락 1개 추가)
- 수정: `resume.html` (R&D / Side Project 항목 1개 추가)
- 수정: `README.md` (Pages 목록에 1줄 추가)
- 수정: `case-study-vr-robot.html` (cross-reference 카드 1개 추가)
- 수정: `case-study-dxcenter.html` (cross-reference 카드 1개 추가)
- 수정: `case-study-orchestration-ts.html` (상단 + 하단 cross-reference 카드 추가)

**Out of scope**:
- Gen 프로젝트 자체 코드 수정 (case study에서 read-only로 인용만)
- 새 nav 메뉴 항목 추가 (case studies는 PROJECTS 하위)
- 새 이미지/스크린샷 자산 추가 (없으면 그라데이션 + 아이콘으로 대체)
- bento grid 전체 재배치
- 필터 JavaScript 로직 변경 (data-category 기반이라 자동 동작)
- Gen 프로젝트 이슈 수정 (예: SPEC-S-078 — 그대로 인용만)

## 3. Architecture & Constraints

| 항목 | 결정 |
|---|---|
| 호스팅 | GitHub Pages 정적 (변경 없음) |
| CSS | Tailwind CSS CDN — 이미 로드, 변경 없음 |
| JS | Vanilla JS, 모바일 nav 토글 IIFE 재사용 |
| Nav 패턴 | Pattern B (Connect 데스크톱 nav 안에) — 기존 3개 case study와 동일 |
| 모바일 패턴 | 이전 mobile-redesign 작업의 토큰 T1/T2/T3 + 햄버거 컴포넌트 처음부터 적용 |
| Active 링크 | overlay 안 PROJECTS (case study는 projects 하위) |
| 코드 블록 스타일 | `case-study-orchestration-ts.html` 의 `.code-block` CSS 패턴 + 모바일 미디어쿼리 |
| 다이어그램 | ASCII 박스/화살표 (기존 vr-robot 패턴) |
| 색상 토큰 | 기존 design system (primary, surface, on-surface 등) 재사용 |

### Target Viewports
| Viewport | 폭 | 우선순위 |
|---|---|---|
| Galaxy S20 | 360px | 1차 |
| iPhone 14 Pro | 390px | 1차 |
| iPad | 768px | 2차 |
| Desktop | 1280px | 회귀 검증 |

### 파일명 결정
**선택**: `case-study-genworld-ollama.html`
- **Why**: GenWorld는 프로젝트명, Ollama는 핵심 기술. 검색/기억 모두 유리.
- **대안**: `case-study-genworld-ai.html` (Ollama 키워드 손실로 기각)

## 4. Case Study Page Structure

### 4.1 페이지 흐름

```
1. <head> — 메타/Tailwind/style block (보일러플레이트)
2. nav (Pattern B + 모바일 햄버거 + overlay)
3. <main class="pt-24">
   ├─ Hero Section
   ├─ § 1. The Challenge — "왜 로컬 LLM인가"
   ├─ § 2. Local LLM Operation
   ├─ § 3. NPC Cognitive Architecture
   ├─ § 4. Phaser TS → Unity 2D Port + AI Augmentation
   ├─ § 5. Result & Verification
   ├─ § 6. Cross-Reference (Related Case Studies)
   └─ § 7. CTA — GitHub 저장소 + Projects 페이지로
4. <footer>
5. <script> — 모바일 메뉴 IIFE
```

### 4.2 Hero Section 명세

- **카테고리 라벨**: `Case Study 04`
- **R&D 배지**: 기존 "Live · 재직 중" 패턴 자리에 "R&D · Tech Validation · Side Project" 배지 (`primary-fixed/15` 배경 + Material Symbol 아이콘 `science`)
- **H1**: `GenWorld + Ollama` (gradient 색상은 기존 H1 패턴)
- **부제**: `Phaser 3 TS RPG → Unity 2D + Local LLM NPC Cognition` (text-3xl text-slate-400)
- **요약 단락**: 2-3 문장. 핵심 메시지: "Phaser 3 TypeScript RPG (testgame2)를 Unity 2D C#로 포팅하면서, 게임 런타임에 로컬 Ollama LLM(gemma3) 기반 NPC 인지·대화 시스템을 직접 설계·구현. 클라우드 API 의존 없이 오프라인 우선 + graceful fallback 구조."
- **통계 4칸** (`grid-cols-2 md:grid-cols-4` — 모바일 반응형 처음부터 적용):
  | 값 | 라벨 |
  |---|---|
  | `Local LLM` | Stack Core |
  | `gemma3 4B/12B` | Models (fast / large) |
  | `4 CLI` | Multi-Persona Dev |
  | `100%` | Offline Capable |

### 4.3 § 1 The Challenge — 왜 로컬 LLM

본문 ~3 단락:

1. **문제 제기**: 인디 게임에 LLM NPC 대화를 붙이려 할 때 클라우드 API의 3가지 한계 — 비용 (플레이어 1인당 분당 API 비용), 프라이버시 (게임 대화가 외부 서버 통과), 오프라인 동작 불가.
2. **로컬 LLM 선택 근거**: Ollama가 gemma3 같은 4B-12B 모델을 로컬에서 합리적인 응답 시간으로 실행. HTTP 인터페이스로 Unity에서 직접 호출 가능. 모델 교체 가능성 (사용자 환경에 따라).
3. **연결 메시지**: '너'스탤지아 프로젝트의 클라우드 5종 API 통합 다음 단계로, 동일한 "AI를 제품 파이프라인에 통합" 패턴을 **온디바이스 로컬 LLM** 환경으로 확장.

### 4.4 § 2 Local LLM Operation

본문 ~4 단락 + 코드 스니펫:

- **OllamaClient 구조**: `http://localhost:11434/api/generate` HTTP 클라이언트. fast(`gemma3:4b`) / large(`gemma3:12b`) 모델 지원.
- **가용성 체크 + warm-up**: 게임 시작 시 3s 가용성 체크 → 성공 시 fast 모델 warm-up (첫 응답 지연 제거).
- **타임아웃 + 재시도**: 30s `UnityWebRequest.timeout` + AIManager 단의 `CancellationTokenSource` 2회 재시도.
- **Graceful fallback**: Ollama 미가동 시 `BuildOfflineResponse()` 가 NPC mood/relationship 기반 템플릿 응답 생성. 게임 진행 끊김 없음.

**코드 스니펫 1** (OllamaClient.cs:67-95 인용, 5-10줄):
```csharp
public async Task<string> GenerateDialogue(string prompt, CancellationToken cancellationToken = default)
{
    var payload = new OllamaRequest
    {
        model = _fastModel,
        prompt = prompt,
        stream = false,
        format = "json",
        options = new OllamaOptions { temperature = 0.8f, top_p = 0.9f, repeat_penalty = 1.3f }
    };
    // ... UnityWebRequest POST + cancellationToken 처리
}
```

### 4.5 § 3 NPC Cognitive Architecture

본문 ~4 단락 + 코드 스니펫 + ASCII 다이어그램:

- **NPCBrain 구조**: per-NPC 상태 — id, name, personality, mood (Happy/Neutral/Angry/Scared), relationship (player 등 대상별 -100~+100), memory (최근 N개 대화 요약), wantToTalk 플래그, 트리거 발동 이력.
- **AIManager 오케스트레이션**: per-NPC brain 등록, 게임 매 프레임마다 한 NPC씩 순환하여 behavior 업데이트 (10s 주기). 관계도가 임계값 넘으면 wantToTalk 자동 트리거.
- **JSON 구조화 응답**: Ollama 에 `format=json` 옵션 + temperature 0.8 + top_p 0.9 + repeat_penalty 1.3 으로 자유도 + 일관성 균형. 응답 schema: `{ dialogue, options[], action, relationshipChange, newMemory, offerQuest }`.
- **Save/load 지원**: `SerializeAllBrains()` / `RestoreAllBrains()` 로 NPC 인지 상태 영구화.

**코드 스니펫 2** (AIManager.cs:42-82 인용 일부, 8-12줄):
```csharp
public void UpdateBehavior(string playerRegion, float playerX, float playerY,
    Dictionary<string, Vector2> npcPositions)
{
    // 10s 주기로 NPC 1명씩 순환하여 mood/wantToTalk 갱신
    int rel = brain.GetRelationship("player");
    if (rel >= 10) brain.CurrentMood = Mood.Happy;
    else if (rel >= 0) brain.CurrentMood = Mood.Neutral;
    // ...
    if (isNearPlayer && rel >= 5 && !brain.WantToTalk)
    {
        brain.WantToTalk = true;
        brain.TalkReason = "nearby_friend";
    }
}
```

**ASCII 다이어그램** (Player → NPC AI 흐름):
```
Player approaches NPC
       ↓
GameManager.Update() ─→ AIManager.UpdateBehavior(npcPositions)
                              ↓
                       per-NPC NPCBrain
                       (mood / relationship / memory)
                              ↓
       relationship >= 5 && nearby ─→ wantToTalk = true
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
DialogueUI shows text + option buttons
```

### 4.6 § 4 Phaser TS → Unity 2D Port + AI Augmentation

본문 ~3 단락:

- **원본 testgame2**: Phaser 3 + TypeScript 2D RPG. Top-down 판타지, 전투/스킬/인벤토리/퀘스트/대화/저장 시스템. NPC 대화는 정적 스크립트 기반.
- **Unity 2D C# 포팅 결정**: Unity 6 LTS + URP. 같은 게임 루프를 Unity 네이티브로 재구현 — Tilemap 마이그레이션, Y축 반전(Phaser Y↓ → Unity Y↑), 시간 단위 변환(ms ↔ seconds), Rigidbody2D 신 API.
- **AI 증설**: 포팅하면서 원본에 없던 **로컬 LLM NPC 대화 시스템**을 추가 도입. 같은 캐릭터들이 personality + mood + memory 기반으로 다이나믹 대화. 정적 스크립트 → AI 생성 + 폴백 구조.
- **개발 자체도 4 CLI 멀티 페르소나**: Director / Dev-Backend / Dev-Frontend / Asset+QA. 폴더 소유권 기반 충돌 방지. 이는 DXCenter case study에서 정형화한 멀티 페르소나 패턴을 산업 외 프로젝트로 확장한 사례.

### 4.7 § 5 Result & Verification

본문 ~3 단락 + 측정 가능한 지표:

- **동작 검증**: NPC와 대화 시 personality/mood/relationship 기반 자연스러운 응답 생성. JSON 응답에서 action 추출 → NPC가 quest 제안 등 게임 행동 수행. Ollama 가동 시 gemma3:4b 응답 시간 평균 ~3-5초.
- **오프라인 fallback**: Ollama 종료 후 게임 실행 → fallback 템플릿 응답으로 게임 끊김 없이 진행. 가용성 체크 3s 타임아웃 → Debug.Log 명시 → AiEnabled = false → BuildOfflineResponse 분기.
- **안정성 개선 진행 중**: SPEC-S-078 (DialogueSystem AI 응답 타임아웃) 작업으로 `CancellationTokenSource` 도입, 로딩 UI 시각 피드백 강화. P2 우선순위로 review queue에 있음.
- **Brain serialize 무손실**: SaveSystem 통합 — `SerializeAllBrains()` 로 player와의 관계도, 트리거 이력, mood, memory 모두 JSON 직렬화 → 게임 재개 시 복원.

### 4.8 § 6 Cross-Reference (Related Case Studies)

3개 카드 그리드 (`grid grid-cols-1 md:grid-cols-3 gap-6`):

1. **VR Robot** (`case-study-vr-robot.html`)
2. **DXCenter** (`case-study-dxcenter.html`)
3. **Orchestration Framework** (`case-study-orchestration-ts.html`)

각 카드는 기존 case study의 cross-ref 패턴 따름 (label + title + 1-2 문장 요약 + hover 효과).

### 4.9 § 7 CTA

- "GitHub Repository" 버튼 → https://github.com/darkhtk/game-GenWorld
- "← All Projects" 링크 → projects.html

## 5. projects.html Updates

### 5.1 새 필터 버튼 추가

기존 6개 필터 버튼 뒤에 1개 추가:

```html
<button data-filter="local-llm" class="filter-btn px-5 py-2 bg-surface-container-low hover:bg-surface-container-highest text-on-surface-variant font-label text-sm transition-all rounded-md">Local LLM</button>
```

### 5.2 새 프로젝트 카드 추가

- **위치**: bento grid 안. Featured(8 col) 다음 줄. 정확한 col-span은 implementer가 read 후 시각 균형 맞춰 결정 (기본: `md:col-span-6`).
- **data-category**: `"ai-agent local-llm"` — 두 필터 모두에서 노출
- **카드 내용**:
  - 카테고리 라벨: `R&D · Local LLM · Game Runtime`
  - 제목: `GenWorld + Ollama`
  - 요약: "Phaser 3 TS RPG를 Unity 2D C#로 포팅하면서 로컬 Ollama LLM(gemma3) 기반 NPC 인지·대화 시스템 구축. 오프라인 우선 + graceful fallback."
  - 태그: `Unity 6 · C#`, `Ollama · gemma3`, `Local LLM`, `4-CLI Orchestration`
  - Case Study 링크: `case-study-genworld-ollama.html`
  - GitHub 링크: github.com/darkhtk/game-GenWorld
  - 비주얼: 그라데이션 + Material Symbol 아이콘 (`psychology` 또는 `forum`) — Gen 프로젝트에 적절한 스크린샷 없으면 텍스트 우선 카드로 (orchestration-ts 패턴)

### 5.3 필터 JS 영향
없음. 기존 필터 로직이 `data-category` 속성을 검사하므로 추가 JS 변경 불필요.

## 6. cover-letter.html Update

**위치**: "AI Agent를 개발 도구 자체로 활용" 섹션 (#2)의 마지막 부분. 기존 단락 손대지 않고 새 단락 추가.

**추가 단락**:
> 같은 멀티 페르소나 방법론을 산업 외 영역까지 확장한 사례로, **GenWorld(Phaser 3 TS RPG의 Unity 2D 포팅)** 프로젝트를 4개 CLI 페르소나(Director / Dev-Backend / Dev-Frontend / Asset+QA)로 진행하면서, 게임 런타임에는 **로컬 Ollama LLM(gemma3)** 기반 NPC 인지·대화 시스템을 직접 설계·구현했습니다. 클라우드 API 의존 없이 오프라인 우선 + graceful fallback 구조로, 산업 환경의 보안·비용 제약에서도 동일 패턴 적용 가능함을 검증했습니다. 자세한 기술 내용은 [Case Study](case-study-genworld-ollama.html) 참조.

## 7. resume.html Update

**위치**: 프로젝트/경력 섹션. implementer가 read 후 가장 자연스러운 자리(R&D / Side Projects 카테고리가 있으면 그 안, 없으면 새로 항목 추가).

**항목 형식** (resume.html 의 기존 카드 디자인 톤 따름):

```
GenWorld + Ollama (R&D · Side Project) — 2026
- Phaser 3 TS RPG (testgame2) → Unity 2D C# 포팅
- 로컬 Ollama LLM (gemma3:4b/12b) 기반 NPC 인지·대화 시스템
- NPCBrain (mood·relationship·memory·triggers) + JSON 구조화 응답
- 4 CLI 멀티 페르소나 orchestration 으로 진행
- Stack: Unity 6, C#, Ollama, Newtonsoft.Json
- GitHub: github.com/darkhtk/game-GenWorld
```

## 8. README.md Update

**위치**: `## Pages` 섹션. case study 목록의 마지막 줄로 추가.

**변경**:
```diff
- `case-study-orchestration-ts.html` — Multi-Agent Orchestration Framework (v1 → v2)
+ `case-study-orchestration-ts.html` — Multi-Agent Orchestration Framework (v1 → v2)
+ `case-study-genworld-ollama.html` — GenWorld · Local Ollama LLM 기반 NPC 인지 시스템
```

## 9. Existing Case Study Cross-Reference Updates

### 9.1 case-study-vr-robot.html
하단 cross-reference 섹션에 GenWorld 카드 1개 추가. 기존 카드와 동일 디자인 패턴.

### 9.2 case-study-dxcenter.html
동일.

### 9.3 case-study-orchestration-ts.html
**두 곳 업데이트 필요**:
1. 상단 meta-base intro (`<section class="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mb-12">` 안의 cross-ref 링크 목록 — line ~104-108)
2. 하단 cross-reference 섹션

### 9.4 Cross-ref 카드 형식 (참고 예시)

```html
<a href="case-study-genworld-ollama.html" class="block bg-surface-container-highest/40 p-6 rounded-xl hover:bg-surface-container-highest/70 transition-all">
  <div class="font-label text-[10px] text-primary-fixed uppercase tracking-widest mb-2">R&D · Local LLM</div>
  <h4 class="font-headline text-lg font-bold mb-2">GenWorld + Ollama</h4>
  <p class="text-sm text-on-surface-variant">Phaser 3 TS RPG → Unity 2D 포팅 + 로컬 LLM 기반 NPC 인지 시스템.</p>
</a>
```

각 case study 의 기존 cross-ref 디자인에 맞춰 implementer가 미세 조정.

## 10. Rollout Plan

```
Phase 1 — Case Study 페이지 신규 작성 (단독)
   ├─ Step 1.1: 보일러플레이트 (head, nav Pattern B + 모바일 overlay + JS, footer, style block)
   ├─ Step 1.2: Hero 섹션 (Case Study 04 라벨 / R&D 배지 / H1 / 통계 4칸)
   ├─ Step 1.3: § 1 The Challenge
   ├─ Step 1.4: § 2 Local LLM Operation (코드 스니펫)
   ├─ Step 1.5: § 3 NPC Cognitive Architecture (코드 스니펫 + ASCII diagram)
   ├─ Step 1.6: § 4 Phaser → Unity Port + AI Augmentation
   ├─ Step 1.7: § 5 Result & Verification
   ├─ Step 1.8: § 6 Cross-Reference (3개 카드)
   ├─ Step 1.9: § 7 CTA
   └─ commit: feat: add case-study-genworld-ollama.html

Phase 2 — 사용자 검토 ▶
   ├─ 브라우저 4 viewport 시각 확인
   ├─ 본문 내용·코드 스니펫 정확성 확인
   └─ 톤(R&D 포지셔닝) 의도대로 전달 확인

Phase 3 — 통합 (7개 파일)
   ├─ Step 3.1: projects.html — 카드 + 필터 추가
   ├─ Step 3.2: cover-letter.html — AI 섹션 단락 추가
   ├─ Step 3.3: resume.html — 프로젝트 항목 추가
   ├─ Step 3.4: README.md — Pages 목록 추가
   ├─ Step 3.5: case-study-vr-robot.html — cross-ref 추가
   ├─ Step 3.6: case-study-dxcenter.html — cross-ref 추가
   ├─ Step 3.7: case-study-orchestration-ts.html — cross-ref (상단 + 하단)
   └─ commits: 논리 단위로 분리 (또는 한 번에 묶음, 사용자 선택)

Phase 4 — 사용자 검토 ▶
   ├─ 8개 파일 변경 확인
   ├─ projects.html 'Local LLM' 필터 동작 확인
   ├─ 3개 case study cross-ref 클릭 → 새 case study 이동
   └─ 모든 페이지 데스크톱 회귀 0

Phase 5 — Push & Merge
   └─ feature branch → main fast-forward → origin push
```

## 11. Verification Checklist

### Phase 2 — case study 페이지 단독

- [ ] 데스크톱 1280px: 기존 case study 3개와 시각적 결 일치
- [ ] 모바일 360px: 햄버거 동작, 가로 스크롤 없음, 코드 블록 자체 가로 스크롤
- [ ] 코드 스니펫 syntax highlighting (`.kw`, `.str`, `.com` 클래스)
- [ ] Hero 통계 4칸 모바일 2×2 깨짐 없음
- [ ] R&D 배지 표시 (Live 배지 대신)
- [ ] cross-reference 카드 3개 정상 링크
- [ ] GitHub 링크 정상 (https://github.com/darkhtk/game-GenWorld)
- [ ] ASCII diagram이 코드 블록 안에서 가독성 OK

### Phase 4 — 통합 후

- [ ] projects.html 새 카드 bento grid 시각 균형 OK
- [ ] 'Local LLM' 필터 클릭 → Gen 카드만 노출
- [ ] '전체' 클릭 → 모든 카드 복귀
- [ ] 'AI Agent' 필터 → Gen 카드도 포함 (data-category)
- [ ] cover-letter.html 새 단락 위치·문체 자연스러움
- [ ] resume.html 새 항목 디자인 톤 OK
- [ ] README.md 새 줄 마크다운 정상
- [ ] 3개 case study cross-ref 카드 → genworld-ollama 이동
- [ ] orchestration-ts.html 2 곳 (상단 + 하단) 모두 업데이트
- [ ] 모든 페이지 데스크톱 회귀 0
- [ ] 모든 페이지 모바일 회귀 0 (이전 mobile-redesign 작업 결과 보존)

## 12. Risks & Mitigations

| 리스크 | 완화 방안 |
|---|---|
| Phase 2 검토에서 톤/내용 큰 수정 요청 | Phase 2를 명확한 사용자 게이트로 설정. 통과 시에만 Phase 3 시작. |
| cross-reference 카드 디자인이 기존 3개 case study에서 미묘하게 다름 | 각 파일 read 후 그 파일의 기존 패턴에 맞춰 카드 작성. 통일하지 않음. |
| Gen 의 SPEC-S-078 이슈가 review queue에 있음 → "검증 완료" 단정 시 부정확 | § 5 Result 섹션에서 "안정성 개선 진행 중" 명시. 과장하지 않음. |
| Gen 프로젝트에 적절한 스크린샷 없음 | 그라데이션 + Material Symbol 아이콘 (`psychology` / `forum`) 으로 대체. orchestration-ts 패턴 참조. |
| projects.html 카드 추가로 bento grid 시각 균형 깨짐 | implementer가 col-span 조정. 필요 시 기존 카드 col-span 미세 조정 (단, 다른 카드 콘텐츠 변경은 X). |
| nav active 링크 충돌 | case study는 모두 PROJECTS 하위, active = PROJECTS. 기존 3개 case study와 동일 결정. |

## 13. Success Criteria

- 8개 파일(1 신규 + 7 수정) 모두 정상 작동
- `case-study-genworld-ollama.html`이 기존 3개 case study와 동등한 시각·구조 품질
- A·B·C 세 각도(Local LLM 운영, NPC 인지 아키텍처, Phaser→Unity 포팅 + AI 증설) 모두 case study에서 충분히 다루어짐
- R&D · 자사 기술 실증 톤 일관됨 — "Live · 재직 중" 같은 산업 배포 톤 사용 안 함
- 'Local LLM' 필터가 기존 ai-agent 필터와 별개 카테고리로 동작
- 데스크톱 + 모바일 모두 회귀 0 (이전 mobile-redesign 결과 보존)
- 각 파일 변경이 논리 단위 commit 으로 명확히 분리됨
- GitHub Pages 자동 배포 후 https://darkhtk.github.io/portfolio/case-study-genworld-ollama.html 정상 접속
