// Built by tools/build.js from src/*.js.txt. Edit the sources, then rebuild.
/* config */
// Constants, emoji packs, colors
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],L=s=>[...s.replace(/\s/g,'')];
const HB=[['\u{1F90D}','\u{1FA76}'],['\u{1F499}','\u{1FA75}'],['\u2764','\u{1FA77}']];
const PACKS={
faces:{dir:'faces',n:'Faces',p:0,e:L('😀 😃 😄 😁 😆 😅 🤣 😂 🙂 🙃 🫠 😉 😊 😇 🥰 😍 🤩 😘 😗 😚 😙 🥲 😋 😛 😜 🤪 😝 🤐 🤨 😐 😑 😶 🫥 😏 😒 🙄 😬 🤥 😌 😔 😪 🤤 😴 😷 🤒 🤕 🥴 😵 🤯 🤠 🥳 🥸 😎 🤓 🧐 😕 🫤 😟 🙁 😮 😯 😲 😳 🥺 🥹 😦 😧 😨 😰 😥 😢 😭 😱 😖 😣 😞 😓 😩 😫 🥱 😤 😡 😠 🤬')},
animals:{dir:'animals',n:'Animals',p:20,e:L('🐕 🐈 🐩 🦮 🐎 🐄 🐂 🐃 🐖 🐑 🐏 🐐 🐪 🐫 🦙 🦒 🐘 🦣 🦏 🦛 🐁 🐀 🐇 🦔 🦇 🦘 🦥 🦦 🦨 🦡 🦫 🐅 🐆 🦓 🦌 🦬 🐒 🦍 🦧 🐓 🦃 🦆 🦢 🦉 🦩 🦚 🦜 🐧 🐦 🐤 🦅 🦤 🐊 🐢 🦎 🐍 🦕 🦖 🐳 🐋 🐬 🦭 🐟 🐠 🐡 🦈 🐙 🦑 🦐 🦞 🦀 🐌 🦋 🐛 🐜 🐝 🐞 🦗 🦂 🦟')},
fruits:{dir:'fruits-veg',n:'Fruits & Veg',p:20,e:L('🍇 🍈 🍉 🍊 🍋 🍌 🍍 🥭 🍎 🍏 🍐 🍑 🍒 🍓 🫐 🥝 🍅 🫒 🥥 🥑 🍆 🥔 🥕 🌽 🫑 🥒 🥬 🥦 🧄 🧅 🍠')},
hearts:{dir:'hearts',n:'Hearts',p:30,e:['\u2764',...L('🧡💛💚💙💜🖤🤎🤍🩶🩵🩷')],bad:(a,b)=>HB.some(p=>p.includes(a)&&p.includes(b))},
time:{dir:'time',n:'Clocks',p:30,e:Array.from({length:24},(_,i)=>String.fromCodePoint(0x1f550+i)),bad:(a,b)=>Math.abs(a.codePointAt(0)-b.codePointAt(0))===12}};
const COLS=['#e63946','#2a9d8f','#f4a261','#457b9d','#9b5de5','#06d6a0','#ef476f','#8d99ae','#ffd166','#118ab2','#00b4d8','#f72585'];
// Levels unlock one by one. For testing, open the game with ?unlock at the end of the address to unlock everything.
const TEST_UNLOCK=(typeof location!=='undefined'&&/unlock/.test(location.search))?999:1;
// Board and game-screen themes (fx = moving effect drawn in js/world.js)
const BG_THEMES={neon:{n:'Neon',p:0,fx:''},ice:{n:'Snowy Biome',p:20,fx:'ice'},jungle:{n:'Jungle',p:20,fx:'jungle'},sky:{n:'Sky',p:30,fx:'sky'},space:{n:'Space',p:30,fx:'space'}};
// Economy (diamonds)
const RANDOM_REWARD=1; // diamonds for a random level
// Levels: the first 500 are in js/levels.js; the rest load in packs of 500 from levels/pack-XXXX.js
let BUILTIN=0,TOTAL_LEVELS=0;const PACK_SIZE=500;
window.LV_PACKS=window.LV_PACKS||{};
// Called once at startup (after js/levels.js has loaded), so script order does not matter.
function initLevels(){if(typeof LEVELS==='undefined'){window.LEVELS=[];if(window.showErr)window.showErr('js/levels.js did not load or is empty. Rebuild it: cd tools/level-generator && node merge.js ../../js/levels.js 500')}
 BUILTIN=LEVELS.length>=500?500:LEVELS.length;TOTAL_LEVELS=BUILTIN+(BUILTIN>=500?(window.LV_EXTRA||0):0)}
const HARD_REWARD=2; // diamonds for a heavy level (8x8 or bigger)
const START_DIAMONDS=10,LEVEL_REWARD=1,DAILY_REWARD=2,HINT_COST=5,EXTEND_COST=3;
// Online content (worlds). Local folder for testing; for release use e.g. https://cdn.jsdelivr.net/gh/<user>/<repo>@main/online-content/
const ONLINE_BASE='https://cdn.jsdelivr.net/gh/avitechagency-ux/smiley-flow-v2@main/online-content/';
const UNDO_COST=0;      // set to 3 when you want undo to cost diamonds
const AD_REWARD=2,ADS_ENABLED=false; // rewarded ad = +2 diamonds, turn on when ads are integrated

