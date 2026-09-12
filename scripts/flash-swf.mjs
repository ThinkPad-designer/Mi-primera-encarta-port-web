import { inflateSync, deflateSync } from 'node:zlib';
import assert from 'node:assert/strict';

export function readSwf(buffer) {
  const signature = buffer.toString('ascii', 0, 3);
  assert(['CWS', 'FWS'].includes(signature), 'Formato SWF no compatible');
  const body = signature === 'CWS' ? inflateSync(buffer.subarray(8)) : buffer.subarray(8);
  assert.equal(body.length + 8, buffer.readUInt32LE(4), 'Longitud SWF incorrecta');
  const rectBytes = Math.ceil((5 + 4 * (body[0] >> 3)) / 8);
  const tags = [];
  let offset = rectBytes + 4, frame = 1;
  while (offset < body.length) {
    const start = offset, header = body.readUInt16LE(offset);
    offset += 2;
    const code = header >> 6;
    let length = header & 63;
    if (length === 63) { length = body.readUInt32LE(offset); offset += 4; }
    assert(offset + length <= body.length, 'Tag SWF truncado');
    tags.push({ code, frame, start, end: offset + length, data: body.subarray(offset, offset + length) });
    offset += length;
    if (code === 1) frame++;
    if (code === 0) break;
  }
  return { body, tags, version: buffer[3] };
}

export function replaceTag(swf, tag, data) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE((tag.code << 6) | 63);
  header.writeUInt32LE(data.length, 2);
  const body = Buffer.concat([swf.body.subarray(0, tag.start), header, data, swf.body.subarray(tag.end)]);
  const prefix = Buffer.alloc(8);
  prefix.write('CWS'); prefix[3] = swf.version;
  prefix.writeUInt32LE(body.length + 8, 4);
  return Buffer.concat([prefix, deflateSync(body)]);
}
