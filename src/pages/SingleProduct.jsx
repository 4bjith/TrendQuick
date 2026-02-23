import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSearchParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/axiosClient";
import useCartStore from "../zustand/Cart";
import { useAuth } from "../hooks/useAuth";
import { toast } from "react-toastify";
import { BASE_URL } from "../api/url";
import ProductRibbon from "../components/ProductRibbon";

export default function SingleProduct() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

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

  const reviewMutation = useMutation({
    mutationFn: async (reviewData) => {
      const res = await api.post(`/product/${id}/reviews`, reviewData);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Review submitted successfully! 🌟");
      setComment("");
      setRating(5);
      queryClient.invalidateQueries(["singleItem", id]);
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Failed to submit review";
      toast.error(message);
    },
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

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      toast.warn("Please login to leave a review 🔐");
      return;
    }
    if (!comment.trim()) {
      toast.warn("Review comment cannot be empty");
      return;
    }
    reviewMutation.mutate({ rating, comment });
  };

  return (
    <div className="w-full min-h-screen bg-cream">
      <Navbar />

      {/* Product Container */}
      <div className="w-full flex flex-col lg:flex-row justify-center items-start gap-10 px-6 lg:px-20 py-10">
        {/* LEFT IMAGE */}
        <div className="w-full lg:w-1/3 flex justify-center">
          <div className="w-full max-w-md h-[450px] bg-white shadow-xl rounded-2xl overflow-hidden border border-green-light">
            <img
              src={product.image.startsWith('http') ? product.image : `${BASE_URL}/${product.image}`}
              alt={product.title}
              className="w-full h-full object-contain p-4 hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>

        {/* RIGHT SIDE DETAILS */}
        <div className="w-full lg:w-1/2 bg-white/40 backdrop-blur-md shadow-lg rounded-2xl p-8 border border-green-light/30">
          <span className="text-green-medium font-semibold uppercase tracking-wider text-sm">{product.catagory?.catagoryName}</span>
          <h1 className="text-4xl font-extrabold text-green-dark mt-2">{product.title}</h1>

          <div className="flex items-center gap-3 mt-4">
            <div className="flex text-yellow-500">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < Math.floor(product.rating || 0) ? "fill-current" : "text-gray-300"}>⭐</span>
              ))}
            </div>
            <span className="text-green-dark/80 font-medium">({product.numReviews || 0} Reviews)</span>
          </div>

          <div className="mt-6 flex items-baseline gap-4">
            <p className="text-4xl font-bold text-green-dark">₹ {product.price}</p>
            {product.discount > 0 && (
              <p className="text-xl text-green-medium line-through opacity-60">₹ {Math.round(product.price * (1 + product.discount / 100))}</p>
            )}
            {product.discount > 0 && (
              <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-bold">-{product.discount}% OFF</span>
            )}
          </div>

          <p className="text-green-dark/70 mt-8 text-lg leading-relaxed border-t border-green-light/20 pt-6">
            {product.description || "Indulge in the perfect blend of quality and style. This premium piece is designed to elevate your lifestyle with its exceptional craftsmanship and timeless appeal."}
          </p>

          <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-green-dark/60">
            <div className="flex items-center gap-2">✓ Premium Quality</div>
            <div className="flex items-center gap-2">✓ Fast Delivery</div>
            <div className="flex items-center gap-2">✓ 7 Days Return</div>
            <div className="flex items-center gap-2">✓ Secure Payment</div>
          </div>

          {/* Buttons */}
          <div className="mt-10 flex flex-wrap gap-4">
            <button className="flex-1 min-w-[200px] py-4 bg-green-dark text-cream font-bold rounded-xl hover:bg-green-medium transform transition-all active:scale-95 shadow-lg">
              Buy Now
            </button>

            <button
              onClick={handleAddToCart}
              className="flex-1 min-w-[200px] py-4 border-2 border-green-dark text-green-dark font-bold rounded-xl hover:bg-green-dark hover:text-cream transition-all active:scale-95 shadow-sm"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="max-w-7xl mx-auto px-6 lg:px-20 py-16">
        <h2 className="text-3xl font-bold text-green-dark mb-10">Customer Reviews</h2>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Review List */}
          <div className="space-y-6">
            {product.reviews && product.reviews.length > 0 ? (
              product.reviews.map((rev, index) => (
                <div key={index} className="bg-white/60 p-6 rounded-2xl border border-green-light shadow-sm">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-bold text-green-dark text-lg">{rev.name}</h4>
                    <div className="text-yellow-500 text-sm">
                      {"⭐".repeat(rev.rating)}
                    </div>
                  </div>
                  <p className="text-green-dark/70 italic">"{rev.comment}"</p>
                  <p className="text-xs text-green-dark/50 mt-4">{new Date(rev.createdAt || Date.now()).toLocaleDateString()}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-10 bg-white/20 rounded-2xl border border-dashed border-green-light">
                <p className="text-green-dark/50 italic">No reviews yet. Be the first to review!</p>
              </div>
            )}
          </div>

          {/* Review Form */}
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-green-light">
            <h3 className="text-xl font-bold text-green-dark mb-6">Write a Review</h3>
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-green-dark mb-1">Rating</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-lg border border-green-light focus:ring-2 focus:ring-green-medium outline-none text-green-dark">
                  <option value="5">5 - Excellent</option>
                  <option value="4">4 - Very Good</option>
                  <option value="3">3 - Good</option>
                  <option value="2">2 - Fair</option>
                  <option value="1">1 - Poor</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-green-dark mb-1">Your Comment</label>
                <textarea
                  rows="4"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience..."
                  className="w-full px-4 py-3 rounded-lg border border-green-light focus:ring-2 focus:ring-green-medium outline-none text-green-dark resize-none"
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={reviewMutation.isPending}
                className={`w-full py-3 bg-green-dark text-white font-bold rounded-lg hover:bg-green-medium transition-all ${reviewMutation.isPending ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {reviewMutation.isPending ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Related Products Placeholder - You might want to fetch these based on category */}
      <div className="w-full py-16 bg-white/30 border-t border-green-light">
        <div className="max-w-7xl mx-auto px-6 lg:px-20">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-green-dark">Related Products</h2>
              <p className="text-green-dark/60 mt-2">You might also like these carefully selected items</p>
            </div>
            <button className="text-green-dark font-bold hover:underline mb-1">View All</button>
          </div>
          <ProductRibbon />
        </div>
      </div>

      <Footer />
    </div>
  );
}