/* state */
// Save data (localStorage), sound, HUD refresh
const S={diamonds:START_DIAMONDS,unlocked:1,owned:['faces'],theme:'faces',stars:{},sound:true,music:true,daily:0,w:{},dr:{last:'',streak:0},bg:'neon',bgOwned:['neon']};
try{Object.assign(S,JSON.parse(localStorage.getItem('sf')||'{}'))}catch(e){}
if(!Array.isArray(S.owned))S.owned=['faces'];if(!S.stars||typeof S.stars!=='object')S.stars={};if(!S.w||typeof S.w!=='object')S.w={};if(!Array.isArray(S.bgOwned))S.bgOwned=['neon'];
delete S.coins;delete S.hints;if(typeof S.diamonds!=='number')S.diamonds=START_DIAMONDS;
const save=()=>{try{localStorage.setItem('sf',JSON.stringify(S))}catch(e){}};
S.owned=S.owned.filter(k=>PACKS[k]);if(!PACKS[S.theme])S.theme='faces';if(!S.owned.includes('faces'))S.owned.push('faces');S.stars=S.stars||{};S.dr=S.dr||{last:'',streak:0};if(!BG_THEMES[S.bg])S.bg='neon';S.bgOwned=(S.bgOwned||['neon']).filter(k=>BG_THEMES[k]);if(!S.bgOwned.includes('neon'))S.bgOwned.push('neon');
function recalcUnlock(P){let m=0;for(const k in P.stars)m=Math.max(m,+k);P.unlocked=Math.max(TEST_UNLOCK,m+1)}
function fixUnlock(){recalcUnlock(S);S.unlocked=Math.min(S.unlocked,TOTAL_LEVELS);Object.values(S.w).forEach(recalcUnlock)}
function refresh(){$$('.dia-n').forEach(x=>x.textContent=S.diamonds);$$('.hc').forEach(x=>x.textContent=HINT_COST);$$('.xc').forEach(x=>x.textContent=EXTEND_COST);$$('.ar').forEach(x=>x.textContent=AD_REWARD);$$('.dr').forEach(x=>x.textContent=DAILY_REWARD);
 $$('.uc').forEach(x=>x.innerHTML=UNDO_COST?'<i class="ic dia">💎</i>'+UNDO_COST:'');$$('.sw-snd').forEach(e=>e.classList.toggle('on',S.sound));$$('.sw-mus').forEach(e=>e.classList.toggle('on',S.music));const g=$('#giftdot');if(g)g.style.display=(typeof drState==='function'&&drState().claimable)?'flex':'none';save()}
function toggleSound(){S.sound=!S.sound;refresh()}
function toggleMusic(){S.music=!S.music;refresh();Music.sync()}
let AC;function beep(f,d,w){setTimeout(()=>{if(!S.sound)return;try{AC=AC||new(window.AudioContext||window.webkitAudioContext)();const o=AC.createOscillator(),g=AC.createGain();o.frequency.value=f;g.gain.value=.08;o.connect(g);g.connect(AC.destination);o.start();o.stop(AC.currentTime+d)}catch(e){}},w||0)}

/* online */
// Online mode: worlds are downloaded from ONLINE_BASE (needs internet). Offline play uses the built-in levels.
let ACTIVE=null,WORLD=null,ANIM={};
const activePack=()=>ACTIVE&&WORLD&&WORLD.pack?WORLD.pack:S.theme;
const maxL=()=>ACTIVE?ACTIVE.length:TOTAL_LEVELS;
function wprog(){if(!ACTIVE)return S;return S.w[WORLD.id]=S.w[WORLD.id]||{unlocked:TEST_UNLOCK,stars:{}}}
// Loads a .js data file from ONLINE_BASE with a script tag: works on file://, in app WebViews and across sites (no CORS), and fails clearly when there is no connection.
function jsload(path,ms){return new Promise((res,rej)=>{const s=document.createElement('script'),t=setTimeout(()=>{s.remove();rej(new Error('timeout'))},ms||10000);
 s.onload=()=>{clearTimeout(t);res()};s.onerror=()=>{clearTimeout(t);s.remove();rej(new Error('load'))};s.src=ONLINE_BASE+path+'?v='+Math.floor(Date.now()/600000);document.head.appendChild(s)})}
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('on'),2200)}
function netState(){}
function chip(){}
function opanel(emoji,title,msg,btns){return '<div class="opanel"><div class="oe">'+emoji+'</div><b>'+title+'</b><p>'+msg+'</p>'+btns+'</div>'}
function ostate(k){const l=$('#wl');
 if(k==='load'){chip('load');l.innerHTML='<div class="sk big"></div><div class="sk"></div><div class="sk"></div>'}
 else if(k==='off'){chip('off');l.innerHTML=opanel('📡',"You're offline",'Online worlds need internet. Your offline levels still work.','<button class="gold" onclick="openOnline()">Try again</button> <button class="btn-secondary" onclick="playOffline()">Play offline</button>')}
 else{chip('err');l.innerHTML=opanel('😵','Could not load worlds','Check your connection and try again.','<button class="gold" onclick="openOnline()">Retry</button>')}}
async function openOnline(){leaveWorld();show('online');
 let cached=null;try{cached=JSON.parse(localStorage.getItem('sf_worlds')||'null')}catch(e){}
 if(cached&&cached.worlds)buildWorlds(cached.worlds);else ostate('load');
 try{window.ONLINE_WORLDS=null;await jsload('worlds.js');const m=window.ONLINE_WORLDS;if(!m||!m.worlds)throw new Error('empty');
  try{localStorage.setItem('sf_worlds',JSON.stringify(m))}catch(e){}buildWorlds(m.worlds)}
 catch(e){if(!cached)ostate(navigator.onLine===false?'off':'err')}}
function prog(w){const P=S.w[w.id]||{stars:{}},total=w.count||20,v=Object.values(P.stars),done=Math.min(total,v.length);return{done,total,stars:v.reduce((x,y)=>x+y,0),pct:Math.round(done/total*100)}}
function emAvatar(w){const d=document.createElement('span');d.className='ae-fb';const k=w.pack;
 if(k&&PACKS[k]){const im=new Image();im.onerror=()=>{d.textContent=w.emoji};im.src='assets/packs/'+PACKS[k].dir+'/'+w.emoji.codePointAt(0).toString(16)+'.webp';d.appendChild(im)}else d.textContent=w.emoji;return d}
