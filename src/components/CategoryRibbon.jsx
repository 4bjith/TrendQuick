import { useEffect, useState } from "react";
import { IoMdArrowRoundForward } from "react-icons/io";
import { BASE_URL } from "../api/url";

export default function CategoryRibbon() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:8000/catagory");
        const data = await res.json();

        if (Array.isArray(data)) setCategories(data);
      } catch (err) {
        console.error("Error fetching category:", err);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="w-full py-10 bg-cream text-green-dark px-6 sm:px-10 md:px-0">
      {/* Section Heading */}
      <div className="flex flex-col items-center mb-10 text-center">
        <p className="text-sm tracking-widest text-green-medium font-semibold">
          SHOP BY CATEGORY
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold mt-2 text-green-dark">Popular Categories</h1>
        <p className="text-green-dark/70 mt-2 max-w-lg">
          Browse our most popular product categories and find exactly what you need.
        </p>
      </div>

      {/* Categories Grid — px-20 only on mobile */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-20 sm:px-0">
        {categories.slice(0, 3).map((item) => (
          <div
            key={item._id}
            className="relative h-[300px] sm:h-[340px] rounded-xl overflow-hidden shadow-md group cursor-pointer border border-green-light"
          >
            {/* Background Image */}
            <img
              src={
                item.catagoryImage?.startsWith('http')?item.catagoryImage : `${BASE_URL}/${item.catagoryImage}` ||
                "https://via.placeholder.com/300x300?text=No+Image"
              }
              alt={item.catagoryName}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />

            {/* Black Gradient Overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>

            {/* Bottom Text + Icon */}
            <div className="absolute bottom-5 left-5 flex items-center gap-2  text-cream font-medium text-lg">
              <span>{item.catagoryName}</span>
              <IoMdArrowRoundForward className="text-2xl group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>

      {/* Feature Icons Section */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16 px-6 sm:px-0">
        {/* Single Feature */}
        <div className="p-6 bg-green-medium rounded-xl shadow text-center">
          <div className="w-12 h-12 mx-auto rounded-full bg-cream flex items-center justify-center text-green-dark text-2xl">
            ⚡
          </div>
          <h3 className="mt-4 font-semibold text-lg text-cream  ">Fast Delivery</h3>
          <p className="text-cream/90 text-sm mt-1">
            Get your orders delivered quickly to your doorstep.
          </p>
        </div>

        <div className="p-6 bg-green-medium rounded-xl shadow text-center">
          <div className="w-12 h-12 mx-auto rounded-full bg-cream flex items-center justify-center text-green-dark text-2xl">
            🏅
          </div>
          <h3 className="mt-4 font-semibold text-lg text-cream ">Quality Assured</h3>
          <p className="text-cream/90  text-sm mt-1">
            All products are carefully selected for quality and durability.
          </p>
        </div>

        <div className="p-6 bg-green-medium rounded-xl shadow text-center">
          <div className="w-12 h-12 mx-auto rounded-full bg-cream flex items-center justify-center text-green-dark text-2xl">
            👤
          </div>
          <h3 className="mt-4 font-semibold text-lg text-cream ">Customer Support</h3>
          <p className="text-cream/90  text-sm mt-1">
            Our team is here to help with any questions or concerns.
          </p>
        </div>
      </div>
    </div>
  );
}
