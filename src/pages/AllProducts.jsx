import { useQuery } from "@tanstack/react-query";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import api from "../api/axiosClient";
import { useEffect, useState } from "react";
import { FiGrid, FiList } from "react-icons/fi";

export default function AllProducts() {
  const [page, setPage] = useState(1);
  const [cate, setCate] = useState([]);
  const [select, setSelect] = useState("");

  // Fetch products
  const {
    data: products,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["products", page],
    queryFn: async () => {
      const res = await api.get(`/product?page=${page}&limit=12`);
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex justify-center items-center text-red-600">
          Error loading products. Please try again later.
        </div>
        <Footer />
      </div>
    );
  }

  const totalPages = products?.totalPages || 1;
  const nextPage = () => page < totalPages && setPage(page + 1);
  const prevPage = () => page > 1 && setPage(page - 1);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* PAGE HEADER */}
      <section className="w-full bg-linear-to-r from-gray-100 to-white py-10 px-4 text-center md:text-left">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900">Shop Our Collection</h1>
          <p className="text-gray-600 mt-2">
            Discover {products?.total} amazing products
          </p>
        </div>
      </section>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 flex flex-col md:flex-row gap-10">

        {/* SIDEBAR */}
        <aside className="hidden md:block w-64 shrink-0 border-r pr-6">
          <h3 className="font-semibold text-gray-700 mb-4">Filters</h3>

          {/* Categories */}
          <div>
            <h4 className="font-bold text-gray-900 mb-2">Categories</h4>
            <div className="flex flex-col gap-2 text-gray-700">

              {cate.length === 0 && (
                <p className="text-gray-500 text-sm">No categories found</p>
              )}

              {cate.map((c) => (
                <label key={c._id} className="flex items-center gap-2 capitalize">
                  <input
                    type="checkbox"
                    checked={select === c.catagoryName}
                    onChange={() =>
                      setSelect(select === c.catagoryName ? "" : c.catagoryName)
                    }
                  />
                  {c.catagoryName}
                </label>
              ))}
            </div>
          </div>

          <hr className="my-6" />

          {/* Price Filter */}
          <div>
            <h4 className="font-bold text-gray-900 mb-2">Price Range</h4>
            <input type="range" className="w-full accent-blue-600" />
            <div className="flex justify-between text-sm text-gray-600 mt-1">
              <span>$0</span>
              <span>$500</span>
            </div>
          </div>

          <hr className="my-6" />
        </aside>

        {/* RIGHT CONTENT SECTION */}
        <section className="flex-1 w-full">

          {/* TOP BAR */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 border p-4 rounded-xl bg-white shadow-sm">
            <p className="text-gray-700 text-sm">
              Showing {products?.data?.length} products
            </p>

            <div className="flex items-center gap-4">
              <select className="border rounded-lg px-3 py-2 text-sm text-gray-700">
                <option>Sort By</option>
                <option>Price: Low → High</option>
                <option>Price: High → Low</option>
              </select>

              <button className="p-2 border rounded-lg">
                <FiGrid />
              </button>
              <button className="p-2 border rounded-lg">
                <FiList />
              </button>
            </div>
          </div>

          {/* PRODUCTS GRID */}
          <div
            className="
              grid 
              grid-cols-1 
              sm:grid-cols-2 
              md:grid-cols-2 
              lg:grid-cols-3 
              xl:grid-cols-4 
              gap-6
            "
          >
            {products?.data
              ?.filter((f) =>
                select === "" ? true : f.catagory?.catagoryName === select
              )
              .map((item) => (
                <ProductCard
                  key={item._id}
                  id={item._id}
                  title={item.title}
                  price={item.price}
                  image={item.image}
                  discount={item.discount}
                  catagory={item.catagory?.catagoryName}
                  priceColor="text-blue-600"
                  buttonColor="bg-blue-600 hover:bg-blue-700"
                />
              ))}
          </div>

          {/* PAGINATION */}
          <div className="w-full flex justify-center gap-6 py-10 mt-6">
            <button
              onClick={prevPage}
              disabled={page === 1}
              className={`px-4 py-2 rounded-lg border text-sm font-semibold transition ${
                page === 1
                  ? "text-gray-400 border-gray-200 cursor-not-allowed"
                  : "text-blue-600 border-blue-600 hover:bg-blue-50"
              }`}
            >
              ← Previous
            </button>

            <span className="px-4 py-2 text-sm font-semibold text-gray-700">
              Page {page} of {totalPages}
            </span>

            <button
              onClick={nextPage}
              disabled={page === totalPages}
              className={`px-4 py-2 rounded-lg border text-sm font-semibold transition ${
                page === totalPages
                  ? "text-gray-400 border-gray-200 cursor-not-allowed"
                  : "text-blue-600 border-blue-600 hover:bg-blue-50"
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
