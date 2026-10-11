// Shows any script error on the screen (red box at the top) so you can send a screenshot. Tap the box to hide it.
(function(){
 function box(m){var b=document.getElementById('errbox');if(!b){b=document.createElement('pre');b.id='errbox';
  b.style.cssText='position:fixed;left:0;right:0;top:0;z-index:99999;margin:0;padding:8px;background:#b00020;color:#fff;font:12px/1.3 monospace;white-space:pre-wrap;max-height:40vh;overflow:auto';
  b.onclick=function(){b.remove()};(document.body||document.documentElement).appendChild(b)}b.textContent+=m+'\n'}
 window.showErr=box;
 window.addEventListener('error',function(e){
  if(e.target&&e.target!==window){if(e.target.tagName==='SCRIPT')box('Could not load: '+e.target.src);return}
  if(!e.message)return;
  box(((e.filename||'').split('/').slice(-2).join('/'))+':'+e.lineno+'  '+e.message)},true);
 window.addEventListener('unhandledrejection',function(e){box('Promise error: '+(e.reason&&e.reason.message||e.reason))});
})();
