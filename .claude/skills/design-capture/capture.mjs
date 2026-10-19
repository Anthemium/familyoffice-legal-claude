// Съём дизайна с любого сайта: скриншоты (десктоп + телефон) и вычисленные стили.
// Использует уже установленный Chrome/Edge — браузеры Playwright скачивать не нужно.
//
//   npm run design:capture -- https://example.com [--out design-captures]
//
// Результат: design-captures/<host>/{desktop.png, mobile.png, tokens.json, report.md}

import { chromium } from "playwright-core";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const url = process.argv[2];
if (!url) {
  console.error("usage: npm run design:capture -- <url> [--out dir]");
  process.exit(1);
}
const outIdx = process.argv.indexOf("--out");
const outRoot = outIdx > 0 ? process.argv[outIdx + 1] : "design-captures";
const dir = path.join(outRoot, new URL(url).host.replace(/[:]/g, "_"));
await mkdir(dir, { recursive: true });

async function launch() {
  for (const channel of ["chrome", "msedge"]) {
    try { return await chromium.launch({ channel }); } catch { /* try next */ }
  }
  throw new Error("Chrome or Edge not found");
}

const browser = await launch();

for (const [name, viewport] of [["desktop", { width: 1440, height: 900 }], ["mobile", { width: 390, height: 844 }]]) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: name === "mobile" ? 2 : 1 });
  await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
  await page.screenshot({ path: path.join(dir, `${name}.png`), fullPage: true });
  await page.close();
}

const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });

const tokens = await page.evaluate(() => {
  const count = (map, key) => { if (key) map[key] = (map[key] || 0) + 1; };
  const colors = {}, backgrounds = {}, fonts = {}, sizes = {}, radii = {}, shadows = {};
  const visible = [...document.querySelectorAll("body *")].filter((el) => {
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  });
  for (const el of visible) {
    const s = getComputedStyle(el);
    const hasText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
    if (hasText) {
      count(colors, s.color);
      count(fonts, s.fontFamily.split(",")[0].replace(/["']/g, "").trim());
      count(sizes, `${s.fontSize}/${s.lineHeight} ${s.fontWeight}`);
    }
    if (s.backgroundColor !== "rgba(0, 0, 0, 0)") count(backgrounds, s.backgroundColor);
    if (s.borderRadius !== "0px") count(radii, s.borderRadius);
    if (s.boxShadow !== "none") count(shadows, s.boxShadow);
  }
  const top = (m, n = 12) => Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, n);
  const cssVars = {};
  for (const sheet of [...document.styleSheets]) {
    let rules;
    try { rules = sheet.cssRules; } catch { continue; }
    for (const rule of rules) {
      if (rule.selectorText === ":root" && rule.style) {
        for (const prop of rule.style) if (prop.startsWith("--")) cssVars[prop] = rule.style.getPropertyValue(prop).trim();
      }
    }
  }
  const headings = [...document.querySelectorAll("h1,h2,h3")].slice(0, 40).map((h) => `${h.tagName} ${h.textContent.trim().slice(0, 90)}`);
  return {
    title: document.title,
    colors: top(colors), backgrounds: top(backgrounds), fonts: top(fonts, 8),
    typeScale: top(sizes, 16), radii: top(radii, 8), shadows: top(shadows, 6),
    cssVars, headings,
  };
});
await browser.close();

await writeFile(path.join(dir, "tokens.json"), JSON.stringify({ url, capturedAt: new Date().toISOString(), ...tokens }, null, 2));

const list = (rows) => rows.map(([k, n]) => `- \`${k}\` × ${n}`).join("\n");
await writeFile(
  path.join(dir, "report.md"),
  `# ${tokens.title}\n\n${url}\n\n## Text colors\n${list(tokens.colors)}\n\n## Backgrounds\n${list(tokens.backgrounds)}\n\n` +
    `## Fonts\n${list(tokens.fonts)}\n\n## Type scale (size/line-height weight)\n${list(tokens.typeScale)}\n\n` +
    `## Radii\n${list(tokens.radii)}\n\n## Shadows\n${list(tokens.shadows)}\n\n## Structure\n${tokens.headings.map((h) => `- ${h}`).join("\n")}\n`
);

console.log(`saved → ${dir}`);