function fillAvatar(el,w){el.appendChild(emAvatar(w));if(!w.icon)return;const i=new Image();i.className='aimg';i.onload=()=>{el.innerHTML='';el.appendChild(i)};i.src=ONLINE_BASE+w.icon}
function buildWorlds(ws){const l=$('#wl');l.innerHTML='';
 ws.forEach(w=>{const p=prog(w),c=w.color||['#86c6f7','#6f95ee'],b=document.createElement('button');b.className='oc';b.style.setProperty('--c1',c[0]);b.style.setProperty('--c2',c[1]);
  b.innerHTML='<span class="oav"></span><span class="otx"><b>'+w.name+'</b><small>'+(w.tagline||w.desc||'')+'</small></span><span class="ost"><span><i>'+p.total+'</i>Levels</span><span><i>'+p.stars+'/'+p.total*3+'</i>Stars</span><span><i>'+p.done+'</i>Done</span></span><span class="ocirc"><i>'+p.pct+'%</i><small>Complete</small></span><em class="oplay">&#9654;</em>'+(w.featured?'<u class="ofe">FEATURED</u>':'');
  fillAvatar(b.querySelector('.oav'),w);b.onclick=()=>openWorld(w);l.appendChild(b)});
 const s=document.createElement('div');s.className='oc soon';s.style.setProperty('--c1','#f27aa0');s.style.setProperty('--c2','#e04a6a');
 s.innerHTML='<span class="oav lockav">🔒</span><span class="otx"><b>More maps</b><small>New maps are added regularly</small></span><span class="ocirc"><i>?</i><small>Coming soon</small></span>';l.appendChild(s);window.WORLDS=ws}
function openWorldById(id){const w=(window.WORLDS||[]).find(x=>x.id===id);if(w)openWorld(w)}
async function openWorld(w){toast('Loading '+w.name+'...');try{window.ONLINE_LV=window.ONLINE_LV||{};delete window.ONLINE_LV[w.id];await jsload(w.levels);const L=window.ONLINE_LV[w.id];if(!L||!L.length)throw new Error('empty');ACTIVE=L;WORLD=w;applyBg();ANIM=Object.fromEntries(Object.entries(w.anim||{}).map(([k,v])=>[k,/^https?:/.test(v)?v:ONLINE_BASE+v]));document.body.classList.add('w-'+w.fx);WorldFX.start(w.fx);LV_PG=-1;show('levels')}catch(e){toast('Could not load this world')}}
function leaveWorld(){if(WORLD)document.body.classList.remove('w-'+WORLD.fx);ACTIVE=null;WORLD=null;ANIM={};WorldFX.stop();applyBg()}
function backLevels(){if(ACTIVE){leaveWorld();show('online')}else show('home')}
function playOffline(){leaveWorld();LV_PG=-1;show('levels')}

/* world */
// Moving effects for themes and maps, drawn in code: snow+fog, jungle light and leaves, clouds, stars, hearts, gears
const WorldFX=(()=>{let cv,cx,run=false,kind='',els=[],P=[],W=0,H=0,shoot=null;
 const R=(a,b)=>a+Math.random()*(b-a),TAU=Math.PI*2;
 function size(){if(cv){W=cv.width=innerWidth;H=cv.height=innerHeight}}
 function add(tag,id,html){const e=document.createElement(tag);if(id)e.id=id;if(html)e.innerHTML=html;document.body.prepend(e);els.push(e);return e}
 function canvas(){cv=add('canvas','wfx');cx=cv.getContext('2d');size();addEventListener('resize',size)}
 function clouds(n,top){add('div','clouds',Array.from({length:n},(_,i)=>'<i style="top:'+(top+i*(60/n))+'%;animation-duration:'+(55+i*13)+'s;animation-delay:-'+(i*17)+'s;transform:scale('+(.7+(i%3)*.35)+')"></i>').join(''))}
 function leaf(f,t){cx.save();cx.translate(f.x*W,f.y*H);cx.rotate(f.a+Math.sin(t/900+f.d)*.7);cx.fillStyle=f.c;cx.beginPath();cx.moveTo(0,-f.r);cx.quadraticCurveTo(f.r*.9,0,0,f.r);cx.quadraticCurveTo(-f.r*.9,0,0,-f.r);cx.fill();cx.strokeStyle='rgba(0,60,20,.35)';cx.lineWidth=1;cx.beginPath();cx.moveTo(0,-f.r);cx.lineTo(0,f.r);cx.stroke();cx.restore()}
 function loop(t){if(!run)return;cx.clearRect(0,0,W,H);
  if(kind==='ice'){cx.fillStyle='rgba(255,255,255,.85)';for(const f of P){f.y+=f.v/60;f.x+=Math.sin(t/1500+f.d)*.0004;if(f.y>1.02){f.y=-.02;f.x=Math.random()}cx.beginPath();cx.arc(f.x*W,f.y*H,f.r,0,7);cx.fill()}}
  else if(kind==='jungle'){for(const f of P){if(f.fly){f.x+=Math.sin(t/3000+f.d)*.0003;f.y+=Math.cos(t/3600+f.d)*.0002;const a=.25+.75*Math.abs(Math.sin(t/1400+f.d));cx.fillStyle='rgba(255,245,160,'+a*.9+')';cx.beginPath();cx.arc(f.x*W,f.y*H,2,0,7);cx.fill()}
    else{f.y+=f.v/60;f.x+=Math.sin(t/2200+f.d)*.0007+.0001;if(f.y>1.05){f.y=-.05;f.x=Math.random()}leaf(f,t)}}}
  else if(kind==='space'){for(const f of P){const a=.35+.65*Math.abs(Math.sin(t/900+f.d));cx.fillStyle='rgba(255,255,255,'+a+')';cx.fillRect(f.x*W,f.y*H,f.r,f.r)}
   if(!shoot&&Math.random()<.004)shoot={x:R(.2,1)*W,y:R(0,.4)*H,l:0};
   if(shoot){shoot.l+=1;const k=shoot.l*9,x=shoot.x-k,y=shoot.y+k*.55,g=cx.createLinearGradient(x,y,x+60,y-33);g.addColorStop(0,'rgba(255,255,255,0)');g.addColorStop(1,'rgba(255,255,255,.95)');
    cx.strokeStyle=g;cx.lineWidth=2;cx.beginPath();cx.moveTo(x,y);cx.lineTo(x+60,y-33);cx.stroke();if(shoot.l>60)shoot=null}}
  else if(kind==='love'){for(const f of P){f.y-=f.v/60;f.x+=Math.sin(t/1400+f.d)*.0006;if(f.y<-.08){f.y=1.08;f.x=Math.random()}cx.globalAlpha=f.al;cx.fillStyle=f.c;cx.font=f.r*3+'px sans-serif';cx.fillText('\u2665',f.x*W,f.y*H)}cx.globalAlpha=1}
  requestAnimationFrame(loop)}
 function start(k){if(!k){stop();return}if(k===kind)return;stop();kind=k;
  if(k==='sky'){clouds(6,4);return}
  if(k==='farm'){clouds(4,6);add('div','hills','<i></i><i></i>');return}
  if(k==='island'){clouds(3,5);add('div','sun');add('div','waves','<i></i><i></i><i></i>');return}
  if(k==='time'){add('div','gears','<i></i><i></i><i></i>');return}
  if(k==='ice')add('div','fog','<i></i><i></i><i></i>');
  if(k==='jungle'){add('div','rays');add('div','fog','<i class="green"></i><i class="green"></i>')}
  canvas();
  P=Array.from({length:k==='space'?110:k==='love'?26:k==='jungle'?16:70},(_,i)=>k==='jungle'?(i<5?{fly:1,x:R(.05,.95),y:R(.2,.9),d:R(0,6)}:{x:R(0,1),y:R(0,1),r:R(8,16),v:R(.025,.06),d:R(0,6),a:R(0,TAU),c:['#4fbf5a','#2f9a52','#7bd85a','#a6e36a'][i%4]})
   :k==='love'?{x:Math.random(),y:Math.random(),r:R(5,13),v:R(.03,.08),d:R(0,6),al:R(.25,.7),c:['#ffffff','#ffb3d1','#ff6fa3'][i%3]}
   :{x:Math.random(),y:Math.random(),r:k==='space'?R(1,2.6):R(1,3.6),v:R(.05,.17),d:R(0,6)});
  run=true;requestAnimationFrame(loop)}
 function stop(){run=false;kind='';shoot=null;removeEventListener('resize',size);els.forEach(e=>e.remove());els=[];cv=null}
 return{start,stop}})();

