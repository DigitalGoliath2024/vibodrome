import { categories, categorySlug, genresFor } from './categories.mjs';
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function categoryLinks(games,active='') {
 return categories.map(c=>`<a class="chip${c===active?' active':''}" href="/genres/${categorySlug(c)}"${c===active?' aria-current="page"':''}>${escape(c)} <span class="category-count">${games.filter(g=>genresFor(g).includes(c)).length}</span></a>`).join('');
}
export function categoryUI(html,games,path) {
 if(path==='/games')html=html.replace(/<div class="filters">[\s\S]*?<\/div>/,()=>'<div class="filters">'+categoryLinks(games)+'</div>');
 if(path==='/') {
  html=html.replace(/<button class="chip active" data-filter="All">All games<\/button>[\s\S]*?(?=<div class="search">)/,()=>'<button class="chip active" data-filter="All">All games</button>'+categories.map(c=>`<button class="chip" data-filter="${escape(c)}">${escape(c)} <span class="category-count">${games.filter(g=>genresFor(g).includes(c)).length}</span></button>`).join(''));
  html=html.replace("c.dataset.category===selected","JSON.parse(c.dataset.genres||'[]').includes(selected)");
 }
 if(path==='/submit')html=html.replace(/(<select id="category" name="category">)[\s\S]*?<\/select>/,(_,open)=>open+categories.map(c=>'<option>'+escape(c)+'</option>').join('')+'</select>');
 html=html.replace(/(<article class="card"[^>]*)(>\s*<a href="\/games\/([^"/]+)")/g,(full,start,end,id)=>{
  const game=games.find(g=>g.id===id);if(!game)return full;
  const genres=genresFor(game);
  start=start.replace(/data-search="([^"]*)"/,(_,search)=>'data-search="'+search+' '+escape(genres.join(' ').toLowerCase())+'"');
  return start+' data-genres="'+escape(JSON.stringify(genres))+'"'+end;
 });
 return html;
}
