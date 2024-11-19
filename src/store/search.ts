import { create } from "zustand";

type searchStore = {
  search: string;

  setSearch: (s: string) => void;
};

export const useSearchStore = create<searchStore>()((set) => ({
  search: "",

  setSearch: (s: string) => set({ search: s }),
}));
