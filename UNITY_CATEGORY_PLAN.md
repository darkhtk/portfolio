# Unity Category Plan

## 목적

포트폴리오에서 `Unity`를 단일 기술 스택처럼 묶지 않고, 실제로 어떤 문제를 어떤 계층에서 풀어왔는지를 기준으로 다시 분류한다.

핵심 방향은 다음과 같다.

- `Unity를 오래 했다`가 아니라 `Unity로 어떤 복잡한 시스템을 구축해 왔는가`가 먼저 읽히게 한다.
- 카테고리는 기술 키워드가 아니라 문제 영역과 시스템 책임 기준으로 나눈다.
- 각 카테고리는 실제 C# 코드 구조로 뒷받침되어야 한다.

## 코드 기반 분석 요약

이번 분류는 아래 Unity 프로젝트의 실제 C# 구조를 기준으로 잡는다.

- `IK_Meta`: 21 files / 5,445 lines
- `DXCenter`: 131 files / 43,713 lines
- `WatchBIM`: 248 files / 27,517 lines
- `GENWorld`: 92 files / 12,427 lines
- `Youstalgia`: 24 files / 3,387 lines

### 1. XR · 로봇 제어 · 실시간 제어 계층

`IK_Meta`는 단순 데모가 아니라 런타임 IK, 조인트 정의, 로봇 통신, 모션 기록 계층이 분리되어 있다.

근거 파일:

- [RuntimeIK.cs](C:/sourcetree/IK_Meta/UnityProject/Assets/Scripts/Core/RuntimeIK.cs)
- [IkRuntimeController.cs](C:/sourcetree/IK_Meta/UnityProject/Assets/Scripts/Core/IkRuntimeController.cs)
- [MyCobotUdpClient.cs](C:/sourcetree/IK_Meta/UnityProject/Assets/Scripts/MyCobot/MyCobotUdpClient.cs)
- [MyCobotBidirectionalCompensator.cs](C:/sourcetree/IK_Meta/UnityProject/Assets/Scripts/MyCobot/MyCobotBidirectionalCompensator.cs)
- [IkMotionRecorder.cs](C:/sourcetree/IK_Meta/UnityProject/Assets/Scripts/Motion/IkMotionRecorder.cs)

읽히는 포인트:

- XR 입력을 실제 제어 문제로 연결
- IK 해석과 제한 조건 처리
- 외부 장치 연동
- 런타임 제어와 기록 계층 동시 운영

### 2. Editor Tooling · 제작 파이프라인 계층

`DXCenter`는 Unity를 콘텐츠 제작 도구로 확장한 구조가 매우 분명하다. EditorWindow, Wizard, Validation, Runtime 데이터 계층이 분리돼 있고, 비개발자 저작 워크플로우까지 코드로 드러난다.

근거 파일:

- [DXEditorWindowBase.cs](C:/sourcetree/rims_custom/customwindow_rims/Assets/DXCenter/Editor/Base/DXEditorWindowBase.cs)
- [DXCenterMainWindow.cs](C:/sourcetree/rims_custom/customwindow_rims/Assets/DXCenter/Editor/Core/DXCenterMainWindow.cs)
- [ProjectWizard.cs](C:/sourcetree/rims_custom/customwindow_rims/Assets/DXCenter/Editor/Wizard/ProjectWizard.cs)
- [ProjectValidator.cs](C:/sourcetree/rims_custom/customwindow_rims/Assets/DXCenter/Editor/Validation/ProjectValidator.cs)
- [EventBus.cs](C:/sourcetree/rims_custom/customwindow_rims/Assets/DXCenter/Runtime/Core/EventBus.cs)
- [ServiceLocator.cs](C:/sourcetree/rims_custom/customwindow_rims/Assets/DXCenter/Runtime/Core/ServiceLocator.cs)

읽히는 포인트:

- Unity Editor 확장
- 제작자용 저작 툴
- 검수/검증 구조
- Runtime UI와 데이터 매핑
- 실서비스형 디지털트윈 제작 환경

### 3. BIM · 대용량 데이터 시각화 · 엔지니어링 분석 계층

