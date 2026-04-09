# NAS Tracker Design

## Goal

GitHub Pages 포트폴리오 방문을 개인 NAS에서 직접 집계한다.

## Requirements

- public IP 기준 집계 가능
- 브라우저별 재방문 식별을 위해 visitor id 저장
- 페이지별 조회 수 확인
- 보호된 대시보드 제공
- GitHub Pages 정적 사이트와 연동 가능
- 특정 IP와 visitor id 제외 가능
- reverse DNS, ASN/ISP, 국가/도시 표시 가능

## Architecture

- Frontend: 각 HTML 페이지에서 `assets/js/tracker.js` 실행
- Tracker API: NAS Docker 컨테이너의 Node HTTPS 서버
- Storage: `data/visits.jsonl`
- Dashboard: Basic Auth 보호 HTML 페이지

## Why JSONL

- 의존성이 거의 없음
- Synology Container Manager에서 가볍게 운영 가능
- 소규모 포트폴리오 트래픽에는 충분

## Transport

- GitHub Pages가 HTTPS이므로 NAS도 HTTPS 엔드포인트 제공
- Synology 기본 인증서를 컨테이너에 read-only 마운트

## Data Shape

- `id`
- `createdAt`
- `ip`
- `path`
- `title`
- `referrer`
- `userAgent`
- `visitorId`
- `screen`
- `language`
- `timezone`

## Exclusion Strategy

- 서버에서 `excluded-ips.json`, `excluded-visitor-ids.json` 유지
- 저장 전에 `ip`, `visitorId` 기준으로 제외 검사
- 클라이언트에서는 `?tracker_exclude=1` 로 현재 브라우저 추적 비활성화

## Network Attribution

- reverse DNS: Node DNS reverse lookup
- ASN/ISP/Geo: 외부 IP metadata API 조회 후 캐시
- 목적: 사람 식별이 아니라 통신사, 회사망, 클라우드 대역 등 접속 출처 추정