/* audio */
// Music (one loop per screen or world, cross-faded) and voice clips for combos
const Music=(()=>{let a=null,src='',pend=false;const V=.4;
 function fade(el,to,done){const id=setInterval(()=>{const d=to-el.volume;if(Math.abs(d)<.03){el.volume=to;clearInterval(id);if(done)done()}else el.volume=Math.max(0,Math.min(1,el.volume+Math.sign(d)*.03))},60)}
 function start(){if(!a||!S.music)return;const el=a;el.play().then(()=>fade(el,V)).catch(()=>{pend=true})}
 function play(s){if(s===src)return;src=s;if(a){const o=a;fade(o,0,()=>o.pause());a=null}if(!s)return;a=new Audio(s);a.loop=true;a.volume=0;a.onerror=()=>{};start()}
 function sync(){if(!a)return;if(S.music)start();else a.pause()}
 addEventListener('pointerdown',()=>{if(pend){pend=false;start()}});
 return{play,sync}})();
// Voice: plays assets/voice/<name>.mp3 if you add it; until then the phone's own voice says the word.
const VOICE={'combo-2':'Nice!','combo-3':'Wow!','combo-4':'Amazing!','combo-5':'Unbelievable!',win:'You did it!',lose:'Oh no!'};
const Voice=(()=>{const ok={};
 function tts(n){try{const u=new SpeechSynthesisUtterance(VOICE[n]);u.pitch=1.5;u.rate=1.05;speechSynthesis.cancel();speechSynthesis.speak(u)}catch(e){}}
 function say(n){if(!S.sound)return;let a=ok[n];if(a===undefined){a=ok[n]=new Audio('assets/voice/'+n+'.mp3');a.onerror=()=>{ok[n]=false}}
  if(a){a.currentTime=0;a.play().catch(()=>tts(n))}else tts(n)}
 return{say}})();

/* ui */
// Screens, level list, theme shop, emoji images, animated emoji
function show(id){Music.play(ACTIVE?ONLINE_BASE+(WORLD.music||''):'assets/music/'+(id==='game'?'game':'home')+'.mp3');
 $$('.scr').forEach(s=>s.classList.toggle('on',s.id===id));document.body.dataset.s=id;$$('.modal').forEach(p=>p.classList.remove('on'));
 if(id==='levels')buildLevels();if(id==='theme')buildThemes();if(id==='shop')buildShop();if(id==='home'){netState();playSub()}
 if(!ACTIVE){const k=id==='game'?BG_THEMES[S.bg].fx:'';if(k)WorldFX.start(k);else WorldFX.stop()}
 refresh()}
function buildLevels(){const g=$('#lv'),P=wprog();g.innerHTML='';$('#rndBtn').style.display=ACTIVE?'none':'';$('#lvh').textContent=ACTIVE?WORLD.name:'Levels';const tot=maxL(),PS=50,pages=Math.ceil(tot/PS);if(LV_PG<0)LV_PG=Math.floor((Math.min(P.unlocked,tot)-1)/PS);LV_PG=Math.max(0,Math.min(LV_PG,pages-1));
 for(let i=LV_PG*PS+1;i<=Math.min(tot,(LV_PG+1)*PS);i++){const b=document.createElement('button'),st=P.stars[i]||0;
 b.innerHTML=i<=P.unlocked?i+'<small>'+(st?[0,1,2].map(k=>'<i class="st '+(k<st?'on':'off')+'"></i>').join(''):'')+'</small>':'🔒';b.disabled=i>P.unlocked;if(i===P.unlocked)b.classList.add('cur');b.onclick=()=>play(i);g.appendChild(b)}
 lvNav(pages,PS,tot)}
let LV_PG=-1;
function lvNav(pages,PS,tot){const n=$('#lvnav');if(pages<2){n.innerHTML='';return}const a=LV_PG*PS+1,b=Math.min(tot,(LV_PG+1)*PS);
 n.innerHTML='<button class="ib2" '+(LV_PG?'':'disabled')+' onclick="lvgo(-1)">&#8249;</button><span>'+a+' - '+b+' of '+tot+'</span><button class="btn-secondary" onclick="lvcur()">Current</button><button class="ib2" '+(LV_PG<pages-1?'':'disabled')+' onclick="lvgo(1)">&#8250;</button>'}
