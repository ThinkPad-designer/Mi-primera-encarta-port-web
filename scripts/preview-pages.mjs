import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

// An exact-case, subdirectory preview catches errors hidden by Windows paths.
const root = fileURLToPath(new URL("../docs/", import.meta.url));
const files = new Map();
function index(dir, prefix = "") {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const relative = prefix + entry.name;
    if (entry.isDirectory()) index(path.join(dir, entry.name), relative + "/");
    else files.set(relative, path.join(dir, entry.name));
  }
}
index(root);
const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".wasm": "application/wasm",
  ".swf": "application/x-shockwave-flash",
  ".xml": "application/xml",
  ".iax": "application/xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".mp3": "audio/mpeg",
};
http
  .createServer((req, res) => {
    let route;
    try {
      route = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
    } catch {
      res.writeHead(400).end();
      return;
    }
    if (route === "/encarta") {
      res.writeHead(302, { Location: "/encarta/" }).end();
      return;
    }
    const relative = route.startsWith("/encarta/")
      ? route.slice("/encarta/".length) || "index.html"
      : "";
    const file = files.get(relative);
    if (!file) {
      console.warn("404:", route);
      res.writeHead(404).end("Not found");
      return;
    }
    res.writeHead(200, { "Content-Type": mime[path.extname(file)] || "application/octet-stream" });
    if (req.method === "HEAD") res.end();
    else fs.createReadStream(file).pipe(res);
  })
  .listen(4173, "127.0.0.1", () =>
    console.log("Vista equivalente a Pages: http://127.0.0.1:4173/encarta/"),
  );