`WatchBIM`은 단순 뷰어가 아니라 데이터 로드, 모델 타입 처리, 횡단면, 클리핑, 치수, 종단/횡단 차트 등 엔지니어링 검토 도구 성격이 강하다.

근거 파일:

- [WBLoader.cs](C:/sourcetree/WatchBIM/Assets/_Dev/Contents/WatchBIM/WBLoader.cs)
- [CrossSectionManager.cs](C:/sourcetree/WatchBIM/Assets/_Dev/Contents/Tools/CrossSection/CrossSectionManager.cs)
- [MeshClipManager.cs](C:/sourcetree/WatchBIM/Assets/_Dev/Contents/Tools/MeshClip/MeshClipManager.cs)
- [VerticalChartManager.cs](C:/sourcetree/WatchBIM/Assets/_Dev/Contents/VerticalChart/VerticalChartManager.cs)
- [WBHelper.cs](C:/sourcetree/WatchBIM/Assets/_Dev/Helper/WBHelper.cs)
- [WBEditor.cs](C:/sourcetree/WatchBIM/Assets/_Dev/Editor/WBEditor.cs)

읽히는 포인트:

- 대용량 BIM/토목 데이터 로드
- 메쉬 기반 분석 도구
- 설계 검토용 시각화
- 에디터 자동화와 검토 UI

### 4. AI 결합형 XR 콘텐츠 파이프라인 계층

`Youstalgia`는 XR 경험 자체보다, 음성 입력과 Flask/OpenAI, Skybox, Thing/모델 생성, 시퀀스 연출을 Unity 안에서 하나의 체험 파이프라인으로 묶는 구조가 핵심이다.

근거 파일:

- [SequenceManager.cs](C:/sourcetree/Youstalgia/Assets/01_Script/Sequence/SequenceManager.cs)
- [FlaskManager.cs](C:/sourcetree/Youstalgia/Assets/01_Script/Sequence/FlaskManager.cs)
- [SkyboxGenerator.cs](C:/sourcetree/Youstalgia/Assets/01_Script/Sequence/SkyboxGenerator.cs)
- [ModelManager.cs](C:/sourcetree/Youstalgia/Assets/01_Script/Thing/ModelManager.cs)
- [PrompterManager.cs](C:/sourcetree/Youstalgia/Assets/01_Script/Sequence/PrompterManager.cs)

읽히는 포인트:

- XR 인터랙션 시퀀스 설계
- 외부 AI/Flask 백엔드 연동
- 생성형 콘텐츠 파이프라인
- 경험 흐름과 운영 로직의 결합

### 5. 게임 시스템 · AI 런타임 구조 계층

`GENWorld`는 Unity에서 게임 런타임 전체를 만들면서, 그 위에 AI/NPC 인지와 대화 구조를 붙인 프로젝트다. 이 카테고리는 `AI 실험`보다 `게임 시스템 위에 AI를 얹은 런타임 설계`에 가깝다.

근거 파일:

- [AIManager.cs](C:/sourcetree/GENWorld/Assets/Scripts/AI/AIManager.cs)
- [PromptBuilder.cs](C:/sourcetree/GENWorld/Assets/Scripts/AI/PromptBuilder.cs)
- [NPCBrain.cs](C:/sourcetree/GENWorld/Assets/Scripts/AI/NPCBrain.cs)
- [DialogueController.cs](C:/sourcetree/GENWorld/Assets/Scripts/Core/DialogueController.cs)
- [EventBus.cs](C:/sourcetree/GENWorld/Assets/Scripts/Core/EventBus.cs)
- [SkillSystem.cs](C:/sourcetree/GENWorld/Assets/Scripts/Systems/SkillSystem.cs)
- [QuestSystem.cs](C:/sourcetree/GENWorld/Assets/Scripts/Systems/QuestSystem.cs)

읽히는 포인트:

- 게임 런타임 시스템 설계
- NPC 상태와 기억 모델
- LLM 대화 연결
- fallback 포함 런타임 제어
- 테스트 코드 기반 검증

## 추천 카테고리 체계

포트폴리오에서 `Unity`를 아래 5개 카테고리로 나누는 방안을 추천한다.