function lvgo(d){LV_PG+=d;buildLevels()}
function lvcur(){LV_PG=-1;buildLevels()}
function help(){alert('Drag from a face to its twin. Lines cannot cross and dark blocks cannot be used. Cover every square to win. A connected line stays until you press Undo. Hint glows the path for one pair, you draw it yourself.')}
function applyBg(){document.body.dataset.bg=ACTIVE?WORLD.fx:S.bg}
function watchAd(){if(!ADS_ENABLED)return alert('Ads are coming soon');S.diamonds+=AD_REWARD;refresh()}
function ico(ch,k){const i=new Image();i.onerror=()=>{const s=document.createElement('span');s.textContent=ch;i.replaceWith(s)};
 i.src='assets/packs/'+PACKS[k||activePack()].dir+'/'+ch.codePointAt(0).toString(16)+'.webp';return i}
function em(ch,k){const w=document.createElement('div');w.className='em';w.appendChild(ico(ch,k));return w}
// Animated emoji: uses assets/anim/<name>.webp if you add it, otherwise a CSS-animated emoji character
function animEm(name,ch){const i=new Image();i.className='ae';i.onerror=()=>{const s=document.createElement('span');s.className='ce';s.appendChild(ico(ch,'faces'));i.replaceWith(s)};i.src=ANIM[name]||'assets/anim/'+name+'.webp';return i}
function buildThemes(){const t=$('#tl');t.innerHTML='';for(const k in BG_THEMES){const p=BG_THEMES[k],r=document.createElement('div');r.className='row';
 const pv=document.createElement('div');pv.className='tp tp-'+k;pv.innerHTML='<i class="mini"></i>';
 const nm=document.createElement('b');nm.textContent=p.n;
 const b=document.createElement('button'),own=S.bgOwned.includes(k);b.innerHTML=S.bg===k?'✔ In use':own?'Use':'<i class="ic dia">💎</i> '+p.p;b.disabled=S.bg===k;
 b.onclick=()=>{if(!own){if(S.diamonds<p.p)return toast('Not enough diamonds');S.diamonds-=p.p;S.bgOwned.push(k)}S.bg=k;applyBg();refresh();buildThemes()};
 r.append(nm,pv,b);t.appendChild(r)}}

/* screens */
// Home helpers, daily reward, settings, shop, emoji pack list
const DAILY_REWARDS=[1,1,2,2,3,3,5];
const DPACKS=[{n:50,g:1},{n:120,g:2},{n:300,g:3,best:1},{n:700,g:4}];
const pad=n=>String(n).padStart(2,'0'),dkey=d=>d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());
function drState(){const now=new Date(),t=dkey(now),y=dkey(new Date(now.getTime()-864e5));let st=S.dr.streak;if(S.dr.last!==t&&S.dr.last!==y)st=0;
 return{claimable:S.dr.last!==t,idx:st%7,streak:st,done:S.dr.last===t?(st%7||7):st%7}}
function buildDaily(){const s=drState();
 $('#dgrid').innerHTML=DAILY_REWARDS.map((n,i)=>'<div class="dc'+(i<s.done?' done':'')+(s.claimable&&i===s.idx?' today':'')+(i===6?' big7':'')+'"><small>Day '+(i+1)+'</small><i class="ic dia">💎</i><b>'+n+'</b></div>').join('');
 const c=$('#dclaim');c.disabled=!s.claimable;c.textContent=s.claimable?'CLAIM +'+DAILY_REWARDS[s.idx]:'COME BACK TOMORROW'}
function openDaily(){buildDaily();$('#dailyp').classList.add('on')}
function claimDaily(){const s=drState();if(!s.claimable)return;S.diamonds+=DAILY_REWARDS[s.idx];S.dr={last:dkey(new Date()),streak:s.streak+1};
 beep(660,.12);beep(880,.2,140);FX.confetti();refresh();buildDaily();toast('+'+DAILY_REWARDS[s.idx]+' diamonds!')}
function closePop(id){$('#'+id).classList.remove('on')}
function openSettings(){refresh();$('#settings').classList.add('on')}
function playSub(){const n=maxL();let i=1;while(i<=n&&S.stars[i])i++;$('#plsub').textContent='Level '+Math.min(i,n)}
function buildShop(){$('#dpacks').innerHTML=DPACKS.map(p=>'<div class="pk">'+(p.best?'<i class="tag">BEST VALUE</i>':'')+'<div class="gems">'+'<i class="ic dia">💎</i>'.repeat(p.g)+'</div><b>'+p.n+'</b><button class="btn-secondary" disabled>Coming soon</button></div>').join('');
 packRows($('#spacks'));$$('[data-e]').forEach(e=>{if(!e.firstChild)e.appendChild(ico(e.dataset.e,'faces'))})}
function packRows(t){t.innerHTML='';for(const k in PACKS){const p=PACKS[k],r=document.createElement('div');r.className='row';
 const pv=document.createElement('div');pv.className='prev';p.e.slice(0,4).forEach(c=>pv.appendChild(em(c,k)));
 const nm=document.createElement('b');nm.innerHTML=p.n+'<br><small style="opacity:.6">'+p.e.length+' items</small>';
 const b=document.createElement('button'),own=S.owned.includes(k);
 b.innerHTML=S.theme===k?'✔ In use':own?'Use':'<i class="ic dia">💎</i> '+p.p;b.disabled=S.theme===k;
 b.onclick=()=>{if(!own){if(S.diamonds<p.p)return toast('Not enough diamonds');S.diamonds-=p.p;S.owned.push(k)}S.theme=k;refresh();packRows(t)};
 r.append(nm,pv,b);t.appendChild(r)}}

