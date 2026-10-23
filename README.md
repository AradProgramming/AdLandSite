# AdLand Studio — Website and app catalogue

Public site: https://aradprogramming.github.io/AdLandSite/

This repository contains the bilingual Persian/English AdLand Studio website, product microsites, app manifest, app assets, and GitHub Actions build workflows.

## AdLand Studio brand film

- Promo landing page: [promo/](promo/) — English-first 3D CGI studio film, product catalogue, and responsive playback page.
- Brand slogan: **Creativity : Ulimited**
- Film master (35 seconds, 1280×720, H.264 + AAC, electronic score and SFX, no narration): [Watch / download the MP4](https://d2ol7oe51mr4n9.cloudfront.net/user_3L5mG1wji8zJmcoSnEFi79BUGBZ/bdc040ad-0ed7-4246-9491-aa89d5a70cec.mp4)

## Website architecture

- `index.html` — main studio homepage and product catalogue.
- `app-manifest.json` — product versions, pages, icons and release metadata.
- `assets/adland-language.js` — shared Persian/English language behavior.
- `assets/adland-ecosystem.js` — shared app experience helpers, support UI and optional sound effects.
- `assets/adland-face2face.js` — Face2Face feature panel and accessible motion polish.
- `face2face/index.html` — bilingual Face2Face product page.
- `face2face/index.html` — Face2Face product page and Windows build guide. A public source bundle and prebuilt installer have not yet been published in this repository.
- `scripts/site_quality.py` — internal-link, asset, manifest and script-syntax checks.

## Local quality checks

Requirements: Python 3.10+ and Node.js 20+.

```bash
python scripts/site_quality.py
node --check assets/adland-face2face.js
```

GitHub Actions runs the same quality checks on pushes and pull requests.

## Face2Face

Face2Face is a Windows-first desktop meeting application. It includes a Node LAN host, Electron desktop shell, room and chat signaling, WebRTC media, device controls, optional sound cues, screen sharing, and file/code sharing. It is intended for small trusted local-network meetings; zero latency is not guaranteed and the GitHub Pages website does not host a running call server.

A Windows source ZIP was generated and is available as a separate conversation attachment, but has not been uploaded into this repository. On Windows, the included source project can be built with Node.js 20+ using `launch-windows.bat` or `build-windows.bat`; a prebuilt signed installer has not been published here.

## Roadmaps

- `IDEAS-100-WEBSITE-AND-ECOSYSTEM.md` — 100 new ideas across the site, apps, accessibility, performance, security and release engineering.
- [Face2Face feature roadmap](face2face/).

## Publishing

The site is published using GitHub Pages from the repository. Keep asset paths relative or prefixed for the `/AdLandSite/` project path. Do not publish credentials, signing keys, local certificates or private customer data.
