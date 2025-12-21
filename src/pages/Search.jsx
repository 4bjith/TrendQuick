import { FaSearch } from "react-icons/fa";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useQuery } from "@tanstack/react-query";
import api from "../api/axiosClient";
import { useEffect, useState } from "react";
import { BASE_URL } from "../api/url";

export default function Search() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showResults, setShowResults] = useState(false);

  // -----------------------------
  // 🔁 Debounce Input (300ms)
  // -----------------------------
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  // -----------------------------
  // 🔍 Search Query
  // -----------------------------
  const { data, isLoading } = useQuery({
    queryKey: ["search", debouncedSearch],
    queryFn: async () => {
      const res = await api.get(`/product?search=${debouncedSearch}`);
      return res.data;
    },
    enabled: !!debouncedSearch,
  });

  const suggestions = data?.suggestions || [];
  const products = data?.data || [];

  return (
    <div className="w-full min-h-dvh">
      <Navbar />

      {/* Body */}
      <div className="bg-cream w-full min-h-[90vh] p-7">
        {/* Search Bar */}
        <div className="w-full p-[30px] relative">
          <div className="w-full flex items-center h-[50px] bg-green-light outline outline-green-light rounded-md">
            <FaSearch className="w-[4%] text-cream" />

            <input
              type="search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setShowResults(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setShowResults(true);
                }
              }}
              className="w-[80%] h-full bg-cream px-5 outline-none"
              placeholder="Search here..."
            />

            <div className="w-[14%] h-full flex justify-center items-center">
              <button
                onClick={() => setShowResults(true)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setShowResults(true);
                  }
                }}
                className="bg-cream px-8 rounded-md py-2 text-green-dark"
              >
                Search
              </button>
            </div>
          </div>

          {/* -----------------------------
              🔽 Suggestions Dropdown
             ----------------------------- */}
          {!showResults && suggestions.length > 0 && (
            <div className="absolute z-10 w-[80%] bg-white shadow-md rounded-md mt-1">
              {suggestions.map((item, index) => (
                <div
                  key={index}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    setSearch(item);
                    setShowResults(true);
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* -----------------------------
            📦 Search Results
           ----------------------------- */}
        {showResults && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 px-6">
            {isLoading && <p>Loading...</p>}

            {!isLoading && products.length === 0 && <p>No products found</p>}

            {products.map((product) => (
              <ProductCard
                key={product._id}
                id={product._id}
                image={product.image}
                title={product.title}
                catagory={product.catagory?.catagoryName}
                price={product.price}
              />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
