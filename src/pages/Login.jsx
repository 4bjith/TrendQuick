import { useRef, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import img1 from "../assets/images/jaclyn-moy-ugZxwLQuZec-unsplash.jpg";
import api from "../api/axiosClient";
import { toast } from "react-toastify";
import useUserStore from "../zustand/userStore";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const emailRef = useRef();
    const passwordRef = useRef();
    const navigate = useNavigate();   // ⬅ correct name (lowercase n)

    const setToken = useUserStore((state) => state.setToken);

    const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
        let email = emailRef.current?.value;
        let password = passwordRef.current?.value;

        if (!email || !password) {
            toast.error("Email and password missing");
            setLoading(false);
            return;
        }

        const res = await api.post("/login", { email, password });

        // Handle backend string responses
        if (typeof res.data === "string") {
            toast.error(res.data); // "no user found" or "Wrong password"
            setLoading(false);
            return;
        }

        // Handle success result
        if (res.data.status === "Login done") {
            setToken(res.data.token);
            toast.success("Login successful ✔️");

            setLoading(false);
            navigate("/");
            return;
        }

    } catch (err) {
        console.error("Internal error", err);
        toast.error(err.response?.data?.message || "Something went wrong");
        setLoading(false);
    }
};


    return (
        <div className="flex flex-col min-h-screen">
            <Navbar height="h-[15vh]" />
            <div
                className="flex w-full h-[80vh] justify-center items-center relative"
                style={{
                    backgroundImage: `url(${img1})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >

                <div className="hidden md:flex w-1/2 h-full justify-center items-center">
                    <div className="p-10 text-black text-center drop-shadow-lg">
                        <h2 className="text-4xl font-bold mb-4">Welcome Back!</h2>
                        <p className="text-xl italic">"Style is a way to say who you are without having to speak."</p>
                        <p className="mt-4 text-sm uppercase tracking-widest">- Rachel Zoe</p>
                    </div>
                </div>

                <div className="w-full md:w-1/2 h-full flex justify-center items-center p-8">
                    <div className="w-full max-w-md bg-white/10 backdrop-blur-md p-8 rounded-lg shadow-2xl border border-white/20">
                        <h1 className="text-3xl font-bold text-center text-black mb-8">Sign in</h1>

                        <form className="space-y-6" onSubmit={handleLogin}>
                            <div>
                                <label className="block text-sm font-medium text-black mb-1">Email</label>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    ref={emailRef}
                                    className="w-full p-3 bg-white/20 border border-white/30 text-black placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition duration-200"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-black mb-1">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        ref={passwordRef}
                                        className="w-full p-3 bg-white/20 border border-white/30 text-black placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition duration-200"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                                    >
                                        {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-gray-900 hover:bg-gray-700 text-white font-semibold rounded-lg transition duration-200 shadow-md"
                            >
                                {loading ? "Logging in..." : "Login"}
                            </button>
                        </form>

                        <div className="mt-6 text-center text-sm text-gray-700">
                            Don't have an account? 
                            <a href="/register" className="text-blue-600 hover:underline font-medium"> Register now</a>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
