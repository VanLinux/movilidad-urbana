import * as cheerio from "cheerio";
import { execFile as execFileCallback } from "node:child_process";
import { mkdir, readdir, stat, unlink, writeFile } from "node:fs/promises";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const source = "https://movilidad-urbana.vanlinux.chatgpt.site";
const base = "/movilidad-urbana";
const execFile = promisify(execFileCallback);
const siteToken = process.env.SITES_BEARER_TOKEN;
const siteRequest = siteToken
  ? { headers: { "OAI-Sites-Authorization": `Bearer ${siteToken}` } }
  : {};
let articleCount = 0;

const coreRoutes = ["/", "/articulos", "/clases", "/videos", "/biblioteca", "/software"];

const routeLabels = {
  "/": "Inicio",
  "/articulos": "Artículos",
  "/clases": "Clases",
  "/videos": "Videos",
  "/biblioteca": "Biblioteca",
  "/software": "Software",
};

async function fetchText(url) {
  const response = await fetch(url, siteRequest);
  if (!response.ok) throw new Error(`${response.status} al recuperar ${url}`);
  return response.text();
}

function localRoute(pathname) {
  if (pathname === "/") return `${base}/`;
  return `${base}${pathname.replace(/\/$/, "")}/`;
}

function routeOutput(pathname) {
  return pathname === "/"
    ? join(root, "index.html")
    : join(root, pathname.slice(1), "index.html");
}

function navigation(activePath) {
  const links = Object.entries(routeLabels)
    .map(([path, label]) => {
      const active = path === "/"
        ? activePath === "/"
        : activePath === path || activePath.startsWith(`${path}/`);
      return `<a href="${localRoute(path)}"${active ? ' aria-current="page"' : ""}>${label}</a>`;
    })
    .join("");

  return `<header class="site-header">
      <a class="brand" href="${base}/" aria-label="Ir al inicio">
        <span class="brand-code">HABG/</span>
        <span>movilidad urbana</span>
      </a>
      <button class="menu-button" type="button" aria-expanded="false" aria-controls="main-nav">
        <span>menú</span><span aria-hidden="true">+</span>
      </button>
      <nav class="main-nav" id="main-nav" aria-label="Navegación principal">${links}</nav>
    </header>`;
}

function footer() {
  return `<footer class="site-footer page-shell">
      <div>
        <strong>Héctor A. Benítez García</strong>
        <span>Ingeniería · investigación · docencia</span>
      </div>
      <p>Ciudad de México · ${new Date().getFullYear()}</p>
      <div class="footer-links">
        <a href="https://transporte-urbano-ingenieria.blogspot.com/" target="_blank" rel="noreferrer">blog original ↗</a>
        <a href="#top">volver arriba ↑</a>
      </div>
    </footer>`;
}

function heroGraphic() {
  return `
    <figure class="hero-technical" aria-label="Diagrama abstracto de una red de transporte urbano">
      <svg viewBox="0 0 760 560" role="img" aria-hidden="true">
        <g class="technical-grid">
          <path d="M0 80H760M0 160H760M0 240H760M0 320H760M0 400H760M0 480H760"/>
          <path d="M80 0V560M160 0V560M240 0V560M320 0V560M400 0V560M480 0V560M560 0V560M640 0V560"/>
        </g>
        <g class="route route-a"><path d="M-20 438C93 435 112 330 213 326S332 404 419 343 511 126 780 107"/></g>
        <g class="route route-b"><path d="M12 137C154 148 196 223 307 215S465 97 530 179 560 391 754 431"/></g>
        <g class="route route-c"><path d="M92 560C91 443 181 405 274 415S431 522 516 452 577 248 677 243"/></g>
        <g class="nodes">
          <circle cx="112" cy="393" r="7"/><circle cx="213" cy="326" r="7"/>
          <circle cx="419" cy="343" r="7"/><circle cx="542" cy="157" r="7"/>
          <circle cx="196" cy="202" r="7"/><circle cx="307" cy="215" r="7"/>
          <circle cx="530" cy="179" r="7"/><circle cx="274" cy="415" r="7"/>
          <circle cx="516" cy="452" r="7"/><circle cx="645" cy="260" r="7"/>
        </g>
      </svg>
      <figcaption>red urbana / nodos / flujos</figcaption>
    </figure>`;
}

