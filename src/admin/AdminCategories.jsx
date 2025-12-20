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
        <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-3xl font-bold text-green-dark">Category Management</h2>

            {/* Create Form */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-green-light">
                <h3 className="text-lg font-semibold text-green-dark mb-4">Add New Category</h3>
                <form onSubmit={handleCreate} className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                        {/* Name Input */}
                        <div className="w-full">
                            <input
                                type="text"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                placeholder="Category Name"
                                className="w-full p-3 border border-green-light rounded-lg focus:outline-none focus:ring-2 focus:ring-green-medium"
                            />
                        </div>

                        {/* Image Upload */}
                        <div className="flex items-center gap-4">
                            <label className="flex-1 cursor-pointer bg-white border border-green-light text-green-dark px-4 py-3 rounded-lg hover:bg-green-light/20 transition-colors flex items-center justify-center gap-2 text-sm max-h-[46px]">
                                <FaUpload />
                                <span>{newImage ? newImage.name : "Choose Image"}</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileChange(e, false)}
                                    className="hidden"
                                />
                            </label>
                            {newPreview && (
                                <div className="w-12 h-12 rounded border border-green-light overflow-hidden shrink-0">
                                    <img src={newPreview} alt="Preview" className="w-full h-full object-cover" />
                                </div>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={createMutation.isLoading || !newName.trim()}
                        className="bg-green-dark text-cream px-6 py-3 rounded-lg hover:bg-green-medium transition-colors disabled:opacity-50 flex items-center gap-2 h-fit w-fit"
                    >
                        <FaPlus /> Add Category
                    </button>
                </form>
            </div>

            {/* Category List */}
            <div className="bg-white rounded-xl shadow-lg border border-green-light overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-green-light/30 text-green-dark uppercase text-sm">
                        <tr>
                            <th className="p-4 border-b border-green-light w-24">Image</th>
                            <th className="p-4 border-b border-green-light">Category Name</th>
                            <th className="p-4 border-b border-green-light w-48 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((cat) => (
                            <tr key={cat._id} className="hover:bg-green-light/10 transition-colors border-b border-green-light last:border-0">
                                {/* Image Column */}
                                <td className="p-4 align-top">
                                    {editingId === cat._id ? (
                                        <div className="space-y-2">
                                            <div className="w-16 h-16 rounded border border-green-medium overflow-hidden bg-white relative group">
                                                <img
                                                    src={editPreview || getImageUrl(existingImage)}
                                                    alt="Edit Preview"
                                                    className="w-full h-full object-cover"
                                                />
                                                <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white cursor-pointer transition-opacity">
                                                    <FaUpload size={20} />
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => handleFileChange(e, true)}
                                                        className="hidden"
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="w-16 h-16 rounded border border-green-light overflow-hidden bg-white">
                                            <img
                                                src={getImageUrl(cat.catagoryImage)}
                                                alt={cat.catagoryName}
                                                className="w-full h-full object-cover"
                                                onError={(e) => e.target.src = 'https://via.placeholder.com/48?text=Error'}
                                            />
                                        </div>
                                    )}
                                </td>

                                {/* Name Column */}
                                <td className="p-4 align-middle">
                                    {editingId === cat._id ? (
                                        <input
                                            type="text"
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                            className="w-full p-2 border border-green-medium rounded focus:outline-none focus:ring-1 focus:ring-green-medium"
                                            autoFocus
                                        />
                                    ) : (
                                        <span className="text-gray-800 font-medium text-lg">{cat.catagoryName}</span>
                                    )}
                                </td>

                                {/* Actions Column */}
                                <td className="p-4 align-middle">
                                    <div className="flex justify-center gap-3">
                                        {editingId === cat._id ? (
                                            <>
                                                <button
                                                    onClick={() => handleUpdate(cat._id)}
                                                    className="p-2 text-green-600 hover:bg-green-50 rounded bg-green-50"
                                                    title="Save"
                                                >
                                                    <FaSave size={18} />
                                                </button>
                                                <button
                                                    onClick={handleCancelEdit}
                                                    className="p-2 text-gray-500 hover:bg-gray-100 rounded bg-gray-50"
                                                    title="Cancel"
                                                >
                                                    <FaTimes size={18} />
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => handleEditStart(cat)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded hover:shadow"
                                                    title="Edit"
                                                >
                                                    <FaEdit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(cat._id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded hover:shadow"
                                                    title="Delete"
                                                >
                                                    <FaTrash size={18} />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {categories.length === 0 && (
                            <tr>
                                <td colSpan="3" className="p-6 text-center text-gray-500">
                                    No categories found. Add one above!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminCategories;
