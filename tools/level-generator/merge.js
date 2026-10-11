// Builds ../../js/levels.js from out/*.json (run from tools/level-generator)
const fs=require('fs');const out=process.argv[2]||'../../js/levels.js',LIMIT=+process.argv[3]||1e9;
const files=fs.readdirSync('out').map(f=>+f.replace('.json','')).sort((a,b)=>a-b);const L=[];
for(let i=1;i<=Math.min(files.length,LIMIT);i++){if(files[i-1]!==i)break;const j=JSON.parse(fs.readFileSync('out/'+i+'.json'));L.push(j.b?{s:j.s,p:j.p,b:j.b}:{s:j.s,p:j.p})}
fs.writeFileSync(out,'// Precomputed levels. Every level has exactly ONE solution that fills the whole board.\n// s = board size, p = paths (cell indices row by row); first and last cell of each path are the pair\nconst LEVELS='+JSON.stringify(L)+';\n');
console.log('levels',L.length);
