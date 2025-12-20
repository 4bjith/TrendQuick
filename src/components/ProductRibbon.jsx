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
    <div className="w-full py-10 bg-cream text-green-dark">
      {/* ---------- Heading Section ---------- */}
      <div className="max-w-6xl mx-auto px-4 mb-10">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-5">
          {/* Heading Left */}
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-green-dark">
              Featured Products
            </h1>
            <p className="text-green-dark/70 mt-2 text-sm sm:text-base">
              Discover our handpicked collection of premium products designed
              for quality and style.
            </p>
          </div>

          {/* View All Button */}
          <Link to="/products" className="self-start sm:self-center">
            <button className="flex items-center gap-2 border border-green-dark text-green-dark px-4 py-2 rounded-lg hover:bg-green-light/20 transition w-fit text-sm sm:text-base">
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
            className=" h-[380px] bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden border border-green-light/50"
          >
            {/* Product Image */}
            <div className="relative">
              <img
                src={item.image.startsWith('http')?item.image : `${BASE_URL}/${item.image}` || "https://via.placeholder.com/400"}
                alt={item.title}
                className="w-full h-[180px] sm:h-[200px] object-cover"
              />

              {item.discount && (
                <span className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 text-xs rounded-lg">
                  -{item.discount}%
                </span>
              )}
            </div>

            {/* Info Section */}
            <div className="p-4">
              <p className="uppercase text-xs text-green-dark/60 tracking-wide font-medium">
                {item.catagory?.catagoryName || "Category"}
              </p>

              <h2 className="font-semibold text-lg mt-1 leading-tight line-clamp-2 text-green-dark">
                {item.title}
              </h2>

              {/* Rating */}
              <div className="flex items-center text-yellow-500 text-sm mt-1">
                ⭐ {item.rating || "4.5"}
              </div>

              {/* Price */}
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <p className="text-green-dark text-lg font-bold">
                  ₹{item.price}
                </p>

                {item.oldPrice && (
                  <p className="line-through text-green-dark/40 text-sm">
                    ₹{item.oldPrice}
                  </p>
                )}
              </div>

              {/* Add Button */}
              <button className="mt-4 w-full flex items-center justify-center gap-2 bg-green-dark text-cream py-2 rounded-lg hover:bg-green-medium transition text-sm font-medium">
                <FaShoppingCart size={15} /> Add
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ---------- Explore Collection Box ---------- */}
      <div className="max-w-6xl mx-auto bg-white border border-green-light rounded-2xl p-8 sm:p-10 mt-16 text-center shadow-sm">
        <h2 className="text-xl sm:text-2xl font-bold text-green-dark">
          Explore Our Full Collection
        </h2>
        <p className="text-green-dark/70 mt-2 text-sm sm:text-base">
          Browse hundreds of carefully selected products across multiple
          categories. Find exactly what you're looking for.
        </p>

        <Link to="/products">
          <button className="bg-green-dark text-cream px-6 py-3 mt-5 rounded-lg hover:bg-green-medium transition flex items-center mx-auto gap-2 text-sm sm:text-base font-semibold shadow-md">
            Shop Now →
          </button>
        </Link>
      </div>
    </div>
  );
}
