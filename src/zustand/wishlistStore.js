import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useWishlistStore = create(
    persist(
        (set, get) => ({
            wishlist: [],

            addToWishlist: (product) => {
                const { wishlist } = get();
                // Check if already in wishlist
                const exists = wishlist.find((item) => item._id === product._id);
                if (!exists) {
                    // Store minimal info or full product
                    set({ wishlist: [...wishlist, product] });
                }
            },

            removeFromWishlist: (id) => {
                const { wishlist } = get();
                set({ wishlist: wishlist.filter((item) => item._id !== id) });
            },

            isInWishlist: (id) => {
                const { wishlist } = get();
                return wishlist.some(item => item._id === id);
            },

            clearWishlist: () => set({ wishlist: [] }),
        }),
        {
            name: "wishlist-store",
            storage: createJSONStorage(() => localStorage),
        }
    )
);

export default useWishlistStore;
