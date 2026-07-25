// Generates the "Most used languages" card as committed SVGs.
//
// Third-party stats services rate-limit and go down; this reads the GitHub
// Languages API directly and writes light/dark SVGs into assets/, so the
// profile renders instantly and never depends on someone else's uptime.
// Refreshed on a schedule by .github/workflows/language-card.yml.
//
// Usage: node scripts/generate-language-card.mjs   (needs gh CLI authenticated)

import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const TOP_N = 8;
const USER = process.env.PROFILE_USER ?? "jon-jc";

// Linguist colors, so the card reads the same as GitHub's own language bars.
const COLORS = {
  TypeScript: "#3178c6", JavaScript: "#f1e05a", "C#": "#178600", Python: "#3572A5",
  CSS: "#663399", HTML: "#e34c26", Java: "#b07219", Dockerfile: "#384d54",
  GDScript: "#355570", Shell: "#89e051", "C++": "#f34b7d", C: "#555555",
  Go: "#00ADD8", Rust: "#dea584", Ruby: "#701516", PHP: "#4F5D95",
  Svelte: "#ff3e00", Vue: "#41b883", SCSS: "#c6538c", Jupyter: "#DA5B0B",
};
const FALLBACK = "#8b949e";

const THEMES = {
  light: { title: "#1f2328", label: "#656d76", track: "#eaeef2" },
  dark: { title: "#e6edf3", label: "#8b949e", track: "#21262d" },
};

const gh = (path) =>
  JSON.parse(execFileSync("gh", ["api", path, "--paginate"], { encoding: "utf8", maxBuffer: 64e6 }));

function collectLanguages() {
  // Public endpoint on purpose: it needs no user-scoped token, so the
  // scheduled workflow runs on the default GITHUB_TOKEN.
  const repos = gh(`users/${USER}/repos?per_page=100&type=owner`)
    .filter((r) => !r.private && !r.fork && !r.archived);

  const totals = new Map();
  for (const repo of repos) {
    let languages;
    try {
      languages = gh(`repos/${repo.full_name}/languages`);
    } catch {
      continue; // a repo we can't read shouldn't fail the whole card
    }
    for (const [name, bytes] of Object.entries(languages)) {
      totals.set(name, (totals.get(name) ?? 0) + bytes);
    }
  }

  const total = [...totals.values()].reduce((a, b) => a + b, 0);
  const ranked = [...totals.entries()].sort((a, b) => b[1] - a[1]);
  const top = ranked.slice(0, TOP_N).map(([name, bytes]) => ({
    name, pct: (bytes / total) * 100, color: COLORS[name] ?? FALLBACK,
  }));

  const restBytes = ranked.slice(TOP_N).reduce((sum, [, bytes]) => sum + bytes, 0);
  if (restBytes > 0) {
    top.push({ name: "Other", pct: (restBytes / total) * 100, color: FALLBACK });
  }
  return { languages: top, repoCount: repos.length };
}

const escapeXml = (s) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" }[c]));

function renderSvg({ languages, repoCount }, theme) {
  const t = THEMES[theme];
  const W = 380, PAD = 20, BAR_Y = 62, BAR_H = 10, BAR_W = W - PAD * 2;
  const COLS = 2, ROW_H = 22, COL_W = BAR_W / COLS;
  const rows = Math.ceil(languages.length / COLS);
  const H = BAR_Y + BAR_H + 22 + rows * ROW_H;

  // Stacked bar. Segments are laid end to end; the last one absorbs rounding
  // so the bar always ends flush with its track.
  let x = 0;
  const segments = languages.map((lang, i) => {
    const w = i === languages.length - 1 ? BAR_W - x : (lang.pct / 100) * BAR_W;
    const seg = `<rect x="${(PAD + x).toFixed(2)}" y="${BAR_Y}" width="${Math.max(0, w).toFixed(2)}" height="${BAR_H}" fill="${lang.color}"/>`;
    x += w;
    return seg;
  }).join("");

  const legend = languages.map((lang, i) => {
    const col = i % COLS, row = Math.floor(i / COLS);
    const lx = PAD + col * COL_W;
    const ly = BAR_Y + BAR_H + 34 + row * ROW_H;
    return `<circle cx="${lx + 5}" cy="${ly - 4}" r="5" fill="${lang.color}"/>` +
      `<text x="${lx + 17}" y="${ly}" class="label">${escapeXml(lang.name)}</text>` +
      `<text x="${lx + COL_W - 34}" y="${ly}" class="pct">${lang.pct.toFixed(1)}%</text>`;
  }).join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Most used languages">
  <style>
    text { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; }
    .title { font-size: 15px; font-weight: 600; fill: ${t.title}; }
    .sub { font-size: 11px; fill: ${t.label}; }
    .label { font-size: 12px; fill: ${t.title}; }
    .pct { font-size: 12px; fill: ${t.label}; }
  </style>
  <text x="${PAD}" y="30" class="title">Most used languages</text>
  <text x="${PAD}" y="47" class="sub">across ${repoCount} public repositories</text>
  <rect x="${PAD}" y="${BAR_Y}" width="${BAR_W}" height="${BAR_H}" rx="5" fill="${t.track}"/>
  <g clip-path="inset(0 round 5px)"><g>${segments}</g></g>
  ${legend}
</svg>
`;
}

const data = collectLanguages();
mkdirSync(join(ROOT, "assets"), { recursive: true });
for (const theme of Object.keys(THEMES)) {
  writeFileSync(join(ROOT, "assets", `top-languages-${theme}.svg`), renderSvg(data, theme));
}
console.log(`Wrote language card for ${data.repoCount} repos: ` +
  data.languages.map((l) => `${l.name} ${l.pct.toFixed(1)}%`).join(", "));
