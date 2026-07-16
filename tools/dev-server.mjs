import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { dirname, extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const repository = dirname(dirname(fileURLToPath(import.meta.url)));
const servedRoot = dirname(repository);
const portIndex = process.argv.indexOf("--port");
const hostIndex = process.argv.indexOf("--host");
const port = Number(portIndex >= 0 ? process.argv[portIndex + 1] : process.env.PORT || 4173);
const host = hostIndex >= 0 ? process.argv[hostIndex + 1] : "0.0.0.0";

const types = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};

createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, "http://local").pathname);
    let target = normalize(join(servedRoot, pathname));
    if (!target.startsWith(servedRoot)) throw new Error("Ruta no permitida");
    const info = await stat(target);
    if (info.isDirectory()) target = join(target, "index.html");
    const body = await readFile(target);
    response.writeHead(200, { "content-type": types[extname(target)] || "application/octet-stream" });
    response.end(body);
  } catch {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("No encontrado");
  }
}).listen(port, host, () => console.log(`Vista previa en http://${host}:${port}/movilidad-urbana/`));
