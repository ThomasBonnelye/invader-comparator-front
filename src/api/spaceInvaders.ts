export interface PlayerData {
  player: string; // player name
  invaders: string[];
}

interface InvaderData {
  name?: string;
}

/**
 * Get player data from Space Invaders API
 * 
 * @param uid - Unique identifier of the player
 * @returns - PlayerData object containing player name and invader names
 */
export async function fetchPlayerData(uid: string): Promise<PlayerData> {
  const BASE_URL = 'https://api.space-invaders.com/flashinvaders_v3_pas_trop_predictif/api/gallery?uid=';

  try {
    const response = await fetch(`${BASE_URL}${uid}`);
    const data = await response.json();
    const player = data?.player?.name || uid;
    
    const invadersRaw = Object.values(data?.invaders || {}) as InvaderData[];
    const invaderNames = [
      ...new Set(
        invadersRaw.map((inv) => (inv?.name ?? '').toString().trim())
      )
    ];

    return {
      player,
      invaders: invaderNames,
    };
    
  } catch (error) {
    console.error(`Data fetch error for player with UID ${uid}:`, error);

    return {
      player: uid,
      invaders: [],
    };
  }
}