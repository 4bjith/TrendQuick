import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../api/url";


export default function ProductCard(props) {
  const navigate = useNavigate()
  return (
    <div onClick={() => navigate(`/item?id=${props.id}`)} className="relative w-[200px] md:w-[200px] h-[300px] bg-[#ffffffe8] rounded-xl p-3 shrink-0 shadow-sm cursor-pointer border border-green-light hover:shadow-md transition-all">
      {/* ❤️ Wishlist Icon */}
      <button className="absolute top-2 right-2 bg-white/80 rounded-full shadow p-1 hover:scale-110 transition">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-5 h-5 text-green-medium hover:text-green-dark hover:fill-green-medium"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
          />
        </svg>
      </button>

      {/* Image */}
      <img
        src={props.image.startsWith('http')?props.image : `${BASE_URL}/${props.image}` || "https://via.placeholder.com/200"}
        alt={props.title}
        className="w-full h-[150px] object-cover rounded-lg bg-gray-100"
      />

      {/* Title */}
      <h2 className="font-semibold mt-2 text-sm line-clamp-1 text-green-dark">{props.title}</h2>

      {/* Rating */}
      <p className="text-yellow-500 text-sm flex items-center gap-1">
        ⭐⭐⭐⭐⭐ <span className="text-gray-400 text-xs">(4.5)</span>
      </p>

      {/* Category */}
      <p className="text-green-dark/70 text-xs capitalize">
        {props.catagory || "Unknown Category"}
      </p>

      {/* Price */}
      <p className="font-bold text-green-dark mt-1">₹ {props.price}</p>

      {/* Buy Now */}
      <Link to={`/item?id=${props.id}`} onClick={(e) => e.stopPropagation()}>
        <button className="w-full mt-2 bg-green-dark text-cream py-1 rounded-md hover:bg-green-medium transition font-medium">
          Buy Now
        </button></Link>
    </div>
  );
}
