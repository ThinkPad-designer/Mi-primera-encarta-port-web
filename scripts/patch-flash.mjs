import fs from 'node:fs';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readSwf, replaceTag } from './flash-swf.mjs';

const file = new URL('../web/public/content/dswmedia/shared/players/iafplayer/matchgame.swf', import.meta.url);
const patch = JSON.parse(fs.readFileSync(new URL('./flash/match-watch.json', import.meta.url)));
const input = fs.readFileSync(file);
const swf = readSwf(input);
const original = Buffer.from(patch.original, 'base64');
const replacement = Buffer.from(patch.replacement, 'base64');
const actions = swf.tags.filter(t => t.code === 12 && t.frame === 2);
if (!actions.some(t => t.data.equals(replacement))) {
  assert.equal(createHash('sha256').update(input).digest('hex'), patch.sourceSha256,
    'MatchGame no coincide con la edición verificada; no se aplicó el parche.');
  const target = actions.find(t => t.data.equals(original));
  assert(target, 'No se encontró la inicialización de MatchGame');
  const output = replaceTag(swf, target, replacement);
  const after = readSwf(output);
  assert.equal(after.tags.length, swf.tags.length);
  swf.tags.forEach((tag, i) => {
    assert.equal(tag.code, after.tags[i].code);
    assert(after.tags[i].data.equals(tag === target ? replacement : tag.data), 'El parche alteró otro recurso');
  });
  fs.writeFileSync(file, output);
}
console.log('MatchGame: protección contra llamadas recursivas verificada.');

// Answer thumbnails already have exactly the dimensions declared in the quiz XML.
// The legacy onLoad resizes them using custom properties on the loaded clip;
// Ruffle clears those properties when loadMovie replaces it, collapsing the image.
const skinFile = new URL('../web/public/content/dswmedia/shared/players/iafplayer/skins/bga_standard.swf', import.meta.url);
const skinInput = fs.readFileSync(skinFile);
const skin = readSwf(skinInput);
const answer = skin.tags.find(t => t.code === 59 && t.data.includes(Buffer.from('mchoiceAnswerSymbol\0')));
assert(answer, 'No se encontró el componente de respuestas del cuestionario');
const event = Buffer.from('onLoad\0'), disabledEvent = Buffer.from('unused\0');
const at = answer.data.indexOf(event);
if (at !== -1) {
  assert.equal(createHash('sha256').update(skinInput).digest('hex'),
    'ac0dc69f2735151a04d3c814d0e81974266ecf5cb624484e4ffcb2cfc4d67e05', 'Skin BGA no verificada');
  assert.equal(answer.data.indexOf(event, at + event.length), -1, 'Evento ambiguo en la skin');
  const data = Buffer.from(answer.data);
  disabledEvent.copy(data, at);
  const output = replaceTag(skin, answer, data);
  const after = readSwf(output);
  assert.equal(after.tags.length, skin.tags.length);
  skin.tags.forEach((tag, i) => assert(after.tags[i].data.equals(tag === answer ? data : tag.data)));
  fs.writeFileSync(skinFile, output);
} else {
  assert(answer.data.includes(disabledEvent), 'Estado desconocido del componente de respuestas');
}
console.log('Cuestionarios: imágenes de opciones conservadas a su tamaño original.');
