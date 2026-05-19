# 포트폴리오 방문 추적 서버

GitHub Pages 포트폴리오 방문을 NAS에서 직접 집계하는 경량 추적 서버입니다.

## 기능

- `POST /track`: 페이지 조회 기록 저장
- `GET /health`: 서버 버전, 저장소 상태, 최근 방문, 무방문 알림 상태 확인
- `GET /dashboard`: Basic Auth로 보호되는 한국어 집계 화면
- `GET /api/stats`: 대시보드용 JSON 집계 API
- `POST /api/exclusions/current-ip`: 현재 접속 IP 제외
- `POST/DELETE /api/exclusions/ip`: IP 제외 목록 관리
- `POST/DELETE /api/exclusions/visitor`: visitor id 제외 목록 관리
- `POST /api/records/reset`: 방문 기록과 제외 요청 로그 초기화
- 저장 항목: 공개 IP, visitor id, 페이지 경로, referrer, user agent, 화면 크기, 언어, 타임존, 테스트 ID, 클라이언트 버전
- 대시보드 표시: reverse DNS, ASN/ISP, 국가/도시, 제외 요청 이력

## 저장 방식

- 기본 저장소는 `data/tracker.sqlite3`입니다.
- 기존 `data/visits.jsonl`, `data/excluded-requests.jsonl` 데이터는 최초 실행 시 SQLite로 마이그레이션합니다.
- 신규 방문과 제외 요청은 SQLite에 기록하고, 백업/감사용으로 JSONL 파일에도 계속 append합니다.
- 대시보드의 기록 초기화는 버튼 클릭 즉시 방문 기록과 제외 요청 로그를 비우며, 제외 IP/방문자 설정은 유지합니다.

## 알림

- `NO_VISIT_ALERT_HOURS` 시간 이상 새 방문이 없으면 `/health`에서 `stale: true`로 표시합니다.
- `ALERT_WEBHOOK_URL`을 설정하면 stale 상태가 되었을 때 하루 한 번 웹훅으로 알림을 보냅니다.
- 웹훅을 비워두면 알림은 보내지 않고 상태만 확인합니다.

## 배포

1. `.env.example`를 `.env`로 복사합니다.
2. `TRACKER_BASE_URL`, `DASHBOARD_PASSWORD`, 필요 시 `ALERT_WEBHOOK_URL`을 수정합니다.
3. Synology NAS의 `/volume1/docker/portfolio-tracker` 경로에 배치합니다.
4. `docker compose up -d --build`로 재빌드합니다.
5. `curl -sk https://127.0.0.1:3443/health`로 `version: server-v2`, `storage: sqlite`를 확인합니다.

## 주의

- 공개 IP는 NAT, VPN, iCloud Private Relay 영향으로 사람 단위와 다를 수 있습니다.
- 브라우저별 `visitor_id`는 `localStorage` 기반입니다.
- 특정 브라우저를 제외하려면 포트폴리오 URL 뒤에 `?tracker_exclude=1`을 붙여 한 번 열면 됩니다.
- 제외를 해제하려면 `?tracker_exclude=0`을 붙여 한 번 엽니다.
- reverse DNS / ASN / Geo 정보는 외부 조회 결과를 캐시해 사용하며, 사람 식별이 아니라 접속 출처 추정용입니다.
