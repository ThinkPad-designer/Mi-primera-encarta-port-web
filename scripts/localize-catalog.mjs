import fs from "node:fs";
import { fileURLToPath } from "node:url";
const file = fileURLToPath(new URL("../web/public/content/catalog.json", import.meta.url));
const titles = JSON.parse(fs.readFileSync(new URL("./titles-es.json", import.meta.url)));
const catalog = JSON.parse(fs.readFileSync(file));
for (const item of catalog) {
  const name = item.originalName.replace(/^Kids\s*[:\-–]?\s*/i, "");
  if (titles[name]) item.title = titles[name];
  for (const slide of item.slides) {
    if (slide.title === "Slide caption title") slide.title = item.title;
    if (slide.text === "Slide caption body") slide.text = "";
  }
  delete item.player;
}
const serialized = JSON.stringify(catalog);
if (fs.readFileSync(file, 'utf8') !== serialized) fs.writeFileSync(file, serialized);
