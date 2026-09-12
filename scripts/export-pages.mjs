import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("../", import.meta.url));
const source = path.join(root, "web/dist");
const dest = path.join(root, "docs");
if (!fs.existsSync(path.join(source, "content/catalog.json")))
  throw new Error("Primero importa la ISO y compila el sitio.");
if (fs.existsSync(dest) && !fs.existsSync(path.join(dest, ".encarta-generated")))
  throw new Error("docs ya existe y no pertenece al exportador. No se ha modificado.");
fs.mkdirSync(dest, { recursive: true });
// Remove stale generated files (for example, a previous Vite asset hash).
function prune(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const target = path.join(dir, entry.name);
    if (entry.isSymbolicLink()) throw new Error("Enlace inesperado en docs.");
    if (entry.isDirectory()) prune(target);
    else {
      const relative = path.relative(dest, target);
      if (
        ![".nojekyll", ".encarta-generated"].includes(relative) &&
        !fs.existsSync(path.join(source, relative))
      )
        fs.unlinkSync(target);
    }
  }
}
prune(dest);
fs.cpSync(source, dest, { recursive: true });
fs.writeFileSync(path.join(dest, ".nojekyll"), "");
fs.writeFileSync(
  path.join(dest, ".encarta-generated"),
  "Generated static Encarta web adaptation.\n",
);
let bytes = 0,
  files = 0;
function audit(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const target = path.join(dir, entry.name);
    if (entry.isDirectory()) audit(target);
    else {
      if (/\.(iso|exe|dll|msi|akc|eit)$/i.test(entry.name))
        throw new Error(`Archivo no publicable en el paquete web: ${entry.name}`);
      const size = fs.statSync(target).size;
      if (size >= 100 * 1024 * 1024) throw new Error("Hay un archivo de 100 MiB o más.");
      bytes += size;
      files++;
    }
  }
}
audit(dest);
if (bytes >= 1024 ** 3) throw new Error("El paquete supera 1 GiB.");
console.log(
  `Salida GitHub Pages: docs (${files} archivos, ${(bytes / 1024 ** 2).toFixed(1)} MiB).`,
);