/* generator */
// Level loader: levels come from js/levels.js (unique solutions); this picks the emoji for each pair
function rng(s){return()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296}}
function packIdx(n){return Math.floor((n-BUILTIN-1)/PACK_SIZE)+1}
function getLv(n){if(n<=BUILTIN)return LEVELS[n-1];const p=window.LV_PACKS[packIdx(n)];return p?p[(n-BUILTIN-1)%PACK_SIZE]:null}
function loadPack(k){return new Promise(res=>{if(window.LV_PACKS[k])return res(true);const s=document.createElement('script');s.src='levels/pack-'+String(k).padStart(4,'0')+'.js';s.onload=()=>res(!!window.LV_PACKS[k]);s.onerror=()=>res(false);document.head.appendChild(s)})}
function mk(n,fs,dl,cus){const SRC=ACTIVE||LEVELS,lv=cus||(dl?LEVELS[30+n%(LEVELS.length-30)]:(ACTIVE?SRC[Math.min(n,SRC.length)-1]:getLv(n))),size=lv.s,r=rng(cus?cus.seed:n*7919+13),k=lv.p.length;
 const pk=PACKS[activePack()],pool=pk.e.slice();for(let i=pool.length-1;i>0;i--){const j=(r()*(i+1))|0;[pool[i],pool[j]]=[pool[j],pool[i]]}
 const ch=[];for(const c of pool)if(ch.length<k&&!(pk.bad&&ch.some(x=>pk.bad(x,c))))ch.push(c);
 for(const c of pool)if(ch.length<k&&!ch.includes(c))ch.push(c);
 return{size,blocks:lv.b||[],pairs:lv.p.map((s,i)=>({a:s[0],b:s[s.length-1],sol:s,e:ch[i]}))}}

/* gen */
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

/* fx */
// Particle effects on a full-screen canvas: trail sparks, bursts, rings, confetti
const FX=(()=>{let cv,cx,ps=[],on=false;
 const R=(a,b)=>a+Math.random()*(b-a);
 function init(){cv=document.createElement('canvas');cv.id='fx';document.body.appendChild(cv);cx=cv.getContext('2d');size();addEventListener('resize',size)}
 function size(){cv.width=innerWidth;cv.height=innerHeight}
 function add(p){if(ps.length>220)return;p.t0=performance.now();ps.push(p);if(!on){on=true;requestAnimationFrame(loop)}}
 function loop(now){cx.clearRect(0,0,cv.width,cv.height);
  ps=ps.filter(p=>{const e=Math.max(0,(now-p.t0)/1000),t=e/p.life;if(t>=1)return false;
   if(p.k==='ring'){cx.globalAlpha=1-t;cx.strokeStyle=p.c;cx.lineWidth=4*(1-t)+1;cx.beginPath();cx.arc(p.x,p.y,p.r*(.2+.8*Math.sqrt(t)),0,7);cx.stroke();return true}
   const x=p.x+p.vx*e,y=p.y+p.vy*e+.5*p.g*e*e;cx.globalAlpha=Math.min(1,(1-t)*1.5);
   if(p.k==='dot'){cx.fillStyle=p.c;cx.beginPath();cx.arc(x,y,p.s*(1-t*.5),0,7);cx.fill()}
   else{cx.save();cx.translate(x,y);cx.rotate(p.a+p.w*e);
    if(p.im&&p.im.complete&&p.im.naturalWidth)cx.drawImage(p.im,-p.s,-p.s,p.s*2,p.s*2);
    else{cx.fillStyle=p.c;cx.fillRect(-p.s*.6,-p.s*.3,p.s*1.2,p.s*.6)}
    cx.restore()}
   return true});
  cx.globalAlpha=1;if(ps.length)requestAnimationFrame(loop);else{on=false;cx.clearRect(0,0,cv.width,cv.height)}}
 return{init,
  spark(x,y,c){for(let i=0;i<1;i++)add({k:'dot',x:x+R(-4,4),y:y+R(-4,4),vx:R(-40,40),vy:R(-60,10),g:120,s:R(1.5,3.2),c,life:R(.35,.6)})},
  burst(x,y,c,n){for(let i=0;i<n;i++){const a=R(0,6.28),v=R(90,240);add({k:'dot',x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,g:300,s:R(2,4.5),c,life:R(.5,.9)})}},
  ring(x,y,c,r){add({k:'ring',x,y,c,r,life:.55})},
  confetti(){const cols=COLS.concat(['#ffffff','#ffd166']),pk=PACKS[activePack()],ims=[];
   for(let i=0;i<6;i++){const im=new Image();im.src='assets/packs/'+pk.dir+'/'+pk.e[(Math.random()*pk.e.length)|0].codePointAt(0).toString(16)+'.webp';ims.push(im)}
   for(let i=0;i<110;i++){const left=i%2===0,img=Math.random()<.35;
    add({k:'conf',x:left?0:innerWidth,y:innerHeight*.75,vx:(left?1:-1)*R(200,650),vy:-R(700,1200),g:1100,a:R(0,6.28),w:R(-8,8),
     s:img?R(13,19):R(4,7),c:cols[(Math.random()*cols.length)|0],im:img?ims[(Math.random()*ims.length)|0]:null,life:R(2,3.4)})}}}})();

/* game */
// Game engine: drawing, moves, hints, timer, win/lose
let G=null;
function play(n,fs,dl,cus){if(!ACTIVE&&!cus&&!dl&&n>BUILTIN&&!getLv(n)){toast('Loading levels...');loadPack(packIdx(n)).then(ok=>ok?play(n,fs,dl,cus):toast('Could not load these levels'));return}
 const Lv=mk(n,fs,dl,cus);G={cus:cus,blocks:Lv.blocks,lv:n,fs,daily:dl,n:Lv.size,pairs:Lv.pairs,paths:[],own:Array(Lv.size**2).fill(-1),ep:{},done:[],cur:-1,els:[],hist:[],t0:Date.now(),over:false,moves:0,shine:{},combo:0,lastC:0};G.lim=Math.round(G.n**2*(dl?4:n<=12?5:n<=30?4.5:4));
 const B=$('#board');B.innerHTML='<svg viewBox="0 0 100 100"></svg>';B.style.setProperty('--n',G.n);
 G.blocks.forEach(c=>{G.own[c]=-2;const d=document.createElement('div');d.className='blk';d.style.left=(c%G.n)*100/G.n+'%';d.style.top=((c/G.n)|0)*100/G.n+'%';B.appendChild(d)});
 G.pairs.forEach((p,i)=>{G.ep[p.a]=i;G.ep[p.b]=i;G.paths.push([]);G.done.push(false);G.els.push([]);
  [p.a,p.b].forEach(c=>{const e=em(p.e);e.style.setProperty('--c',COLS[i]);e.style.left=(c%G.n)*100/G.n+'%';e.style.top=((c/G.n)|0)*100/G.n+'%';B.appendChild(e);G.els[i].push(e)})});
 $('#ltitle').textContent=dl?'Daily Puzzle':cus?'Random '+Lv.size+'x'+Lv.size:'Level '+n;show('game');draw()}
