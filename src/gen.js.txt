// Live random level maker (same solver as tools/level-generator). Fast for 5x5 to 7x7; 8x8 may take a couple of seconds.
const LG=(()=>{
function rng(s){return()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296}}
function solve(size,pairs,limit,cap,blocks){blocks=blocks||[];const N=size*size,nb=[];
 for(let c=0;c<N;c++){const x=c%size,y=(c/size)|0,a=[];if(x>0)a.push(c-1);if(x<size-1)a.push(c+1);if(y>0)a.push(c-size);if(y<size-1)a.push(c+size);nb.push(a)}
 const own=new Int8Array(N).fill(-1),head=pairs.map(p=>p.a),tgt=pairs.map(p=>p.b),done=pairs.map(()=>false);
 pairs.forEach((p,i)=>{own[p.a]=i;own[p.b]=i});blocks.forEach(c=>{own[c]=-3});
 let sols=0,nodes=0,aborted=false;const found=[];
 function dead(){for(let c=0;c<N;c++){if(own[c]!==-1)continue;let k=0;for(const d of nb[c]){const o=own[d];if(o===-1)k++;else if(!done[o]&&(d===head[o]||d===tgt[o]))k++}if(k<2)return true}return false}
 const seen=new Int32Array(N);let stamp=0;
 function reach(){for(let i=0;i<pairs.length;i++){if(done[i])continue;stamp++;const st=[head[i]];seen[head[i]]=stamp;let ok=false;
   while(st.length){const c=st.pop();for(const d of nb[c]){if(d===tgt[i]){ok=true;break}if(own[d]===-1&&seen[d]!==stamp){seen[d]=stamp;st.push(d)}}if(ok)break}
   if(!ok)return false}return true}
 function dfs(rem){if(sols>=limit||aborted)return;if(++nodes>cap){aborted=true;return}
  let bi=-1,bm=null;
  for(let i=0;i<pairs.length;i++){if(done[i])continue;const m=[];for(const d of nb[head[i]]){if(own[d]===-1||d===tgt[i])m.push(d)}
   if(!m.length)return;if(bm===null||m.length<bm.length){bm=m;bi=i}}
  if(bi<0){if(rem===0){sols++;found.push(Int8Array.from(own))}return}
  for(const d of bm){if(d===tgt[bi]){done[bi]=true;if(!dead()&&reach())dfs(rem);done[bi]=false}
   else{const old=head[bi];own[d]=bi;head[bi]=d;if(!dead()&&reach())dfs(rem-1);head[bi]=old;own[d]=-1}}}
 if(!dead())dfs(N-2*pairs.length-blocks.length);
 return{sols,nodes,aborted,found}}
function hamil(size,r){const N=size*size;let p=[];for(let y=0;y<size;y++)for(let x=0;x<size;x++)p.push(y*size+(y%2?size-1-x:x));
 for(let it=0;it<N*40;it++){if(r()<.5)p.reverse();const a=p[0],x=a%size,y=(a/size)|0,nb=[];
  if(x>0)nb.push(a-1);if(x<size-1)nb.push(a+1);if(y>0)nb.push(a-size);if(y<size-1)nb.push(a+size);
  const q=nb[(r()*nb.length)|0],j=p.indexOf(q);if(j>=2)p=p.slice(0,j).reverse().concat(p.slice(j))}return p}
function segment(p,k,r){const N=p.length,w=Array.from({length:k},()=>.35+r()*1.6),ws=w.reduce((a,b)=>a+b,0),extra=N-3*k,lens=w.map(x=>3+Math.floor(x/ws*extra));
 let rem=N-lens.reduce((a,b)=>a+b,0);for(let i=0;rem>0;i=(i+1)%k,rem--)lens[i]++;
 const segs=[];let at=0;for(const L of lens){segs.push(p.slice(at,at+L));at+=L}return segs}


function build(size,kmin,kmax,r,cap,deadline){
 while(Date.now()<deadline){const p=hamil(size,r);let segs=segment(p,kmin,r);
  for(;;){const pairs=segs.map(x=>({a:x[0],b:x[x.length-1]})),res=solve(size,pairs,2,cap);
   if(res.aborted)break;
   if(res.sols===1)return{segs,nodes:res.nodes};
   if(segs.length>=kmax)break;
   const ours=new Int8Array(size*size);segs.forEach((sg,i)=>sg.forEach(c=>ours[c]=i));
   const alt=res.found.find(f=>f.some((v,c)=>v!==ours[c]))||res.found[0];
   const cand=[];segs.forEach((sg,si)=>{for(let j=1;j<=sg.length-3;j++)if(alt[sg[j]]!==ours[sg[j]]||alt[sg[j+1]]!==ours[sg[j+1]])cand.push([si,j])});
   if(!cand.length)break;
   const [si,j]=cand[(r()*cand.length)|0],sg=segs[si];segs.splice(si,1,sg.slice(0,j+1),sg.slice(j+1))}}
 return null}


function make(size,seed,ms){const rg=rng(seed),k={5:[4,7],6:[5,8],7:[6,9],8:[7,10]}[size],b=build(size,k[0],k[1],rg,60000,Date.now()+ms);if(!b)return null;
 const out={s:size,p:b.segs.map(s=>s.slice()),seed};
 if(size>=6&&rg()<.5){for(let t=0;t<12;t++){const P=out.p.map(s=>s.slice()),B=[],c=P.map((p,i)=>i).filter(i=>P[i].length<=10);if(!c.length||P.length<=4)break;
   const i=c[(rg()*c.length)|0];B.push(...P[i]);P.splice(i,1);
   const r=solve(size,P.map(p=>({a:p[0],b:p[p.length-1]})),2,80000,B);if(!r.aborted&&r.sols===1&&B.length<=size*size*.3){out.p=P;out.b=B;break}}}
 return out}
return{make}})();
function randomLevel(){const pool=[5,5,6,6,7,7,8];let size=pool[(Math.random()*pool.length)|0];
 while(size>=5){const lv=LG.make(size,(Math.random()*1e9)|0,size>=8?2500:1500);if(lv)return lv;size--}
 return null}
function playRandom(){toast('Rolling the dice...');setTimeout(()=>{const lv=randomLevel();if(!lv)return toast('Try again');play(0,0,false,lv)},60)}
