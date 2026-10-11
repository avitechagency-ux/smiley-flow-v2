const fs=require('fs');const {rng,build}=require('./lib');
const [,, W, I]=process.argv.map(Number);
const sched=n=>n<=4?[4,3,5]:n<=12?[5,4,7]:n<=22?[6,5,9]:n<=34?[7,6,10]:n<=48?[8,7,11]:[9,8,12];
fs.mkdirSync('out',{recursive:true});
for(let n=1;n<=100;n++){if(n%W!==I)continue;if(fs.existsSync('out/'+n+'.json'))continue;
 let [size,kmin,kmax]=sched(n),b=null;const r=rng(n*7919+13);
 while(!b){b=build(size,kmin,kmax,r,80000,Date.now()+(size>=9?90000:40000));if(!b&&size>6){size--;kmin=Math.max(3,kmin-1);kmax=Math.max(kmin+2,kmax-1)}}
 fs.writeFileSync('out/'+n+'.json',JSON.stringify({s:size,p:b.segs,nodes:b.nodes}));}
