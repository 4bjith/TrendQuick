import React, { useState, useEffect } from 'react';
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
                        to="/admin/dashboard/product/create"
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
                    <tbody className="divide-y-0">
                        {products.length > 0 ? (
                            products.map((product) => (
                                <tr key={product._id} className="group hover:bg-white/60 transition-all duration-300 border-b border-green-light/30 last:border-0 hover:shadow-inner">
                                    <td className="p-10">
                                        <div className="flex items-center gap-8">
                                            <div className="w-24 h-24 rounded-3xl overflow-hidden bg-white shadow-2xl border-2 border-green-light/10 shrink-0 group-hover:scale-110 transition-transform duration-700 hover:rotate-2">
                                                <img
                                                    src={getImageUrl(product.image)}
                                                    alt={product.title}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => e.target.src = 'https://via.placeholder.com/150'}
                                                />
                                            </div>
                                            <div className="min-w-0 max-w-[320px]">
                                                <p className="font-black text-green-dark text-lg whitespace-normal break-words leading-tight group-hover:text-green-medium transition-colors tracking-tight">{product.title}</p>
                                                <div className="flex items-center gap-3 mt-3">
                                                    <p className="text-[0.65rem] font-black text-green-dark/20 tracking-[0.2em] uppercase bg-green-light/5 px-2.5 py-1 rounded-md">REF: #{product._id.slice(-8).toUpperCase()}</p>
                                                    {product.countInStock <= 5 && (
                                                        <span className="text-[0.6rem] font-black text-red-500 bg-red-50 px-3 py-1 rounded-lg animate-pulse uppercase tracking-widest shrink-0">Low Stock</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-10">
                                        <div className="flex flex-col gap-2">
                                            <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-light/10 text-green-dark rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border border-green-light/30 w-fit">
                                                <span className="w-2 h-2 bg-green-medium rounded-full"></span>
                                                {product.catagory?.catagoryName || 'Uncategorized'}
                                            </span>
                                            <p className="text-[0.6rem] font-bold text-green-dark/20 uppercase tracking-widest ml-1">Asset Sector</p>
                                        </div>
                                    </td>
                                    <td className="p-10">
                                        <div className="bg-green-light/5 p-4 rounded-[1.5rem] border border-green-light/10 w-fit group-hover:bg-white/80 transition-all shadow-inner">
                                            <p className="text-2xl font-black text-green-dark tracking-tighter">₹{product.price}</p>
                                            <p className="text-[0.65rem] text-green-dark/30 font-bold uppercase tracking-widest mt-1">Valuation</p>
                                        </div>
                                    </td>
                                    <td className="p-10">
                                        <div className="flex justify-center gap-5">
                                            <Link
                                                to={`/admin/dashboard/product/edit/${product._id}`}
                                                className="w-14 h-14 flex items-center justify-center bg-blue-500/10 text-blue-600 rounded-[1.25rem] hover:bg-blue-600 hover:text-white transition-all duration-500 hover:shadow-[0_10px_30px_rgba(59,130,246,0.4)] hover:-translate-y-1 active:scale-95"
                                                title="Modify Asset"
                                            >
                                                <FaEdit size={20} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(product._id)}
                                                className="w-14 h-14 flex items-center justify-center bg-red-500/10 text-red-500 rounded-[1.25rem] hover:bg-red-500 hover:text-white transition-all duration-500 hover:shadow-[0_10px_30px_rgba(239,68,68,0.4)] hover:-translate-y-1 active:scale-95"
                                                title="Purge Entry"
                                            >
                                                <FaTrash size={20} />
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
