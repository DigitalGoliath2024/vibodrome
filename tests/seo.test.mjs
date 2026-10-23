import test from 'node:test';
import assert from 'node:assert/strict';
import { handle } from '../netlify/functions/site.mjs';
const store={list:async()=>({blobs:[]}),get:async()=>null,set:async()=>{},delete:async()=>{}};
const fetchPage=path=>handle(new Request('https://vibodrome.fun'+path),store);
const graph=text=>JSON.parse(text.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];
test('all sitemap pages have one canonical, unique metadata, valid JSON-LD and visible breadcrumbs',async()=>{
 const sitemap=await (await fetchPage('/sitemap.xml')).text();
 const urls=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);assert.equal(urls.length,new Set(urls).size);assert.ok(!urls.some(x=>x.includes('/submit')||x.includes('/admin')||x.includes('/api/')));
 const titles=new Set(),descriptions=new Set();
 for(const url of urls){const path=new URL(url).pathname;const r=await fetchPage(path);assert.equal(r.status,200,path);const html=await r.text();assert.equal((html.match(/rel="canonical"/g)||[]).length,1,path);assert.ok(html.includes('href="'+url+'"'),path);const title=html.match(/<title>(.*?)<\/title>/)[1],description=html.match(/<meta name="description" content="([^"]*)"/)[1];assert.ok(title&&description,path);assert.ok(!titles.has(title),'duplicate title '+path);assert.ok(!descriptions.has(description),'duplicate description '+path);titles.add(title);descriptions.add(description);assert.ok(html.includes('og:image')&&html.includes('twitter:card'),path);const nodes=graph(html);assert.ok(nodes.some(x=>x['@type']==='WebSite'),path);assert.ok(nodes.some(x=>x['@type']==='Organization'),path);assert.ok(!html.includes('vibodrome.artificialtv.chatgpt.site'),path);assert.equal((html.match(/<h1[ >]/g)||[]).length,1,path);if(path!=='/'){const b=nodes.find(x=>x['@type']==='BreadcrumbList');assert.ok(b,path);assert.ok(html.includes('aria-label="Breadcrumb"'),path);assert.ok(b.itemListElement.length>=2);b.itemListElement.forEach((x,i)=>{assert.equal(x.position,i+1);assert.ok(x.name&&x.item.startsWith('https://vibodrome.fun/'))});}assert.ok(!nodes.some(x=>x.aggregateRating||x.offers),'invented rating or offer '+path);
 }
 console.log('Audited '+urls.length+' indexable pages');
});
test('game, studio and editorial directory schema are appropriate',async()=>{
 let nodes=graph(await (await fetchPage('/games/melon-poppers')).text());assert.ok(nodes.some(x=>x['@type']==='VideoGame'&&x.image&&x.author));
 nodes=graph(await (await fetchPage('/developers/flying-vee-studios')).text());assert.ok(nodes.some(x=>x['@type']==='ProfilePage'));
 nodes=graph(await (await fetchPage('/developers/jason')).text());assert.ok(!nodes.some(x=>x['@type']==='ProfilePage'));
 nodes=graph(await (await fetchPage('/')).text());assert.equal(nodes.find(x=>x['@type']==='ItemList').numberOfItems,40);
 nodes=graph(await (await fetchPage('/guides/vibe-coded-games')).text());assert.ok(nodes.some(x=>x['@type']==='Article'&&x.headline&&x.image&&x.author&&x.datePublished));
});
test('redirects, crawl controls, private paths and image assets',async()=>{
 assert.equal((await fetchPage('/games/melon-poppers/')).status,308);assert.equal((await fetchPage('/index.html')).status,308);
 const robots=await (await fetchPage('/robots.txt')).text();assert.ok(robots.includes('Sitemap: https://vibodrome.fun/sitemap.xml'));assert.ok(robots.includes('Disallow: /admin'));
 assert.match((await fetchPage('/submit')).headers.get('x-robots-tag'),/noindex/);
 const missing=await fetchPage('/missing');assert.equal(missing.status,404);assert.match(missing.headers.get('x-robots-tag'),/noindex/);
 for(const path of ['/og/site.png','/logo.png','/favicon.png']){const r=await fetchPage(path);assert.equal(r.status,200);assert.equal(r.headers.get('content-type'),'image/png');assert.ok((await r.arrayBuffer()).byteLength>100)}
});
test('new editorial games have discoverable pages, artwork, creator credits and original play links',async()=>{
 const { additions }=await import('../netlify/catalog-additions.mjs');
 assert.equal(additions.length,10);
 const directory=await(await fetchPage('/games')).text();
 const sitemap=await(await fetchPage('/sitemap.xml')).text();
 for(const game of additions){
  const path='/games/'+game.id;
  assert.ok(directory.includes('href="'+path+'"'),game.id+' missing from directory');
  assert.ok(sitemap.includes('https://vibodrome.fun'+path),game.id+' missing from sitemap');
  const response=await fetchPage(path);assert.equal(response.status,200);
  const html=await response.text();
  assert.ok(html.includes(game.imageUrl.replaceAll('&','&amp;')),game.id+' missing cover');
  assert.ok(html.includes('href="'+game.url+'"'),game.id+' incorrect play destination');
  const schema=graph(html).find(node=>node['@type']==='VideoGame');
  assert.equal(schema.url,game.url);assert.ok(schema.image&&schema.author);
 }
 const home=await(await fetchPage('/')).text();assert.ok(home.includes('40 games to explore.'));assert.ok(!home.includes('30 games to explore.'));
});
test('categories share multi-genre membership across pages, filters and schema',async()=>{
 const {categories,categorySlug,genresFor}=await import('../netlify/categories.mjs');
 const {catalog}=await import('../worker/index.js');
 const home=await(await fetchPage('/')).text();
 const directory=await(await fetchPage('/games')).text();
 const sitemap=await(await fetchPage('/sitemap.xml')).text();
 for(const category of categories){
  const path='/genres/'+categorySlug(category),expected=catalog.filter(g=>genresFor(g).includes(category));
  assert.ok(expected.length,category+' should not be empty');
  const response=await fetchPage(path);assert.equal(response.status,200,path);
  const html=await response.text();
  const ids=[...html.matchAll(/<article class="card"[^>]*>\s*<a href="\/games\/([^"/]+)"/g)].map(m=>m[1]);
  assert.deepEqual(ids,expected.map(g=>g.id),category);
  assert.equal(graph(html).find(n=>n['@type']==='ItemList').numberOfItems,expected.length);
  assert.ok(directory.includes('href="'+path+'"'));assert.ok(sitemap.includes('<loc>https://vibodrome.fun'+path+'</loc>'));
  assert.ok(home.includes('data-filter="'+category.replaceAll('&','&amp;')+'"'));
 }
 assert.ok(home.includes("JSON.parse(c.dataset.genres||'[]').includes(selected)"));
 const finger=await(await fetchPage('/games/finger-haunt')).text();
 assert.deepEqual(graph(finger).find(n=>n['@type']==='VideoGame').genre,['Action','Shooters','Horror','Survival']);
 assert.ok(finger.includes('href="/genres/shooters"'));assert.ok(finger.includes('href="/genres/survival"'));
 const horror=await(await fetchPage('/genres/horror')).text();assert.ok(!horror.includes('href="/games/camo-chameleon"'));
 assert.equal((await fetchPage('/genres/not-a-category')).status,404);
});
test('submission form offers new categories and stores selected primary category',async()=>{
 const saved=[];
 const capturing={...store,set:async(key,value)=>saved.push(JSON.parse(value))};
 const page=await(await fetchPage('/submit')).text();assert.ok(page.includes('<option>Cozy &amp; Relaxing</option>'));
 for(const category of ['Shooters','Sports','Physics','Cozy & Relaxing','Survival']){
  const response=await handle(new Request('https://vibodrome.fun/api/submit',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({title:'Test entry',creator:'Test creator',email:'test@example.com',url:'https://example.com/game',description:'A test submission.',category,consent:'on'})}),capturing);
  assert.equal(response.status,200);assert.equal(saved.at(-1).category,category);
 }
});
test('About copy links to live discovery pages and game pages link back to the main hubs',async()=>{
 const about=await(await fetchPage('/about')).text();
 const article=about.match(/<article class="page about-page">([\s\S]*?)<\/article>/)?.[1];assert.ok(article);
 assert.match(article,/<a href="\/">Vibe Coded Games<\/a>/);
 const targets=[...new Set([...article.matchAll(/<a [^>]*href="([^"]+)"/g)].map(m=>m[1]))];
 for(const path of ['/','/games','/guides/vibe-coded-games','/genres/puzzle','/genres/shooters','/genres/strategy','/genres/simulation','/genres/cozy-relaxing','/developers','/developers/flying-vee-studios','/submit','/contact']){
  assert.ok(targets.includes(path),path+' missing from About content');assert.equal((await fetchPage(path)).status,200,path);
 }
 const aboutNode=graph(about).find(n=>n['@type']==='AboutPage');assert.ok(aboutNode);assert.match(aboutNode.name,/About Vibodrome/);
 for(const path of ['/games/tiny-skies','/games/vibesail','/games/full-send']){
  const html=await(await fetchPage(path)).text();const section=html.match(/<p class="discovery-links">([\s\S]*?)<\/p>/)?.[1];assert.ok(section,path);
  assert.match(section,/<a href="\/">vibe-coded games<\/a>/);assert.ok(section.includes('href="/guides/vibe-coded-games"'));
 }
 const home=await(await fetchPage('/')).text();assert.match(home,/<title>[^<]*Vibe-Coded Games[^<]*AI-Coded Browser Games[^<]*<\/title>/);
});
