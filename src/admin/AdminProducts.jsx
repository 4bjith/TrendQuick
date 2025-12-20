import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../api/axiosClient';
import { FaEdit, FaTrash, FaPlus, FaSearch } from 'react-icons/fa';
import { toast } from 'react-toastify';

const AdminProducts = () => {
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const queryClient = useQueryClient();

    const { data: productsData, isLoading, isError } = useQuery({
        queryKey: ['admin-products', page],
        queryFn: async () => {
            const res = await api.get(`/product?page=${page}&limit=10`);
            return res.data;
        },
        keepPreviousData: true,
    });

    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            return await api.delete(`/product/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-products']);
            toast.success("Product deleted successfully");
        },
        onError: () => {
            toast.error("Failed to delete product");
        }
    });

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            deleteMutation.mutate(id);
        }
    };

    const products = productsData?.data || [];
    const totalPages = productsData?.totalPages || 1;

    // Filter by search term (client-side for now as API might not support it yet)
    const filteredProducts = products.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase())
    );


    // Helper to get image URL (consistent with AdminCategories)
    const getImageUrl = (path) => {
        if (!path) return 'https://via.placeholder.com/48';
        return path.startsWith('http') ? path : `http://localhost:3000/${path}`;
    };

    if (isLoading) return <div className="text-center py-10">Loading products...</div>;
    if (isError) return <div className="text-center py-10 text-red-500">Error loading products</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h2 className="text-3xl font-bold text-green-dark">Product Management</h2>
                <Link
                    to="/admin/products/create"
                    className="flex items-center gap-2 bg-green-dark text-cream px-4 py-2 rounded-lg hover:bg-green-medium transition-colors shadow-md"
                >
                    <FaPlus /> Add New Product
                </Link>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full pl-10 pr-4 py-2 border border-green-light rounded-lg focus:outline-none focus:ring-2 focus:ring-green-medium"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-lg border border-green-light overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-green-light/30 text-green-dark uppercase text-sm">
                            <tr>
                                <th className="p-4 border-b border-green-light">Product</th>
                                <th className="p-4 border-b border-green-light">Category</th>
                                <th className="p-4 border-b border-green-light">Price</th>
                                <th className="p-4 border-b border-green-light text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map((product) => (
                                    <tr key={product._id} className="hover:bg-green-light/10 transition-colors">
                                        <td className="p-4 border-b border-green-light flex items-center gap-4">
                                            <div className="w-12 h-12 rounded overflow-hidden bg-gray-100 border border-gray-200">
                                                <img
                                                    src={getImageUrl(product.image)}
                                                    alt={product.title}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => e.target.src = 'https://via.placeholder.com/48'}
                                                />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-800">{product.title}</p>
                                                <p className="text-xs text-gray-500">ID: {product._id}</p>
                                            </div>
                                        </td>
                                        <td className="p-4 border-b border-green-light text-gray-600">
                                            {product.catagory?.catagoryName || 'Uncategorized'}
                                        </td>
                                        <td className="p-4 border-b border-green-light font-medium text-gray-800">
                                            ${product.price}
                                        </td>
                                        <td className="p-4 border-b border-green-light">
                                            <div className="flex justify-center gap-3">
                                                <Link
                                                    to={`/admin/products/edit/${product._id}`}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                    title="Edit"
                                                >
                                                    <FaEdit />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(product._id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                                                    title="Delete"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="p-6 text-center text-gray-500">
                                        No products found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-4 flex justify-between items-center border-t border-green-light bg-gray-50">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 bg-white border border-green-medium rounded hover:bg-green-light disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>
                    <span className="text-gray-600">Page {page} of {totalPages}</span>
                    <button
                        onClick={() => setPage(p => Math.max(1, p + 1))} // logic for max page needed really but safe for now
                        disabled={page >= totalPages}
                        className="px-4 py-2 bg-white border border-green-medium rounded hover:bg-green-light disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminProducts;
