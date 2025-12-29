import { useState, useCallback, useEffect } from 'react';
import { UidsState, UidsActions } from '../types';
import { AuthStatus } from '../contexts/types';

// Keys for localStorage (guest mode)
export const GUEST_MY_UID_KEY = 'guest_my_uid';
export const GUEST_OTHERS_UIDS_KEY = 'guest_others_uids';

interface UseUidsOptions {
  authStatus: AuthStatus;
  showMessage?: (text: string, type: 'success' | 'error') => void;
  onUidsChanged?: () => Promise<void>;
}

interface UseUidsReturn extends UidsState, UidsActions {
  loadUids: () => Promise<void>;
  resetUids: () => void;
}

export function useUids({
  authStatus,
  showMessage,
  onUidsChanged,
}: UseUidsOptions): UseUidsReturn {
  const [myUid, setMyUid] = useState('');
  const [othersUids, setOthersUids] = useState<string[]>([]);
  const [newUid, setNewUid] = useState('');

  const resetUids = useCallback(() => {
    setMyUid('');
    setOthersUids([]);
    setNewUid('');
  }, []);

  useEffect(() => {
    if (authStatus === null) {
      resetUids();
    }
  }, [authStatus, resetUids]);

  const loadUids = useCallback(async () => {
    try {
      if (authStatus === 'GUEST') {
        const myUidLocal = localStorage.getItem(GUEST_MY_UID_KEY) || '';
        const othersUidsStr = localStorage.getItem(GUEST_OTHERS_UIDS_KEY);
        const othersUidsLocal = othersUidsStr ? JSON.parse(othersUidsStr) : [];

        setMyUid(myUidLocal);
        setOthersUids(othersUidsLocal);
      } else if (authStatus === 'CONNECTED') {
        const response = await fetch('/api/uids', {
          credentials: 'include',
        });
        const data = await response.json();

        setMyUid(data.myUid);
        setOthersUids(data.othersUids);
      }
    } catch (error) {
      console.error('Failed to load UIDs:', error);
      showMessage?.('Les UIDs n\'ont pas été chargés', 'error');
    }
  }, [authStatus, showMessage]);

  const updateMyUid = useCallback(async (uidValue?: string) => {
    const uidToSave = uidValue !== undefined ? uidValue : myUid;

    try {
      if (authStatus === 'GUEST') {
        localStorage.setItem(GUEST_MY_UID_KEY, uidToSave);
        if (uidValue !== undefined) {
          setMyUid(uidToSave);
        }
        showMessage?.('UID mis à jour', 'success');
        await onUidsChanged?.();
      } else if (authStatus === 'CONNECTED') {
        const response = await fetch('/api/uids/my-uid', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ uid: uidToSave }),
        });

        if (response.ok) {
          if (uidValue !== undefined) {
            setMyUid(uidToSave);
          }
          showMessage?.('UID mis à jour', 'success');
          await onUidsChanged?.();
        } else {
          showMessage?.('L\'UID n\'a pas été mis à jour', 'error');
        }
      }
    } catch (error) {
      console.error('UID update failed:', error);
      showMessage?.('L\'UID n\'a pas été mis à jour', 'error');
    }
  }, [authStatus, myUid, showMessage, onUidsChanged]);

  const addOtherUid = useCallback(async () => {
    if (!newUid.trim()) {
      showMessage?.('Veuillez entrer un UID valide', 'error');
      return;
    }

    try {
      if (authStatus === 'GUEST') {
        const updatedOthersUids = [...othersUids, newUid];
        localStorage.setItem(GUEST_OTHERS_UIDS_KEY, JSON.stringify(updatedOthersUids));
        setOthersUids(updatedOthersUids);
        setNewUid('');
        showMessage?.('UID ajouté avec succès', 'success');
        await onUidsChanged?.();
      } else if (authStatus === 'CONNECTED') {
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
          showMessage?.('UID ajouté avec succès', 'success');
          await onUidsChanged?.();
        } else {
          showMessage?.('L\'UID n\'a pas été ajouté', 'error');
        }
      }
    } catch (error) {
      console.error('UID addition failed:', error);
      showMessage?.('L\'UID n\'a pas été ajouté', 'error');
    }
  }, [authStatus, newUid, othersUids, showMessage, onUidsChanged]);

  const removeOtherUid = useCallback(async (uid: string) => {
    try {
      if (authStatus === 'GUEST') {
        const updatedOthersUids = othersUids.filter((u) => u !== uid);
        localStorage.setItem(GUEST_OTHERS_UIDS_KEY, JSON.stringify(updatedOthersUids));
        setOthersUids(updatedOthersUids);
        showMessage?.('UID supprimé avec succès', 'success');
        await onUidsChanged?.();
      } else if (authStatus === 'CONNECTED') {
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
          showMessage?.('UID supprimé avec succès', 'success');
          await onUidsChanged?.();
        } else {
          showMessage?.('L\'UID n\'a pas pu être supprimé', 'error');
        }
      }
    } catch (error) {
      console.error('UID removal failed:', error);
      showMessage?.('L\'UID n\'a pas pu être supprimé', 'error');
    }
  }, [authStatus, othersUids, showMessage, onUidsChanged]);

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
    resetUids,
  };
}
