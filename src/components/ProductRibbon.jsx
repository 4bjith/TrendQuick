import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import api from "../api/axiosClient";
import { useEffect, useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { BASE_URL } from "../api/url";

export default function ProductRibbon() {
  const [items, setItems] = useState([]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["products", 1, 10],
    queryFn: async () => {
      const res = await api.get("/product?page=1&limit=10");
      return res.data;
    },
  });

  useEffect(() => {
    if (data?.data) {
      setItems(data.data);
    }
  }, [data]);

  if (isLoading) {
    return <p className="text-center py-10 bg-cream">Loading products...</p>;
  }

  if (isError) {
    return (
      <p className="text-center py-10 text-red-600 bg-cream">
        Failed to load products.
      </p>
    );
  }

  return (
    <div className="w-full py-16 bg-background text-foreground transition-colors duration-300">
      {/* ---------- Heading Section ---------- */}
      <div className="max-w-6xl mx-auto px-4 mb-10">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-5">
          {/* Heading Left */}
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              Featured Products
            </h1>
            <p className="text-foreground/60 mt-2 text-sm sm:text-base font-medium">
              Discover our handpicked collection of premium products designed
              for quality and style.
            </p>
          </div>

          {/* View All Button */}
          <Link to="/products" className="self-start sm:self-center">
            <button className="flex items-center gap-2 border border-border text-foreground px-5 py-2.5 rounded-xl hover:bg-surface transition-all w-fit text-sm font-bold shadow-sm">
              View All Products →
            </button>
          </Link>
        </div>
      </div>

      {/* ---------- Product Grid ---------- */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-20 sm:px-0">
        {items.slice(0, 4).map((item) => (
          <div
            key={item._id}
            className="group bg-surface rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-border flex flex-col h-full hover:-translate-y-1"
          >
            {/* Product Image */}
            <div className="relative aspect-square bg-white dark:bg-zinc-900 m-2 rounded-xl overflow-hidden flex items-center justify-center p-4">
              <img
                src={item.image.startsWith('http') ? item.image : `${BASE_URL}/${item.image}` || "https://via.placeholder.com/400"}
                alt={item.title}
                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
              />

              {item.discount && (
                <span className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 text-xs rounded-lg">
                  -{item.discount}%
                </span>
              )}
            </div>

            {/* Info Section */}
            <div className="p-5 flex flex-col flex-grow">
              <div className="flex-grow">
                <p className="uppercase text-[10px] text-green-medium tracking-wider font-bold">
                  {item.catagory?.catagoryName || "Category"}
                </p>

                <h2 className="font-bold text-base mt-1 leading-tight line-clamp-2 text-foreground group-hover:text-green-medium transition-colors">
                  {item.title}
                </h2>

                <div className="flex items-center text-yellow-500 text-xs mt-1 gap-1">
                  ⭐ <span className="text-foreground/50 font-semibold">{item.rating || "4.5"}</span>
                </div>

                <div className="mt-2 flex items-baseline gap-2">
                  <p className="text-foreground text-lg font-black">
                    ₹{item.price}
                  </p>
                  {item.oldPrice && (
                    <p className="line-through text-foreground/30 text-xs">
                      ₹{item.oldPrice}
                    </p>
                  )}
                </div>
              </div>

              {/* Add Button */}
              <button className="mt-6 w-full flex items-center justify-center gap-2 bg-green-dark dark:bg-foreground dark:text-background text-cream py-3 rounded-xl hover:bg-green-medium dark:hover:bg-green-light transition-all duration-300 text-sm font-bold shadow-sm active:scale-95">
                <FaShoppingCart size={14} /> Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ---------- Explore Collection Box ---------- */}
      <div className="max-w-6xl mx-auto bg-surface border border-border rounded-[2rem] p-8 sm:p-12 mt-20 text-center shadow-lg relative overflow-hidden group">
        <div className="relative z-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Explore Our Full Collection
          </h2>
          <p className="text-foreground/60 mt-3 text-sm sm:text-lg max-w-2xl mx-auto font-medium">
            Browse hundreds of carefully selected products across multiple
            categories. Find exactly what you're looking for.
          </p>

          <Link to="/products">
            <button className="bg-green-dark dark:bg-foreground dark:text-background text-cream px-8 py-4 mt-8 rounded-2xl hover:bg-green-medium dark:hover:bg-green-light transition-all flex items-center mx-auto gap-3 text-base font-bold shadow-xl hover:scale-105 active:scale-95">
              Shop Now →
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
