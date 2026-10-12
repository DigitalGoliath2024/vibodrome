import { mkdir, writeFile } from 'node:fs/promises';
import worker from '../worker/index.js';
await mkdir('netlify-public', { recursive: true });
const home = await worker.fetch(new Request('https://vibodrome.fun/'), {});
await writeFile('netlify-public/index.html', await home.text());
console.log('Netlify publish directory ready; all routes are served by the site function.');
