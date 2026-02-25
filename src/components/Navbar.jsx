import { useState } from "react";
import { TiUser } from "react-icons/ti";
import { FiMenu, FiX, FiSearch, FiSun, FiMoon } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useThemeStore } from "../zustand/themeStore";

export default function Navbar(prop) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();
  const { isDarkMode, toggleTheme } = useThemeStore();

  return (
    <nav
      className={`w-full ${prop.height || "h-[10vh]"
        } flex justify-between items-center px-8 bg-background dark:bg-zinc-950 border-b border-green-light dark:border-zinc-800 shadow-sm text-[1rem] font-medium text-white relative z-50 transition-colors duration-300`}
    >

      {/* Logo */}
      <div className="flex items-center">
        <h1 className="font-bold tracking-wider cursor-pointer text-2xl text-white">
          TrendQuik
        </h1>
      </div>

      {/* Desktop Nav Menus */}
      <div className="hidden lg:flex items-center gap-8">
        <Link
          to={"/"}
          className="hover:text-amber-500 transition-colors hover:scale-105 transform duration-200"
        >
          Home
        </Link>
        <Link
          to={"/products"}
          className="hover:text-amber-500 transition-colors hover:scale-105 transform duration-200"
        >
          Products
        </Link>
        <Link
          to={"/wishlist"}
          className="hover:text-amber-500 transition-colors hover:scale-105 transform duration-200"
        >
          Wishlist
        </Link>
        <Link
          to={"/orders"}
          className="hover:text-amber-500 transition-colors hover:scale-105 transform duration-200"
        >
          My Orders
        </Link>
        <Link
          to={"/cart"}
          className="hover:text-amber-500 transition-colors hover:scale-105 transform duration-200"
        >
          Cart
        </Link>
      </div>

      {/* Desktop Login/Register & User Details */}
      <div className="hidden lg:flex items-center gap-6">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-green-medium transition-colors cursor-pointer"
          aria-label="Toggle Theme"
        >
          {isDarkMode ? <FiSun className="text-xl" /> : <FiMoon className="text-xl" />}
        </button>

        <Link to={"/search"}>
          <FiSearch className="text-xl hover:text-amber-500 transition-colors" />
        </Link>
        <Link to={"/login"} className="hover:text-amber-500 transition-colors">
          Sign in
        </Link>
        <Link to="/account" className="flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer text-white bg-green-medium hover:bg-green-light transition-colors shadow-md">
          <TiUser className="text-lg" />
          <span className="text-sm font-semibold">
            {user?.name || "user_name"}
          </span>
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <div className="lg:hidden flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-green-medium transition-colors"
        >
          {isDarkMode ? <FiSun className="text-xl text-white" /> : <FiMoon className="text-xl text-white" />}
        </button>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-2xl focus:outline-none"
        >
          {isMenuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="absolute top-[10vh] left-0 w-full bg-cream dark:bg-zinc-900 shadow-lg flex flex-col items-center gap-6 py-8 lg:hidden animate-fade-in-down z-50 transition-colors duration-300">
          <Link
            to={"/"}
            className="text-lg hover:text-amber-500 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to={"/products"}
            className="text-lg hover:text-amber-500 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Products
          </Link>
          <Link
            to={"/category"}
            className="text-lg hover:text-amber-500 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Category
          </Link>
          <Link
            to={"/wishlist"}
            className="text-lg hover:text-amber-500 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Wishlist
          </Link>
          <Link
            to={"/orders"}
            className="text-lg hover:text-amber-500 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            My Orders
          </Link>
          <Link
            to={"/cart"}
            className="text-lg hover:text-amber-500 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Cart
          </Link>
          <div className="w-full border-t border-green-medium my-2"></div>
          <Link
            to={"/login"}
            className="text-lg hover:text-amber-500 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Sign in
          </Link>
          <Link to="/account" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 px-6 py-2 rounded-full cursor-pointer hover:bg-green-medium transition-colors shadow-md bg-green-light dark:bg-zinc-800">
            <TiUser className="text-lg text-white " />
            <span className="text-sm font-semibold text-white">
              {user ? user.name : "user_name"}
            </span>
          </Link>
        </div>
      )}
    </nav>
  );
}
