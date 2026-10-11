// Adds blocker tiles to levels: removes end cells of long paths (they become blocks), keeps the level only if still unique.
const fs=require('fs');const {rng,solve}=require('./lib');
for(const f of fs.readdirSync('out').sort((a,b)=>parseInt(a)-parseInt(b))){const n=+f.replace('.json','');const j=JSON.parse(fs.readFileSync('out/'+f));
 if(j.b||n<13||!(n>30||n%2===1))continue;
 const want=Math.min(5,1+Math.floor((n-13)/14)),r=rng(n*104729+7);let done=false;
 for(let t=0;t<40&&!done;t++){const paths=j.p.map(p=>p.slice()),blocks=[];
  for(let b=0;b<want;b++){const cand=paths.map((p,i)=>i).filter(i=>paths[i].length>=5);if(!cand.length)break;const i=cand[(r()*cand.length)|0];blocks.push(r()<.5?paths[i].shift():paths[i].pop())}
  const res=solve(j.s,paths.map(p=>({a:p[0],b:p[p.length-1]})),2,300000,blocks);
  if(!res.aborted&&res.sols===1&&blocks.length){j.p=paths;j.b=blocks;fs.writeFileSync('out/'+f,JSON.stringify(j));done=true}}
 console.log(n,done?'blocks '+j.b.length:'skipped')}
