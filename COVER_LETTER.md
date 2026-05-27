# Cover Letter

안녕하세요. 저는 Unity 기반 실시간 시스템을 중심으로 XR, 로보틱스, BIM 시각화, 디지털트윈 저작 도구, 그리고 최근에는 AI 개발 도구와 운영 구조까지 만들고 다듬어온 홍대기입니다.

제가 가장 중요하게 보는 기준은 `실제로 운영 가능한가`입니다. 기능이 동작하는 것만으로는 충분하지 않고, 현장 설치와 검증, 운영자 안전, 반복 가능한 전달 방식까지 함께 버텨야 좋은 시스템이라고 생각합니다. 그래서 저는 구현만 하는 개발자보다, 구조를 먼저 보고 운영까지 닫는 엔지니어에 더 가깝습니다.

이 기준은 Unity 산업 개발 전반에 일관되게 이어졌습니다. WatchBIM과 Unity-CrossSection에서는 대용량 BIM 데이터를 다루기 위한 히트 처리, 단면 생성, 2D 분석 뷰어, shader 기반 시각화, Burst/Job System 처리, NativeArray 기반 geometry tooling을 다뤘습니다. DXCenter에서는 Unity 6 URP/WebGL 기반 저작 환경을 만들며 ScriptableObject 데이터 흐름, Service Locator, EventBus, Strategy 기반 상태 효과, adapter 방식의 기기 연동 구조를 적용했습니다. VR Robot과 MetaArm에서는 Quest 3 입력, Unity 런타임, 좌표계 변환, smoothing, Flask API, TCP 통신, RoboDK, 안전 제약을 하나의 XR 제어 파이프라인으로 묶었습니다.

최근에는 이 관점을 AI 개발 도구 쪽으로 확장하고 있습니다. 대표 사례는 DeskRelay입니다. DeskRelay는 Claude Code를 풀바이브 코딩 방식으로 활용해 만든 self-host AI 개발 제어 도구입니다. 브라우저나 모바일에서 로컬 PC의 Claude Code 세션을 조작하고, server PC, registered PC connector daemon, LAN/Tailscale, WebSocket/SSE relay, bearer-token authorization, session queue, permission, instruction, skill, update flow, diagnostics, offline failure reporting까지 하나의 운영 흐름으로 묶습니다.

DeskRelay에서 중요한 점은 제가 AI에게 코딩을 많이 맡겼다는 사실 자체가 아닙니다. 저는 AI를 단순 코드 작성기가 아니라 개발 조직처럼 다뤘습니다. 관리자와 worker 역할을 나누고, 프로젝트 지침과 상태판을 만들고, happy path를 의심하며, 등록/오프라인/업데이트/권한/모바일/복구 흐름을 계속 검증했습니다. AI가 만든 문구도 그대로 믿지 않고, 사용자에게 실제로 도움이 되는 상태 메시지인지, 숨겨야 할 정보와 보여줘야 할 정보가 분리되어 있는지, 개인 도구와 출시 제품의 기준이 섞이지 않았는지 계속 다듬었습니다.

결국 제가 잘하는 일은 복잡한 시스템을 단순한 화면으로 포장하는 것이 아니라, 복잡한 시스템이 실제 환경에서 계속 굴러가게 만드는 것입니다. XR, 시뮬레이터, BIM, 로보틱스, AI 개발 도구처럼 제약이 많은 영역일수록 이런 방식이 더 중요하다고 믿습니다. 저는 AI를 제 판단력을 대체하는 도구가 아니라, 제 판단력을 증폭시키는 작업 시스템으로 사용합니다.

포트폴리오에는 대표 프로젝트와 작업 기준을 함께 정리해두었습니다. 더 자세한 맥락이나 특정 역할과의 연결점을 이야기해보고 싶다면 편하게 연락 부탁드립니다.

## Contact

- Email: darkhtk@gmail.com
- GitHub: https://github.com/darkhtk
- LinkedIn: https://www.linkedin.com/in/daeki-hong-041947182
