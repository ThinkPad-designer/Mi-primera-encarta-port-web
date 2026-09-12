import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { contentRewriteRules } from '../web/app/content-paths.ts';
import { readSwf } from './flash-swf.mjs';
const root = fileURLToPath(new URL("../web/public/content/", import.meta.url));
const catalog = JSON.parse(fs.readFileSync(path.join(root, "catalog.json")));
const files = JSON.parse(fs.readFileSync(path.join(root, "files.json")));
assert(catalog.length > 0, "El catálogo está vacío");
assert.equal(
  new Set(catalog.map((a) => a.id)).size,
  catalog.length,
  "Hay identificadores duplicados",
);
function verify(file) {
  assert(!file.includes("..") && !path.isAbsolute(file), "Ruta fuera del contenido");
  assert(fs.statSync(path.join(root, file)).isFile(), `Falta ${file}`);
}
for (const file of files) verify(file);
for (const activity of catalog) {
  assert(activity.title && activity.title !== "Slide caption title", "Título inválido");
  assert(activity.width > 0 && activity.height > 0, "Dimensiones inválidas");
  verify(activity.definition);
  assert(
    activity.definition.startsWith(`dswmedia/iaf/e/${activity.id}/`),
    "La definición debe estar junto a sus medios",
  );
  verify(`dswmedia/shared/players/iafplayer/${activity.type.toLowerCase()}.swf`);
  if (activity.preview) verify(activity.preview);
  for (const slide of activity.slides) if (slide.image) verify(slide.image);
}
verify("dswmedia/shared/players/iafplayer/base.swf");
// These exact requests returned 404 on a case-sensitive Pages preview.
const base = 'https://example.test/encarta/content/';
const rules = contentRewriteRules(files, '00174d64', base);
for (const request of ['dswmedia/quiz/859/T047673A.jpg', 'dswmedia/quiz/859/T012515A.jpg',
  'dswmedia/quiz/889/T012897A.jpg', 'dswmedia/quiz/892/T242297A.jpg',
  'dswmedia/quiz/893/T235833A.jpg', 'dswmedia/quiz/890/T012509A.jpg']) {
  const match = rules.find(([pattern]) => pattern.test(base + request));
  assert(match, `No se resuelve la imagen del cuestionario: ${request}`);
  const resolved = match[1].slice(base.length);
  assert(files.includes(resolved), `La URL no coincide exactamente con el manifiesto: ${resolved}`);
  verify(resolved);
}
const patch = JSON.parse(fs.readFileSync(new URL('./flash/match-watch.json', import.meta.url)));
const matchSwf = readSwf(fs.readFileSync(path.join(root, 'dswmedia/shared/players/iafplayer/matchgame.swf')));
assert(matchSwf.tags.some(t => t.code === 12 && t.frame === 2 && t.data.equals(Buffer.from(patch.replacement, 'base64'))),
  'Falta la corrección de recursión de MatchGame; ejecuta node scripts/patch-flash.mjs');
const quizSkin = readSwf(fs.readFileSync(path.join(root, 'dswmedia/shared/players/iafplayer/skins/bga_standard.swf')));
const answer = quizSkin.tags.find(t => t.code === 59 && t.data.includes(Buffer.from('mchoiceAnswerSymbol\0')));
assert(answer && !answer.data.includes(Buffer.from('onLoad\0')) && answer.data.includes(Buffer.from('unused\0')),
  'Falta la corrección de imágenes en las respuestas');
const interfaceFiles = JSON.parse(fs.readFileSync(path.join(root, "interface/files.json")));
assert(interfaceFiles.length > 30, "Falta la interfaz original");
for (const file of interfaceFiles) verify(file);
console.log(`Verificados ${interfaceFiles.length} recursos de la interfaz original.`);
console.log(
  `Verificados ${catalog.length} registros, sus reproductores, fichas y ${files.length} archivos de contenido.`,
);