function daily(){const d=new Date();play(d.getFullYear()*10000+(d.getMonth()+1)*100+d.getDate(),0,true)}
function reset(){if(G)play(G.lv,G.fs,G.daily,G.cus)}
function nextLv(){if(G.daily)show('levels');else if(G.cus)playRandom();else play(Math.min(G.lv+1,maxL()))}
setInterval(()=>{if(G&&$('#game').classList.contains('on')&&!G.won&&!G.over){const t=(Date.now()-G.t0)/1000,rem=G.lim-t;$('#tm').textContent=Math.max(0,Math.ceil(rem));$('#tbar i').style.width=Math.max(0,rem/G.lim*100)+'%';if(rem<=0){G.over=true;G.cur=-1;beep(200,.4);$('#lmsg').textContent=G.done.filter(Boolean).length+' of '+G.pairs.length+' pairs connected';$('#lose .aeh').replaceChildren(animEm('lose','😵'));Voice.say('lose');$('#lose').classList.add('on')}}},200);
function extend(){if(S.diamonds<EXTEND_COST){$('#lose').classList.remove('on');return show('shop')}S.diamonds-=EXTEND_COST;G.lim+=20;G.over=false;refresh();$('#lose').classList.remove('on')}
const adj=(a,b)=>{const n=G.n;return Math.abs(a-b)===n||(Math.abs(a-b)===1&&((a/n)|0)===((b/n)|0))};
function trunc(i,len){G.paths[i].splice(len).forEach(c=>{if(G.ep[c]===undefined)G.own[c]=-1});G.done[i]=false}
function snap(){G.hist.push(JSON.stringify([G.paths,G.own,G.done]));if(G.hist.length>60)G.hist.shift()}
function undo(){if(!G||G.won||G.over||!G.hist.length)return;if(UNDO_COST){if(S.diamonds<UNDO_COST)return show('shop');S.diamonds-=UNDO_COST;refresh()}[G.paths,G.own,G.done]=JSON.parse(G.hist.pop());draw()}
function cellAt(e){const r=G.rect||(G.rect=$('#board').getBoundingClientRect()),n=G.n,x=Math.floor((e.clientX-r.left)/r.width*n),y=Math.floor((e.clientY-r.top)/r.height*n);return x<0||y<0||x>=n||y>=n?-1:y*n+x}
function down(c){if(c<0||G.won||G.over)return;const e=G.ep[c];
 if(e!==undefined){if(G.done[e])return;snap();G.moves++;trunc(e,0);G.paths[e]=[c];G.cur=e}
 else if(G.own[c]>=0){if(G.done[G.own[c]])return;snap();G.moves++;const i=G.own[c];trunc(i,G.paths[i].indexOf(c)+1);G.cur=i}
 draw()}
function move(c){const i=G.cur,P=G.paths[i],last=P[P.length-1];
 if(c===last||!adj(last,c))return;
 if(P.length>1&&c===P[P.length-2])trunc(i,P.length-1);
 else{const e=G.ep[c];
  if(G.own[c]===-2)return;
  if(e!==undefined&&e!==i)return;
  if(e===i&&c===P[0])return;
  if(e===undefined&&G.own[c]===i){trunc(i,P.indexOf(c)+1);draw();return}
  if(e===undefined&&G.own[c]>=0){const o=G.own[c];if(G.done[o])return;trunc(o,G.paths[o].indexOf(c))}
  P.push(c);if(e===undefined)G.own[c]=i;
  if(e===i){G.done[i]=true;G.cur=-1;pop(i);connectFX(i);beep(660,.12);try{navigator.vibrate(25)}catch(x){}check()}}
 draw()}
function moveTo(c){if(c<0)return;for(let g=0;g<30&&G.cur>=0;g++){const P=G.paths[G.cur],l=P[P.length-1];if(l===c)break;const n=G.n,dx=(c%n)-(l%n),dy=((c/n)|0)-((l/n)|0),nx=Math.abs(dx)>=Math.abs(dy)?l+Math.sign(dx):l+Math.sign(dy)*n;
 move(nx);if(G.cur<0)break;const Q=G.paths[G.cur];if(Q[Q.length-1]!==nx)break}}
function pop(i){G.els[i].forEach(e=>{e.classList.remove('pop');void e.offsetWidth;e.classList.add('pop')})}
function draw(){const n=G.n,s=$('#board svg'),w=100/n,now=Date.now();$('#mv').textContent=G.moves;$('#fl').textContent=(G.own.filter(o=>o>=0).length+G.pairs.length*2)+'/'+(G.n*G.n-G.blocks.length);$('#tg').textContent=G.done.filter(Boolean).length+'/'+G.pairs.length;
 s.innerHTML=G.paths.map((P,i)=>{if(P.length<2)return'';const xy=P.map(c=>((c%n+.5)*w)+','+((((c/n)|0)+.5)*w));
  let h='<polyline fill="none" stroke="#fff" stroke-width="'+(w*.42)+'" stroke-linecap="round" stroke-linejoin="round" opacity=".5" points="'+xy.join(' ')+'"/><polyline fill="none" stroke="'+COLS[i]+'" stroke-width="'+(w*.30)+'" stroke-linecap="round" stroke-linejoin="round" points="'+xy.join(' ')+'"/>';
  const a=G.shine[i];if(G.done[i]&&a&&now-a<800)h+='<path class="shine" pathLength="100" d="M'+xy.join(' L')+'" fill="none" stroke="#fff" stroke-width="'+(w*.14)+'" stroke-linecap="round" stroke-linejoin="round" style="animation-delay:-'+((now-a)/1000)+'s"/>';
  return h}).join('');
 if(G.hl!==undefined&&G.done[G.hl])G.hl=undefined;
 if(G.hl!==undefined){const hp=G.pairs[G.hl].sol.map(c=>((c%n+.5)*w)+','+((((c/n)|0)+.5)*w)).join(' ');
  s.insertAdjacentHTML('afterbegin','<polyline class="hl" fill="none" stroke="#fff" stroke-width="'+(w*.5)+'" stroke-linecap="round" stroke-linejoin="round" points="'+hp+'"/><polyline class="hl2" fill="none" stroke="'+COLS[G.hl]+'" stroke-width="'+(w*.24)+'" stroke-linecap="round" stroke-linejoin="round" points="'+hp+'"/>')}
 react()}
