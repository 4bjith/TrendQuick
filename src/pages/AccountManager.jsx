import { useRef, useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../api/axiosClient";
import { toast } from "react-toastify";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useUserStore from "../zustand/userStore";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

export default function AccountManager() {
    const { user, isLoading, isError, token } = useAuth();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!token && !isLoading) {
            navigate("/login");
        }
    }, [token, navigate, isLoading]);

    // Local state for form fields
    const [formData, setFormData] = useState({
        name: "",
        mobile: "",
        address: "",
        age: "",
        profile: "",
    });

    // Populate form when user data is loaded
    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name || "",
                mobile: user.mobile || "",
                address: user.address || "",
                age: user.age || "",
                profile: user.profile || "", // Assuming profile is a URL string
            }));
        }
    }, [user]);

    // Mutation to update user
    const mutation = useMutation({
        mutationFn: async (updatedData) => {
            const data = new FormData();
            data.append("name", updatedData.name);
            data.append("mobile", updatedData.mobile);
            data.append("address", updatedData.address);
            data.append("age", updatedData.age);

            // If a new file is selected, append it
            if (updatedData.profileFile) {
                data.append("profile", updatedData.profileFile);
            } else {
                // If no new file, but we have a text URL (rare if using file input only, but good for fallback)
                data.append("profile", updatedData.profile);
            }

            const res = await api.put("/user", data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return res.data;
        },
        onSuccess: (data) => {
            toast.success("Profile updated successfully!");
            // Invalidate query to refetch fresh data
            queryClient.invalidateQueries(["user"]);
            // Clear local file preview after successful upload
            setFormData((prev) => ({ ...prev, profileFile: null, profilePreview: null }));
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || "Failed to update profile");
        },
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prev) => ({
                ...prev,
                profileFile: file,
                profilePreview: URL.createObjectURL(file) // For local preview
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        mutation.mutate(formData);
    };

    // Helper to get correct image source
    const getProfileSrc = () => {
        if (formData.profilePreview) return formData.profilePreview;
        if (formData.profile) {
            // If it's a relative path from backend (e.g. "uploads/...")
            if (!formData.profile.startsWith("http") && !formData.profile.startsWith("blob:")) {
                return `http://localhost:8000/${formData.profile}`;
            }
            return formData.profile;
        }
        return null;
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col bg-cream">
                <Navbar />
                <div className="flex-1 flex justify-center items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-medium"></div>
                </div>
                <Footer />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-screen flex flex-col bg-cream">
                <Navbar />
                <div className="flex-1 flex justify-center items-center text-red-600">
                    Error loading profile. Please try logging in again.
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-cream selection:bg-green-medium selection:text-white">
            <Navbar />

            <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12 lg:py-20">
                <div className="flex flex-col lg:flex-row gap-12">

                    {/* LEFT SIDE: Identity Card */}
                    <div className="w-full lg:w-1/3 flex flex-col gap-6">
                        <div className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] p-10 shadow-2xl border border-white/40 flex flex-col items-center text-center sticky top-24">
                            <div className="relative group">
                                <div className="w-44 h-44 rounded-full overflow-hidden border-8 border-white shadow-2xl bg-gradient-to-br from-green-light to-green-medium flex items-center justify-center relative">
                                    {getProfileSrc() ? (
                                        <img
                                            src={getProfileSrc()}
                                            alt="Profile"
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            onError={(e) => { e.target.src = "https://via.placeholder.com/300" }}
                                        />
                                    ) : (
                                        <span className="text-6xl font-black text-white drop-shadow-md">
                                            {formData.name ? formData.name.charAt(0).toUpperCase() : "U"}
                                        </span>
                                    )}

                                    {/* Edit Overlay */}
                                    <label
                                        htmlFor="profile-upload"
                                        className="absolute inset-0 bg-green-dark/60 backdrop-blur-sm flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer text-white"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <span className="text-xs font-bold tracking-widest uppercase">Update Photo</span>
                                    </label>
                                </div>
                                <input id="profile-upload" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                            </div>

                            <div className="mt-8">
                                <h1 className="text-3xl font-black text-green-dark tracking-tight">{formData.name || "Set Your Name"}</h1>
                                <p className="text-green-medium font-bold text-sm tracking-widest uppercase mt-1">Premium Member</p>
                            </div>

                            <div className="w-full grid grid-cols-2 gap-4 mt-10">
                                <div className="bg-cream/50 p-4 rounded-3xl border border-green-light/20">
                                    <p className="text-[0.6rem] font-bold text-green-dark/40 uppercase tracking-widest mb-1">Orders</p>
                                    <p className="text-lg font-black text-green-dark">12</p>
                                </div>
                                <div className="bg-cream/50 p-4 rounded-3xl border border-green-light/20">
                                    <p className="text-[0.6rem] font-bold text-green-dark/40 uppercase tracking-widest mb-1">Wishlist</p>
                                    <p className="text-lg font-black text-green-dark">08</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDE: Information Form */}
                    <div className="w-full lg:w-2/3">
                        <div className="bg-white/40 backdrop-blur-md rounded-[2.5rem] p-10 lg:p-14 shadow-xl border border-white/30">
                            <div className="flex items-center gap-4 mb-12">
                                <div className="h-12 w-2 bg-green-medium rounded-full"></div>
                                <h2 className="text-3xl font-black text-green-dark tracking-tight">Personal Information</h2>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-green-dark/60 uppercase tracking-widest ml-1">Full Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="e.g. John Doe"
                                            className="w-full px-6 py-4 bg-white/80 border border-green-light/30 rounded-2xl focus:ring-4 focus:ring-green-medium/10 focus:border-green-medium outline-none transition-all text-green-dark font-medium placeholder:text-green-dark/20"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-green-dark/60 uppercase tracking-widest ml-1">Email Address</label>
                                        <input
                                            type="email"
                                            value={user?.email || ""}
                                            disabled
                                            className="w-full px-6 py-4 bg-green-dark/5 border border-green-light/10 rounded-2xl text-green-dark/40 font-medium cursor-not-allowed opacity-70"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-green-dark/60 uppercase tracking-widest ml-1">Mobile Contact</label>
                                        <input
                                            type="tel"
                                            name="mobile"
                                            value={formData.mobile}
                                            onChange={handleChange}
                                            placeholder="+91 XXXXX XXXXX"
                                            className="w-full px-6 py-4 bg-white/80 border border-green-light/30 rounded-2xl focus:ring-4 focus:ring-green-medium/10 focus:border-green-medium outline-none transition-all text-green-dark font-medium placeholder:text-green-dark/20"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-green-dark/60 uppercase tracking-widest ml-1">Your Age</label>
                                        <input
                                            type="number"
                                            name="age"
                                            value={formData.age}
                                            onChange={handleChange}
                                            placeholder="25"
                                            className="w-full px-6 py-4 bg-white/80 border border-green-light/30 rounded-2xl focus:ring-4 focus:ring-green-medium/10 focus:border-green-medium outline-none transition-all text-green-dark font-medium placeholder:text-green-dark/20"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-green-dark/60 uppercase tracking-widest ml-1">Billing & Delivery Address</label>
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        rows="4"
                                        placeholder="Floor, Building, Street Name..."
                                        className="w-full px-6 py-4 bg-white/80 border border-green-light/30 rounded-2xl focus:ring-4 focus:ring-green-medium/10 focus:border-green-medium outline-none transition-all text-green-dark font-medium placeholder:text-green-dark/20 resize-none"
                                    ></textarea>
                                </div>

                                <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-green-light/20">
                                    <p className="text-sm text-green-dark/40 italic flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                        Your data is encrypted and secure
                                    </p>

                                    <button
                                        type="submit"
                                        disabled={mutation.isPending}
                                        className="w-full md:w-auto px-12 py-5 bg-green-dark text-cream font-black rounded-2xl shadow-xl hover:bg-green-medium hover:-translate-y-1 active:translate-y-0 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group flex items-center justify-center gap-3"
                                    >
                                        {mutation.isPending ? (
                                            <><div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Saving Changes</>
                                        ) : (
                                            <><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Update Profile</>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
