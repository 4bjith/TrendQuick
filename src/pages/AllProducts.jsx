import { useQuery } from "@tanstack/react-query";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import api from "../api/axiosClient";
import { useEffect, useState } from "react";
import { FiGrid, FiList } from "react-icons/fi";
import { useLocation } from "react-router-dom";


// Skeleton Loader Component
const ProductSkeleton = () => (
  <div className="bg-[#ffffffe8] rounded-xl p-3 shrink-0 border border-green-light animate-pulse">
    <div className="w-full h-[150px] bg-gray-200 rounded-lg mb-4"></div>
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
    <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
    <div className="h-3 bg-gray-200 rounded w-1/4 mb-4"></div>
    <div className="h-8 bg-gray-200 rounded w-full"></div>
  </div>
);

export default function AllProducts() {
  const [page, setPage] = useState(1);
  const [cate, setCate] = useState([]);
  const [select, setSelect] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [priceRange, setPriceRange] = useState(0);
  const location = useLocation();
  const categoryName = new URLSearchParams(location.search).get("category");

  useEffect(() => {
    if (categoryName) {
      setSelect(categoryName);
    }
  }, [categoryName]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [select, priceRange]);

  // Fetch products with filters
  const {
    data: products,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["products", page, select, priceRange],
    queryFn: async () => {
      const res = await api.get(`/product?page=${page}&limit=8&category=${select}&maxPrice=${priceRange}`);
      return res.data;
    },
    keepPreviousData: true,
  });

  // Fetch categories
  const { data: categoryData } = useQuery({
    queryKey: ["category"],
    queryFn: async () => {
      const res = await api.get("/catagory");
      return res.data;
    },
    keepPreviousData: true,
  });

  // Save categories in state
  useEffect(() => {
    if (Array.isArray(categoryData)) {
      setCate(categoryData);
    }
  }, [categoryData]);

  if (isError) {
    return (
      <div className="min-h-screen flex flex-col bg-cream">
        <Navbar />
        <div className="flex-1 flex flex-col justify-center items-center text-red-600 gap-4">
          <span className="text-5xl">⚠️</span>
          <p className="font-bold text-xl">Error loading products.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-green-dark text-white rounded-lg hover:bg-green-medium transition-colors"
          >
            Try Again
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const totalPages = products?.totalPages || 1;
  const nextPage = () => page < totalPages && setPage(page + 1);
  const prevPage = () => page > 1 && setPage(page - 1);

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Navbar />

      {/* PAGE HEADER */}
      <section className="w-full bg-white/50 backdrop-blur-sm py-10 px-4 text-center md:text-left border-b border-green-light">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-green-dark">Shop Our Collection</h1>
          <p className="text-green-dark/70 mt-2">
            {isLoading ? (
              <span className="inline-block w-48 h-5 bg-gray-200 animate-pulse rounded"></span>
            ) : (
              `Discover ${products?.total || 0} amazing products`
            )}
          </p>
        </div>
      </section>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 flex flex-col md:flex-row gap-10">
        {/* SIDEBAR */}
        <aside className="hidden md:block w-72 shrink-0 border-r border-green-light/30 pr-8">
          <div className="sticky top-24 space-y-8">
            <h3 className="text-xl font-bold text-green-dark border-b border-green-light pb-2">Filters</h3>

            {/* Categories */}
            <div>
              <h4 className="font-semibold text-green-dark mb-4">Categories</h4>
              <div className="flex flex-col gap-3">
                {isLoading || cate.length === 0 ? (
                  Array(5).fill(0).map((_, i) => (
                    <div key={i} className="h-5 bg-gray-200 animate-pulse rounded w-full"></div>
                  ))
                ) : (
                  cate.map((c) => (
                    <label key={c._id} className="flex items-center gap-3 group cursor-pointer">
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          checked={select === c.catagoryName}
                          onChange={() => setSelect(select === c.catagoryName ? "" : c.catagoryName)}
                          className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-green-light checked:bg-green-dark transition-all"
                        />
                        <svg
                          className="absolute h-3.5 w-3.5 pointer-events-none hidden peer-checked:block text-white left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <span className="text-green-dark/80 group-hover:text-green-dark transition-colors capitalize sm:text-base text-sm">
                        {c.catagoryName}
                      </span>
                    </label>
                  ))
                )}
              </div>
            </div>

            {/* Price Filter */}
            <div className="pt-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold text-green-dark">Price Range</h4>
                <span className="text-sm font-bold text-green-medium">Up to ₹{priceRange}</span>
              </div>
              <input
                type="range"
                min="0"
                max="10000"
                step="100"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full h-2 bg-green-light/30 rounded-lg appearance-none cursor-pointer accent-green-dark hover:accent-green-medium transition-all"
              />
              <div className="flex justify-between text-xs text-green-dark/50 mt-2 font-medium">
                <span>₹0</span>
                <span>₹10,000+</span>
              </div>
            </div>

            {/* Reset Filters */}
            <button
              onClick={() => { setSelect(""); setPriceRange(10000); setSortOrder(""); }}
              className="w-full py-2 text-sm font-bold text-red-500 hover:bg-red-50 rounded-lg transition-all"
            >
              Reset All Filters
            </button>
          </div>
        </aside>

        {/* RIGHT CONTENT SECTION */}
        <section className="flex-1 w-full">

          {/* TOP BAR */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 border border-green-light/30 p-5 rounded-2xl bg-white/40 backdrop-blur-sm shadow-sm">
            <p className="text-green-dark font-medium">
              {isLoading ? (
                <span className="inline-block w-40 h-5 bg-gray-200 animate-pulse rounded"></span>
              ) : (
                <>Showing <span className="text-green-medium">{products?.data?.length || 0}</span> of <span className="text-green-medium">{products?.total || 0}</span> products</>
              )}
            </p>

            <div className="flex items-center gap-4">
              <div className="relative">
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="appearance-none border border-green-light rounded-xl px-5 py-2.5 text-sm font-medium text-green-dark bg-white hover:border-green-medium focus:outline-none focus:ring-2 focus:ring-green-medium/20 transition-all cursor-pointer pr-10"
                >
                  <option value="">Sort By: Default</option>
                  <option value="asc">Price: Low to High</option>
                  <option value="desc">Price: High to Low</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-green-dark/50">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              <div className="flex border border-green-light rounded-xl overflow-hidden shadow-sm">
                <button className="p-2.5 bg-green-dark text-white hover:bg-green-medium transition">
                  <FiGrid size={20} />
                </button>
                <button className="p-2.5 bg-white text-green-dark hover:bg-green-light/20 transition border-l border-green-light">
                  <FiList size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* PRODUCTS GRID */}
          <div
            className="
              grid 
              grid-cols-1 
              sm:grid-cols-2 
              lg:grid-cols-3 
              xl:grid-cols-4 
              gap-8
            "
          >
            {isLoading ? (
              Array(8).fill(0).map((_, i) => <ProductSkeleton key={i} />)
            ) : (
              products?.data
                ?.sort((a, b) => {
                  if (sortOrder === "asc") return a.price - b.price;
                  if (sortOrder === "desc") return b.price - a.price;
                  return 0;
                })
                .map((item) => (
                  <div key={item._id} className="hover:scale-[1.02] transition-transform duration-300">
                    <ProductCard
                      id={item._id}
                      title={item.title}
                      price={item.price}
                      image={item.image}
                      discount={item.discount}
                      catagory={item.catagory?.catagoryName}
                    />
                  </div>
                ))
            )}
          </div>

          {/* PAGINATION */}
          <div className="w-full flex justify-center gap-6 py-10 mt-6">
            <button
              onClick={prevPage}
              disabled={page === 1 || isLoading}
              className={`px-4 py-2 rounded-lg border text-sm font-semibold transition ${page === 1 || isLoading
                ? "text-gray-400 border-gray-200 cursor-not-allowed"
                : "text-green-dark border-green-dark hover:bg-green-light/20"
                }`}
            >
              ← Previous
            </button>

            <span className="px-4 py-2 text-sm font-semibold text-green-dark">
              {isLoading ? "Loading..." : `Page ${page} of ${totalPages}`}
            </span>

            <button
              onClick={nextPage}
              disabled={page === totalPages || isLoading}
              className={`px-4 py-2 rounded-lg border text-sm font-semibold transition ${page === totalPages || isLoading
                ? "text-gray-400 border-gray-200 cursor-not-allowed"
                : "text-green-dark border-green-dark hover:bg-green-light/20"
                }`}
            >
              Next →
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

