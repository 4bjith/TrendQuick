import React from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { BASE_URL } from "../api/url";
import api from "../api/axiosClient";


export default function Thanks() {
    const location = useLocation();
    const navigate = useNavigate();
    const [order, setOrder] = React.useState(location.state?.order || null);
    const [loading, setLoading] = React.useState(!location.state?.order);

    const query = new URLSearchParams(location.search);
    const orderId = query.get("order_id");

    React.useEffect(() => {
        if (!order && orderId) {
            const fetchOrder = async () => {
                try {
                    const res = await api.get(`/orders/my`); // Assuming developer knows how to get one order, or search in all
                    // For better implementation, one should have /orders/:id
                    // but let's try to find it in my orders for now if specific endpoint isn't clear
                    const yourOrder = res.data.find(o => o._id === orderId);
                    if (yourOrder) {
                        setOrder(yourOrder);
                    }
                } catch (err) {
                    console.error("Error fetching order:", err);
                } finally {
                    setLoading(false);
                }
            };
            fetchOrder();
        } else {
            setLoading(false);
        }
    }, [order, orderId]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-cream">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-dark"></div>
            </div>
        );
    }

    if (!order) {

        return (
            <div className="min-h-screen flex flex-col bg-cream">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center p-4">
                    <h2 className="text-2xl font-bold text-green-dark">No order information found.</h2>
                    <button
                        onClick={() => navigate('/')}
                        className="mt-4 px-6 py-2 bg-green-dark text-cream rounded-lg hover:bg-green-medium transition"
                    >
                        Go Home
                    </button>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-cream">
            <Navbar />

            <main className="flex-1 container mx-auto px-4 py-12 flex flex-col items-center">
                {/* Success Icon & Header */}
                <div className="w-20 h-20 bg-green-dark text-cream rounded-full flex items-center justify-center mb-6 shadow-xl animate-bounce">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                <h1 className="text-4xl md:text-5xl font-extrabold text-green-dark text-center mb-2">
                    Thank You for Your Order!
                </h1>
                <p className="text-green-dark/70 text-lg text-center mb-10">
                    Your order has been placed successfully and is being processed.
                </p>

                {/* Order Slip / Invoice */}
                <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-green-light">
                    {/* Slip Header */}
                    <div className="bg-green-dark p-8 text-cream flex justify-between items-center">
                        <div>
                            <p className="text-xs uppercase font-bold tracking-widest opacity-70">Order ID</p>
                            <h2 className="text-xl font-mono">#{order._id}</h2>
                        </div>
                        <div className="text-right">
                            <p className="text-xs uppercase font-bold tracking-widest opacity-70">Date</p>
                            <p className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>

                    <div className="p-8 space-y-8">
                        {/* Customer Details */}
                        <div className="grid grid-cols-2 gap-8 border-b border-green-light/20 pb-8">
                            <div>
                                <h3 className="text-xs uppercase font-bold text-green-dark/50 mb-3 tracking-widest">Ship To</h3>
                                <p className="font-bold text-green-dark">{order.fname} {order.lname}</p>
                                <p className="text-green-dark/70 break-words">{order.address}</p>
                                <p className="text-green-dark/70">{order.phone}</p>
                            </div>
                            <div className="text-right">
                                <h3 className="text-xs uppercase font-bold text-green-dark/50 mb-3 tracking-widest">Payment Method</h3>
                                <p className="text-green-dark/70 font-medium">Credit Card / Gateway</p>
                                <p className="text-green-dark/70 italic text-sm">Status: Authorized</p>
                            </div>
                        </div>

                        {/* Items List */}
                        <div>
                            <h3 className="text-xs uppercase font-bold text-green-dark/50 mb-4 tracking-widest">Order Summary</h3>
                            <div className="space-y-4">
                                {order.orderedItems.map((item, index) => (
                                    <div key={index} className="flex justify-between items-center bg-green-light/5 p-4 rounded-xl border border-green-light/20">
                                        <div className="flex items-center gap-4">
                                            {/* Product Snapshot (assuming image is available in populated item) */}
                                            <div className="w-12 h-12 bg-white rounded-lg border border-green-light overflow-hidden shrink-0">
                                                {item.pid && (
                                                    <img
                                                        src={item.pid.image?.startsWith('http') ? item.pid.image : `${BASE_URL}/${item.pid.image}`}
                                                        alt={item.pid.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-bold text-green-dark">{item.pid?.title || "Product"}</p>
                                                <p className="text-xs text-green-dark/50">Quantity: {item.qty}</p>
                                            </div>
                                        </div>
                                        <p className="font-bold text-green-dark">₹{item.pid?.price * item.qty}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Total Section */}
                        <div className="pt-6 border-t border-green-light space-y-2">
                            <div className="flex justify-between text-green-dark/60">
                                <span>Subtotal</span>
                                <span>₹{order.TotalPrice}</span>
                            </div>
                            <div className="flex justify-between text-green-dark/60">
                                <span>Shipping</span>
                                <span className="text-green-medium">FREE</span>
                            </div>
                            <div className="flex justify-between text-2xl font-black text-green-dark pt-4">
                                <span>Total Amount</span>
                                <span className="text-green-medium">₹{order.TotalPrice}</span>
                            </div>
                        </div>
                    </div>

                    {/* Slip Footer Actions */}
                    <div className="bg-green-light/10 p-6 border-t border-green-light/30 flex justify-center gap-4">
                        <button
                            onClick={() => window.print()}
                            className="px-6 py-2 border border-green-dark text-green-dark font-bold rounded-lg hover:bg-green-dark hover:text-cream transition shadow-sm"
                        >
                            Print Slip
                        </button>
                        <Link to="/orders">
                            <button className="px-6 py-2 bg-green-dark text-cream font-bold rounded-lg hover:bg-green-medium transition shadow-md">
                                My Orders
                            </button>
                        </Link>
                    </div>
                </div>

                <Link to="/" className="mt-12 text-green-dark font-bold hover:underline">
                    ← Back to Shopping
                </Link>
            </main>

            <Footer />
        </div>
    );
}
