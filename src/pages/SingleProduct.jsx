import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSearchParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/axiosClient";
import useCartStore from "../zustand/Cart";
import { useAuth } from "../hooks/useAuth";
import { toast } from "react-toastify";
import { BASE_URL } from "../api/url";
import ProductRibbon from "../components/ProductRibbon";
import { FiChevronRight, FiShield, FiRotateCcw, FiTruck, FiCreditCard, FiTag, FiStar, FiShoppingBag, FiAtSign } from "react-icons/fi";

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

  const {
    data: reviews = [],
    isLoading: reviewsLoading
  } = useQuery({
    queryKey: ["reviews", id],
    queryFn: async () => {
      const res = await api.get(`/product/${id}/reviews`);
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
      queryClient.invalidateQueries(["reviews", id]);
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
    <div className="w-full min-h-screen bg-background text-foreground transition-colors duration-300">
      <Navbar />

      {/* BREADCRUMBS */}
      <nav className="max-w-7xl mx-auto px-6 lg:px-20 py-6">
        <ol className="flex items-center space-x-2 text-sm font-medium text-foreground/50">
          <li>Home</li>
          <FiChevronRight size={14} />
          <li>{product.catagory?.catagoryName || "Category"}</li>
          <FiChevronRight size={14} />
          <li className="text-foreground truncate max-w-[200px]">{product.title}</li>
        </ol>
      </nav>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 lg:px-20 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">
          
          {/* LEFT: IMAGE GALLERY */}
          <div className="relative">
            <div className="lg:sticky lg:top-24 space-y-4">
              <div className="aspect-[4/5] bg-surface rounded-3xl overflow-hidden border border-border flex items-center justify-center p-8 group shadow-sm transition-shadow hover:shadow-md">
                <img
                  src={product.image.startsWith('http') ? product.image : `${BASE_URL}/${product.image}`}
                  alt={product.title}
                  className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-105 transition-transform duration-700"
                />
                {product.discount > 0 && (
                  <div className="absolute top-6 left-6 bg-red-500 text-white font-black px-4 py-2 rounded-xl text-sm shadow-xl animate-pulse">
                    {product.discount}% OFF
                  </div>
                )}
              </div>
              
              {/* Thumbnail Gallery (Placeholder) */}
              <div className="flex gap-4">
                 {[1,2,3].map((i) => (
                   <div key={i} className="w-20 h-20 bg-surface border border-border rounded-xl p-2 cursor-pointer hover:border-green-medium transition-colors">
                     <img src={product.image.startsWith('http') ? product.image : `${BASE_URL}/${product.image}`} className="w-full h-full object-contain opacity-50 hover:opacity-100 transition-opacity" alt="thumbnail" />
                   </div>
                 ))}
              </div>
            </div>
          </div>

          {/* RIGHT: PRODUCT DETAILS */}
          <div className="space-y-10">
            {/* Header Info */}
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="bg-green-light dark:bg-zinc-800 text-green-medium px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase">
                  {product.catagory?.catagoryName || "Premium"}
                </span>
                <span className="text-foreground/40 text-[10px] font-bold uppercase tracking-widest">• Brand New</span>
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-black text-foreground leading-[1.1] tracking-tight">
                {product.title}
              </h1>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-1.5 bg-green-500/10 text-green-500 px-3 py-1.5 rounded-xl font-black text-xs">
                  <FiStar fill="currentColor" size={14} />
                  <span>{product.rating || "4.5"}</span>
                  <span className="text-green-500/50 font-medium ml-1">|</span>
                  <span className="text-green-500/80 ml-1">{product.numReviews || 124} Ratings</span>
                </div>
                <div className="h-4 w-px bg-border"></div>
                <p className="text-foreground/40 text-xs font-bold uppercase tracking-widest">In Stock • Ships in 24h</p>
              </div>
            </section>

            {/* Price Section */}
            <section className="bg-surface/30 p-8 rounded-[2.5rem] border border-border shadow-sm">
              <div className="flex items-baseline gap-4">
                <h2 className="text-5xl font-black text-foreground">₹{product.price}</h2>
                {product.discount > 0 && (
                  <p className="text-2xl text-foreground/30 line-through font-bold">₹{Math.round(product.price * (1 + product.discount / 100))}</p>
                )}
              </div>
              <p className="text-green-medium font-black text-sm mt-1 uppercase tracking-wider">
                You Save ₹{Math.round(product.price * (product.discount / 100))} ({product.discount}% Off)
              </p>
              
              <div className="mt-8 space-y-3">
                <p className="text-[10px] font-black uppercase text-foreground/40 tracking-widest flex items-center gap-2">
                  <FiTag size={12} className="text-green-medium" /> Available Offers
                </p>
                <div className="space-y-2">
                  <div className="p-3 bg-surface border border-dashed border-border rounded-2xl text-xs flex items-center gap-3 group cursor-pointer hover:bg-surface/50 transition-colors">
                    <div className="p-2 bg-green-500/10 text-green-500 rounded-lg"><FiAtSign size={14} /></div>
                    <div>
                      <span className="font-bold text-foreground">Bank Offer</span> 10% instant discount on Axis Bank Credits... <span className="text-green-medium font-bold ml-2">T&C</span>
                    </div>
                  </div>
                  <div className="p-3 bg-surface border border-dashed border-border rounded-2xl text-xs flex items-center gap-3 group cursor-pointer hover:bg-surface/50 transition-colors">
                    <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg"><FiTag size={14} /></div>
                    <div>
                      <span className="font-bold text-foreground">Partner Offer</span> Add more items worth ₹2,000 to save extra ₹200
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Selection (Dummy for Modern Look) */}
            <section className="space-y-6">
              <div>
                <p className="text-xs font-black uppercase text-foreground/40 tracking-widest mb-3">Choose Color</p>
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full border-2 border-green-medium p-0.5"><div className="w-full h-full rounded-full bg-zinc-800 shadow-inner"></div></div>
                  <div className="w-10 h-10 rounded-full border border-border p-0.5 hover:border-foreground transition-colors cursor-pointer"><div className="w-full h-full rounded-full bg-zinc-400"></div></div>
                  <div className="w-10 h-10 rounded-full border border-border p-0.5 hover:border-foreground transition-colors cursor-pointer"><div className="w-full h-full rounded-full bg-zinc-200"></div></div>
                </div>
              </div>

              <div>
                <p className="text-xs font-black uppercase text-foreground/40 tracking-widest mb-3 flex justify-between items-center">
                  <span>Choose Size</span>
                  <span className="text-green-medium hover:underline cursor-pointer">Size Chart</span>
                </p>
                <div className="flex gap-3 flex-wrap">
                  {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                    <button key={size} className={`px-6 py-3 rounded-xl border font-black text-xs transition-all ${size === 'L' ? 'bg-foreground text-background border-foreground shadow-lg' : 'bg-surface border-border hover:border-foreground'}`}>
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* Action Buttons */}
            <section className="flex gap-4 sticky bottom-6 lg:static z-20 bg-background/80 lg:bg-transparent backdrop-blur-md lg:backdrop-blur-none p-4 lg:p-0 rounded-3xl lg:rounded-none border border-border lg:border-none shadow-2xl lg:shadow-none">
              <button className="flex-[2] bg-zinc-950 dark:bg-foreground text-white dark:text-background py-5 rounded-[2rem] font-black text-lg shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
                <FiShoppingBag size={20} /> Buy It Now
              </button>
              <button 
                onClick={handleAddToCart}
                className="flex-[1] border-2 border-border bg-surface text-foreground py-5 rounded-[2rem] font-black text-lg hover:bg-foreground hover:text-background transition-all active:scale-95 shadow-lg flex items-center justify-center gap-2"
              >
                Add to Cart
              </button>
            </section>

            {/* Description & Specs */}
            <section className="space-y-6 pt-10 border-t border-border">
               <div>
                 <h3 className="text-xl font-extrabold text-foreground mb-4">Product Story</h3>
                 <p className="text-foreground/60 leading-[1.8] font-medium text-base">
                   {product.description || "Designed for the modern individual who values both aesthetics and functionality. This piece is crafted from premium materials sourced sustainably, ensuring a luxury feel that lasts. Whether you're dressing up for an event or looking for everyday comfort, this caters to every need with effortless style."}
                 </p>
               </div>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 py-6">
                  <div className="flex items-start gap-4 p-4 bg-surface rounded-3xl border border-border">
                    <div className="p-3 bg-green-500/10 text-green-500 rounded-2xl"><FiShield size={20} /></div>
                    <div>
                      <p className="text-xs font-black uppercase text-foreground/40 tracking-widest mb-1">Authentic</p>
                      <p className="text-sm font-bold text-foreground">100% Original Products</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-surface rounded-3xl border border-border">
                    <div className="p-3 bg-blue-500/10 text-blue-500 rounded-2xl"><FiRotateCcw size={20} /></div>
                    <div>
                      <p className="text-xs font-black uppercase text-foreground/40 tracking-widest mb-1">Exchange</p>
                      <p className="text-sm font-bold text-foreground">10 Days Return Policy</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-surface rounded-3xl border border-border">
                    <div className="p-3 bg-amber-500/10 text-amber-500 rounded-2xl"><FiTruck size={20} /></div>
                    <div>
                      <p className="text-xs font-black uppercase text-foreground/40 tracking-widest mb-1">Premium</p>
                      <p className="text-sm font-bold text-foreground">Fast & Free Delivery</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-surface rounded-3xl border border-border">
                    <div className="p-3 bg-purple-500/10 text-purple-500 rounded-2xl"><FiCreditCard size={20} /></div>
                    <div>
                      <p className="text-xs font-black uppercase text-foreground/40 tracking-widest mb-1">Payments</p>
                      <p className="text-sm font-bold text-foreground">Secure Checkout SSL</p>
                    </div>
                  </div>
               </div>
            </section>
          </div>
        </div>
      </main>

      {/* Reviews Section */}
      <section className="bg-surface/50 py-24 border-y border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-20">
          <div className="flex flex-col md:flex-row justify-between items-baseline mb-16 gap-4">
            <div>
              <h2 className="text-4xl font-black text-foreground tracking-tight">Customer Voices</h2>
              <p className="text-foreground/50 mt-2 font-medium">Read honest feedback from fellow shoppers</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-2xl shadow-sm">
                <span className="text-2xl font-black text-foreground">{product.rating || "4.5"}</span>
                <FiStar fill="currentColor" className="text-yellow-500" />
                <span className="text-foreground/30 font-bold ml-2">({product.numReviews || 0} Reviews)</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-16">
            {/* Review Form */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-surface p-10 rounded-[2.5rem] shadow-2xl border border-border relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 text-foreground/5 opacity-10 group-hover:scale-110 transition-transform">
                  <FiAtSign size={120} />
                </div>
                <h3 className="text-2xl font-black text-foreground mb-8">Voice Your Opinion</h3>
                <form onSubmit={handleReviewSubmit} className="space-y-6 relative z-10">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-foreground/40 tracking-widest mb-2 ml-1">Satisfaction Level</label>
                    <select
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      className="w-full px-5 py-4 rounded-2xl bg-background border border-border focus:ring-2 focus:ring-green-medium outline-none text-foreground font-bold shadow-inner"
                    >
                      <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
                      <option value="4">⭐⭐⭐⭐ Very Good</option>
                      <option value="3">⭐⭐⭐ Good</option>
                      <option value="2">⭐⭐ Fair</option>
                      <option value="1">⭐ Poor</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-foreground/40 tracking-widest mb-2 ml-1">Your Detailed Feedback</label>
                    <textarea
                      rows="5"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Was the quality as expected?"
                      className="w-full px-5 py-4 rounded-2xl bg-background border border-border focus:ring-2 focus:ring-green-medium outline-none text-foreground font-medium resize-none shadow-inner"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    disabled={reviewMutation.isPending}
                    className="w-full py-5 bg-zinc-950 dark:bg-foreground text-white dark:text-background font-black rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl disabled:opacity-50"
                  >
                    {reviewMutation.isPending ? "Submitting Voice..." : "Post Review"}
                  </button>
                </form>
              </div>
            </div>

            {/* Review List */}
            <div className="lg:col-span-2 space-y-8">
              {reviews?.length > 0 ? (
                reviews.map((rev, index) => (
                  <div key={index} className="bg-surface p-8 rounded-[2.5rem] border border-border shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-medium font-black text-lg border border-green-500/20">
                          {rev.name?.[0] || 'U'}
                        </div>
                        <div>
                          <h4 className="font-black text-foreground text-lg leading-tight">{rev.name || "Anonymous Buyer"}</h4>
                          <p className="text-[10px] font-black text-green-medium uppercase tracking-widest mt-1 italic">Verified Purchase</p>
                        </div>
                      </div>
                      <div className="px-3 py-1.5 bg-yellow-500/10 text-yellow-600 rounded-xl flex items-center gap-1 text-xs font-black">
                        {rev.rating} <FiStar fill="currentColor" size={12} />
                      </div>
                    </div>
                    <p className="text-foreground/70 text-lg leading-relaxed font-medium">"{rev.comment}"</p>
                    <div className="mt-8 flex items-center justify-between">
                       <p className="text-[10px] font-black text-foreground/30 uppercase tracking-widest">
                         Published • {new Date(rev.createdAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                       </p>
                       <div className="flex gap-4 text-foreground/40 text-xs font-bold transition-colors">
                          <button className="hover:text-foreground">Helpful</button>
                          <button className="hover:text-red-500">Report</button>
                       </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-20 bg-surface/30 rounded-[3rem] border-2 border-dashed border-border text-center px-10">
                  <div className="w-20 h-20 bg-surface rounded-full flex items-center justify-center text-foreground/10 mb-6 border border-border shadow-inner">
                    <FiShoppingBag size={40} />
                  </div>
                  <h3 className="text-xl font-black text-foreground">No voices yet</h3>
                  <p className="text-foreground/40 mt-2 font-medium">Be the first to share your experience with this premium product.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* RELATED PRODUCTS */}
      <section className="w-full py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-20">
          <div className="flex flex-col sm:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <h2 className="text-4xl font-black text-foreground tracking-tight">Curated For You</h2>
              <p className="text-foreground/40 mt-2 font-medium text-lg italic">Premium selections that complement your style</p>
            </div>
            <Link to="/products" className="px-8 py-3 bg-surface border border-border text-foreground font-black text-sm rounded-2xl hover:bg-foreground hover:text-background transition-all shadow-sm">
                View All Collection
            </Link>
          </div>
          <ProductRibbon />
        </div>
      </section>

      <Footer />
    </div>
  );
}
