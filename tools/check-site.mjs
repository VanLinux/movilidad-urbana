import * as cheerio from "cheerio";
import { access, readFile, readdir, stat } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const index = await readFile(join(root, "index.html"), "utf8");
const articles = await readFile(join(root, "articulos", "index.html"), "utf8");
const classes = await readFile(join(root, "clases", "index.html"), "utf8");
const articleCount = (articles.match(/class="archive-card"/g) || []).length;

const checks = [
  [index.includes("Ingeniería para"), "portada"],
  [articleCount > 0, "archivo de artículos"],
  [classes.includes("29"), "29 recursos de clase"],
  [classes.includes("Ingeniería de Tránsito"), "materias"],
  [index.includes("transporte-urbano-ingenieria.blogspot.com"), "enlace al blog"],
];

for (const [ok, label] of checks) {
  if (!ok) throw new Error(`Falta: ${label}`);
}

await stat(join(root, "assets", "media", "hero-intercambio.webp"));
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
const expectedPages = 6 + articleCount;
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
