# NAS Tracker Design

## Goal

GitHub Pages 포트폴리오 방문을 개인 NAS에서 직접 집계한다.

## Requirements

- public IP 기준 집계 가능
- 브라우저별 재방문 식별을 위해 visitor id 저장
- 페이지별 조회 수 확인
- 보호된 대시보드 제공
- GitHub Pages 정적 사이트와 연동 가능

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
