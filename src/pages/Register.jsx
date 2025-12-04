import { useState, useRef } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import img1 from "../assets/images/jaclyn-moy-ugZxwLQuZec-unsplash.jpg";
import { toast } from "react-toastify";
import api from "../api/axiosClient";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const mobileRef = useRef();

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const name = nameRef.current?.value;
            const email = emailRef.current?.value;
            const password = passwordRef.current?.value;
            const mobile = mobileRef.current?.value;

            if (!name || !email || !password || !mobile) {
                toast.info("Please enter all fields!");
                setLoading(false);
                return;
            }

            const response = await api.post("/register", {
                name,
                email,
                password,
                mobile,
            });

            if (response.data?.status === "success") {
                toast.success("Registration successful 🎉");
                navigate("/login");
            } else {
                toast.error(response.data?.message || "Registration failed");
            }

        } catch (err) {
            console.error(err);
            toast.error("Server error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar height="h-[15vh]" />

            <div
                className="flex w-full h-[80vh] justify-center items-center"
                style={{
                    backgroundImage: `url(${img1})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <div className="hidden md:flex w-1/2 h-full justify-center items-center">
                    <div className="p-10 text-black text-center drop-shadow-lg">
                        <h2 className="text-4xl font-bold mb-4">Join Us!</h2>
                        <p className="text-xl italic">
                            "Fashion is the armor to survive the reality of everyday life."
                        </p>
                        <p className="mt-4 text-sm uppercase tracking-widest">
                            - Bill Cunningham
                        </p>
                    </div>
                </div>

                <div className="w-full md:w-1/2 h-full flex justify-center items-center p-8">
                    <div className="w-full max-w-md bg-white/10 backdrop-blur-md p-8 rounded-lg shadow-2xl border border-white/20">
                        <h1 className="text-3xl font-bold text-center text-black mb-8">Register</h1>

                        <form className="space-y-4" onSubmit={handleRegister}>
                            <div>
                                <label className="block text-sm font-medium text-black mb-1">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    ref={nameRef}
                                    placeholder="Enter your full name"
                                    className="w-full p-3 bg-white/20 border border-white/30 text-black placeholder-gray-400 rounded-lg"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-black mb-1">
                                    Mobile Number
                                </label>
                                <input
                                    type="tel"
                                    ref={mobileRef}
                                    placeholder="Enter your mobile number"
                                    className="w-full p-3 bg-white/20 border border-white/30 text-black placeholder-gray-400 rounded-lg"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-black mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    ref={emailRef}
                                    placeholder="Enter your email"
                                    className="w-full p-3 bg-white/20 border border-white/30 text-black placeholder-gray-400 rounded-lg"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-black mb-1">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        ref={passwordRef}
                                        placeholder="Create a password"
                                        className="w-full p-3 bg-white/20 border border-white/30 text-black placeholder-gray-400 rounded-lg"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                    >
                                        {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-gray-900 hover:bg-gray-700 text-white font-semibold rounded-lg"
                            >
                                {loading ? "Registering..." : "Register"}
                            </button>
                        </form>

                        <div className="mt-6 text-center text-sm text-gray-700">
                            Already have an account?{" "}
                            <a href="/login" className="text-blue-600 hover:underline font-medium">
                                Sign in
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
