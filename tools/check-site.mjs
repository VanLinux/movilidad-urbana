import * as cheerio from "cheerio";
import { access, readFile, readdir, stat } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const index = await readFile(join(root, "index.html"), "utf8");
const articles = await readFile(join(root, "articulos", "index.html"), "utf8");
const classes = await readFile(join(root, "clases", "index.html"), "utf8");
const resources = await readFile(join(root, "recursos", "index.html"), "utf8");
const softwareCatalog = await readFile(join(root, "software", "catalogo-propio.js"), "utf8");
const articleCount = (articles.match(/class="archive-card"/g) || []).length;

const checks = [
  [index.includes("Ingeniería para"), "portada"],
  [articleCount > 0, "archivo de artículos"],
  [classes.includes("30"), "30 recursos de clase"],
  [classes.includes("Contexto de la ingeniería enfocada a la movilidad"), "nueva clase de movilidad"],
  [classes.includes("Ingeniería de Tránsito"), "materias"],
  [resources.includes("Calculadora NumWorks en línea"), "calculadora NumWorks"],
  [resources.includes("Equilibrio de Wardrop en GNU Octave"), "código de Wardrop"],
  [resources.includes("no son formatos oficiales"), "aviso de hojas de campo"],
  [softwareCatalog.includes("Versión 3.1.1"), "MacroNet Transport 3.1.1"],
  [softwareCatalog.includes("Manual_MacroNet_Transport_v3.1.1.pdf"), "manual de MacroNet 3.1.1"],
  [index.includes("transporte-urbano-ingenieria.blogspot.com"), "enlace al blog"],
];

for (const [ok, label] of checks) {
  if (!ok) throw new Error(`Falta: ${label}`);
}

await stat(join(root, "assets", "media", "hero-intercambio.webp"));
await stat(join(root, "software", "manuales", "Manual_MacroNet_Transport_v3.1.1.pdf"));
await stat(join(root, "recursos", "codigo", "wardrop.m"));
await stat(join(root, "recursos", "imagenes", "wardrop-network.svg"));
for (const file of await readdir(join(root, "assets", "media"))) {
  if (file.endsWith(".webp") && (await stat(join(root, "assets", "media", file))).size === 0) {
    throw new Error(`Imagen vacía: ${file}`);
  }
}

const htmlFiles = [];
async function collectHtml(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".git") continue;
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await collectHtml(path);
    else if (entry.name.endsWith(".html")) htmlFiles.push(path);
  }
}

await collectHtml(root);
const expectedPages = 9 + articleCount; // incluye /diagnostico/
if (htmlFiles.length !== expectedPages) {
  throw new Error(`Se esperaban ${expectedPages} páginas y se encontraron ${htmlFiles.length}`);
}

for (const file of htmlFiles) {
  const $ = cheerio.load(await readFile(file, "utf8"));
  for (const element of $("a[href], img[src], link[href], script[src]").toArray()) {
    const value = $(element).attr("href") || $(element).attr("src");
    if (!value?.startsWith("/movilidad-urbana/")) continue;
    const pathname = value.split("#")[0].split("?")[0].replace("/movilidad-urbana/", "");
    const target = value.endsWith("/") ? join(root, pathname, "index.html") : join(root, pathname);
    await access(target);
  }
}

console.log(`Contenido esencial, ${htmlFiles.length} páginas y enlaces internos verificados.`);
