import { heroSlider } from './hero-slider.mjs';
import { yellowRiot } from './yellow-riot.mjs';
// Shared visual language for the Netlify directory.
const paths={
 game:'<path d="M6 7h12l3 10a2 2 0 0 1-3 2l-4-3h-4l-4 3a2 2 0 0 1-3-2L6 7Z"/><path d="M7 10v4m-2-2h4m6-1h.01M18 14h.01"/>',
 spark:'<path d="m12 3 2.4 6.6L21 12l-6.6 2.4L12 21l-2.4-6.6L3 12l6.6-2.4L12 3Z"/>',
 puzzle:'<path d="M9 3h6v5a3 3 0 1 1 5 3v4h-5a3 3 0 1 1-3 5H4v-8a3 3 0 1 0 5-3V3Z"/>',
 bolt:'<path d="m13 2-9 12h7l-1 8 10-13h-7l1-7Z"/>',
 people:'<circle cx="9" cy="8" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3m1-16a3 3 0 0 1 0 6m2 4a5 5 0 0 1 3 4v2"/>',
 arrow:'<path d="M5 12h14m-6-6 6 6-6 6"/>',
 play:'<path d="m8 4 12 8-12 8V4Z"/>',
 globe:'<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/>'
};
export const icon=(name)=>`<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]||paths.game}</svg>`;
const theme=`
body{background:radial-gradient(ellipse at 5% 0%,#527c2523,transparent 42%),radial-gradient(ellipse at 100% 40%,#6148ab10,transparent 40%),#101310}
.ui-icon{width:19px;height:19px;flex-shrink:0;vertical-align:middle}nav a,.chip{display:inline-flex;align-items:center;gap:7px}header{background:#111610e8}header .brand span{display:inline-block;text-shadow:0 0 24px #b2f25b77}.hero{position:relative}.hero:before{content:'';position:absolute;inset:16px -20px;pointer-events:none;background-image:radial-gradient(#b5e78021 1px,transparent 1px);background-size:22px 22px;mask-image:linear-gradient(110deg,transparent 15%,#000 90%);z-index:-1}.eyebrow{display:flex;align-items:center;gap:8px}.spotlight{box-shadow:0 20px 70px #0006,0 0 0 5px #b4ed5a05;border-color:#87a76066;border-radius:18px;min-height:365px}.spotlight .spotlight-play{gap:16px}.spotlight .pill{border-radius:100px}.btn:not(.outline){position:relative;overflow:hidden;isolation:isolate;text-transform:uppercase;letter-spacing:.65px;font-size:12px;box-shadow:0 4px 20px #b4ed5a19;transition:box-shadow .2s,transform .2s}.btn:not(.outline):after{content:'';position:absolute;inset:-90% auto -90% -80%;width:45%;background:linear-gradient(90deg,transparent,#fff9,transparent);transform:rotate(25deg);animation:cta-shimmer 5s ease-in-out infinite;pointer-events:none;z-index:-1}.btn:not(.outline):hover{box-shadow:0 8px 30px #b4ed5a36;transform:translateY(-2px)}.game-play.btn{font-size:15px;letter-spacing:1.2px}.game-play .ui-icon{width:20px;height:20px}.game-hero{background:radial-gradient(ellipse at top right,#c6f77612,transparent 75%),#1a2017}.game-note h2,.game-info h2,.sectionbar h2{display:flex;align-items:center;gap:10px}.sectionbar h2 .ui-icon,.game-info h2 .ui-icon{color:#c6f776}.card{padding:10px;background:linear-gradient(155deg,#252e2080,#171c16);border:1px solid #36432d;border-radius:14px;transition:transform .2s,border-color .2s,box-shadow .2s}.card:hover{transform:translateY(-4px);border-color:#88a366;box-shadow:0 16px 30px #0003}.card .art{border-radius:9px}.card h3{line-height:1.35}.card .creator{font-size:11px}.card .meta{margin:12px 0 5px}.art .browser{border:1px solid #d0f69d33;border-radius:100px}.callout{position:relative;overflow:hidden;border-radius:18px;background:radial-gradient(ellipse at 90% 30%,#76a73f36,transparent 65%),#1b2517;padding:36px}.callout:before{content:'✳';position:absolute;right:20%;top:-65px;font-size:260px;line-height:1;color:#c6f7760a;pointer-events:none}.callout>*{position:relative}.game-tags .ui-icon{width:13px;height:13px}.game-tag{display:inline-flex;align-items:center;gap:6px}.art:has(img):before{display:none}.visual-picks{display:flex;align-items:center;gap:0;margin-top:20px}.visual-picks a{display:block;width:64px;height:45px;border:2px solid #111a0e;border-radius:9px;overflow:hidden;margin-right:-10px;transform:rotate(-7deg);background:#27321d;transition:transform .2s}.visual-picks a:nth-child(2){transform:rotate(5deg)}.visual-picks a:nth-child(3){transform:rotate(-3deg)}.visual-picks a:hover{transform:translateY(-5px) rotate(0);z-index:1}.visual-picks img{width:100%;height:100%;object-fit:cover}.visual-picks span{margin-left:24px;font-size:12px;color:#a9b69d}.chip .ui-icon{width:15px;height:15px}
@keyframes cta-shimmer{0%,65%{left:-80%}90%,100%{left:150%}}
@media(max-width:720px){.spotlight{min-height:310px}.card{padding:8px}.visual-picks{margin-top:16px}.callout{padding:25px}.game-play.btn{min-height:55px}}
@media(prefers-reduced-motion:reduce){.btn:not(.outline):after{animation:none;display:none}.btn,.card,.visual-picks a{transition:none!important}.card:hover,.btn:not(.outline):hover{transform:none}}
`;
export function visualTheme(html, games, path) {
 html=html.replace(/<label style="display:flex;align-items:flex-start;gap:12px">(<input(?=[^>]*name="consent")[^>]*>)([\s\S]*?)<\/label>/,(_,input,text)=>'<label class="contact-consent">'+input+'<span>'+text.trim()+'</span></label>');
 html=html.replace('</head>',()=>'<style>'+theme+yellowRiot+'</style></head>');
 const labels={'Discover games':'game','Puzzle':'puzzle','Action':'bolt','Developers':'people','All games':'game','Arcade':'game','Simulation':'globe','Strategy':'puzzle','Adventure':'spark','Horror':'spark','Racing':'bolt','Platformer':'game','Shooters':'bolt','Sports':'game','Physics':'bolt','Cozy & Relaxing':'spark','Survival':'game'};
 html=html.replace(/(<(?:a|button)\b[^>]*>)(Discover games|Puzzle|Action|Developers|All games|Arcade|Simulation|Strategy|Adventure|Horror|Racing|Platformer)(<\/(?:a|button)>)/g,(_,open,label,close)=>open+icon(labels[label])+label+close);
 html=html.replace(/(<h2(?:\s[^>]*)?>)(Featured games|Find your next favorite|The essentials|Before you jump in|More games to explore)/g,(_,tag,label)=>tag+icon(label==='Before you jump in'?'globe':label==='The essentials'?'game':'spark')+label);
 html=html.replace('>PLAY GAME <span','>'+icon('play')+' PLAY GAME <span');
 if(path==='/'){
  html=heroSlider(html,games);
  const picks=games.filter(g=>g.imageUrl?.startsWith('/media/')).slice(0,3);
  if(picks.length)html=html.replace('<div class="tiny">Browser games · Independent creators · Direct links</div>',()=>'<div class="tiny">Browser games · Independent creators · Direct links</div><div class="visual-picks">'+picks.map(g=>'<a href="/games/'+encodeURIComponent(g.id)+'" aria-label="Discover '+String(g.title).replace(/[&<>"']/g,'')+'"><img src="'+g.imageUrl+'" alt="" loading="lazy"></a>').join('')+'<span>Small studios. Big discoveries.</span></div>');
 }
 return html.replace(/style="([^"]*)"/g,(full,style)=>'style="'+style.replace(/#c6f776/gi,'#932444').replace(/#58624e/gi,'#932444')+'"');
}
