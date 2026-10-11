// Turns whole short paths into empty (void) areas, so boards get irregular shapes. Keeps a level only if it is still unique.
const fs=require('fs');const {rng,solve}=require('./lib');
for(const f of fs.readdirSync('out').sort((a,b)=>parseInt(a)-parseInt(b))){const n=+f.replace('.json','');const j=JSON.parse(fs.readFileSync('out/'+f));
 if(j.v||n<8||n%3===1)continue;
 const r=rng(n*7717+3),want=1+(n>40?1:0)+(n>65?1:0);let done=false;
 for(let t=0;t<40&&!done;t++){const paths=j.p.map(p=>p.slice()),blocks=(j.b||[]).slice(),before=blocks.length;
  for(let w=0;w<want;w++){const cand=paths.map((p,i)=>i).filter(i=>paths[i].length<=12);if(!cand.length||paths.length<=4)break;const i=cand[(r()*cand.length)|0];blocks.push(...paths[i]);paths.splice(i,1)}
  if(blocks.length===before)continue;
  const res=solve(j.s,paths.map(p=>({a:p[0],b:p[p.length-1]})),2,300000,blocks);
  if(!res.aborted&&res.sols===1){j.p=paths;j.b=blocks;j.v=1;fs.writeFileSync('out/'+f,JSON.stringify(j));done=true}}
 console.log(n,done?'void '+j.b.length:'skipped')}
