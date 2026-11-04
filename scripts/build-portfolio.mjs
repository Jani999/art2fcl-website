import { cp, mkdir, readFile, writeFile, access, readdir } from 'node:fs/promises';
import path from 'node:path';
const local=process.argv.includes('--local-audio');
const root=path.resolve(local?'.local/claude-preview':'dist');
await mkdir(root,{recursive:true});
await cp('portfolio',root,{recursive:true});
let html=await readFile(path.join(root,'index.html'),'utf8');
if(local){
 const audio=path.resolve('references/claude-design/demons-shot.mp3');await access(audio);
 await mkdir(path.join(root,'assets/audio'),{recursive:true});await cp(audio,path.join(root,'assets/audio/demons-shot.mp3'));
}else{
 html=html.replace('src="assets/audio/demons-shot.mp3"','data-audio-unavailable="true"');
 // Do not accidentally publish stale local audio or other historical assets.
 const files=await readdir(root,{recursive:true});
 if(files.some(file=>/\.(mp3|wav|ogg)$/i.test(file)))throw new Error('Publish directory contains audio. Use a clean dist directory; audio rights are not confirmed.');
}
await writeFile(path.join(root,'index.html'),html);
await writeFile(path.join(root,'.nojekyll'),'');
await writeFile(path.join(root,'404.html'),'<!doctype html><html lang="id"><meta charset="utf-8"><title>404 — ART2FCL</title><body style="background:#020309;color:#e9f3ff;font:20px monospace;padding:10vw"><h1>404 // SIGNAL NOT FOUND</h1><a href="/" style="color:#00e5ff">Kembali ke ART2FCL</a></body></html>');
console.log(`${local?'LOCAL AUDIO PREVIEW':'PUBLISH ARTIFACT (NO AUDIO)'}: ${root}`);
