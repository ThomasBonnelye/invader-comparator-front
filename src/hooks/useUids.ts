import { useState, useCallback } from 'react';
import { UidsState, UidsActions } from '../types';
import type { PlayerData } from '../api/spaceInvaders';

interface UseUidsReturn extends UidsState, UidsActions {
  loadUids: () => Promise<void>;
  setUidsList: (uids: string[], others: string[]) => void;
}

export function useUids(
  showMessage: (text: string, type: 'success' | 'error') => void,
  loadPlayers: () => Promise<void>
): UseUidsReturn {
  const [myUid, setMyUid] = useState('');
  const [othersUids, setOthersUids] = useState<string[]>([]);
  const [newUid, setNewUid] = useState('');

  const loadUids = useCallback(async () => {
    try {
      const response = await fetch('/api/uids', {
        credentials: 'include',
      });
      const data = await response.json();

      setMyUid(data.myUid);
      setOthersUids(data.othersUids);
    } catch (error) {
      console.error('Failed to load UIDs:', error);
      showMessage('Failed to load UIDs', 'error');
    }
  }, [showMessage]);

  const updateMyUid = useCallback(async () => {
    try {
      const response = await fetch('/api/uids/my-uid', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ uid: myUid }),
      });

      if (response.ok) {
        showMessage('UID updated successfully', 'success');
        await loadPlayers();
      } else {
        showMessage('Failed to update UID', 'error');
      }
    } catch (error) {
      console.error('UID update failed:', error);
      showMessage('Failed to update UID', 'error');
    }
  }, [myUid, showMessage, loadPlayers]);

  const addOtherUid = useCallback(async () => {
    if (!newUid.trim()) {
      showMessage('Please enter a valid UID', 'error');
      return;
    }

    try {
      const response = await fetch('/api/uids/others-uids', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ uid: newUid }),
      });

      if (response.ok) {
        const data = await response.json();
        setOthersUids(data.othersUids);
        setNewUid('');
        showMessage('UID added successfully', 'success');
        await loadPlayers();
      } else {
        showMessage('Failed to add UID', 'error');
      }
    } catch (error) {
      console.error('UID addition failed:', error);
      showMessage('Failed to add UID', 'error');
    }
  }, [newUid, showMessage, loadPlayers]);

  const removeOtherUid = useCallback(async (uid: string) => {
    try {
      const response = await fetch(
        `/api/uids/others-uids/${encodeURIComponent(uid)}`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      );

      if (response.ok) {
        const data = await response.json();
        setOthersUids(data.othersUids);
        showMessage('UID removed successfully', 'success');
        await loadPlayers();
      } else {
        showMessage('Failed to remove UID', 'error');
      }
    } catch (error) {
      console.error('UID removal failed:', error);
      showMessage('Failed to remove UID', 'error');
    }
  }, [showMessage, loadPlayers]);

  const setUidsList = useCallback((uids: string[], others: string[]) => {
    // This method can be used to set both lists at once
    // For now, we'll let the context handle the coordination
  }, []);

  return {
    myUid,
    othersUids,
    newUid,
    setMyUid,
    setNewUid,
    updateMyUid,
    addOtherUid,
    removeOtherUid,
    loadUids,
    setUidsList,
  };
}
