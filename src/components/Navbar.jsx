import { useState } from "react";
import { TiUser } from "react-icons/ti";
import { FiMenu, FiX } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useUserStore from "../zustand/userStore";
import api from "../api/axiosClient";
import { FiSearch } from "react-icons/fi";

export default function Navbar(prop) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const token = useUserStore((state) => state.token);

  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await api.get("/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data.user;
    },
    enabled: !!token,
    keepkeepPreviousData: true,
  });

  return (
    <nav
      className={`w-full ${prop.height || "h-[10vh]"
        } flex justify-between items-center px-8 bg-green-dark shadow-sm text-[1rem] font-medium text-cream relative z-50`}
    >
      {/* Logo */}
      <div className="flex items-center">
        <h1 className="font-bold tracking-wider cursor-pointer text-2xl text-cream">
          TrendQuik
        </h1>
      </div>

      {/* Desktop Nav Menus */}
      <div className="hidden lg:flex items-center gap-8">
        <Link
          to={"/"}
          className="hover:text-black transition-colors hover:scale-105 transform duration-200"
        >
          Home
        </Link>
        <Link
          to={"/products"}
          className="hover:text-black transition-colors hover:scale-105 transform duration-200"
        >
          Products
        </Link>
        <Link
          to={"/wishlist"}
          className="hover:text-black transition-colors hover:scale-105 transform duration-200"
        >
          Wishlist
        </Link>
        <Link
          to={"/orders"}
          className="hover:text-black transition-colors hover:scale-105 transform duration-200"
        >
          My Orders
        </Link>
        <Link
          to={"/cart"}
          className="hover:text-black transition-colors hover:scale-105 transform duration-200"
        >
          Cart
        </Link>
      </div>

      {/* Desktop Login/Register & User Details */}
      <div className="hidden lg:flex items-center gap-6">
        <Link to={"/search"}>
          <FiSearch />
        </Link>
        <Link to={"/login"} className="hover:text-black transition-colors">
          Sign in
        </Link>
        <div className="flex items-center gap-2  px-4 py-2 rounded-full cursor-pointer text-cream bg-green-medium hover:bg-green-dark transition-colors shadow-md">
          <TiUser className="text-lg text-black" />
          <span className="text-sm font-semibold text-cream">
            {user?.name || "user_name"}
          </span>
        </div>
      </div>

      {/* Mobile Menu Button */}
      <div className="lg:hidden flex items-center">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-2xl focus:outline-none"
        >
          {isMenuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="absolute top-[10vh] left-0 w-full bg-cream shadow-lg flex flex-col items-center gap-6 py-8 lg:hidden animate-fade-in-down z-50">
          <Link
            to={"/"}
            className="text-lg hover:text-black transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to={"/products"}
            className="text-lg hover:text-black transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Products
          </Link>
          <Link
            to={"/category"}
            className="text-lg hover:text-black transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Category
          </Link>
          <Link
            to={"/wishlist"}
            className="text-lg hover:text-black transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Wishlist
          </Link>
          <Link
            to={"/orders"}
            className="text-lg hover:text-black transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            My Orders
          </Link>
          <Link
            to={"/cart"}
            className="text-lg hover:text-black transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Cart
          </Link>
          <div className="w-full border-t border-green-medium my-2"></div>
          <Link
            to={"/login"}
            className="text-lg hover:text-black transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Sign in
          </Link>
          <div className="flex items-center gap-2 px-6 py-2 rounded-full cursor-pointer hover:bg-green-medium transition-colors shadow-md bg-green-light">
            <TiUser className="text-lg text-black " />
            <span className="text-sm font-semibold text-black">
              {user ? user.name : "user_name"}
            </span>
          </div>
        </div>
      )}
    </nav>
  );
}
