import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../api/axiosClient";
import useCartStore from "../zustand/Cart";
import { toast } from "react-toastify";
import { BASE_URL } from "../api/url";

export default function SingleProduct() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const addToCart = useCartStore((state) => state.addItem);

  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["singleItem", id],
    queryFn: async () => {
      const res = await api.get(`/product/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  if (isLoading) return <div className="text-center py-10 bg-cream min-h-screen">Loading...</div>;
  if (isError)
    return (
      <div className="text-center py-10 text-red-500 bg-cream min-h-screen">
        Error loading product
      </div>
    );

  const handleAddToCart = () => {
    if (!product) return;

    addToCart(product);

    toast.success(`Added "${product.title}" to cart 🛒`, {
      position: "top-right",
      autoClose: 1500,
    });
  };

  return (
    <div className="w-full min-h-screen bg-cream">
      <Navbar />

      {/* Product Container */}
      <div className="w-full flex flex-col lg:flex-row justify-center items-start gap-10 px-6 lg:px-20 py-10">
        {/* LEFT IMAGE */}
        <div className="w-full lg:w-1/3 flex justify-center">
          <div className="w-full max-w-md h-[380px] bg-white shadow-lg rounded-xl overflow-hidden border border-green-light">
            <img
              src={product.image.startsWith('http') ? product.image : `${BASE_URL}/${product.image}`}
              alt={product.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>

        {/* RIGHT SIDE DETAILS */}
        <div className="w-full lg:w-1/2 bg-white/90 shadow-md rounded-xl p-8 border border-green-light">
          <h1 className="text-3xl font-bold text-green-dark">{product.title}</h1>

          <div className="flex items-center gap-2 mt-2">
            <span className="text-yellow-500 text-xl">⭐</span>
            <span className="text-green-dark/80">{product.rating || "4.5"} / 5</span>
          </div>

          <p className="text-3xl font-semibold text-green-dark mt-4">
            ₹ {product.price}
          </p>

          <p className="text-green-dark/70 mt-6 leading-relaxed">
            {product.description || "No description available"}
          </p>

          <p className="text-sm mt-5 text-green-dark/60">
            Category:{" "}
            <span className="font-medium text-green-dark">
              {product.catagory?.catagoryName}
            </span>
          </p>

          {/* Buttons */}
          <div className="mt-8 flex gap-4">
            <button className="w-40 py-3 bg-green-dark text-cream font-semibold rounded-lg hover:bg-green-medium transition shadow-md">
              Buy Now
            </button>

            <button
              onClick={handleAddToCart}
              className="w-40 py-3 border border-green-dark text-green-dark font-semibold rounded-lg hover:bg-green-dark hover:text-cream transition shadow-sm"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
