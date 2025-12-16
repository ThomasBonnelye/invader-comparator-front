import { PlayerData } from '../api/spaceInvaders';

export interface Option {
  label: string;
  value: string;
}

export type PlayersState = {
  uids: string[];
  playersMap: Record<string, PlayerData>;
  firstOptions: Option[];
  secondOptions: Option[];
};
