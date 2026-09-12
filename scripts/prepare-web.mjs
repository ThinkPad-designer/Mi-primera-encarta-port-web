import { cp, mkdir, readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
const root = fileURLToPath(new URL("../", import.meta.url));
const source = path.join(root, "web/node_modules/@ruffle-rs/ruffle");
const output = path.join(root, "web/public/ruffle");
await mkdir(output, { recursive: true });
for (const file of await readdir(source)) {
  if (/\.(js|wasm)$|LICENSE|README/i.test(file)) {
    const src = path.join(source, file), dest = path.join(output, file);
    const existing = await readFile(dest).catch(() => null);
    if (!existing || !existing.equals(await readFile(src))) await cp(src, dest);
  }
}
console.log("Ruffle preparado para alojamiento estático.");
await import("./localize-catalog.mjs");
await import("./patch-flash.mjs");
