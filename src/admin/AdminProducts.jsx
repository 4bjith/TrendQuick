import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../api/axiosClient';
import { FaEdit, FaTrash, FaPlus, FaSearch } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { BASE_URL } from '../api/url'

const AdminProducts = () => {
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const queryClient = useQueryClient();

    const { data: productsData, isLoading, isError } = useQuery({
        queryKey: ['admin-products', page, searchTerm],
        queryFn: async () => {
            const res = await api.get(`/product?page=${page}&limit=10&search=${searchTerm}`);
            return res.data;
        },
        keepPreviousData: true,
    });

    // Handle search with debounce effectively
    const [displaySearch, setDisplaySearch] = useState(searchTerm);
    useEffect(() => {
        const handler = setTimeout(() => {
            setSearchTerm(displaySearch);
            setPage(1);
        }, 500);
        return () => clearTimeout(handler);
    }, [displaySearch]);

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

    // Helper to get image URL (consistent with AdminCategories)
    const getImageUrl = (path) => {
        if (!path) return 'https://via.placeholder.com/80';
        return path.startsWith('http') ? path : `${BASE_URL}/${path}`;
    };

    if (isLoading) return <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-medium"></div>
    </div>;

    if (isError) return <div className="text-center py-20 text-red-500 font-bold bg-red-50 rounded-3xl border border-red-100 italic">Error loading products. Check your connection.</div>;

    return (
        <div className="space-y-10">
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8">
                <div>
                    <h2 className="text-4xl font-black text-green-dark tracking-tight mb-2">Inventory Management</h2>
                    <p className="text-green-dark/40 font-bold text-sm tracking-widest uppercase ml-1">Total Products: {productsData?.total || 0}</p>
                </div>

                <div className="flex flex-col sm:flex-row w-full xl:w-auto gap-4">
                    <div className="relative group flex-1 sm:w-80">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-green-dark/30 group-focus-within:text-green-medium transition-colors" />
                        <input
                            type="text"
                            placeholder="Search Inventory..."
                            className="w-full pl-12 pr-4 py-4 bg-white/60 backdrop-blur-md border border-green-light rounded-2xl focus:ring-4 focus:ring-green-medium/10 focus:border-green-medium outline-none transition-all text-green-dark font-medium"
                            value={displaySearch}
                            onChange={(e) => setDisplaySearch(e.target.value)}
                        />
                    </div>

                    <Link
                        to="/admin/products/create"
                        className="flex items-center justify-center gap-2 bg-green-dark text-cream px-8 py-4 rounded-2xl hover:bg-green-medium transition-all shadow-xl hover:-translate-y-1 font-black whitespace-nowrap"
                    >
                        <FaPlus /> Add Product
                    </Link>
                </div>
            </div>

            {/* Table Container */}
            <div className="bg-white/40 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/40 overflow-hidden overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                        <tr className="bg-green-dark text-cream">
                            <th className="p-8 font-black uppercase tracking-widest text-[0.65rem]">Product Details</th>
                            <th className="p-8 font-black uppercase tracking-widest text-[0.65rem]">Category</th>
                            <th className="p-8 font-black uppercase tracking-widest text-[0.65rem]">Pricing</th>
                            <th className="p-8 font-black uppercase tracking-widest text-[0.65rem] text-center">Operations</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-green-light/10">
                        {products.length > 0 ? (
                            products.map((product) => (
                                <tr key={product._id} className="group hover:bg-white/40 transition-all duration-300">
                                    <td className="p-8">
                                        <div className="flex items-center gap-6">
                                            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white shadow-lg border border-green-light/20 shrink-0 group-hover:scale-105 transition-transform duration-500">
                                                <img
                                                    src={getImageUrl(product.image)}
                                                    alt={product.title}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => e.target.src = 'https://via.placeholder.com/80'}
                                                />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-black text-green-dark text-lg truncate group-hover:text-green-medium transition-colors">{product.title}</p>
                                                <p className="text-[0.65rem] font-bold text-green-dark/30 tracking-widest uppercase mt-1">ID: #{product._id.slice(-8)}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-8">
                                        <span className="px-4 py-2 bg-green-light/20 text-green-dark rounded-full text-xs font-black uppercase tracking-widest border border-green-light/30">
                                            {product.catagory?.catagoryName || 'Uncategorized'}
                                        </span>
                                    </td>
                                    <td className="p-8">
                                        <p className="text-xl font-black text-green-dark">₹{product.price}</p>
                                        <p className="text-[0.65rem] text-green-dark/30 font-bold uppercase tracking-widest">List Price</p>
                                    </td>
                                    <td className="p-8">
                                        <div className="flex justify-center gap-4">
                                            <Link
                                                to={`/admin/products/edit/${product._id}`}
                                                className="w-12 h-12 flex items-center justify-center bg-blue-500/10 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30"
                                                title="Edit Listing"
                                            >
                                                <FaEdit size={18} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(product._id)}
                                                className="w-12 h-12 flex items-center justify-center bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all duration-300 hover:shadow-lg hover:shadow-red-500/30"
                                                title="Remove Product"
                                            >
                                                <FaTrash size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="p-20 text-center">
                                    <div className="flex flex-col items-center gap-4 opacity-30">
                                        <FaBox size={60} />
                                        <p className="font-black text-xl uppercase tracking-widest">No matching products</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Improved Pagination */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6 px-4">
                <p className="text-sm font-bold text-green-dark/40 uppercase tracking-[0.2em]">
                    Showing Page <span className="text-green-dark !opacity-100">{page}</span> of <span className="text-green-dark !opacity-100">{totalPages}</span>
                </p>

                <div className="flex gap-4">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-8 py-3 bg-white/60 backdrop-blur-md border border-green-light rounded-2xl text-green-dark font-black text-sm uppercase tracking-widest hover:bg-green-dark hover:text-cream transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-lg active:scale-95"
                    >
                        Prev
                    </button>
                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page >= totalPages}
                        className="px-8 py-3 bg-white/60 backdrop-blur-md border border-green-light rounded-2xl text-green-dark font-black text-sm uppercase tracking-widest hover:bg-green-dark hover:text-cream transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-lg active:scale-95"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminProducts;
