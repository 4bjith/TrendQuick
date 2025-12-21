import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

/**
 * Checkout page – includes shipping address and payment sections.
 * Designed with a premium glass‑morphism style and Tailwind CSS utilities.
 */
export default function Checkout() {
    const navigate = useNavigate();

    // ----- Shipping address state -----
    const [shipping, setShipping] = useState({
        fullName: "",
        address1: "",
        address2: "",
        city: "",
        state: "",
        zip: "",
        country: "",
        phone: "",
    });

    // ----- Payment state -----
    const [payment, setPayment] = useState({
        cardNumber: "",
        expiry: "",
        cvv: "",
        nameOnCard: "",
    });

    // ----- Handlers -----
    const handleShippingChange = (e) => {
        const { name, value } = e.target;
        setShipping((prev) => ({ ...prev, [name]: value }));
    };

    const handlePaymentChange = (e) => {
        const { name, value } = e.target;
        setPayment((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Placeholder – in a real app you’d send data to the backend.
        console.log("Shipping:", shipping);
        console.log("Payment:", payment);
        alert("Order placed! 🎉");
        navigate("/"); // redirect to home after checkout
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

                    {/* ----- Payment Details ----- */}
                    <section className="bg-white/40 backdrop-blur-lg rounded-xl p-8 shadow-lg border border-white/40">
                        <h2 className="text-2xl font-semibold text-green-dark mb-6">
                            Payment Details
                        </h2>

                        <div className="grid gap-4">
                            <input
                                type="text"
                                name="cardNumber"
                                placeholder="Card Number"
                                value={payment.cardNumber}
                                onChange={handlePaymentChange}
                                required
                                className={inputClasses}
                                maxLength={19}
                            />
                            <div className="grid gap-4 md:grid-cols-2">
                                <input
                                    type="text"
                                    name="expiry"
                                    placeholder="MM/YY"
                                    value={payment.expiry}
                                    onChange={handlePaymentChange}
                                    required
                                    className={inputClasses}
                                    maxLength={5}
                                />
                                <input
                                    type="password"
                                    name="cvv"
                                    placeholder="CVV"
                                    value={payment.cvv}
                                    onChange={handlePaymentChange}
                                    required
                                    className={inputClasses}
                                    maxLength={4}
                                />
                            </div>
                            <input
                                type="text"
                                name="nameOnCard"
                                placeholder="Name on Card"
                                value={payment.nameOnCard}
                                onChange={handlePaymentChange}
                                required
                                className={inputClasses}
                            />
                        </div>
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
