# Hong Daeki Portfolio

Static portfolio site for industrial Unity real-time systems, XR, BIM, editor tooling, automation, robotics integration, and AI collaboration case studies.

- Live: [https://darkhtk.github.io/portfolio/](https://darkhtk.github.io/portfolio/)
- Repo: [https://github.com/darkhtk/portfolio](https://github.com/darkhtk/portfolio)
- Deploy: push `main` to trigger GitHub Pages

## Repository Layout

Keep only deployable site files in the repository root. Local-only service code and working materials now live in a sibling folder: `C:\sourcetree\portfolio-internal\portfolio`.

- `index.html`, `projects.html`, `about.html`, `resume.html`, `cover-letter.html`
  - Main pages
- `case-study-*.html`
  - Case study detail pages
- `assets/`
  - Images, favicons, shared scripts
- `AGENTS.md`
  - Repo working context
- `C:\sourcetree\portfolio-internal\portfolio\tracker`
  - NAS-hosted visitor tracker and dashboard source
- `C:\sourcetree\portfolio-internal\portfolio\workspace\docs\site`
  - Portfolio rewrite, architecture, and category planning docs
- `C:\sourcetree\portfolio-internal\portfolio\workspace\docs\superpowers`
  - Spec and plan documents
- `C:\sourcetree\portfolio-internal\portfolio\workspace\layout`
  - Layout references and mockups
- `C:\sourcetree\portfolio-internal\portfolio\CLAUDE.md`
  - Extended collaboration context backup

## Pages

- `index.html`: Home
- `projects.html`: Featured projects and foundation work
- `about.html`: Working style and problem-solving approach
- `resume.html`: Career flow
- `cover-letter.html`: Cover letter
- `case-study-vr-robot.html`: VR robot teleoperation
- `case-study-dxcenter.html`: DXCenter editor tooling
- `case-study-neostalgia.html`: Neostalgia
- `case-study-orchestration-ts.html`: Orchestration framework
- `case-study-genworld-ollama.html`: GenWorld + Ollama R&D

## Tracker

See [tracker README](/C:/sourcetree/portfolio-internal/portfolio/tracker/README.md).

- Dashboard: `https://semirain.synology.me:3443/dashboard`
- Captures: public IP, visitor id, page path, referrer, user agent
- Enrichment: reverse DNS, ASN/ISP, country, city

## Notes

- No build system. Static HTML + Tailwind CDN only.
- Root paths stay GitHub Pages friendly.
- Local-only docs, layout references, and tracker source live under `C:\sourcetree\portfolio-internal\portfolio`.
