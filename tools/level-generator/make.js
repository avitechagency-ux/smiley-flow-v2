// Bulk level maker. Usage: node make.js <fromLevel> <toLevel> [shard total]
// Writes out/<n>.json for each level (skips existing). Every level has exactly one solution (checked by the solver).
// Then run: node merge.js ../../js/levels.js
const fs=require('fs');const {rng,build,solve}=require('./lib');
const [from,to,sh,tot]=process.argv.slice(2).map(Number);
fs.mkdirSync('out',{recursive:true});
// Size and pair range per level number. Edit this to change the difficulty curve.
function sched(n){
 if(n>500){const w=n%30,size=w<10?7:w<20?8:9;return[size,{7:6,8:7,9:8}[size],{7:10,8:11,9:12}[size]]} // waves: easier, medium, harder, repeat
 if(n<=4)return[4,3,5];if(n<=12)return[5,4,7];if(n<=22)return[6,5,9];if(n<=34)return[7,6,10];if(n<=48)return[8,7,11];if(n<=100)return[9,8,12];
 const size=[7,8,8,9,9,9][n%6];return[size,{7:6,8:7,9:8}[size],{7:10,8:11,9:12}[size]]}
function carveEnds(j,n,r){ // blocker cells at path ends
 const want=Math.min(5,1+Math.floor((n-13)/14));
 for(let t=0;t<40;t++){const paths=j.p.map(p=>p.slice()),blocks=[];
  for(let b=0;b<want;b++){const c=paths.map((p,i)=>i).filter(i=>paths[i].length>=5);if(!c.length)break;const i=c[(r()*c.length)|0];blocks.push(r()<.5?paths[i].shift():paths[i].pop())}
  const res=solve(j.s,paths.map(p=>({a:p[0],b:p[p.length-1]})),2,300000,blocks);
  if(!res.aborted&&res.sols===1&&blocks.length&&blocks.length<=j.s*j.s*.3){j.p=paths;j.b=blocks;return}}}
function carveVoid(j,n,r){ // whole short paths become empty areas
 const want=1+(n>40?1:0)+(n>65?1:0);
 for(let t=0;t<40;t++){const paths=j.p.map(p=>p.slice()),blocks=(j.b||[]).slice(),before=blocks.length;
  for(let w=0;w<want;w++){const c=paths.map((p,i)=>i).filter(i=>paths[i].length<=12);if(!c.length||paths.length<=4)break;const i=c[(r()*c.length)|0];blocks.push(...paths[i]);paths.splice(i,1)}
  if(blocks.length===before||blocks.length>j.s*j.s*.3)continue;
  const res=solve(j.s,paths.map(p=>({a:p[0],b:p[p.length-1]})),2,300000,blocks);
  if(!res.aborted&&res.sols===1){j.p=paths;j.b=blocks;return}}}
const sig=j=>JSON.stringify([j.s,j.p,j.b||[]]);
const seen=new Set();for(const f of fs.readdirSync('out')){if(!f.endsWith('.json'))continue;try{seen.add(sig(JSON.parse(fs.readFileSync('out/'+f))))}catch(e){}}
for(let n=from;n<=to;n++){
 if(tot&&n%tot!==sh)continue;if(fs.existsSync('out/'+n+'.json'))continue;
 let j,att=0;
 do{ // make again with a different seed if this exact level already exists
  let [size,kmin,kmax]=sched(n),b=null;const r=rng(n*7919+13+att*1000003);
  while(!b){b=build(size,kmin,kmax,r,80000,Date.now()+(size>=9?90000:40000));if(!b&&size>6){size--;kmin=Math.max(3,kmin-1);kmax=Math.max(kmin+2,kmax-1)}}
  j={s:size,p:b.segs,nodes:b.nodes};
  if(n>=13&&(n>30||n%2===1))carveEnds(j,n,rng(n*104729+7+att));
  if(n>=8&&n%3!==1)carveVoid(j,n,rng(n*7717+3+att));
  att++}while(seen.has(sig(j))&&att<6);
 seen.add(sig(j));
 fs.writeFileSync('out/'+n+'.json',JSON.stringify(j));console.log('level',n,j.s+'x'+j.s,j.p.length+' pairs',(j.b||[]).length+' blocked cells')}
