<h1 align="center">Jonathan Cho</h1>

<p align="center">
  <b>Backend &amp; AI systems engineer — English / 日本語</b>
</p>

<p align="center">
  <a href="README.md">English</a> · <a href="README.ja.md">日本語</a>
</p>

<p align="center">
  TypeScript and React across the front end · streaming speech pipelines in Python ·<br>
  event-driven ingestion in Go · .NET services over well-modeled data —<br>
  and the realtime clients, maps and dashboards that sit on top of them.
</p>

<p align="center">
  <a href="https://portfolio-green-two-xlecxjrx3z.vercel.app"><img src="https://img.shields.io/badge/Portfolio-111111?style=flat-square&logo=vercel&logoColor=white" alt="Portfolio" /></a>
  <a href="https://linkedin.com/in/jon-jc"><img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=flat-square&logo=linkedin&logoColor=white" alt="LinkedIn" /></a>
  <a href="mailto:Jonathancho.jc@gmail.com"><img src="https://img.shields.io/badge/Email-EA4335?style=flat-square&logo=gmail&logoColor=white" alt="Email" /></a>
  <img src="https://img.shields.io/badge/English%20%2F%20日本語-4c8c4a?style=flat-square" alt="English / 日本語" />
</p>

---

## Kotoba Studio · ことば — bilingual voice AI and an agent desktop

