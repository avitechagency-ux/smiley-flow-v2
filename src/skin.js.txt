// Image skin: every PNG you add to assets/ui/ is detected here and switches on its CSS rule in css/skin.css.
// Missing images are fine: the game keeps its plain fallback style for that part.
const SKIN_SLOTS='bg-home bg-levels bg-game logo btn-primary btn-secondary btn-back btn-undo btn-reset btn-hint btn-help btn-sound panel board-frame cell block level-tile level-locked star-on star-off diamond dialog'.split(' ');
SKIN_SLOTS.forEach(n=>{const i=new Image();i.onload=()=>document.documentElement.classList.add('a-'+n);i.src='assets/ui/'+n+'.png'});
