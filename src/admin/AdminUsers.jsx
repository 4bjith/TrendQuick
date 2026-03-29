import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axiosClient';
import { 
  Users, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  XCircle,
  Mail,
  Phone,
  Calendar,
  ShieldAlert
} from 'lucide-react';

const AdminUsers = () => {
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [displaySearch, setDisplaySearch] = useState('');

    const { data: usersData, isLoading, isError } = useQuery({
        queryKey: ['admin-users', page, searchTerm],
        queryFn: async () => {
            const res = await api.get(`/admin/users?page=${page}&limit=10&search=${searchTerm}`);
            return res.data;
        },
        keepPreviousData: true,
    });

    React.useEffect(() => {
        const handler = setTimeout(() => {
            setSearchTerm(displaySearch);
            setPage(1);
        }, 500);
        return () => clearTimeout(handler);
    }, [displaySearch]);

    if (isLoading) return (
        <div className="flex flex-col justify-center items-center py-40 gap-6">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-dark shadow-2xl"></div>
            <p className="font-black text-green-dark/40 uppercase tracking-[0.3em] text-xs">Synchronizing Client Nodes...</p>
        </div>
    );

    if (isError) return (
        <div className="text-center py-40">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
                <ShieldAlert size={40} />
            </div>
            <h2 className="text-2xl font-black text-green-dark uppercase tracking-tight">Security Protocol Compromised</h2>
            <p className="text-green-dark/60 font-medium font-mono">Unable to retrieve client identity stream from core server.</p>
        </div>
    );

    const users = usersData?.users || [];
    const totalPages = usersData?.totalPages || 1;
    const totalCount = usersData?.total || 0;

    return (
        <div className="space-y-12">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                <div>
                    <h2 className="text-5xl font-black text-green-dark tracking-tighter mb-4 uppercase">Client Network</h2>
                    <p className="text-green-dark/40 font-black text-xs tracking-[0.2em] uppercase ml-1">Managing {totalCount} Validated Identities</p>
                </div>
                
                <div className="relative group w-full md:w-96">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-green-dark/20 group-focus-within:text-green-dark transition-colors" size={20} strokeWidth={3} />
                    <input
                        type="text"
                        placeholder="Scan for identities..."
                        className="w-full pl-16 pr-8 py-5 bg-white border border-green-light rounded-3xl focus:ring-4 focus:ring-green-medium/10 focus:border-green-dark outline-none transition-all text-green-dark font-black tracking-tight"
                        value={displaySearch}
                        onChange={(e) => setDisplaySearch(e.target.value)}
                    />
                </div>
            </header>

            {/* Table Overhaul */}
            <div className="bg-white rounded-[3.5rem] shadow-2xl border border-green-light/20 overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-96 h-96 bg-green-light/5 rounded-full blur-3xl -mr-48 -mt-48"></div>
                
                <div className="overflow-x-auto relative">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                        <thead>
                            <tr className="bg-green-dark text-white border-b border-white/5">
                                <th className="p-10 font-black uppercase tracking-[0.2em] text-[0.65rem]">Node Descriptor</th>
                                <th className="p-10 font-black uppercase tracking-[0.2em] text-[0.65rem]">Channel Access</th>
                                <th className="p-10 font-black uppercase tracking-[0.2em] text-[0.65rem]">Security Rank</th>
                                <th className="p-10 font-black uppercase tracking-[0.2em] text-[0.65rem]">Lifecycle Start</th>
                                <th className="p-10 font-black uppercase tracking-[0.2em] text-[0.65rem] text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-green-light/5">
                            {users.map((user) => (
                                <tr key={user._id} className="group/row hover:bg-green-light/5 transition-all duration-300">
                                    <td className="p-10">
                                        <div className="flex items-center gap-6">
                                            <div className="w-16 h-16 rounded-2xl bg-green-dark text-white flex items-center justify-center font-black text-xl shadow-xl group-hover/row:scale-110 group-hover/row:rotate-3 transition-all duration-500 relative">
                                                {user.name.charAt(0)}
                                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
                                            </div>
                                            <div>
                                                <p className="font-black text-green-dark text-xl tracking-tighter uppercase">{user.name}</p>
                                                <p className="text-[0.6rem] font-bold text-green-dark/30 tracking-widest mt-1 uppercase">ID: #{user._id.slice(-8).toUpperCase()}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-10">
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3 text-green-dark/60">
                                                <Mail size={16} strokeWidth={3} className="text-green-dark/20" />
                                                <span className="text-xs font-black lowercase tracking-tight">{user.email}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-green-dark/60">
                                                <Phone size={16} strokeWidth={3} className="text-green-dark/20" />
                                                <span className="text-xs font-black tracking-widest">{user.mobile || 'Unregistered'}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-10">
                                        <div className={`inline-flex items-center gap-3 px-6 py-2 rounded-2xl border font-black text-[0.65rem] uppercase tracking-widest shadow-sm ${
                                            user.role === 'admin' 
                                            ? 'bg-amber-500/10 text-amber-600 border-amber-500/20 shadow-amber-500/10' 
                                            : 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20 shadow-indigo-500/10'
                                        }`}>
                                            <ShieldAlert size={14} strokeWidth={3} />
                                            {user.role || 'Member'}
                                        </div>
                                    </td>
                                    <td className="p-10">
                                        <div className="flex items-center gap-3 text-green-dark/40 font-black">
                                            <Calendar size={16} strokeWidth={3} />
                                            <span className="text-xs">{new Date(user.createdAt).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                        </div>
                                    </td>
                                    <td className="p-10">
                                        <div className="flex justify-center">
                                            <div className="group/status relative flex items-center justify-center w-14 h-14 bg-emerald-500/10 text-emerald-600 rounded-full hover:bg-emerald-500 hover:text-white transition-all duration-500 shadow-inner">
                                                <CheckCircle2 size={24} strokeWidth={3} />
                                                <div className="absolute -top-12 scale-0 group-hover/status:scale-100 transition-transform bg-green-dark text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap shadow-2xl pointer-events-none">Signal Active</div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                    {users.length === 0 && (
                        <div className="p-40 text-center flex flex-col items-center">
                            <Users size={80} className="text-green-dark/10 mb-8 animate-bounce" />
                            <h3 className="text-2xl font-black text-green-dark/20 uppercase tracking-[0.2em]">Null Identity Stream</h3>
                            <p className="text-green-dark/10 font-bold max-w-sm mt-4 italic font-mono uppercase text-xs">No client signatures matching the search criteria found within the memory bank.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Pagination Logic Control */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-8 px-8 py-4 bg-white rounded-3xl border border-green-light/20 shadow-xl">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-green-dark text-white rounded-xl flex items-center justify-center font-black text-xs shadow-inner">
                        {page}
                    </div>
                    <p className="text-[0.65rem] font-bold text-green-dark/30 uppercase tracking-[0.3em]">Operational Segment <span className="text-green-dark font-black">/ {totalPages}</span></p>
                </div>
                
                <div className="flex gap-4">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="group flex items-center gap-3 px-10 py-5 bg-green-light/10 text-green-dark/40 rounded-[2rem] font-black text-[10px] uppercase tracking-widest hover:bg-green-dark hover:text-white transition-all disabled:opacity-20 shadow-inner active:scale-95"
                    >
                        <ChevronLeft size={16} strokeWidth={4} className="group-hover:-translate-x-1 transition-transform" />
                        Retreat
                    </button>
                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page >= totalPages}
                        className="group flex items-center gap-3 px-10 py-5 bg-green-dark text-white rounded-[2rem] font-black text-[10px] uppercase tracking-widest hover:shadow-2xl hover:scale-[1.05] transition-all disabled:opacity-20 active:scale-95"
                    >
                        Advance
                        <ChevronRight size={16} strokeWidth={4} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminUsers;
