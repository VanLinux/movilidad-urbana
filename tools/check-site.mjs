import * as cheerio from "cheerio";
import { access, readFile, readdir, stat } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const index = await readFile(join(root, "index.html"), "utf8");
const articles = await readFile(join(root, "articulos", "index.html"), "utf8");
const classes = await readFile(join(root, "clases", "index.html"), "utf8");

const checks = [
  [index.includes("Ingeniería para"), "portada"],
  [(articles.match(/class="archive-card"/g) || []).length === 34, "archivo de 34 artículos"],
  [classes.includes("29"), "29 recursos de clase"],
  [classes.includes("Ingeniería de Tránsito"), "materias"],
  [index.includes("transporte-urbano-ingenieria.blogspot.com"), "enlace al blog"],
];

for (const [ok, label] of checks) {
  if (!ok) throw new Error(`Falta: ${label}`);
}

await stat(join(root, "assets", "media", "hero-intercambio.webp"));

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
if (htmlFiles.length !== 40) throw new Error(`Se esperaban 40 páginas y se encontraron ${htmlFiles.length}`);

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
