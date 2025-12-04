import { Link, useNavigate } from "react-router-dom";


export default function ProductCard(props) {
  const navigate = useNavigate()
  return (
    <div onClick={()=>navigate(`/item?id=${props.id}`)} className="relative w-[200px] md:w-[200px] h-[300px] bg-gray-100 rounded-xl p-3 shrink-0 shadow-sm cursor-default">
      {/* ❤️ Wishlist Icon */}
      <button className="absolute top-2 right-2 bg-white rounded-full shadow p-1 hover:scale-110 transition">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="#f3f3f3"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="#ff4d6d"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 21s-6.2-4.35-9.2-8.35C-.52 9.2.48 5.21 3.64 3.6c2.05-1.07 4.57-.54 6.11 1.02L12 6.3l2.25-1.68c1.54-1.56 4.06-2.09 6.11-1.02 3.16 1.61 4.16 5.6 1.84 9.05C18.2 16.65 12 21 12 21z"
          />
        </svg>
      </button>

      {/* Image */}
      <img
        src={props.image || "https://via.placeholder.com/200"}
        alt={props.title}
        className="w-full h-[150px] object-cover rounded-lg"
      />

      {/* Title */}
      <h2 className="font-semibold mt-2 text-sm line-clamp-1">{props.title}</h2>

      {/* Rating */}
      <p className="text-yellow-500 text-sm flex items-center gap-1">
        ⭐⭐⭐⭐⭐ <span className="text-gray-500 text-xs">(4.5)</span>
      </p>

      {/* Category */}
      <p className="text-gray-600 text-xs">
        {props.catagory || "Unknown Category"}
      </p>

      {/* Price */}
      <p className="font-bold text-green-700 mt-1">₹ {props.price}</p>

      {/* Buy Now */}
      <Link to={`/item?id=${props.id}`}>
      <button className="w-full mt-2 bg-blue-600 text-white py-1 rounded-md hover:bg-blue-700 transition">
        Buy Now
      </button></Link>
    </div>
  );
}