function react(){G.els.forEach(a=>a.forEach(e=>e.classList.remove('wig','pulse')));if(G.cur<0)return;
 const P=G.paths[G.cur],pr=G.pairs[G.cur],si=pr.a===P[0]?0:1,tw=si?pr.a:pr.b;
 G.els[G.cur][si].classList.add('wig');if(adj(P[P.length-1],tw))G.els[G.cur][1-si].classList.add('pulse')}
function cellPos(c){const r=$('#board').getBoundingClientRect(),n=G.n;return[r.left+((c%n)+.5)*r.width/n,r.top+(((c/n)|0)+.5)*r.height/n,r.width/n]}
function connectFX(i){const P=G.paths[i],col=COLS[i];[P[0],P[P.length-1]].forEach((c,k)=>{const[x,y,cs]=cellPos(c);FX.ring(x,y,col,cs*.9);FX.burst(x,y,col,k?12:6)});
 G.shine[i]=Date.now();const now=Date.now();G.combo=now-G.lastC<3500?G.combo+1:1;G.lastC=now;if(G.combo>=2)comboText(G.combo)}
function comboText(k){const m=k>=5?['🚀','Unstoppable!']:k===4?['🤩','Perfect!']:k===3?['🔥','Great!']:['😎','Nice!'],d=document.createElement('div');d.className='combo';
 d.append(animEm('combo-'+Math.min(k,5),m[0]),' '+m[1]+(k>=3?' x'+k:''));document.body.appendChild(d);Voice.say('combo-'+Math.min(k,5));setTimeout(()=>d.remove(),1200)}
function check(){if(!G.done.every(Boolean))return;if(G.own.filter(o=>o>=0).length+G.pairs.length*2<G.n*G.n-G.blocks.length)return;G.won=true;const t=(Date.now()-G.t0)/1000,st=t<=G.lim*.5?3:t<=G.lim*.75?2:1;let gain;
 if(G.daily){gain=S.daily===G.lv?0:DAILY_REWARD;S.daily=G.lv}
 else if(G.cus){gain=RANDOM_REWARD}
 else{gain=G.n>=8?HARD_REWARD:LEVEL_REWARD;const P=wprog();P.stars[G.lv]=Math.max(P.stars[G.lv]||0,st);P.unlocked=Math.max(P.unlocked,Math.min(G.lv+1,maxL()))}
 S.diamonds+=gain;refresh();beep(523,.15,200);FX.confetti();
 setTimeout(()=>{$('#wt').innerHTML=[0,1,2].map(i=>'<span class="st s'+i+' '+(i<st?'on':'off')+'" style="animation-delay:'+(i*.4+.3)+'s"></span>').join('');for(let i=0;i<st;i++)beep(600+i*140,.14,i*400+400);
  $('#wg').innerHTML=gain?'+'+gain+' <i class="ic dia">💎</i>':'Daily reward claimed';$('#wstat').textContent='⏱ '+Math.round(t)+'s     👣 '+G.moves;$('#wnext').textContent=G.daily?'DONE':'NEXT';$('#win .aeh').replaceChildren(animEm('win','🎉'));Voice.say('win');$('#win').classList.add('on')},700)}
function hint(){if(!G||G.won||G.over)return;if(G.hl!==undefined&&!G.done[G.hl])return toast('Follow the glowing path');
 const i=G.done.findIndex(d=>!d);if(i<0)return;if(S.diamonds<HINT_COST)return show('shop');
 S.diamonds-=HINT_COST;G.hl=i;refresh();draw()}

/* skin */
// Image skin: every PNG you add to assets/ui/ is detected here and switches on its CSS rule in css/skin.css.
// Missing images are fine: the game keeps its plain fallback style for that part.
const SKIN_SLOTS='bg-home bg-levels bg-game logo btn-primary btn-secondary btn-back btn-undo btn-reset btn-hint btn-help btn-sound panel board-frame cell block level-tile level-locked star-on star-off diamond dialog'.split(' ');
SKIN_SLOTS.forEach(n=>{const i=new Image();i.onload=()=>document.documentElement.classList.add('a-'+n);i.src='assets/ui/'+n+'.png'});

/* main */
// Pointer input and startup. boot() runs after the page has loaded and js/levels.js is available.
let lastSp=0;
function boot(){initLevels();fixUnlock();FX.init();applyBg();netState();playSub();if(drState().claimable)setTimeout(openDaily,900);addEventListener('online',netState);addEventListener('offline',netState);
 $$('[data-e]').forEach(el=>el.appendChild(ico(el.dataset.e,'faces')));
 const dc=document.createElement('div');dc.id='deco';document.body.prepend(dc);
 PACKS.faces.e.slice().sort(()=>Math.random()-.5).slice(0,16).forEach(ch=>{const w=ico(ch,'faces');w.style.cssText='left:'+Math.random()*92+'%;top:'+Math.random()*92+'%;width:'+(50+Math.random()*60)+'px;animation-delay:-'+Math.random()*9+'s';dc.appendChild(w)});
 const B=$('#board');
 B.addEventListener('pointerdown',e=>{if(!G)return;G.rect=null;B.setPointerCapture(e.pointerId);down(cellAt(e))});
 B.addEventListener('pointermove',e=>{if(G&&G.cur>=0){const i=G.cur;moveTo(cellAt(e));const t=performance.now();if(t-lastSp>40){lastSp=t;FX.spark(e.clientX,e.clientY,COLS[i])}}});
 ['pointerup','pointercancel'].forEach(t=>B.addEventListener(t,()=>{if(G){G.cur=-1;react()}}));
 refresh()}
function bootWhenReady(n){n=n||0;if(typeof LEVELS!=='undefined'||n>25)boot();else setTimeout(()=>bootWhenReady(n+1),100)}
if(document.readyState==='complete')bootWhenReady();else addEventListener('load',()=>bootWhenReady());
