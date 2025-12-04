import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../api/axiosClient";
import useCartStore from "../zustand/Cart";
import { toast } from "react-toastify";

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

  if (isLoading) return <div className="text-center py-10">Loading...</div>;
  if (isError)
    return (
      <div className="text-center py-10 text-red-500">
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
    <div className="w-full min-h-screen bg-gray-50">
      <Navbar />

      {/* Product Container */}
      <div className="w-full flex flex-col lg:flex-row justify-center items-start gap-10 px-6 lg:px-20 py-10">
        {/* LEFT IMAGE */}
        <div className="w-full lg:w-1/3 flex justify-center">
          <div className="w-full max-w-md h-[380px] bg-white shadow-lg rounded-xl overflow-hidden">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>

        {/* RIGHT SIDE DETAILS */}
        <div className="w-full lg:w-1/2 bg-white shadow-md rounded-xl p-8">
          <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>

          <div className="flex items-center gap-2 mt-2">
            <span className="text-yellow-500 text-xl">⭐</span>
            <span className="text-gray-700">{product.rating || "4.5"} / 5</span>
          </div>

          <p className="text-3xl font-semibold text-gray-800 mt-4">
            ₹ {product.price}
          </p>

          <p className="text-gray-600 mt-6 leading-relaxed">
            {product.description || "No description available"}
          </p>

          <p className="text-sm mt-5 text-gray-500">
            Category:{" "}
            <span className="font-medium">
              {product.catagory?.catagoryName}
            </span>
          </p>

          {/* Buttons */}
          <div className="mt-8 flex gap-4">
            <button className="w-40 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition">
              Buy Now
            </button>

            <button
              onClick={handleAddToCart}
              className="w-40 py-3 border border-black text-black font-semibold rounded-lg hover:bg-black hover:text-white transition"
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
