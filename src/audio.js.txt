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
