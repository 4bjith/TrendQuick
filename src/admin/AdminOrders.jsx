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
        queryKey: ['orders', page, statusFilter, searchTerm],
        queryFn: async () => {
            const res = await api.get(`/orders?page=${page}&limit=10&status=${statusFilter}&search=${searchTerm}`);
            return res.data;
        },
        keepPreviousData: true,
        retry: false
    });

    const updateStatusMutation = useMutation({
        mutationFn: async ({ id, status }) => {
            return await api.put(`/orders/${id}/status`, { status });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['orders']);
            toast.success("Order status updated successfully");
        },
        onError: () => {
            toast.error("Failed to update status");
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            return await api.delete(`/orders/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['orders']);
            toast.success("Order record purged");
        },
        onError: () => {
            toast.error("Failed to delete order");
        }
    });

    const handleStatusUpdate = (id, newStatus) => {
        updateStatusMutation.mutate({ id, status: newStatus });
    };

    const handleDelete = (id) => {
        if (window.confirm("CRITICAL ACTION: Are you sure you want to permanently delete this order record?")) {
            deleteMutation.mutate(id);
        }
    };

    const orders = ordersData?.data || [];
    const totalPages = ordersData?.totalPages || 1;

    if (isLoading) return <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-medium"></div>
    </div>;

    if (isError) return (
        <div className="max-w-2xl mx-auto mt-20 p-12 bg-white/40 backdrop-blur-xl rounded-[2.5rem] border border-white/40 text-center shadow-2xl">
            <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaTrash size={30} />
            </div>
            <h2 className="text-3xl font-black text-green-dark mb-4 tracking-tight">Access Protocol Error</h2>
            <p className="text-green-dark/60 font-medium mb-8">The Order Management System is currently unreachable. Our team is working on establishing link and backend synchronization.</p>
            <button onClick={() => window.location.reload()} className="px-8 py-4 bg-green-dark text-cream rounded-2xl font-black uppercase tracking-widest hover:bg-green-medium transition-all shadow-xl">Re-establish Connection</button>
        </div>
    );

    const getStatusStyle = (status) => {
        switch (status) {
            case 'delivered': return 'bg-green-500/10 text-green-600 border-green-200';
            case 'pending': return 'bg-yellow-500/10 text-yellow-600 border-yellow-200';
            case 'shipping': return 'bg-blue-500/10 text-blue-600 border-blue-200';
            case 'canceled': return 'bg-red-500/10 text-red-600 border-red-200';
            default: return 'bg-gray-500/10 text-gray-600 border-gray-200';
        }
    };

    return (
        <div className="space-y-10">
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8">
                <div>
                    <h2 className="text-4xl font-black text-green-dark tracking-tight mb-2">Order Logistics</h2>
                    <p className="text-green-dark/40 font-bold text-sm tracking-widest uppercase ml-1">Live Processing Stream</p>
                </div>

                <div className="flex flex-col lg:flex-row w-full xl:w-auto gap-4">
                    <div className="flex bg-white/60 backdrop-blur-md p-2 rounded-2xl border border-green-light shrink-0 overflow-x-auto no-scrollbar">
                        {['all', 'pending', 'shipping', 'delivered', 'canceled'].map(status => (
                            <button
                                key={status}
                                onClick={() => { setStatusFilter(status); setPage(1); }}
                                className={`px-6 py-2 rounded-xl capitalize text-xs font-black tracking-widest transition-all whitespace-nowrap ${statusFilter === status
                                    ? 'bg-green-dark text-cream shadow-lg'
                                    : 'text-green-dark/40 hover:text-green-dark hover:bg-green-light/20'
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>

                    <div className="relative group lg:w-80">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-green-dark/30 group-focus-within:text-green-medium transition-colors" />
                        <input
                            type="text"
                            placeholder="Find ID or Client..."
                            value={searchTerm}
                            onChange={e => { setSearchTerm(e.target.value); setPage(1); }}
                            className="w-full pl-12 pr-4 py-4 bg-white/60 backdrop-blur-md border border-green-light rounded-2xl focus:ring-4 focus:ring-green-medium/10 focus:border-green-medium outline-none transition-all text-green-dark font-medium"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white/40 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/40 overflow-hidden overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-0 min-w-[1000px]">
                    <thead>
                        <tr className="bg-green-dark text-cream">
                            <th className="p-8 font-black uppercase tracking-widest text-[0.65rem] border-r border-white/10">Ref Code</th>
                            <th className="p-8 font-black uppercase tracking-widest text-[0.65rem] border-r border-white/10">Customer Profile</th>
                            <th className="p-8 font-black uppercase tracking-widest text-[0.65rem] border-r border-white/10">Temporal Data</th>
                            <th className="p-8 font-black uppercase tracking-widest text-[0.65rem] border-r border-white/10">Volume Value</th>
                            <th className="p-8 font-black uppercase tracking-widest text-[0.65rem] border-r border-white/10">Flow Status</th>
                            <th className="p-8 font-black uppercase tracking-widest text-[0.65rem] text-center">Protocol Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-green-light/10">
                        {orders.map(order => (
                            <tr key={order._id} className="group hover:bg-white/40 transition-all duration-300">
                                <td className="p-8 border-r border-green-light/5 font-mono text-[0.7rem] font-black text-green-dark/60 tracking-widest group-hover:text-green-medium transition-colors">
                                    ORD-{order._id.slice(-6).toUpperCase()}
                                </td>
                                <td className="p-8 border-r border-green-light/5">
                                    <p className="font-black text-green-dark uppercase tracking-tight">{order.userId?.name || 'Authorized Guest'}</p>
                                    <p className="text-[0.65rem] text-green-dark/30 font-bold tracking-wider mt-1">{order.email}</p>
                                </td>
                                <td className="p-8 border-r border-green-light/5">
                                    <p className="text-sm font-black text-green-dark/60">{new Date(order.createdAt).toLocaleDateString()}</p>
                                    <p className="text-[0.65rem] text-green-dark/30 font-bold uppercase tracking-widest mt-1">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                </td>
                                <td className="p-8 border-r border-green-light/5">
                                    <p className="text-lg font-black text-green-dark tracking-tighter">₹{order.TotalPrice}</p>
                                    <p className="text-[0.65rem] text-green-dark/30 font-bold uppercase tracking-widest mt-1">{order.orderedItems?.length || 0} Assets</p>
                                </td>
                                <td className="p-8 border-r border-green-light/5">
                                    <span className={`px-4 py-2 rounded-xl text-[0.65rem] font-black uppercase tracking-[0.15em] border ${getStatusStyle(order.status)} block text-center min-w-[120px]`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="p-8">
                                    <div className="flex justify-center gap-3">
                                        <div className="relative group/select">
                                            <select
                                                value={order.status}
                                                onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="shipping">Shipping</option>
                                                <option value="delivered">Delivered</option>
                                                <option value="canceled">Canceled</option>
                                            </select>
                                            <div className="w-12 h-12 flex items-center justify-center bg-green-500/10 text-green-600 rounded-2xl group-hover/select:bg-green-600 group-hover/select:text-white transition-all duration-300">
                                                <FaCheck size={16} />
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleDelete(order._id)}
                                            className="w-12 h-12 flex items-center justify-center bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all duration-300 hover:shadow-lg hover:shadow-red-500/30"
                                            title="Purge Record"
                                        >
                                            <FaTrash size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {orders.length === 0 && (
                    <div className="p-32 text-center opacity-20">
                        <FaShoppingCart size={80} className="mx-auto mb-6" />
                        <p className="font-black text-2xl uppercase tracking-[0.3em]">No Active Logistics</p>
                    </div>
                )}
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-6 px-4">
                <p className="text-sm font-bold text-green-dark/40 uppercase tracking-[0.2em]">
                    Log Segment <span className="text-green-dark !opacity-100">{page}</span> of <span className="text-green-dark !opacity-100">{totalPages}</span>
                </p>
                <div className="flex gap-4">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-10 py-4 bg-white/60 backdrop-blur-md border border-green-light rounded-2xl text-green-dark font-black text-sm uppercase tracking-widest hover:bg-green-dark hover:text-cream transition-all disabled:opacity-30 shadow-lg active:scale-95"
                    >
                        Back
                    </button>
                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page >= totalPages}
                        className="px-10 py-4 bg-white/60 backdrop-blur-md border border-green-light rounded-2xl text-green-dark font-black text-sm uppercase tracking-widest hover:bg-green-dark hover:text-cream transition-all disabled:opacity-30 shadow-lg active:scale-95"
                    >
                        Forward
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminOrders;
