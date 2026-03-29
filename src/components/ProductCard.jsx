import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../api/url";
import useWishlistStore from "../zustand/wishlistStore";
import { toast } from "react-toastify";


export default function ProductCard(props) {
  const navigate = useNavigate();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();

  // Construct a product object from props (or assume props is the product, but props are flattened here)
  const productObj = {
    _id: props.id,
    title: props.title,
    price: props.price,
    image: props.image,
    catagory: props.catagory
    // Add other needed fields
  };

  const isIn = isInWishlist(props.id);

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    if (isIn) {
      removeFromWishlist(props.id);
      toast.info("Removed from Wishlist");
    } else {
      addToWishlist(productObj);
      toast.success("Added to Wishlist");
    }
  };

  return (
    <div 
      onClick={() => navigate(`/item?id=${props.id}`)} 
      className={`relative bg-surface rounded-2xl shrink-0 shadow-sm cursor-pointer border border-border hover:border-green-medium transition-all group overflow-hidden ${
        props.viewMode === "list" 
          ? "w-full h-auto sm:h-48 flex flex-col sm:flex-row p-4 gap-6" 
          : "w-full max-w-[280px] h-[400px] flex flex-col p-4"
      }`}
    >
      {/* ❤️ Wishlist Icon */}
      <button
        onClick={handleWishlistClick}
        className="absolute top-3 right-3 bg-background/80 dark:bg-zinc-800/80 backdrop-blur-sm rounded-full shadow-sm p-2 hover:scale-110 transition z-10"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill={isIn ? "currentColor" : "none"}
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className={`w-5 h-5 ${isIn ? "text-red-500" : "text-green-medium group-hover:text-green-dark dark:group-hover:text-white"}`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
          />
        </svg>
      </button>

      {/* Image */}
      <div className={`${props.viewMode === "list" ? "w-full sm:w-40 h-40" : "w-full h-48"} bg-white/50 dark:bg-zinc-900/50 rounded-xl overflow-hidden flex items-center justify-center shrink-0`}>
        <img
          src={props.image.startsWith('http') ? props.image : `${BASE_URL}/${props.image}` || "https://via.placeholder.com/200"}
          alt={props.title}
          className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-500"
        />
      </div>

      {/* Content */}
      <div className={`flex flex-col justify-between grow ${props.viewMode === "list" ? "py-1" : "mt-4"}`}>
        <div>
          <div className="flex justify-between items-start gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-green-medium px-2 py-0.5 bg-green-light dark:bg-zinc-800 rounded-md">
              {props.catagory || "Unknown"}
            </span>
          </div>
          <h2 className="font-bold mt-2 text-base text-green-dark dark:text-foreground line-clamp-2 leading-tight group-hover:text-green-medium transition-colors">
            {props.title}
          </h2>
          
          <div className="flex items-center gap-1 mt-2">
            <div className="flex text-yellow-500 text-xs">
              {[...Array(5)].map((_, i) => <span key={i}>⭐</span>)}
            </div>
            <span className="text-[10px] text-green-dark/50 font-semibold">(4.5)</span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-xl font-black text-green-dark dark:text-foreground">₹{props.price}</p>
            {props.discount > 0 && (
              <p className="text-xs text-green-medium line-through opacity-70">₹{Math.round(props.price * (1 + props.discount / 100))}</p>
            )}
          </div>
          
          <Link 
            to={`/item?id=${props.id}`} 
            onClick={(e) => e.stopPropagation()}
            className="px-4 py-2 bg-green-dark dark:bg-foreground dark:text-background text-cream text-sm font-bold rounded-lg hover:bg-green-medium dark:hover:bg-green-light transition-colors shadow-sm active:scale-95"
          >
            Buy Now
          </Link>
        </div>
      </div>
    </div>
  );
}