1. `Unity XR · Real-Time Control`
2. `Unity Editor Tooling · Authoring Systems`
3. `Unity BIM · Engineering Visualization`
4. `Unity XR Experience · AI Pipeline`
5. `Unity Game Systems · AI Runtime`

이 구조가 좋은 이유는 다음과 같다.

- Unity를 엔진이 아니라 문제 해결 환경으로 보이게 한다.
- 산업기술회사, 게임회사, 대기업 실무자가 각자 필요한 영역만 빠르게 스캔할 수 있다.
- 기존 프로젝트를 억지로 `AI`와 `비AI`로 나누지 않아도 된다.

## 프로젝트 매핑

### Unity XR · Real-Time Control

- VR 로봇 원격 조종 시스템
- IK Meta

메시지:

`XR 입력을 실시간 제어와 외부 장치 연동으로 연결한 작업`

### Unity Editor Tooling · Authoring Systems

- DXCenter
- eGuide 계열

메시지:

`Unity를 제작자용 툴과 검수 가능한 저작 시스템으로 확장한 작업`

### Unity BIM · Engineering Visualization

- WatchBIM
- 토목/설계 검토 도구

메시지:

`대용량 모델을 탐색 가능한 실시간 환경과 분석 도구로 바꾼 작업`

### Unity XR Experience · AI Pipeline

- 너스탤지아 / Youstalgia

메시지:

`XR 체험 흐름 안에 음성·생성형 AI·시각 생성 파이프라인을 통합한 작업`

### Unity Game Systems · AI Runtime

- GENWorld

메시지:

`게임 시스템 위에 NPC 인지·대화·fallback 구조를 얹은 런타임 작업`

## 사이트 반영 방식

### 방법 A. Projects 페이지에 `Unity Work Areas` 섹션 추가

가장 추천하는 방식이다.

배치:

- Hero 아래 또는 Featured Projects 아래
- 5개 카테고리 카드
- 각 카드에 대표 프로젝트 1~2개 연결

카드 구조:

- 카테고리명
- 한 줄 정의
- 대표 프로젝트 2개
- `이 카테고리에서 한 일` 2~3개

예:

- `Unity XR · Real-Time Control`
- `VR 입력, IK, 외부 장치 제어를 실시간 시스템으로 연결한 작업`
- `VR 로봇 원격 조종`, `IK Meta`

### 방법 B. Resume 페이지에 `Unity Capability Map` 추가

이력 흐름 아래에 짧은 요약 블록으로 넣는 방식이다.

용도:

- 이력 타임라인을 다시 반복하지 않음
- `Unity 경력의 범위`를 한 번에 스캔 가능

### 방법 C. About 페이지에 `Unity로 풀어온 문제` 블록 추가

About이 자기소개 문장 위주로 끝나지 않도록 보완하는 용도다.

다만 우선순위는 `Projects > Resume > About` 순서가 적절하다.

## 카피라이팅 원칙

카테고리 제목은 기술명 나열보다 문제 영역이 드러나야 한다.

피할 표현:

- `Unity Development`
- `Unity Projects`
- `Unity Expert`
- `XR / AI / BIM / Tooling`

권장 표현:

- `Unity XR · Real-Time Control`
- `Unity Editor Tooling · Authoring Systems`
- `Unity BIM · Engineering Visualization`

설명 문장도 `무엇을 했다`보다 `무엇을 가능하게 했는가`가 더 적합하다.

예:

- `비개발자도 제작과 검수를 진행할 수 있도록 Unity Editor를 저작 도구로 확장했습니다.`
- `XR 입력과 IK, 외부 장치 통신을 연결해 실제 제어가 가능한 구조를 만들었습니다.`

## 최종 추천

현재 포트폴리오 기준으로 가장 자연스러운 적용안은 다음과 같다.

1. [projects.html](C:/sourcetree/portfolio/projects.html)에 `Unity Work Areas` 섹션 추가
2. Featured / Foundation 아래 프로젝트를 위 5개 카테고리로 재배치
3. [resume.html](C:/sourcetree/portfolio/resume.html)에 같은 기준의 축약판 추가

이렇게 하면 `산업용 Unity 실시간 시스템 개발자`라는 첫 인상을 유지하면서도, 실제 Unity 역량 범위를 훨씬 구조적으로 보여줄 수 있다.
