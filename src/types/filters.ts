export type FiltersState = {
  selectedFirst: string;
  selectedSeconds: string[];
  search: string;
};

export type FiltersActions = {
  setSelectedFirst: (value: string) => void;
  setSelectedSeconds: (values: string[]) => void;
  setSearch: (value: string) => void;
};
