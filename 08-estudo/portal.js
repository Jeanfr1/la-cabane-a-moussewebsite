'use strict';
const clamp=(v,min=0,max=1)=>Math.max(min,Math.min(max,v));
const range=(p,a,b)=>clamp((p-a)/(b-a));
const ease=t=>t*t*(3-2*t);
function motionAt(p){p=clamp(p);return{p,campaignOpacity:1-ease(range(p,.2,.37)),heroScale:1+.17*ease(range(p,0,.65)),copyOpacity:1-ease(range(p,.18,.52)),copyY:-50*ease(range(p,.12,.5)),toastOpacity:ease(range(p,.16,.35))*(1-ease(range(p,.58,.78))),toastScale:1+.24*ease(range(p,.2,.65)),toastX:-18*ease(range(p,.2,.65)),revealOpacity:ease(range(p,.64,.76)),revealInset:46*(1-ease(range(p,.65,1))),glintOpacity:Math.sin(Math.PI*range(p,.38,.59)),chapter:p<.35?'01 / LE RENDEZ-VOUS':p<.7?'02 / LE TCHIN':'03 / LA VRAIE CABANE'};}
const root=document.documentElement,hero=document.querySelector('.hero-scroll'),button=document.getElementById('motion-toggle'),chapter=document.getElementById('chapter'),media=window.matchMedia('(prefers-reduced-motion: reduce)');
let manual=false,pending=false;
function apply(m){const props={'--p':m.p,'--campaign-opacity':m.campaignOpacity,'--hero-scale':m.heroScale,'--copy-opacity':m.copyOpacity,'--copy-y':m.copyY+'px','--toast-opacity':m.toastOpacity,'--toast-scale':m.toastScale,'--toast-x':m.toastX+'px','--reveal-opacity':m.revealOpacity,'--reveal-inset':m.revealInset+'%','--glint-opacity':m.glintOpacity};Object.entries(props).forEach(([k,v])=>root.style.setProperty(k,String(v)));chapter.textContent=m.chapter;}
function render(){pending=false;const reduced=manual||media.matches;root.classList.toggle('reduced',reduced);button.setAttribute('aria-pressed',String(reduced));button.disabled=media.matches;button.textContent=media.matches?'Mouvement réduit':reduced?'Activer l’animation':'Désactiver l’animation';if(reduced){apply(motionAt(0));return;}const rect=hero.getBoundingClientRect();const span=Math.max(hero.offsetHeight-window.innerHeight,1);apply(motionAt(-rect.top/span));}
function requestRender(){if(!pending){pending=true;requestAnimationFrame(render);}}
button.addEventListener('click',()=>{manual=!(manual||media.matches);if(media.matches)manual=true;render();});
if(media.addEventListener)media.addEventListener('change',render);window.addEventListener('scroll',requestRender,{passive:true});window.addEventListener('resize',requestRender,{passive:true});
const menu=document.querySelector('.menu-toggle'),nav=document.getElementById('navigation');
function closeMenu(){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');}
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';nav.classList.toggle('open',open);menu.setAttribute('aria-expanded',String(open));});nav.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu();});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('open')){closeMenu();menu.focus();}});
render();