async function saveInternalImage(src) {
  const url = new URL(src, source);
  if (url.origin !== source) return src;
  const cleanName = url.pathname.split("/").filter(Boolean).pop() || "image.bin";
  const extension = extname(cleanName) || ".bin";
  const stem = cleanName.slice(0, cleanName.length - extension.length).replace(/[^a-zA-Z0-9_-]+/g, "-");
  const temporaryName = `${stem}${extension}`;
  const optimizedName = `${stem}.webp`;
  const temporary = join(root, "assets", "media", temporaryName);
  const optimized = join(root, "assets", "media", optimizedName);
  await mkdir(dirname(temporary), { recursive: true });
  const response = await fetch(url, siteRequest);
  if (!response.ok) throw new Error(`${response.status} al recuperar imagen ${url}`);
  await writeFile(temporary, Buffer.from(await response.arrayBuffer()));
  await execFile("convert", [temporary, "-resize", "1400x900>", "-quality", "78", optimized]);
  if ((await stat(optimized)).size === 0) throw new Error(`La imagen optimizada quedó vacía: ${optimizedName}`);
  await unlink(temporary);
  return `${base}/assets/media/${optimizedName}`;
}

async function prepareMain(html, pathname) {
  const $ = cheerio.load(html);
  const main = $("main").first();
  if (!main.length) throw new Error(`No se encontró <main> en ${pathname}`);

  main.find("script, style, .site-header, .site-footer").remove();
  main.find("a").each((_, element) => {
    const anchor = $(element);
    const href = anchor.attr("href");
    if (!href) return;
    if (href.startsWith("#")) return;
    if (!href.startsWith("/") && !/^https?:\/\//i.test(href)) return;
    const url = new URL(href, source);
    if (url.origin !== source) {
      anchor.attr("target", "_blank").attr("rel", "noreferrer");
      return;
    }
    anchor.attr("href", `${localRoute(url.pathname)}${url.hash}`);
  });

  for (const image of main.find("img").toArray()) {
    const img = $(image);
    const src = img.attr("src");
    if (!src) continue;
    img.attr("src", await saveInternalImage(src));
    img.attr("loading", "lazy").attr("decoding", "async");
  }

  main.find("iframe").each((_, element) => {
    $(element).attr("loading", "lazy").attr("title", $(element).attr("title") || "Contenido audiovisual");
  });

  if (pathname === "/") {
    main.find(".hero").prepend(heroGraphic());
  }

  if (pathname === "/articulos") {
    main.find(".archive-hero .page-shell > p").last().text(
      `${articleCount} textos migrados del blog original, conservando fechas, etiquetas y autoría.`
    );
  }

  return main.toString();
}

function pageTemplate({ title, description, pathname, main }) {
  return `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="${description.replaceAll('"', "&quot;")}">
    <meta name="theme-color" content="#111111">
    <title>${title}</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css">
    <link rel="stylesheet" href="${base}/styles.css">
    <script src="${base}/script.js" defer></script>
  </head>
  <body id="top">
    <a class="skip-link" href="#contenido">Saltar al contenido</a>
    ${navigation(pathname)}
    <div id="contenido">${main}</div>
    ${footer()}
  </body>
</html>`;
}

async function discoverArticleRoutes() {
  const html = await fetchText(`${source}/articulos`);
  const $ = cheerio.load(html);
  return [...new Set(
    $("a[href^='/articulos/']")
      .toArray()
      .map((anchor) => new URL($(anchor).attr("href"), source).pathname.replace(/\/$/, ""))
  )];
}

async function buildRoute(pathname) {
  const html = await fetchText(`${source}${pathname}`);
  const $ = cheerio.load(html);
  const title = $("title").text().trim() || "Ingeniería en Movilidad Urbana y Transporte";
  const description = $("meta[name='description']").attr("content")
    || "Portal académico de ingeniería en movilidad urbana y transporte.";
  const main = await prepareMain(html, pathname);
  const output = routeOutput(pathname);
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, pageTemplate({ title, description, pathname, main }));
  console.log(`generado ${pathname}`);
}

await saveInternalImage("/hero-intercambio.png");
const articleRoutes = await discoverArticleRoutes();
articleCount = articleRoutes.length;
const routes = [...coreRoutes, ...articleRoutes];
for (const route of routes) await buildRoute(route);
for (const file of await readdir(join(root, "assets", "media"))) {
  if (file.endsWith(".png")) await unlink(join(root, "assets", "media", file));
}
for (const file of await readdir(join(root, "assets", "media"))) {
  if (file.endsWith(".webp") && (await stat(join(root, "assets", "media", file))).size === 0) {
    throw new Error(`La imagen optimizada quedó vacía: ${file}`);
  }
}
console.log(`\n${routes.length} páginas generadas (${articleRoutes.length} artículos).`);
