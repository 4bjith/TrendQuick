import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import useWishlistStore from "../zustand/wishlistStore";

export default function WishList() {
    const { wishlist } = useWishlistStore();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col bg-cream">
            <Navbar />

            {/* PAGE HEADER */}
            <section className="w-full bg-white/50 backdrop-blur-sm py-10 px-4 text-center md:text-left border-b border-green-light">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl font-bold text-green-dark">My Wishlist</h1>
                    <p className="text-green-dark/70 mt-2">
                        {wishlist.length} item{wishlist.length !== 1 ? 's' : ''} saved for later
                    </p>
                </div>
            </section>

            <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
                {wishlist.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-center">
                        <h2 className="text-2xl font-semibold text-green-dark mb-4">Your wishlist is empty</h2>
                        <p className="text-green-dark/60 mb-8">Browse our products and find something you love!</p>
                        <button
                            onClick={() => navigate('/products')}
                            className="px-6 py-3 bg-green-dark text-cream rounded-lg hover:bg-green-medium transition shadow-md"
                        >
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {wishlist.map((item) => (
                            <ProductCard
                                key={item._id}
                                id={item._id}
                                title={item.title}
                                price={item.price}
                                image={item.image}
                                discount={item.discount}
                                catagory={item.catagory} // Assuming this is stored or passed correctly
                            />
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
