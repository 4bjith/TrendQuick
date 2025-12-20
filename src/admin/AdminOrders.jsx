import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axiosClient';
import { FaTrash, FaEye, FaSearch, FaCheck } from 'react-icons/fa';
import { toast } from 'react-toastify';

const AdminOrders = () => {
    const [page, setPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const queryClient = useQueryClient();

    const { data: ordersData, isLoading, isError } = useQuery({
        queryKey: ['orders', page],
        queryFn: async () => {
            const res = await api.get(`/order?page=${page}&limit=10`);
            return res.data;
        },
        keepPreviousData: true,
        retry: false // Don't retry if it fails (likely 404 if API missing)
    });

    const updateStatusMutation = useMutation({
        mutationFn: async ({ id, status }) => {
            return await api.put(`/order/${id}/status`, { status });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['orders']);
            toast.success("Order status updated");
        },
        onError: () => {
            toast.error("Failed to update status");
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            return await api.delete(`/order/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['orders']);
            toast.success("Order deleted");
        },
        onError: () => {
            toast.error("Failed to delete order");
        }
    });

    const handleStatusUpdate = (id, newStatus) => {
        updateStatusMutation.mutate({ id, status: newStatus });
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this order?")) {
            deleteMutation.mutate(id);
        }
    };

    const orders = ordersData?.data || [];
    const totalPages = ordersData?.totalPages || 1;

    // Client-side filter
    const activeOrders = orders.filter(order => {
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
        const matchesSearch = order._id?.includes(searchTerm) || order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    if (isLoading) return <div className="p-10 text-center">Loading orders...</div>;

    // If API endpoint doesn't exist, show placeholder
    if (isError) {
        return (
            <div className="p-10 text-center text-gray-600">
                <h2 className="text-2xl font-bold mb-4">Orders Management</h2>
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 inline-block text-left">
                    <p className="font-bold text-yellow-800">Note:</p>
                    <p>The Order API endpoint was not found or failed to load.</p>
                    <p>When the backend is ready, orders will appear here.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-green-dark">Orders Management</h2>

            <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex gap-2">
                    {['all', 'pending', 'shipping', 'delivered', 'canceled'].map(status => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-4 py-2 rounded-lg capitalize ${statusFilter === status
                                    ? 'bg-green-dark text-cream'
                                    : 'bg-white text-green-dark border border-green-light hover:bg-green-light/20'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>

                <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search ID or Customer"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-green-light rounded-lg focus:outline-none focus:ring-2 focus:ring-green-medium"
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-green-light overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-green-light/30 text-green-dark uppercase text-sm">
                        <tr>
                            <th className="p-4 border-b border-green-light">Order ID</th>
                            <th className="p-4 border-b border-green-light">Customer</th>
                            <th className="p-4 border-b border-green-light">Date</th>
                            <th className="p-4 border-b border-green-light">Total</th>
                            <th className="p-4 border-b border-green-light">Status</th>
                            <th className="p-4 border-b border-green-light text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {activeOrders.map(order => (
                            <tr key={order._id} className="hover:bg-green-light/10 transition-colors border-b border-green-light">
                                <td className="p-4 font-mono text-sm">{order._id.substring(0, 8)}...</td>
                                <td className="p-4">{order.user?.name || 'Guest'}</td>
                                <td className="p-4 text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                                <td className="p-4 font-bold text-gray-800">${order.totalAmount}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                            order.status === 'canceled' ? 'bg-red-100 text-red-800' :
                                                'bg-blue-100 text-blue-800'
                                        }`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <div className="flex justify-center gap-2">
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                            className="text-xs border border-gray-300 rounded p-1"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="shipping">Shipping</option>
                                            <option value="delivered">Delivered</option>
                                            <option value="canceled">Canceled</option>
                                        </select>
                                        <button
                                            onClick={() => handleDelete(order._id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                                            title="Delete"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="p-4 flex justify-between items-center">
                <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 bg-white border border-green-medium rounded hover:bg-green-light disabled:opacity-50"
                >
                    Previous
                </button>
                <span className="text-gray-600">Page {page} of {totalPages}</span>
                <button
                    onClick={() => setPage(p => Math.max(1, p + 1))}
                    disabled={page >= totalPages}
                    className="px-4 py-2 bg-white border border-green-medium rounded hover:bg-green-light disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default AdminOrders;
