export const fetchPlayers = async (): Promise<{ value: string }[]> => {

  try {

    const response = await fetch('/api/uids');
    
    if (!response.ok) {
      throw new Error('Failed to fetch UIDs');
    }

    const data = await response.json();

    const allUids = [data.myUid, ...data.othersUids].filter(Boolean);
    
    return allUids.map((value: string) => ({ value }));
    
  } catch (error) {
    console.error('Players loading failed:', error);
    return [];
  }
};

export const players: { value: string }[] = [];