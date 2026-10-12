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
 nodes=graph(await (await fetchPage('/')).text());assert.equal(nodes.find(x=>x['@type']==='ItemList').numberOfItems,30);
 nodes=graph(await (await fetchPage('/guides/vibe-coded-games')).text());assert.ok(nodes.some(x=>x['@type']==='Article'&&x.headline&&x.image&&x.author&&x.datePublished));
});
test('redirects, crawl controls, private paths and image assets',async()=>{
 assert.equal((await fetchPage('/games/melon-poppers/')).status,308);assert.equal((await fetchPage('/index.html')).status,308);
 const robots=await (await fetchPage('/robots.txt')).text();assert.ok(robots.includes('Sitemap: https://vibodrome.fun/sitemap.xml'));assert.ok(robots.includes('Disallow: /admin'));
 assert.match((await fetchPage('/submit')).headers.get('x-robots-tag'),/noindex/);
 const missing=await fetchPage('/missing');assert.equal(missing.status,404);assert.match(missing.headers.get('x-robots-tag'),/noindex/);
 for(const path of ['/og/site.png','/logo.png','/favicon.png']){const r=await fetchPage(path);assert.equal(r.status,200);assert.equal(r.headers.get('content-type'),'image/png');assert.ok((await r.arrayBuffer()).byteLength>100)}
});
