import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axiosClient';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaSave, FaUpload } from 'react-icons/fa';
import useUserStore from '../zustand/userStore';
import { BASE_URL } from '../api/url'

const AdminUpdateProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const token = useUserStore(state => state.token)


    const [formData, setFormData] = useState({
        title: '',
        price: '',
        description: '',
        catagory: '',
        discount: 0,
        countInStock: 0,
        brand: '',
        image: null
    });
    const [previewImage, setPreviewImage] = useState(null);

    // Fetch Categories
    const { data: categories } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const res = await api.get('/catagory');
            return Array.isArray(res.data) ? res.data : [];
        }
    });



    // Fetch Product Data
    const { data: prod } = useQuery({
        queryKey: ['product', id],
        queryFn: async () => {
            const res = await api.get(`/product/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return res.data;
        },
        enabled: !!id,
        // onSuccess: (data) => {
        //     console.log(data)
        //     setFormData({
        //         title: data?.title ,
        //         price: data.price ,
        //         description: data.description ,
        //         catagory: data.catagory?._id || data.catagory || '',
        //         discount: data.discount || 0,
        //         countInStock: data.countInStock || 0,
        //         brand: data.brand || '',
        //         image: data.image
        //     });
        //     if (data.image) {
        //         setPreviewImage(data.image.startsWith('http') ? data.image : `http://localhost:3000/${data.image}`);
        //     }
        // },
        onError: () => {
            toast.error("Failed to fetch product details");
            navigate('/admin/products');
        }
    });

    useEffect(() => {
        if (prod) {
            setFormData({
                ...prod,
                catagory: prod.catagory?._id || prod.catagory || ''
            })
            if (prod?.image) {
                setPreviewImage(prod.image?.startsWith('http') ? prod.image : `${BASE_URL}/${prod.image}`);
            }
        }
    }, [prod])

    const mutation = useMutation({
        mutationFn: async (data) => {
            const formData = new FormData();

            formData.append('title', data.title);
            formData.append('price', data.price);
            formData.append('description', data.description);
            // Ensure category is sent as ID, not object
            const catId = typeof data.catagory === 'object' && data.catagory !== null
                ? data.catagory._id
                : data.catagory;
            formData.append('catagory', catId);
            formData.append('discount', data.discount || 0);
            formData.append('countInStock', data.countInStock || 0);
            formData.append('brand', data.brand);

            if (data.image instanceof File) {
                formData.append('image', data.image);
            } else if (typeof data.image === 'string' && data.image.startsWith('http')) {
                formData.append('image', data.image);
            } else if (typeof data.image === 'string' && !data.image) {
                formData.append('image', "");
            }

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                },

            };

            return await api.put(`/product/${id}`, formData, config);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-products']);
            toast.success("Product updated successfully");
            navigate('/admin/products');
        },
        onError: (err) => {
            console.error(err);
            toast.error("Failed to update product");
        }
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, image: file }));
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        mutation.mutate(formData);
    };

    if (!id) return null;



    return (
        <div className="max-w-4xl mx-auto pb-10">
            <button
                onClick={() => navigate('/admin/products')}
                className="flex items-center gap-2 text-gray-600 hover:text-green-dark mb-6 transition-colors"
            >
                <FaArrowLeft /> Back to Products
            </button>

            <div className="bg-white rounded-xl shadow-lg border border-green-light overflow-hidden">
                <div className="bg-green-dark p-6 text-cream">
                    <h2 className="text-2xl font-bold">Edit Product</h2>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Title */}
                        <div className="col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Product Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}

                                className="w-full p-3 border border-green-light rounded-lg focus:ring-2 focus:ring-green-medium outline-none"
                                placeholder="Enter product title"
                            />
                        </div>

                        {/* Price */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Price ($)</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}

                                className="w-full p-3 border border-green-light rounded-lg focus:ring-2 focus:ring-green-medium outline-none"
                                placeholder="0.00"
                            />
                        </div>

                        {/* Discount */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Discount (%)</label>
                            <input
                                type="number"
                                name="discount"
                                value={formData.discount}
                                onChange={handleChange}
                                className="w-full p-3 border border-green-light rounded-lg focus:ring-2 focus:ring-green-medium outline-none"
                                placeholder="0"
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                            <select
                                name="catagory"
                                value={formData.catagory}
                                onChange={handleChange}
                                className="w-full p-3 border border-green-light rounded-lg focus:ring-2 focus:ring-green-medium outline-none bg-white"
                            >
                                <option value="">Select Categories</option>
                                {categories?.map(cat => (
                                    <option key={cat._id} value={cat._id}>
                                        {cat.catagoryName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Stock */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Stock Count</label>
                            <input
                                type="number"
                                name="countInStock"
                                value={formData.countInStock}
                                onChange={handleChange}
                                placeholder={formData.countInStock}
                                className="w-full p-3 border border-green-light rounded-lg focus:ring-2 focus:ring-green-medium outline-none"

                            />
                        </div>

                        {/* Brand */}
                        <div className="col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Brand</label>
                            <input
                                type="text"
                                name="brand"
                                value={formData.brand}
                                onChange={handleChange}
                                className="w-full p-3 border border-green-light rounded-lg focus:ring-2 focus:ring-green-medium outline-none"
                                placeholder={formData.brand}
                            />
                        </div>

                        {/* Description */}
                        <div className="col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="4"
                                className="w-full p-3 border border-green-light rounded-lg focus:ring-2 focus:ring-green-medium outline-none"
                                placeholder={formData.description}
                            ></textarea>
                        </div>

                        {/* Image Upload */}
                        <div className="col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Product Image</label>
                            <div className="flex items-center gap-6">
                                <div className="w-32 h-32 bg-gray-100 border-2 border-dashed border-green-medium rounded-lg flex items-center justify-center overflow-hidden relative">
                                    {previewImage ? (
                                        <img src={previewImage}
                                            alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-gray-400 text-sm">No Image</span>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <label className="cursor-pointer bg-white border border-green-medium text-green-dark px-4 py-2 rounded-lg hover:bg-green-light/20 transition-colors inline-flex items-center gap-2">
                                        <FaUpload />
                                        {formData.image instanceof File ? 'Change File' : 'Choose File'}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                    </label>
                                    <p className="text-xs text-gray-500 mt-2">Recommended size: 800x800px. Max 2MB.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-green-light flex justify-end">
                        <button
                            type="submit"
                            disabled={mutation.isLoading}
                            className="bg-green-dark text-cream px-8 py-3 rounded-lg hover:bg-green-medium transition-transform transform hover:scale-105 shadow-md flex items-center gap-2 disabled:opacity-50"
                        >
                            <FaSave /> Update Product
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminUpdateProduct;
