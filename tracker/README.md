# Portfolio Tracker

GitHub Pages 포트폴리오 방문을 NAS에서 직접 집계하는 경량 추적 서버입니다.

## 기능

- `POST /track`: 페이지 조회 기록 저장
- `GET /dashboard`: Basic Auth 보호된 집계 화면
- `GET /api/stats`: JSON 집계 API
- `POST /api/exclusions/current-ip`: 현재 접속 IP 제외
- `POST/DELETE /api/exclusions/ip`: IP 제외 목록 관리
- `POST/DELETE /api/exclusions/visitor`: visitor id 제외 목록 관리
- 저장 항목: public IP, visitor id, 페이지 경로, referrer, user agent, 시간
- 대시보드 표시: reverse DNS, ASN/ISP, 국가/도시

## 저장 방식

- `data/visits.jsonl` 에 JSON Lines 형식으로 기록
- SQLite 대신 의존성 없는 파일 저장 방식을 사용

## 배포

1. `.env.example` 를 `.env` 로 복사
2. `TRACKER_BASE_URL`, `DASHBOARD_PASSWORD` 수정
3. Synology `docker/portfolio-tracker` 경로에 배치
4. `docker compose up -d --build`

## 주의

- public IP는 NAT, VPN, iCloud Private Relay 영향으로 사람 단위와 다를 수 있습니다.
- 브라우저별 `visitor_id` 는 `localStorage` 기반입니다.
- 특정 브라우저를 제외하려면 포트폴리오 URL 뒤에 `?tracker_exclude=1` 을 붙여 한 번 열면 됩니다.
- reverse DNS / ASN / Geo 정보는 외부 조회 결과를 캐시해 사용하며, 사람 식별이 아니라 접속 출처 추정용입니다.
