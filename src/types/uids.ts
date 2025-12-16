export type UidsState = {
  myUid: string;
  othersUids: string[];
  newUid: string;
};

export type UidsActions = {
  setMyUid: (uid: string) => void;
  setNewUid: (uid: string) => void;
  updateMyUid: () => Promise<void>;
  addOtherUid: () => Promise<void>;
  removeOtherUid: (uid: string) => Promise<void>;
};
