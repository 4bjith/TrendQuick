import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useUserStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,

      setUser: (userData) => set({ user: userData }),
      clearUser: () => set({ user: null }),

      setToken: (token) => set({ token }),
      clearToken: () => set({ token: null }),
    }),

    {
      name: "user-store", // key in localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useUserStore;
