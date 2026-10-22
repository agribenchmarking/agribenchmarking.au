import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url));
const port = Number(process.env.PORT) || 3010;

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".js": "text/javascript; charset=utf-8",
};

const server = createServer(async (request, response) => {
  const url = new URL(request.url ?? "/", "http://127.0.0.1");
  const pathname = url.pathname === "/" ? "/index.html" : url.pathname;
  let file;
  try {
    file = normalize(join(root, decodeURIComponent(pathname)));
  } catch {
    // A malformed escape (`/%E0%A4%A`) throws; uncaught, it ends the process.
    response.writeHead(400).end();
    return;
  }
  if (
    file !== root &&
    !file.startsWith(root.endsWith(sep) ? root : root + sep)
  ) {
    response.writeHead(403).end();
    return;
  }
  // Only the site's own file types: never server.mjs, package.json, the
  // tests, or a dotfile (`.env`, `.git/`), which all live under root too.
  if (!Object.hasOwn(types, extname(file))) {
    response.writeHead(404).end("Not found");
    return;
  }
  try {
    const body = await readFile(file);
    response.writeHead(200, {
      "content-type": types[extname(file)],
    });
    response.end(body);
  } catch {
    response.writeHead(404).end("Not found");
  }
});

server.listen(port, "127.0.0.1");
