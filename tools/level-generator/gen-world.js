// Makes an online map's level file: node gen-world.js <seedBase> <count> [maxBoardSize] > levels.json
const {rng,build,solve}=require('./lib');
const seed=+process.argv[2]||5000,count=+process.argv[3]||20,maxS=+process.argv[4]||8,out=[];
const sched0=n=>n<=4?[5,4,7]:n<=10?[6,5,8]:n<=16?[7,6,9]:[8,7,10];
const sched=n=>{const r=sched0(n);return r[0]>maxS?[maxS,maxS-1,maxS+2]:r};
for(let n=1;n<=count;n++){const [size,kmin,kmax]=sched(n),r=rng(seed+n*977);let b=null;
 while(!b)b=build(size,kmin,kmax,r,150000,Date.now()+30000);
 let paths=b.segs.map(s=>s.slice()),blocks=[];
 if(n>=5&&n%2===0){for(let t=0;t<30;t++){const P=paths.map(s=>s.slice()),B=[];const cand=P.map((p,i)=>i).filter(i=>P[i].length<=10);if(!cand.length||P.length<=4)break;
   const i=cand[(r()*cand.length)|0];B.push(...P[i]);P.splice(i,1);
   const res=solve(size,P.map(p=>({a:p[0],b:p[p.length-1]})),2,300000,B);if(!res.aborted&&res.sols===1){paths=P;blocks=B;break}}}
 out.push(blocks.length?{s:size,p:paths,b:blocks}:{s:size,p:paths})}
console.log(JSON.stringify(out));
