import nuggets from '../data/nuggets.json';
export const nuggetDescription = `${nuggets.length} short ideas from ${new Set(nuggets.map(nugget => nugget.href)).size} essays and frameworks, edited as summaries with links to the full arguments.`;
