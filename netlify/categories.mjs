import './catalog-additions.mjs';
import { catalog } from '../worker/index.js';

export const extraCategories = {
  Shooters: 'Browser shooters with aiming, ranged combat, and fast reactions. Explore sniper games, arena battles, and wave-based ghost fights, then play on the original developer’s site.',
  Sports: 'Quick browser sports games, from table tennis to arcade boxing. Check each game’s listing for its controls and recommended devices.',
  Physics: 'Browser games built around movement, momentum, collisions, and destruction. Swing through a city, roll through obstacles, or consume everything in your path.',
  'Cozy & Relaxing': 'Slower-paced browser games for growing a garden or exploring a small world. Some adventures include darker story elements; check the game description before playing.',
  Survival: 'Survive enemy waves, hostile environments, and mounting pressure. Explore browser survival games and build your skills through repeated attempts.'
};
export const categories = ['Action','Adventure','Arcade','Puzzle','Racing','Simulation','Strategy','Horror','Platformer',...Object.keys(extraCategories)];
export const categorySlug = name => name.toLowerCase().replace(/ & /g,'-').replace(/\s+/g,'-');
export const categoryForPath = path => categories.find(name => path === '/genres/'+categorySlug(name));
const tags = {
  'the-mind-reading-robot':['Puzzle'],
  'melon-poppers':['Action','Shooters'],
  'the-dropper':['Simulation','Adventure'],
  'the-sizing-game':['Puzzle'],
  'boulder-blitz-rolling-rampage':['Arcade','Action','Physics'],
  'flight-simulator-2025':['Simulation','Action','Shooters'],
  'capybara-food-delivery':['Adventure','Simulation','Physics'],
  'fantos-mega-mart':['Racing','Action','Horror'],
  'tiny-siege':['Strategy'],
  'six-midnight-shifts':['Horror','Simulation','Survival'],
  'planetary-defender-nuke-edition':['Arcade','Action','Shooters','Survival'],
  'bottomless':['Arcade','Physics'],
  'galaxy-eater':['Arcade','Physics'],
  'claiming-cosmos':['Strategy'],
  'marauders-sea':['Strategy','Action'],
  'camo-chameleon':['Action','Strategy'],
  'backrooms-stay-alive':['Horror','Adventure','Survival'],
  'pocket-pong':['Arcade','Sports'],
  'think-ice':['Puzzle'],
  'tiny-skies':['Adventure','Simulation','Cozy & Relaxing'],
  'wenware':['Puzzle','Simulation'],
  'full-send':['Racing'],
  'null-range':['Action','Shooters','Simulation'],
  'haldane-4':['Horror','Adventure'],
  'undersphere':['Action','Shooters'],
  'great-taxi-assignment':['Simulation','Racing'],
  'vibesail':['Simulation','Sports','Racing'],
  'beetlejump':['Platformer','Racing'],
  'plug-prosper':['Puzzle','Physics','Simulation'],
  'pyramid-wars':['Strategy','Action'],
  'sunset-city':['Adventure','Platformer','Action'],
  'eyrie':['Action','Shooters','Survival'],
  'swingers':['Action','Physics'],
  'vector-tango-classic':['Simulation','Strategy'],
  'kanso':['Simulation','Cozy & Relaxing'],
  'finger-haunt':['Action','Shooters','Horror','Survival'],
  'midnight-rider':['Racing','Arcade'],
  'all-4-sides':['Arcade','Platformer'],
  'totoy-bato':['Action','Sports','Arcade'],
  'almost-surgery':['Simulation','Physics']
};
export function genresFor(game) {
  return [...new Set([game.category,...(game.genres||[]),...(tags[game.id]||[])])].filter(name=>categories.includes(name));
}
// Hide-and-seek is not horror; retain the other games' primary categories.
const chameleon=catalog.find(game=>game.id==='camo-chameleon');
if(chameleon)chameleon.category='Action';
