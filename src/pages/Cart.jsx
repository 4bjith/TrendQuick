import React from "react";
import { Link } from "react-router-dom";
import { FiTrash2, FiMinus, FiPlus, FiArrowLeft } from "react-icons/fi";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import useCartStore from "../zustand/Cart";

const Cart = () => {
    const { items, increaseQty, decreaseQty, removeItem, getTotal } = useCartStore();

    const totalAmount = getTotal();
    const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <div className="min-h-screen flex flex-col bg-cream">
            <Navbar />

            <main className="grow container mx-auto px-4 py-8 md:py-12">
                <h1 className="text-3xl md:text-4xl font-bold mb-8 text-green-dark">Shopping Cart</h1>

                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 bg-white/80 rounded-lg shadow-sm">
                        <div className="w-24 h-24 bg-green-light/30 rounded-full flex items-center justify-center mb-6">
                            <span className="text-4xl">🛒</span>
                        </div>
                        <h2 className="text-2xl font-semibold text-green-dark mb-2">Your cart is empty</h2>
                        <p className="text-green-dark/70 mb-8">Looks like you haven't added anything to your cart yet.</p>
                        <Link
                            to="/products"
                            className="px-8 py-3 bg-green-dark text-cream font-medium rounded-full hover:bg-green-medium transition-colors flex items-center gap-2"
                        >
                            <FiArrowLeft /> Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Cart Items List */}
                        <div className="lg:w-2/3 space-y-4">
                            {items.map((item) => (
                                <div
                                    key={item._id}
                                    className="bg-white/90 p-4 rounded-xl shadow-sm border border-green-light flex flex-col sm:flex-row items-center gap-4 transition-all hover:shadow-md"
                                >
                                    {/* Product Image */}
                                    <div className="w-full sm:w-24 h-24 shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                                        {item.image ? (
                                            <img
                                                src={item.image}
                                                alt={item.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                No Image
                                            </div>
                                        )}
                                    </div>

                                    {/* Product Details */}
                                    <div className="grow text-center sm:text-left w-full">
                                        <h3 className="text-lg font-semibold text-green-dark mb-1">{item.title}</h3>
                                        <p className="text-green-dark/70 text-sm mb-2">{item.category}</p>
                                        <p className="text-lg font-bold text-green-dark">₹{item.price.toLocaleString()}</p>
                                    </div>

                                    {/* Quantity Controls */}
                                    <div className="flex items-center gap-3 bg-cream px-3 py-1.5 rounded-lg border border-green-light">
                                        <button
                                            onClick={() => decreaseQty(item._id)}
                                            className="p-1 hover:text-red-500 transition-colors disabled:opacity-50"
                                            aria-label="Decrease quantity"
                                        >
                                            <FiMinus size={16} />
                                        </button>
                                        <span className="font-semibold w-8 text-center">{item.quantity}</span>
                                        <button
                                            onClick={() => increaseQty(item._id)}
                                            className="p-1 hover:text-green-medium transition-colors"
                                            aria-label="Increase quantity"
                                        >
                                            <FiPlus size={16} />
                                        </button>
                                    </div>

                                    {/* Remove Button */}
                                    <button
                                        onClick={() => removeItem(item._id)}
                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                                        aria-label="Remove item"
                                    >
                                        <FiTrash2 size={20} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:w-1/3">
                            <div className="bg-white/90 p-6 rounded-xl shadow-sm border border-green-light sticky top-24">
                                <h2 className="text-xl font-bold text-green-dark mb-6">Order Summary</h2>

                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between text-green-dark/80">
                                        <span>Subtotal ({totalItems} items)</span>
                                        <span className="font-medium">₹{totalAmount.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-green-dark/80">
                                        <span>Shipping</span>
                                        <span className="text-green-medium font-medium">Free</span>
                                    </div>
                                    <div className="border-t border-green-light pt-4 flex justify-between items-center">
                                        <span className="text-lg font-bold text-green-dark">Total</span>
                                        <span className="text-2xl font-bold text-green-dark">₹{totalAmount.toLocaleString()}</span>
                                    </div>
                                </div>
                                <Link to={`/checkout?`}>
                                    <button className="w-full py-4 bg-green-dark text-cream font-bold rounded-xl hover:bg-green-medium transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-lg">
                                        Proceed to Checkout
                                    </button></Link>

                                <div className="mt-6 text-center">
                                    <Link to="/products" className="text-sm text-green-dark/60 hover:text-green-dark hover:underline">
                                        or Continue Shopping
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default Cart;
