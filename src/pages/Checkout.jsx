import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useMutation } from "@tanstack/react-query";
import api from "../api/axiosClient";
import useCartStore from "../zustand/Cart";
import { useAuth } from "../hooks/useAuth";
import { toast } from "react-toastify";

export default function Checkout() {
    const navigate = useNavigate();
    const { items, clearCart } = useCartStore();
    const { user } = useAuth();

    // ----- Shipping address state -----
    const [shipping, setShipping] = useState({
        fullName: "",
        phone: "",
        address1: "",
        address2: "",
        city: "",
        state: "",
        zip: "",
        country: "",
    });

    const [cashfree, setCashfree] = useState(null);

    React.useEffect(() => {
        if (window.Cashfree) {
            setCashfree(window.Cashfree({ mode: "sandbox" }));
        }
    }, []);

    const orderMutation = useMutation({
        mutationFn: async (orderData) => {
            const res = await api.post("/orders", orderData);
            return res.data;
        },
        onSuccess: async (data) => {
            try {
                // Request payment session from backend
                const payRes = await api.post("/payment", { orderId: data._id });

                if (payRes.data.success && cashfree) {
                    const checkoutOptions = {
                        paymentSessionId: payRes.data.payment_session_id,
                        redirectTarget: "_self", // Redirects to return_url defined in backend
                    };
                    cashfree.checkout(checkoutOptions);
                    clearCart();
                } else {
                    toast.error("Failed to initiate payment. Please try again.");
                }
            } catch (err) {
                console.error("Payment Error:", err);
                toast.error("Error creating payment session.");
            }
        },
        onError: (err) => {
            toast.error(err.response?.data?.error || "Failed to place order. Please try again.");
        }
    });

    // ----- Handlers -----
    const handleShippingChange = (e) => {
        const { name, value } = e.target;
        setShipping((prev) => ({ ...prev, [name]: value }));
    };


    const handleSubmit = (e) => {
        e.preventDefault();

        if (items.length === 0) {
            toast.error("Your cart is empty!");
            return;
        }

        if (!user) {
            toast.warn("Please log in to place an order.");
            return;
        }

        const [fname, ...lnameArr] = shipping.fullName.split(" ");
        const lname = lnameArr.join(" ") || ".";

        const orderData = {
            userId: user.id || user._id,
            email: user.email,
            phone: shipping.phone,
            address: `${shipping.address1}, ${shipping.address2 ? shipping.address2 + ", " : ""}${shipping.city}, ${shipping.state}, ${shipping.zip}, ${shipping.country}`,
            fname: fname,
            lname: lname,
            orderedItems: items.map(item => ({
                pid: item._id,
                qty: item.quantity
            }))
        };

        orderMutation.mutate(orderData);
    };

    const inputClasses = "w-full px-4 py-3 bg-white/70 backdrop-blur-sm rounded-lg border border-green-light focus:outline-none focus:ring-2 focus:ring-green-medium transition text-green-dark placeholder-green-dark/50";

    return (
        <div className="min-h-screen flex flex-col bg-cream">
            {/* ---------- Navbar ---------- */}
            <Navbar />

            {/* ---------- Main Content ---------- */}
            <main className="grow container mx-auto px-4 py-12">
                <h1 className="text-4xl font-extrabold text-center text-green-dark mb-10 drop-shadow-md">
                    Checkout
                </h1>

                <form
                    onSubmit={handleSubmit}
                    className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto"
                >
                    {/* ----- Shipping Address ----- */}
                    <section className="bg-white/40 backdrop-blur-lg rounded-xl p-8 shadow-lg border border-white/40">
                        <h2 className="text-2xl font-semibold text-green-dark mb-6">
                            Shipping Address
                        </h2>

                        <div className="grid gap-4 md:grid-cols-2">
                            <input
                                type="text"
                                name="fullName"
                                placeholder="Full Name"
                                value={shipping.fullName}
                                onChange={handleShippingChange}
                                required
                                className={inputClasses}
                            />
                            <input
                                type="tel"
                                name="phone"
                                placeholder="Phone"
                                value={shipping.phone}
                                onChange={handleShippingChange}
                                required
                                className={inputClasses}
                            />
                            <input
                                type="text"
                                name="address1"
                                placeholder="Address Line 1"
                                value={shipping.address1}
                                onChange={handleShippingChange}
                                required
                                className={`${inputClasses} col-span-2`}
                            />
                            <input
                                type="text"
                                name="address2"
                                placeholder="Address Line 2 (optional)"
                                value={shipping.address2}
                                onChange={handleShippingChange}
                                className={`${inputClasses} col-span-2`}
                            />
                            <input
                                type="text"
                                name="city"
                                placeholder="City"
                                value={shipping.city}
                                onChange={handleShippingChange}
                                required
                                className={inputClasses}
                            />
                            <input
                                type="text"
                                name="state"
                                placeholder="State / Province"
                                value={shipping.state}
                                onChange={handleShippingChange}
                                required
                                className={inputClasses}
                            />
                            <input
                                type="text"
                                name="zip"
                                placeholder="ZIP / Postal Code"
                                value={shipping.zip}
                                onChange={handleShippingChange}
                                required
                                className={inputClasses}
                            />
                            <input
                                type="text"
                                name="country"
                                placeholder="Country"
                                value={shipping.country}
                                onChange={handleShippingChange}
                                required
                                className={inputClasses}
                            />
                        </div>
                    </section>

                    {/* ----- Order Summary (Replacing Payment Details) ----- */}
                    <section className="bg-white/40 backdrop-blur-lg rounded-xl p-8 shadow-lg border border-white/40">
                        <h2 className="text-2xl font-semibold text-green-dark mb-6">
                            Order Summary
                        </h2>
                        <div className="space-y-4">
                            {items.map((item) => (
                                <div key={item._id} className="flex justify-between text-green-dark">
                                    <span>{item.name} (x{item.quantity})</span>
                                    <span>₹{item.price * item.quantity}</span>
                                </div>
                            ))}
                            <div className="border-t border-green-light pt-4 mt-4 flex justify-between font-bold text-xl text-green-dark">
                                <span>Total Amount</span>
                                <span>₹{items.reduce((acc, item) => acc + (item.price * item.quantity), 0)}</span>
                            </div>
                        </div>
                        <p className="mt-8 text-sm text-green-dark/70 text-center italic">
                            You will be redirected to our secure payment gateway (Cashfree) to complete your transaction.
                        </p>
                    </section>


                    {/* ----- Submit Button ----- */}
                    <button
                        type="submit"
                        className="col-span-2 mt-6 w-full py-4 bg-green-dark text-cream font-bold rounded-xl hover:bg-green-medium transition-all transform hover:scale-105 shadow-lg"
                    >
                        Place Order
                    </button>
                </form>
            </main>

            {/* ---------- Footer ---------- */}
            <Footer />
        </div>
    );
}
