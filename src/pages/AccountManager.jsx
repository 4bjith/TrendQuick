import { useRef, useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../api/axiosClient";
import { toast } from "react-toastify";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useUserStore from "../zustand/userStore";
import { useNavigate } from "react-router-dom";

export default function AccountManager() {
    const token = useUserStore((state) => state.token);
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!token) {
            navigate("/login");
        }
    }, [token, navigate]);

    // Fetch user data
    const { data: user, isLoading, isError } = useQuery({
        queryKey: ["user"],
        queryFn: async () => {
            const res = await api.get("/user");
            return res.data.user;
        },
        enabled: !!token,
    });

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
        <div className="min-h-screen flex flex-col bg-cream">
            <Navbar />

            <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-10">
                <h1 className="text-3xl font-bold text-green-dark mb-8 text-center">Account Management</h1>

                <div className="bg-white/60 backdrop-blur-sm shadow-lg rounded-2xl p-8 border border-green-light">
                    <div className="flex flex-col md:flex-row gap-8">

                        {/* Profile Picture Placeholder/Preview */}
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-green-medium bg-gray-200 relative group">
                                {getProfileSrc() ? (
                                    <img
                                        src={getProfileSrc()}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                        onError={(e) => { e.target.src = "https://via.placeholder.com/150" }}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-4xl text-gray-400 font-bold">
                                        {formData.name ? formData.name.charAt(0).toUpperCase() : "U"}
                                    </div>
                                )}

                                {/* Overlay upload icon */}
                                <label htmlFor="profile-upload" className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                    <span className="text-white text-xs font-bold">Change</span>
                                </label>
                            </div>
                            <p className="text-sm text-green-dark/70">Profile Picture</p>
                            <input
                                id="profile-upload"
                                type="file"
                                name="profile"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="flex-1 space-y-6">

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Name */}
                                <div>
                                    <label className="block text-sm font-medium text-green-dark mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full p-3 bg-white border border-green-light rounded-lg focus:outline-none focus:ring-2 focus:ring-green-medium text-green-dark"
                                    />
                                </div>

                                {/* Email (Read Only usually, but let's check) - User model usually has email. We won't edit email here for simplicity unless requested */}
                                <div>
                                    <label className="block text-sm font-medium text-green-dark mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={user?.email || ""}
                                        disabled
                                        className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-500 cursor-not-allowed"
                                    />
                                </div>

                                {/* Mobile */}
                                <div>
                                    <label className="block text-sm font-medium text-green-dark mb-1">Mobile Number</label>
                                    <input
                                        type="text"
                                        name="mobile"
                                        value={formData.mobile}
                                        onChange={handleChange}
                                        className="w-full p-3 bg-white border border-green-light rounded-lg focus:outline-none focus:ring-2 focus:ring-green-medium text-green-dark"
                                    />
                                </div>

                                {/* Age */}
                                <div>
                                    <label className="block text-sm font-medium text-green-dark mb-1">Age</label>
                                    <input
                                        type="number"
                                        name="age"
                                        value={formData.age}
                                        onChange={handleChange}
                                        className="w-full p-3 bg-white border border-green-light rounded-lg focus:outline-none focus:ring-2 focus:ring-green-medium text-green-dark"
                                    />
                                </div>
                            </div>

                            {/* Profile - File Upload (Hidden in UI, handled by the circle click) - Optional: Keep a visible input if requested, but modern UX typically hides it. 
                            Let's just show a read-only text of the filename if a file is selected, or a note. 
                            */}
                            <div>
                                <label className="block text-sm font-medium text-green-dark mb-1">Profile Image</label>
                                <div className="flex items-center gap-2">
                                    <label
                                        htmlFor="profile-upload-btn"
                                        className="px-4 py-2 bg-white border border-green-light rounded-lg text-green-dark cursor-pointer hover:bg-green-light/20 transition"
                                    >
                                        Choose File
                                    </label>
                                    <span className="text-sm text-green-dark/60 truncate max-w-[200px]">
                                        {formData.profileFile ? formData.profileFile.name : "No file chosen"}
                                    </span>
                                    <input
                                        id="profile-upload-btn"
                                        type="file"
                                        name="profile"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </div>
                            </div>

                            {/* Address */}
                            <div>
                                <label className="block text-sm font-medium text-green-dark mb-1">Address</label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    rows="3"
                                    className="w-full p-3 bg-white border border-green-light rounded-lg focus:outline-none focus:ring-2 focus:ring-green-medium text-green-dark"
                                ></textarea>
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end pt-4">
                                <button
                                    type="submit"
                                    disabled={mutation.isLoading}
                                    className="px-8 py-3 bg-green-dark text-cream font-semibold rounded-lg shadow-md hover:bg-green-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {mutation.isLoading ? "Saving..." : "Save Changes"}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
