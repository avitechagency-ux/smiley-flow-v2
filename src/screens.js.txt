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
