import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceRoot = path.resolve(repoRoot, "..");
const publicRoot = path.join(repoRoot, "public");

const sites = [
  { source: "edit.lamquoccuong", target: "edit", entry: "index.html", base: "/edit/" },
  { source: "bio.lamquoccuong", target: "bio", entry: "index.html", base: "/bio/" },
  { source: "nuoitoi.lamquoccuong", target: "nuoitoi", entry: "index.html", base: "/nuoitoi/" }
];

const pathFor = (site, relativePath = "") => path.join(publicRoot, site.target, relativePath);

function rewriteInternalUrls(html) {
  return html
    .replaceAll("https://edit.lamquoccuong.com", "/edit")
    .replaceAll("https://bio.lamquoccuong.com", "/bio")
    .replaceAll("https://nuoitoi.lamquoccuong.com", "/nuoitoi")
    .replaceAll("https://lamquoccuong.io.vn", "/")
    .replaceAll("https://lamquoccuong.com", "/");
}

function addHubNavigation(html, base) {
  const withBase = html.includes("<base ")
    ? html
    : html.replace(/<head([^>]*)>/i, `<head$1>\n  <base href="${base}">`);
  const withAssets = withBase
    .replace("</head>", '  <link rel="stylesheet" href="/site-hub/navigation.css">\n</head>')
    .replace("</body>", '  <script src="/site-hub/navigation.js" defer></script>\n</body>');
  return withAssets;
}

async function writePage(site, sourceFile, targetFile, base) {
  let html = await fs.readFile(sourceFile, "utf8");
  html = rewriteInternalUrls(html);
  html = html.replace(/href="\.\.\/index\.html(#[^"]*)?"/g, (_, hash = "") => `href="/${hash}"`);
  html = addHubNavigation(html, base);
  await fs.mkdir(path.dirname(targetFile), { recursive: true });
  await fs.writeFile(targetFile, html);
}

async function copyIfPresent(source, target) {
  try {
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.copyFile(source, target);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
}

async function integrate() {
  await fs.mkdir(path.join(publicRoot, "site-hub"), { recursive: true });

  for (const site of sites) {
    const sourceDir = path.join(sourceRoot, site.source);
    await writePage(site, path.join(sourceDir, site.entry), pathFor(site, site.entry), site.base);

    for (const asset of ["favicon.png", "photo-public.jpg", "photo-public.webp"]) {
      await copyIfPresent(path.join(sourceDir, asset), pathFor(site, asset));
    }

  }

  await fs.writeFile(path.join(publicRoot, "site-hub", "integration-map.json"), `${JSON.stringify({
    generatedAt: new Date().toISOString(),
    routes: ["/edit/", "/bio/", "/nuoitoi/"]
  }, null, 2)}\n`);
}

integrate().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
