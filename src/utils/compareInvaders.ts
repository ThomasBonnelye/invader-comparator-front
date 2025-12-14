/**
 * Compare players' invaders against a reference player's invaders
 * 
 * @param referenceInvaders - List of invaders from the reference player
 * @param others - Object mapping other player names to their invader lists
 * @returns - Object mapping player names to invaders they have that the reference does not
 */
export function compareInvaders(
  referenceInvaders: string[],
  others: Record<string, string[]>
): Record<string, string[]> {

  const result: Record<string, string[]> = {};
  const refSet = new Set(referenceInvaders.map(s => s.trim()));

  for (const [playerName, invList] of Object.entries(others)) {
    const invSet = new Set((invList || []).map(s => s.trim()));
    const diff = [...invSet].filter(inv => !refSet.has(inv));
    result[playerName] = diff.sort();
  }

  return result;
}