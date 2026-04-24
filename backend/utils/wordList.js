const words = [
  'amber', 'anchor', 'anvil', 'apple', 'arrow', 'atlas', 'azure',
  'bacon', 'badge', 'bark', 'barrel', 'basin', 'beacon', 'beam',
  'bear', 'bell', 'birch', 'blade', 'blast', 'blaze', 'blizzard',
  'block', 'bloom', 'bolt', 'bone', 'border', 'boulder', 'branch',
  'brass', 'brave', 'breeze', 'brick', 'bridge', 'brine', 'brook',
  'brush', 'buckle', 'bullet', 'bunker', 'burst', 'canyon', 'cape',
  'carbon', 'castle', 'cave', 'cedar', 'chain', 'chalk', 'chasm',
  'chest', 'chief', 'cipher', 'circle', 'cinder', 'clamp', 'claw',
  'clay', 'cliff', 'cloak', 'cloud', 'clover', 'coal', 'coast',
  'cobalt', 'cobble', 'comet', 'copper', 'coral', 'cord', 'core',
  'cork', 'corner', 'crag', 'crane', 'crater', 'creek', 'crest',
  'crisp', 'cross', 'crown', 'crush', 'crust', 'crystal', 'cube',
  'current', 'curve', 'dagger', 'dale', 'dark', 'dawn', 'delta',
  'depth', 'desert', 'dew', 'diamond', 'digit', 'dingo', 'dome',
  'draft', 'dragon', 'drain', 'dusk', 'dust', 'eagle', 'echo',
  'edge', 'elder', 'ember', 'epic', 'fang', 'falcon', 'fell',
  'fern', 'field', 'fierce', 'fire', 'fjord', 'flare', 'flash',
  'flint', 'flood', 'floor', 'flux', 'foam', 'fog', 'force',
  'forge', 'fork', 'fort', 'fossil', 'fracture', 'frame', 'frost',
  'fume', 'fury', 'gale', 'gap', 'garnet', 'gate', 'geyser',
  'ghost', 'glade', 'glass', 'glow', 'gold', 'gorge', 'granite',
  'gravel', 'grove', 'guard', 'gulf', 'gust', 'hammer', 'haven',
  'haze', 'heath', 'helm', 'hollow', 'horizon', 'hull', 'husk',
  'ice', 'idol', 'inlet', 'iron', 'isle', 'ivory', 'jade',
  'jaguar', 'jasper', 'javelin', 'jetty', 'jungle', 'kelp', 'kite',
  'knot', 'lagoon', 'lance', 'larch', 'lava', 'lead', 'leaf',
  'ledge', 'level', 'light', 'lime', 'linen', 'lion', 'log',
  'loom', 'loop', 'lore', 'lunar', 'lynx', 'magma', 'maple',
  'marble', 'marsh', 'mast', 'maze', 'mesa', 'metal', 'meteor',
  'mist', 'moat', 'moon', 'moor', 'moss', 'mount', 'mud',
  'mystic', 'needle', 'nest', 'night', 'noble', 'north', 'notch',
  'nova', 'oak', 'obsidian', 'ocean', 'onyx', 'orbit', 'ore',
  'ozone', 'pact', 'peak', 'pebble', 'pine', 'pit', 'pixel',
  'plain', 'planet', 'plank', 'plasma', 'plume', 'polar', 'pond',
  'portal', 'prism', 'pulse', 'quarry', 'quartz', 'quest', 'quick',
  'rain', 'rapids', 'raven', 'ray', 'reef', 'ridge', 'rift',
  'rim', 'ripple', 'river', 'robe', 'rock', 'root', 'rope',
  'ruin', 'rush', 'rust', 'sage', 'sand', 'shard', 'shield',
  'shore', 'silver', 'sketch', 'skull', 'slate', 'slope', 'snow',
  'solar', 'spark', 'spear', 'spike', 'spirit', 'splash', 'spore',
  'spray', 'spring', 'spur', 'squall', 'stack', 'star', 'static',
  'steel', 'stem', 'step', 'stone', 'storm', 'strand', 'stream',
  'summit', 'surge', 'swamp', 'swift', 'thorn', 'thunder', 'tide',
  'timber', 'titan', 'torch', 'torrent', 'tower', 'track', 'trail',
  'trap', 'trench', 'trial', 'tundra', 'tunnel', 'vapor', 'vault',
  'venom', 'vent', 'vines', 'void', 'volcano', 'vortex', 'wake',
  'ward', 'wave', 'web', 'wedge', 'west', 'whirl', 'wind',
  'wisp', 'wolf', 'wood', 'wraith', 'zenith', 'zone',
];


const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

export const generateGameName = () => {
  const w1 = pickRandom(words);
  let w2 = pickRandom(words);
  let w3 = pickRandom(words);

  // Ensure all three words are different
  while (w2 === w1) w2 = pickRandom(words);
  while (w3 === w1 || w3 === w2) w3 = pickRandom(words);

  const capitalize = (w) => w.charAt(0).toUpperCase() + w.slice(1);
  return `${capitalize(w1)} ${capitalize(w2)} ${capitalize(w3)}`;
};

export default words;