**[github.com/jon-jc/kotoba-studio](https://github.com/jon-jc/kotoba-studio)** · [Screenshots & setup](https://github.com/jon-jc/kotoba-studio#english) · `Python` `TypeScript` `React` `PySide6` `ONNX`

A Windows desktop workspace that connects Japanese and English speech to reviewable text,
AI conversations and development tools. I extended DeepSeek Harness and integrated OpenWhispr
components to bring voice input, multiple model providers and desktop workflows into one application.

**Model selection belongs to each conversation.** Independent chats can use OpenAI, Anthropic Claude,
Kimi, DeepSeek or local models concurrently. Provider and model controls are separate, the chat menu
shows configured providers, and each conversation preserves its own selection. A code viewer,
terminal and plugin system keep the surrounding development workflow close to the agent.

**Local inference has an explicit setup flow.** English defaults to Parakeet; Japanese uses
Kotoba-Whisper, with other Whisper models available. Missing weights trigger a download prompt and
progress display before transcription starts. GGUF support through llama.cpp, plus Ollama and
LM Studio connections, lets users choose local execution alongside cloud APIs.

**Voice stays reviewable before it becomes an action.** Capture a microphone, system audio or an
application process; import a recording; or use a global hotkey for dictation at the cursor. Review
names, numbers and intent before sending a transcript to an agent. Evaluation exposes Japanese CER,
English WER, transcription latency and real-time factor against supplied reference text.

**Delivery includes the desktop lifecycle.** The app ships as an installable Windows executable with
English/Japanese controls, persistent chat views, user-selectable access policies and system-tray
operation. Packaged-app checks cover actual Harness startup, workspace navigation, language switching
and tray restoration, alongside focused UI and backend regression tests.

---

## 重ね Kasane — realtime Japanese→English video translation

**[japanese-live-transcriber.vercel.app](https://japanese-live-transcriber.vercel.app)** · `Python` `FastAPI` `Celery` `Redis` `faster-whisper` `UniDic` `Next.js` `Docker`

A self-hosted Japanese→English video translator. Subtitles publish *as* the video processes, and every
synchronized Japanese word stays clickable for readings, definitions, confidence and contextual
examples. The complete translation path runs in your own containers — no hosted model API, no key,
no metered service.

**Playback never waits for inference.** The worker prepares the first 12 seconds, then stays ahead
with bounded overlapping audio windows pushed to the browser over SSE. Durable Redis snapshots and
adaptive polling mean an interrupted connection recovers instead of restarting.

**Morphology, because Japanese has no spaces.** Fugashi + UniDic tokenization drives a locally indexed
JMdict lookup with Tatoeba example sentences — readings, Hepburn, parts of speech, bilingual SRT export.

**Work is deduplicated at the fingerprint.** Public analyses are keyed by video ID and inference
profile; concurrent requests for the same video share one in-flight task, tracking parameters don't
fork it, and uploads never enter the shared cache.

**Production ops, not a demo.** PRs run lint, types, builds, dependency audits, analyzer tests, Compose
validation, container builds and a same-origin health smoke test. Merges publish immutable images to
GHCR with OCI SBOMs and provenance; deploys are opt-in to a labeled self-hosted runner behind a
protected environment, with Caddy terminating TLS and everything else on a private network.

---

## NEO TOKYO TRANSIT — Tokyo rail, from graph to 3D interface

**[NEO TOKYO TRANSIT](https://tokyo-train-map.vercel.app/)** · [src](https://github.com/jon-jc/tokyo-train-map) · `TypeScript` `Next.js` `React` `three.js` `React Three Fiber` `zustand`

An explorable 3D map and journey planner spanning **22 lines and 269 stations** across JR,
Tokyo Metro, Toei, Yurikamome and Rinkai. Elevated rail, underground lines and interchange stations
form a layered city that can be searched, filtered and used to plan a trip in English or Japanese.

**A transfer is part of the route's cost.** Dijkstra runs over a **station × line** graph, so changing
lines incurs an explicit transfer penalty. Designated walking links connect nearby stations such as
Tokyo and Otemachi. Results break the journey into line segments, stops, transfers and walking time,
with curated exit guidance for the connections that need it.

**The renderer and planner share geometry.** Rail lines are cached Catmull–Rom curves through station
coordinates at their elevation layers. Animated trains and route highlights follow those same curves;
selecting a journey dims unrelated lines and emphasizes its endpoints and interchanges. The visual
interface stays connected to the underlying network model.

**Navigation works through search as well as the map.** Japanese and romaji fuzzy search supports
keyboard navigation. Station cards set an origin or destination, operator filters reduce visual
clutter, and rail/subway views expose different layers of the network.

**The data model is tested alongside the interface.** Vitest checks dataset integrity, geographic
projection and routing invariants; CI tests and builds the static application before deployment.
Journey times are distance-based estimates, train movement is simulated, and exit guidance is curated.

---

## Fluxgate — distributed telemetry ingestion

**[github.com/jon-jc/fluxgate](https://github.com/jon-jc/fluxgate)** · `Go` `GCP Pub/Sub` `PostgreSQL` `Cloud Run` `Terraform` `OpenTelemetry`

Three stateless services that accept high-volume metric points over HTTP, publish them onto a durable
event bus, aggregate them into event-time windows across a worker fleet, and serve the rollups back
over a query API.

**202 means the broker has it.** The response is withheld until Pub/Sub acknowledges. The faster
answer is to buffer in-process and reply immediately — which is a lie about durability, told at
exactly the moment durability is the whole product.

**Exactly-once accumulation under redelivery**, via a delivery ledger keyed by `(batch, window)`
where the rollup and the ledger entry commit in the same transaction. Redelivery is normal operation
for a broker; double-counting a metric is not.

**Partial success is reported, not rounded off.** One bad point returns which points landed and why
the others didn't, rather than rejecting the batch and making the client bisect it.

**Cardinality is bounded by construction** — labels come from route patterns, never raw paths, so a
metrics backend can't be taken down by a caller with creative URLs. Circuit breakers turn a dependency
outage into fast 503s instead of a timeout queue; a three-phase drain keeps deploys from shedding.

<sub><b>8,970 points/s</b> sustained at p99 <b>60.7 ms</b> · watermark lag 4.2 s against a 10 s window · fuzz targets, integration tests against real services, and Terraform for the entire GCP footprint including per-service accounts, dead-lettering and four alert policies</sub>

---

## SpillSense — environmental data platform & GIS

**[spillsense.vercel.app](https://spillsense.vercel.app)** · [src](https://github.com/jon-jc/spillsense) · `C#` `ASP.NET Core` `EF Core` `SQL Server / SQLite` `Leaflet`

A spill incident data management and analytics platform for Washington State, modeled on how
spill-response programs actually work rather than on what a CRUD scaffold produces.

**Auditable ETL intake.** Every row is validated against its full rule set at once, and rejected rows
are *quarantined verbatim* with each failure reason attached rather than dropped — because the row
someone has to fix is the row you just deleted. Re-importing a file is idempotent by natural key.

**Spatial validation at the boundary.** Statewide WGS 84 bounds catch swapped or malformed coordinates
before they reach the database; all 39 counties are seeded with FIPS codes and Department of Ecology
regional assignments, so geography is reference data rather than free text.

**Two deployment targets, one contract.** An ASP.NET Core system of record owning the database and
intake pipeline, plus a serverless read replica serving a published snapshot — held together by 109
automated tests: xUnit integration tests running real migrations, and `node:test` contract tests that
stop the two hosts drifting apart.

<sub>Bounding-box spatial queries, RFC 7946 GeoJSON, statistical rollups, annual reports and CSV export across 11 OpenAPI-documented endpoints · clustered incident map, trend and substance analytics, URL-encoded shareable filter state, and an intake audit view</sub>

---

## More TypeScript & React

| Project | What it does | Stack |
|---|---|---|
| **[ChordLab](https://chord-finder-ten.vercel.app)** · [src](https://github.com/jon-jc/chord-finder) | Music analysis entirely in the browser, nothing uploaded. Chord recognition over 145 states smoothed by a Viterbi decoder, Krumhansl–Schmuckler key detection, note-level transcription to playable guitar tab, MIDI export. FFT, chromagram, onset detection and pitch estimation written from scratch — **zero runtime dependencies**, all of it off the main thread in a Web Worker. | `TypeScript` `Web Audio` `Web Workers` `DSP` |
| **[LanguageRooms](https://github.com/jon-jc/language-rooms)** | Persistent practice rooms by language and CEFR level on a self-hosted LiveKit SFU: multi-party video and voice, shared whiteboard with photo upload, host controls, active-speaker detection and connection-quality indicators. Moderation, reporting and a review queue are a first-class subsystem rather than an afterthought. | `Next.js` `LiveKit` `Prisma` `Postgres` `JWT` |
| **[Tokyo Move-in Cost Calculator](https://apartmentfeesjapan.vercel.app)** · [src](https://github.com/jon-jc/apartmentfeesjapan) | Japanese leases front-load 4.5–6 months of rent. This models the entire 初期費用 stack — deposit, key money, agency, guarantor, insurance — against a choropleth of all 23 wards on live SUUMO / HOME'S data. Ward boundaries are compiled to ~28 KB of precomputed SVG paths at build time; 23 ward guides regenerate daily on ISR. Fully bilingual. | `Next.js` `TypeScript` `ISR` `i18n` |
| **[Portfolio](https://jon-jc.vercel.app)** · [src](https://github.com/jon-jc/portfolio) | Content-driven site where projects, experience and skills are data — routes, sitemaps, metadata and per-project social cards all generate from it at build time. Command palette with fuzzy matching, pointer-tracking cursor, scroll-triggered reveals, hand-drawn SVG posters from seeded randomness, a print-optimized resume route. Every route prerendered, no client-side fetching. | `Next.js 16` `React 19` `TypeScript` `Motion` |

---

## What I work with

**Front end** — TypeScript, React 19, Next.js (App Router), Tailwind CSS, three.js, Motion, WebSocket & SSE, WebRTC/LiveKit, Web Audio & Web Workers, i18n, accessible and themeable UI

**Backend & data** — Go, C#, ASP.NET Core, EF Core, Python, FastAPI, Node.js, PostgreSQL, SQL Server, Redis, SQLite, Prisma, REST/OpenAPI, event-driven architecture, ETL pipeline design

**AI & audio** — streaming ASR, speaker diarization, LLM orchestration and guardrails, evaluation harnesses (CER/WER/DER, bootstrap CIs, regression gates), VAD and endpointing, DSP

**GIS & visualization** — Leaflet, GeoJSON, spatial queries, coordinate-system validation, choropleths, Chart.js

**Delivery** — Docker, Terraform, GitHub Actions, GCP (Pub/Sub, Cloud Run), AWS (ECS Fargate), Vercel, xUnit, pytest, Vitest, integration & contract testing, fuzzing

<p align="left">
<a href="https://www.typescriptlang.org/" target="_blank"><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg" width="40" height="40" alt="TypeScript"/></a>
<a href="https://reactjs.org/" target="_blank"><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original-wordmark.svg" width="40" height="40" alt="React"/></a>
<a href="https://nextjs.org/" target="_blank"><img src="https://cdn.worldvectorlogo.com/logos/nextjs-2.svg" width="40" height="40" alt="Next.js"/></a>
<a href="https://tailwindcss.com/" target="_blank"><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/tailwindcss/tailwindcss-original.svg" width="40" height="40" alt="Tailwind CSS"/></a>
<a href="https://threejs.org/" target="_blank"><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/threejs/threejs-original.svg" width="40" height="40" alt="three.js"/></a>
<a href="https://nodejs.org/" target="_blank"><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original-wordmark.svg" width="40" height="40" alt="Node.js"/></a>
<a href="https://go.dev/" target="_blank"><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/go/go-original-wordmark.svg" width="40" height="40" alt="Go"/></a>
<a href="https://learn.microsoft.com/dotnet/csharp/" target="_blank"><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/csharp/csharp-original.svg" width="40" height="40" alt="C#"/></a>
<a href="https://dotnet.microsoft.com/" target="_blank"><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/dotnetcore/dotnetcore-original.svg" width="40" height="40" alt=".NET"/></a>
<a href="https://www.python.org/" target="_blank"><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/python/python-original.svg" width="40" height="40" alt="Python"/></a>
<a href="https://fastapi.tiangolo.com/" target="_blank"><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/fastapi/fastapi-original.svg" width="40" height="40" alt="FastAPI"/></a>
<a href="https://www.postgresql.org/" target="_blank"><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/postgresql/postgresql-original-wordmark.svg" width="40" height="40" alt="PostgreSQL"/></a>
<a href="https://www.microsoft.com/sql-server" target="_blank"><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/microsoftsqlserver/microsoftsqlserver-plain-wordmark.svg" width="40" height="40" alt="SQL Server"/></a>
<a href="https://redis.io/" target="_blank"><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/redis/redis-original-wordmark.svg" width="40" height="40" alt="Redis"/></a>
<a href="https://www.sqlite.org/" target="_blank"><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/sqlite/sqlite-original-wordmark.svg" width="40" height="40" alt="SQLite"/></a>
<a href="https://www.docker.com/" target="_blank"><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/docker/docker-original-wordmark.svg" width="40" height="40" alt="Docker"/></a>
<a href="https://www.terraform.io/" target="_blank"><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/terraform/terraform-original.svg" width="40" height="40" alt="Terraform"/></a>
<a href="https://cloud.google.com/" target="_blank"><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/googlecloud/googlecloud-original-wordmark.svg" width="40" height="40" alt="Google Cloud"/></a>
<a href="https://aws.amazon.com/" target="_blank"><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/amazonwebservices/amazonwebservices-original-wordmark.svg" width="40" height="40" alt="AWS"/></a>
<a href="https://github.com/features/actions" target="_blank"><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/githubactions/githubactions-original.svg" width="40" height="40" alt="GitHub Actions"/></a>
<a href="https://git-scm.com/" target="_blank"><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/git/git-original-wordmark.svg" width="40" height="40" alt="Git"/></a>
</p>

---

## 📊 GitHub

<p align="left">
  <img src="https://streak-stats.demolab.com?user=jon-jc&theme=transparent&hide_border=true" height="200" alt="Contribution streak" />
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/top-languages-dark.svg" />
    <img src="assets/top-languages-light.svg" height="200" alt="Most used languages across my public repositories" />
  </picture>
</p>

<sub>The language card is generated from the GitHub API and committed to this repo by
<a href=".github/workflows/language-card.yml">a scheduled workflow</a> — no third-party stats service to rate-limit or go down.</sub>

---

<p align="center">
  <i>Open to software engineering roles in the US and Japan — 日英バイリンガル対応可。<br>
  <a href="mailto:Jonathancho.jc@gmail.com">Jonathancho.jc@gmail.com</a> · <a href="https://linkedin.com/in/jon-jc">LinkedIn</a> · <a href="README.ja.md">日本語版</a></i>
</p>
