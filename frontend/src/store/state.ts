/* eslint-disable @typescript-eslint/no-explicit-any */
// src/store.ts
import  {create, StateCreator } from 'zustand';

interface BearState {
  clients: any;
  setClients: (value: any) => void;
//   setBears: (count: number) => void;
}

const bearSlice: StateCreator<BearState> = (set) => ({
  clients: [],
  setClients: (newValue: any) => set(() => ({ clients: [...newValue] })),
});

const useBearStore = create(bearSlice);

export default useBearStore;
