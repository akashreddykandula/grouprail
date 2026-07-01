import { create } from 'zustand';

const useTripStore = create((set, get) => ({
  currentTrip: null,
  trips: [],
  members: [],
  isLoading: false,

  setCurrentTrip: (trip) => set({ currentTrip: trip }),

  setTrips: (trips) => set({ trips }),

  setMembers: (members) => set({ members }),

  setLoading: (isLoading) => set({ isLoading }),

  updateTrip: (updates) =>
    set((state) => ({
      currentTrip: state.currentTrip
        ? { ...state.currentTrip, ...updates }
        : null,
    })),

  addMember: (member) =>
    set((state) => ({
      members: [...state.members, member],
    })),

  updateMember: (memberId, updates) =>
    set((state) => ({
      members: state.members.map((m) =>
        m._id === memberId ? { ...m, ...updates } : m
      ),
    })),

  clearTrip: () =>
    set({
      currentTrip: null,
      members: [],
    }),
}));

export default useTripStore;
