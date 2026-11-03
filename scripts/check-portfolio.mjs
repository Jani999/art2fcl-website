import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const html=await readFile('portfolio/index.html','utf8');
assert.equal((html.match(/class="pj"/g)||[]).length,3);
for(const id of ['home','about','work','stack','contact'])assert(html.includes(`id="${id}"`));
assert(!html.includes('href="#"'));assert(!html.includes('base64,'));assert(!html.includes('�'));
for(const link of ['https://wa.me/6289652447077','https://github.com/Jani999','mailto:celesfrieg@gmail.com'])assert(html.includes(link));
for(const match of html.matchAll(/(?:src|href)="(\/[^"#]+)"/g))await readFile('portfolio'+match[1]);
for(const file of await readdir('portfolio/assets/js')){const r=spawnSync(process.execPath,['--check',`portfolio/assets/js/${file}`],{stdio:'inherit'});assert.equal(r.status,0);}
const manifest=JSON.parse(await readFile('portfolio/assets/vendor/manifest.json','utf8'));
for(const item of manifest){const bytes=await readFile('portfolio/assets/vendor/'+item.file);assert.equal(createHash('sha256').update(bytes).digest('hex'),item.sha256);assert(!item.url.includes('@latest'));}
console.log('PASS: canonical sections, three projects, contacts, static paths, encoding, JS syntax, pinned vendor hashes');
