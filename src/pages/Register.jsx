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

    const inputClasses = "w-full p-3 bg-white/50 border border-green-light text-green-dark placeholder-green-dark/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-medium focus:border-transparent transition duration-200";

    return (
        <div className="flex flex-col min-h-screen bg-cream">
            <Navbar height="h-[15vh]" />

            <div
                className="flex w-full h-[80vh] justify-center items-center relative"
                style={{
                    backgroundImage: `url(${img1})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <div className="absolute inset-0 bg-green-dark/10"></div>

                <div className="hidden md:flex w-1/2 h-full justify-center items-center z-10">
                    <div className="p-10 text-green-dark text-center drop-shadow-lg bg-cream/70 rounded-xl backdrop-blur-sm">
                        <h2 className="text-4xl font-bold mb-4">Join Us!</h2>
                        <p className="text-xl italic">
                            "Fashion is the armor to survive the reality of everyday life."
                        </p>
                        <p className="mt-4 text-sm uppercase tracking-widest text-green-medium">
                            - Bill Cunningham
                        </p>
                    </div>
                </div>

                <div className="w-full md:w-1/2 h-full flex justify-center items-center p-8 z-10">
                    <div className="w-full max-w-md bg-white/70 backdrop-blur-md p-8 rounded-lg shadow-2xl border border-white/50">
                        <h1 className="text-3xl font-bold text-center text-green-dark mb-8">Register</h1>

                        <form className="space-y-4" onSubmit={handleRegister}>
                            <div>
                                <label className="block text-sm font-medium text-green-dark mb-1">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    ref={nameRef}
                                    placeholder="Enter your full name"
                                    className={inputClasses}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-green-dark mb-1">
                                    Mobile Number
                                </label>
                                <input
                                    type="tel"
                                    ref={mobileRef}
                                    placeholder="Enter your mobile number"
                                    className={inputClasses}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-green-dark mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    ref={emailRef}
                                    placeholder="Enter your email"
                                    className={inputClasses}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-green-dark mb-1">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        ref={passwordRef}
                                        placeholder="Create a password"
                                        className={inputClasses}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-dark/60 hover:text-green-dark focus:outline-none"
                                    >
                                        {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-green-dark hover:bg-green-medium text-cream font-semibold rounded-lg shadow-md transition-all"
                            >
                                {loading ? "Registering..." : "Register"}
                            </button>
                        </form>

                        <div className="mt-6 text-center text-sm text-green-dark/80">
                            Already have an account?{" "}
                            <a href="/login" className="text-green-medium hover:underline font-bold ml-1">
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
