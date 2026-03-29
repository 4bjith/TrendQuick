import { useState } from "react";
import { TiUser } from "react-icons/ti";
import { FiMenu, FiX, FiSearch, FiSun, FiMoon } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useThemeStore } from "../zustand/themeStore";
import useUserStore from "../zustand/userStore";
import { useQueryClient } from "@tanstack/react-query";

export default function Navbar(prop) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();
  const { isDarkMode, toggleTheme } = useThemeStore();
  const clearToken = useUserStore((state) => state.clearToken);
  const clearUser = useUserStore((state) => state.clearUser);
  const queryClient = useQueryClient();

  const handleLogout = () => {
    clearToken();
    clearUser();
    queryClient.invalidateQueries(["user"]);
    setIsMenuOpen(false);
  };

  return (
    <nav
      className={`w-full ${prop.height || "h-[10vh]"
        } flex justify-between items-center px-8 bg-background dark:bg-background border-b border-green-light dark:border-green-light/10 shadow-sm text-[1rem] font-medium text-foreground dark:text-foreground relative z-50 transition-colors duration-300`}
    >

      {/* Logo */}
      <div className="flex items-center">
        <h1 className="relative z-10 font-bold tracking-wider cursor-pointer text-2xl text-gray-900 dark:text-white">
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
          id="theme-toggle"
          onClick={toggleTheme}
          className="p-2 rounded-full bg-cream dark:bg-zinc-800 text-green-dark dark:text-foreground hover:bg-green-light/20 transition-all border border-green-light dark:border-green-light/10 shadow-sm"
          aria-label="Toggle theme"
        >
          {isDarkMode ? <FiSun className="text-xl" /> : <FiMoon className="text-xl" />}
        </button>

        {user ? (
          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="text-foreground/40 hover:text-red-500 transition-colors font-black uppercase tracking-[0.2em] text-[10px] pr-4 border-r border-border"
            >
              Sign Out
            </button>
            <Link
              to="/account"
              className="group relative flex items-center justify-center p-2.5 rounded-full bg-surface border border-border text-foreground hover:bg-foreground hover:text-background transition-all shadow-sm active:scale-90"
              title={user.name}
            >
              <TiUser className="text-xl" />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></div>
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-4">
             <Link
              to={"/login"}
              className="px-8 py-3 bg-foreground text-background rounded-full font-black text-[10px] uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-all shadow-xl"
            >
              Sign In
            </Link>
          </div>
        )}
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
          <div className="w-full border-t border-border/50 my-2"></div>
          {user ? (
            <>
              <Link
                to="/account"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-center p-4 rounded-2xl bg-surface border border-border shadow-sm w-full"
              >
                <div className="p-3 bg-green-500/10 text-green-medium rounded-full">
                  <TiUser size={32} />
                </div>
              </Link>
              <button
                onClick={handleLogout}
                className="w-full py-4 text-red-500 font-black uppercase tracking-widest text-xs hover:bg-red-500/10 transition-colors rounded-2xl"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to={"/login"}
              className="w-full py-4 bg-green-dark text-white font-black uppercase tracking-widest text-xs rounded-2xl text-center shadow-xl"
              onClick={() => setIsMenuOpen(false)}
            >
              Sign in
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
