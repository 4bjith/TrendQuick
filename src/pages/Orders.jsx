import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useQuery } from "@tanstack/react-query";
import api from "../api/axiosClient";
import { BASE_URL } from "../api/url";
import { Link } from "react-router-dom";

const OrderSkeleton = () => (
    <div className="bg-white/60 rounded-2xl border border-green-light p-6 animate-pulse">
        <div className="flex flex-col md:flex-row justify-between border-b border-green-light/20 pb-4 mb-4 gap-4">
            <div className="space-y-2">
                <div className="h-3 w-16 bg-gray-200 rounded"></div>
                <div className="h-4 w-32 bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-2">
                <div className="h-3 w-16 bg-gray-200 rounded"></div>
                <div className="h-4 w-32 bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-2">
                <div className="h-3 w-16 bg-gray-200 rounded"></div>
                <div className="h-6 w-24 bg-gray-200 rounded"></div>
            </div>
            <div className="h-6 w-24 bg-gray-200 rounded-full"></div>
        </div>
        <div className="space-y-4">
            {[1, 2].map((i) => (
                <div key={i} className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg shrink-0"></div>
                    <div className="flex-1 space-y-2">
                        <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                        <div className="h-3 w-1/4 bg-gray-200 rounded"></div>
                    </div>
                    <div className="h-4 w-16 bg-gray-200 rounded"></div>
                </div>
            ))}
        </div>
    </div>
);

export default function Orders() {
    const {
        data: orders,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["userOrders"],
        queryFn: async () => {
            const res = await api.get("/orders/my");
            return res.data;
        },
    });

    if (isError)
        return (
            <div className="min-h-screen flex flex-col bg-cream">
                <Navbar />
                <div className="flex-1 flex flex-col justify-center items-center text-red-600 gap-4">
                    <span className="text-5xl">⚠️</span>
                    <p className="font-bold text-xl">Error loading orders.</p>
                    <Link to="/login" className="px-6 py-2 bg-green-dark text-white rounded-lg hover:bg-green-medium transition">
                        Please Login Again
                    </Link>
                </div>
                <Footer />
            </div>
        );

    return (
        <div className="min-h-screen flex flex-col bg-cream">
            <Navbar />

            <section className="w-full bg-white/50 backdrop-blur-sm py-10 px-4 text-center md:text-left border-b border-green-light">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl font-bold text-green-dark">My Orders</h1>
                    <p className="text-green-dark/70 mt-2">
                        Track and view your previous purchases
                    </p>
                </div>
            </section>

            <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
                {isLoading ? (
                    <div className="space-y-6">
                        {[1, 2, 3].map((i) => <OrderSkeleton key={i} />)}
                    </div>
                ) : orders && orders.length > 0 ? (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div
                                key={order._id}
                                className="bg-white/60 backdrop-blur-md rounded-2xl border border-green-light p-6 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="flex flex-col md:flex-row justify-between border-b border-green-light/20 pb-4 mb-4 gap-4">
                                    <div>
                                        <p className="text-xs text-green-dark/50 uppercase font-bold tracking-wider">
                                            Order ID
                                        </p>
                                        <p className="text-sm font-mono text-green-dark">#{order._id}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-green-dark/50 uppercase font-bold tracking-wider">
                                            Date
                                        </p>
                                        <p className="text-sm text-green-dark">
                                            {new Date(order.createdAt).toLocaleDateString("en-IN", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-green-dark/50 uppercase font-bold tracking-wider">
                                            Total
                                        </p>
                                        <p className="text-lg font-bold text-green-dark">₹{order.TotalPrice}</p>
                                    </div>
                                    <div>
                                        <span className="px-3 py-1 bg-green-dark/10 text-green-dark text-xs font-bold rounded-full uppercase">
                                            Confirmed
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {order.orderedItems.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-4">
                                            <div className="w-16 h-16 bg-white rounded-lg border border-green-light overflow-hidden shrink-0">
                                                {item.pid && (
                                                    <img
                                                        src={
                                                            item.pid.image.startsWith("http")
                                                                ? item.pid.image
                                                                : `${BASE_URL}/${item.pid.image}`
                                                        }
                                                        alt={item.pid.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-green-dark line-clamp-1">
                                                    {item.pid?.title || "Product Unavailable"}
                                                </h4>
                                                <p className="text-sm text-green-dark/60">
                                                    Qty: {item.qty} × ₹{item.pid?.price || 0}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <Link to={item.pid?._id ? `/item?id=${item.pid._id}` : "#"}>
                                                    <button className="text-sm font-bold text-green-medium hover:underline">
                                                        Buy Again
                                                    </button>
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-24 h-24 bg-green-light/20 rounded-full flex items-center justify-center mb-6">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-12 w-12 text-green-medium"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-green-dark mb-4">
                            No orders yet
                        </h2>
                        <p className="text-green-dark/60 mb-8 max-w-xs">
                            Looks like you haven't placed any orders. Start shopping to fill your history!
                        </p>
                        <Link
                            to="/products"
                            className="px-8 py-3 bg-green-dark text-cream font-bold rounded-xl hover:bg-green-medium transition shadow-lg"
                        >
                            Discover Products
                        </Link>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
