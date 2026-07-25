<h1 align="center">Jonathan Cho</h1>

<p align="center">
  <b>Software engineer — data systems, GIS, and the interfaces that make them useful.</b>
</p>

<p align="center">
  I build the whole path from raw data to decision: validated ingestion pipelines,<br>
  well-modeled databases, clean REST APIs, and the maps and dashboards on top of them.
</p>

<p align="center">
  <a href="https://linkedin.com/in/jon-jc"><img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=flat-square&logo=linkedin&logoColor=white" alt="LinkedIn" /></a>
  <a href="mailto:Jonathancho.jc@gmail.com"><img src="https://img.shields.io/badge/Email-EA4335?style=flat-square&logo=gmail&logoColor=white" alt="Email" /></a>
  <img src="https://img.shields.io/badge/Lacey,%20WA-4c8c4a?style=flat-square&logo=googlemaps&logoColor=white" alt="Lacey, WA" />
</p>

---

## 🛢️ Featured — SpillSense

**A spill incident data management & analytics platform for Washington State.**

[**Live app**](https://spillsense.vercel.app) · [**Source**](https://github.com/jon-jc/spillsense) · `C#` `ASP.NET Core` `EF Core` `SQL` `Leaflet`

An end-to-end environmental data system, modeled on how spill-response programs actually work:

- **Auditable ETL intake** — every row is validated against its full rule set at once, and rejected rows are *quarantined verbatim* with each failure reason rather than dropped. Re-importing a file is idempotent by natural key.
- **Spatial validation at the boundary** — statewide WGS 84 bounds catch swapped or malformed coordinates before they reach the database; all 39 counties are seeded with FIPS codes and Ecology regional assignments.
- **Filterable REST API** — bounding-box spatial queries, RFC 7946 GeoJSON, statistical rollups, annual reports, and CSV export, documented with OpenAPI.
- **Interactive GIS dashboard** — clustered incident map, trend and substance analytics, shareable URL-encoded filter state, and an intake audit view.
- **Two deployment targets, one contract** — an ASP.NET Core system of record plus a serverless replica, held together by **109 automated tests** across both suites in CI.

---

## 🚀 Selected Work

| Project | What it does | Stack |
|---|---|---|
| **[NEO TOKYO TRANSIT](https://tokyo-train-map.vercel.app)** · [src](https://github.com/jon-jc/tokyo-train-map) | A fully explorable 3D map of Tokyo's rail network — JR, Metro, Toei, Yurikamome, Rinkai — with trains animated in real time against their schedules, doubling as a working multi-operator route planner. | `TypeScript` `Three.js` `CI/CD` |
| **[ChordLab](https://chord-finder-ten.vercel.app)** · [src](https://github.com/jon-jc/chord-finder) | Music analysis entirely in the browser: chord recognition across 145 states smoothed by a Viterbi decoder, Krumhansl–Schmuckler key detection, note-level transcription to playable guitar tab, and MIDI export. | `TypeScript` `Web Audio` `DSP` |
| **[Kasane](https://japanese-live-transcriber.vercel.app)** | A self-hosted Japanese→English video translator. Subtitles publish as the video processes, and every Japanese word stays clickable for readings and definitions — no hosted model API, no metered service. | `Python` `TypeScript` `Docker` |
| **[Tokyo Move-in Cost Calculator](https://apartmentfeesjapan.vercel.app)** · [src](https://github.com/jon-jc/apartmentfeesjapan) | Japanese leases front-load 4.5–6 months of rent. This models the entire 初期費用 fee stack — deposit, key money, agency, guarantor, insurance — with ward-level rent maps, fully bilingual. | `TypeScript` `i18n` |
| **[LanguageRooms](https://github.com/jon-jc/language-rooms)** | Persistent practice rooms organized by language and level, built around live multi-party video and voice with a shared collaborative whiteboard. | `TypeScript` `WebRTC` `Docker` |

---

## 🧰 What I Work With

**Data & backend** — C#, ASP.NET Core, Entity Framework Core, SQL Server, PostgreSQL, SQLite, REST/OpenAPI, ETL pipeline design, Node.js, Python

**GIS & visualization** — Leaflet, GeoJSON, spatial queries, coordinate-system validation, Three.js, Chart.js, interactive data visualization

**Front end** — TypeScript, React, Next.js, Tailwind CSS, Web Audio, accessible and themeable UI

**Delivery** — Docker, GitHub Actions, xUnit, integration & contract testing, Vercel, AWS

<p align="left">
<a href="https://learn.microsoft.com/dotnet/csharp/" target="_blank"><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/csharp/csharp-original.svg" width="40" height="40" alt="C#"/></a>
<a href="https://dotnet.microsoft.com/" target="_blank"><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/dotnetcore/dotnetcore-original.svg" width="40" height="40" alt=".NET"/></a>
<a href="https://www.microsoft.com/sql-server" target="_blank"><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/microsoftsqlserver/microsoftsqlserver-plain-wordmark.svg" width="40" height="40" alt="SQL Server"/></a>
<a href="https://www.postgresql.org/" target="_blank"><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/postgresql/postgresql-original-wordmark.svg" width="40" height="40" alt="PostgreSQL"/></a>
<a href="https://www.sqlite.org/" target="_blank"><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/sqlite/sqlite-original-wordmark.svg" width="40" height="40" alt="SQLite"/></a>
<a href="https://www.typescriptlang.org/" target="_blank"><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg" width="40" height="40" alt="TypeScript"/></a>
<a href="https://reactjs.org/" target="_blank"><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original-wordmark.svg" width="40" height="40" alt="React"/></a>
<a href="https://nextjs.org/" target="_blank"><img src="https://cdn.worldvectorlogo.com/logos/nextjs-2.svg" width="40" height="40" alt="Next.js"/></a>
<a href="https://threejs.org/" target="_blank"><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/threejs/threejs-original.svg" width="40" height="40" alt="Three.js"/></a>
<a href="https://tailwindcss.com/" target="_blank"><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/tailwindcss/tailwindcss-original.svg" width="40" height="40" alt="Tailwind CSS"/></a>
<a href="https://nodejs.org/" target="_blank"><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original-wordmark.svg" width="40" height="40" alt="Node.js"/></a>
<a href="https://www.python.org/" target="_blank"><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/python/python-original.svg" width="40" height="40" alt="Python"/></a>
<a href="https://www.java.com/" target="_blank"><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/java/java-original.svg" width="40" height="40" alt="Java"/></a>
<a href="https://www.docker.com/" target="_blank"><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/docker/docker-original-wordmark.svg" width="40" height="40" alt="Docker"/></a>
<a href="https://github.com/features/actions" target="_blank"><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/githubactions/githubactions-original.svg" width="40" height="40" alt="GitHub Actions"/></a>
<a href="https://git-scm.com/" target="_blank"><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/git/git-original-wordmark.svg" width="40" height="40" alt="Git"/></a>
</p>

---

## 📊 GitHub

<p align="left">
  <img src="https://streak-stats.demolab.com?user=jon-jc&theme=transparent&hide_border=true" height="165" alt="Contribution streak" />
  <img src="https://github-readme-stats.vercel.app/api/top-langs/?username=jon-jc&layout=compact&theme=transparent&hide_border=true&langs_count=8" height="165" alt="Top languages" />
</p>

---

<p align="center">
  <i>Open to software engineering roles — reach me at <a href="mailto:Jonathancho.jc@gmail.com">Jonathancho.jc@gmail.com</a>.</i>
</p>
