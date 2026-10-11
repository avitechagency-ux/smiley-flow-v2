// Turns online-content JSON into .js files the game loads with script tags (works everywhere, no fetch needed).
// Usage (from tools/level-generator):  node online-js.js ../../online-content
const fs=require('fs');const dir=process.argv[2]||'../../online-content';
const m=JSON.parse(fs.readFileSync(dir+'/worlds.json','utf8'));
m.worlds.forEach(w=>{const f=w.levels.replace(/\.json$/,'.json');const L=JSON.parse(fs.readFileSync(dir+'/'+f,'utf8'));
 fs.writeFileSync(dir+'/'+f.replace(/\.json$/,'.js'),"(window.ONLINE_LV=window.ONLINE_LV||{})['"+w.id+"']="+JSON.stringify(L)+";\n");w.levels=f.replace(/\.json$/,'.js')});
fs.writeFileSync(dir+'/worlds.js','window.ONLINE_WORLDS='+JSON.stringify(m)+';\n');console.log('wrote worlds.js and',m.worlds.length,'level files');
