import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      // ADD ITEM → If exists, increase quantity instead
      addItem: (product) => {
        const items = get().items;
        const existing = items.find((i) => i._id === product._id);

        if (existing) {
          return set({
            items: items.map((i) =>
              i._id === product._id
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          });
        }

        // Add new product with quantity = 1
        set({ items: [...items, { ...product, quantity: 1 }] });
      },

      // REMOVE SINGLE ITEM BY ID
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item._id !== id),
        })),

      // CLEAR CART
      clearCart: () => set({ items: [] }),

      // INCREASE QUANTITY
      increaseQty: (id) => {
        set((state) => ({
          items: state.items.map((item) =>
            item._id === id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        }));
      },

      // DECREASE QUANTITY (remove item if qty reaches 1)
      decreaseQty: (id) => {
        const items = get().items;
        const item = items.find((i) => i._id === id);

        if (!item) return;

        if (item.quantity === 1) {
          // remove item
          return set({
            items: items.filter((i) => i._id !== id),
          });
        }

        // reduce qty
        set({
          items: items.map((i) =>
            i._id === id ? { ...i, quantity: i.quantity - 1 } : i
          ),
        });
      },

      // GET CART TOTAL PRICE
      getTotal: () => {
        return get()
          .items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
    }),

    {
      name: "cart-storage", // localStorage key
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useCartStore;
