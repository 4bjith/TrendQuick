import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axiosClient';
import { FaEdit, FaTrash, FaPlus, FaSave, FaTimes, FaImage, FaUpload } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { BASE_URL } from '../api/url';

const AdminCategories = () => {
    const queryClient = useQueryClient();

    // Create State
    const [newName, setNewName] = useState('');
    const [newImage, setNewImage] = useState(null); // File object
    const [newPreview, setNewPreview] = useState(null);

    // Edit State
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState('');
    const [editImage, setEditImage] = useState(null); // File object
    const [editPreview, setEditPreview] = useState(null);
    const [existingImage, setExistingImage] = useState('');

    // Fetch Categories
    const { data: categories = [], isLoading, isError } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const res = await api.get('/catagory');
            return Array.isArray(res.data) ? res.data : [];
        },
    });

    // Create Mutation
    const createMutation = useMutation({
        mutationFn: async () => {
            const formData = new FormData();
            formData.append('catagoryName', newName);
            if (newImage) {
                formData.append('image', newImage);
            }
            return await api.post('/catagory', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['categories']);
            toast.success("Category created successfully");
            setNewName('');
            setNewImage(null);
            setNewPreview(null);
        },
        onError: () => {
            toast.error("Failed to create category");
        }
    });

    // Update Mutation
    const updateMutation = useMutation({
        mutationFn: async ({ id }) => {
            const formData = new FormData();
            formData.append('catagoryName', editName);
            if (editImage) {
                formData.append('image', editImage);
            }
            return await api.put(`/catagory/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['categories']);
            toast.success("Category updated successfully");
            handleCancelEdit();
        },
        onError: () => {
            toast.error("Failed to update category");
        }
    });

    // Delete Mutation
    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            return await api.delete(`/catagory/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['categories']);
            toast.success("Category deleted successfully");
        },
        onError: () => {
            toast.error("Failed to delete category");
        }
    });

    const handleFileChange = (e, isEdit = false) => {
        const file = e.target.files[0];
        if (file) {
            const preview = URL.createObjectURL(file);
            if (isEdit) {
                setEditImage(file);
                setEditPreview(preview);
            } else {
                setNewImage(file);
                setNewPreview(preview);
            }
        }
    };

    const handleCreate = (e) => {
        e.preventDefault();
        if (!newName.trim()) return;
        createMutation.mutate();
    };

    const handleEditStart = (category) => {
        setEditingId(category._id);
        setEditName(category.catagoryName);
        setExistingImage(category.catagoryImage || '');
        setEditImage(null);
        setEditPreview(null);
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditName('');
        setEditImage(null);
        setEditPreview(null);
        setExistingImage('');
    };

    const handleUpdate = (id) => {
        if (!editName.trim()) return;
        updateMutation.mutate({ id });
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this category?")) {
            deleteMutation.mutate(id);
        }
    };

    const getImageUrl = (path) => {
        if (!path) return 'https://via.placeholder.com/48?text=No+Img';
        return path.startsWith('http') ? path : `${BASE_URL}/${path}`;
    };

    if (isLoading) return <div className="p-10 text-center">Loading categories...</div>;
    if (isError) return <div className="p-10 text-center text-red-500">Error loading categories.</div>;

    return (
        <div className="max-w-6xl mx-auto space-y-12 pb-20">
            <header>
                <h2 className="text-4xl font-black text-green-dark tracking-tight mb-2">Category Architecture</h2>
                <p className="text-green-dark/40 font-bold text-sm tracking-widest uppercase ml-1">Defining the Marketplace Structure</p>
            </header>

            {/* Create Card */}
            <div className="bg-white/60 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-2xl border border-white/40">
                <div className="flex items-center gap-4 mb-8">
                    <div className="h-8 w-2 bg-green-medium rounded-full"></div>
                    <h3 className="text-xl font-black text-green-dark uppercase tracking-wider">Initialize New Segment</h3>
                </div>

                <form onSubmit={handleCreate} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-end">
                    <div className="space-y-2 lg:col-span-1">
                        <label className="text-[0.65rem] font-bold text-green-dark/60 uppercase tracking-widest ml-1">Category Designation</label>
                        <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            placeholder="e.g. Organic Essentials"
                            className="w-full px-6 py-4 bg-white/80 border border-green-light/30 rounded-2xl focus:ring-4 focus:ring-green-medium/10 focus:border-green-medium outline-none transition-all text-green-dark font-medium placeholder:text-green-dark/20"
                        />
                    </div>

                    <div className="lg:col-span-1">
                        <label className="text-[0.65rem] font-bold text-green-dark/60 uppercase tracking-widest ml-1 block mb-2">Visual Asset</label>
                        <div className="flex items-center gap-4">
                            <label className="flex-1 cursor-pointer bg-green-dark text-cream px-6 py-4 rounded-2xl hover:bg-green-medium transition-all flex items-center justify-center gap-3 text-xs font-black uppercase tracking-widest shadow-lg">
                                <FaUpload />
                                <span>{newImage ? newImage.name : "Select Media"}</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileChange(e, false)}
                                    className="hidden"
                                />
                            </label>
                            {newPreview && (
                                <div className="w-14 h-14 rounded-2xl border-4 border-white shadow-xl overflow-hidden shrink-0 animate-bounce-subtle">
                                    <img src={newPreview} alt="Preview" className="w-full h-full object-cover" />
                                </div>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={createMutation.isPending || !newName.trim()}
                        className="lg:col-span-1 w-full bg-green-medium text-white px-8 py-4 rounded-2xl hover:bg-green-dark transition-all disabled:opacity-30 flex items-center justify-center gap-3 font-black uppercase tracking-widest shadow-xl shadow-green-medium/20 active:scale-95 h-[58px]"
                    >
                        {createMutation.isPending ? 'Processing...' : <><FaPlus /> Build Segment</>}
                    </button>
                </form>
            </div>

            {/* Grid of Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {categories.map((cat) => (
                    <div key={cat._id} className="group relative bg-white/40 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-xl border border-white/40 hover:shadow-2xl transition-all duration-500 overflow-hidden">
                        {editingId === cat._id ? (
                            <div className="space-y-6">
                                <div className="relative group/edit">
                                    <div className="w-full h-48 rounded-3xl overflow-hidden shadow-inner bg-green-dark/5">
                                        <img
                                            src={editPreview || getImageUrl(existingImage)}
                                            alt="Edit Preview"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <label className="absolute inset-0 bg-green-dark/60 backdrop-blur-sm opacity-0 group-hover/edit:opacity-100 flex flex-col items-center justify-center text-white cursor-pointer transition-all duration-300 rounded-3xl">
                                        <FaUpload size={24} className="mb-2" />
                                        <span className="text-[0.6rem] font-black uppercase tracking-widest">Swap Media</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleFileChange(e, true)}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                                <input
                                    type="text"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    className="w-full px-6 py-4 bg-white/80 border border-green-medium rounded-2xl focus:ring-4 focus:ring-green-medium/10 outline-none transition-all text-green-dark font-black text-center"
                                    autoFocus
                                />
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => handleUpdate(cat._id)}
                                        className="flex-1 py-4 bg-green-medium text-white rounded-2xl font-black uppercase tracking-widest hover:bg-green-dark transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        <FaSave /> Commit
                                    </button>
                                    <button
                                        onClick={handleCancelEdit}
                                        className="px-6 py-4 bg-red-500/10 text-red-500 rounded-2xl font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all active:scale-95"
                                    >
                                        <FaTimes />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="w-full h-48 rounded-3xl overflow-hidden mb-6 shadow-lg group-hover:scale-[1.02] transition-transform duration-700">
                                    <img
                                        src={getImageUrl(cat.catagoryImage)}
                                        alt={cat.catagoryName}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="text-center group-hover:-translate-y-1 transition-transform duration-500">
                                    <h4 className="text-2xl font-black text-green-dark tracking-tight mb-6">{cat.catagoryName}</h4>
                                    <div className="flex justify-center gap-3">
                                        <button
                                            onClick={() => handleEditStart(cat)}
                                            className="w-12 h-12 flex items-center justify-center bg-green-dark text-cream rounded-2xl hover:bg-green-medium transition-all duration-300 shadow-lg hover:-translate-y-1"
                                            title="Modify Component"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(cat._id)}
                                            className="w-12 h-12 flex items-center justify-center bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all duration-300 shadow-md hover:-translate-y-1"
                                            title="Dissolve Component"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                ))}

                {categories.length === 0 && (
                    <div className="col-span-full py-20 bg-white/20 backdrop-blur-md rounded-[2.5rem] border-2 border-dashed border-green-light flex flex-col items-center gap-4 text-green-dark/20 italic">
                        <FaImage size={60} />
                        <p className="font-black uppercase tracking-[0.2em] text-lg">Foundation Empty</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminCategories;
