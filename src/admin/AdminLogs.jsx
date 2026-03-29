import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axiosClient';
import { 
  ClipboardList, 
  Terminal, 
  ChevronLeft, 
  ChevronRight, 
  Activity, 
  Database, 
  HardDrive, 
  Fingerprint,
  RefreshCcw,
  AlertTriangle
} from 'lucide-react';

const AdminLogs = () => {
    const [page, setPage] = useState(1);

    const { data: logsData, isLoading, isError, refetch } = useQuery({
        queryKey: ['admin-logs', page],
        queryFn: async () => {
            const res = await api.get(`/admin/logs?page=${page}&limit=20`);
            return res.data;
        },
        keepPreviousData: true,
    });

    if (isLoading) return (
        <div className="flex flex-col justify-center items-center py-40 gap-6">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-dark shadow-2xl"></div>
            <p className="font-black text-green-dark/40 uppercase tracking-[0.3em] text-xs">Streaming Audit Pipeline...</p>
        </div>
    );

    if (isError) return (
        <div className="text-center py-40">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
                <AlertTriangle size={40} />
            </div>
            <h2 className="text-3xl font-black text-green-dark uppercase tracking-tight">Stream Corruption</h2>
            <p className="text-green-dark/60 font-medium font-mono uppercase text-xs tracking-widest mt-4">Failed to initialize log buffer. Memory fault or core sync error.</p>
        </div>
    );

    const logs = logsData?.logs || [];
    const totalPages = logsData?.totalPages || 1;

    const getModuleColor = (module) => {
        switch(module.toLowerCase()) {
            case 'product': return 'text-amber-500 group-hover:bg-amber-500/10';
            case 'order': return 'text-indigo-500 group-hover:bg-indigo-500/10';
            case 'user': return 'text-blue-500 group-hover:bg-blue-500/10';
            default: return 'text-zinc-500 group-hover:bg-zinc-500/10';
        }
    };

    return (
        <div className="space-y-12">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 bg-white p-10 rounded-[3rem] border border-green-light/20 shadow-2xl">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-green-dark text-white rounded-3xl flex items-center justify-center shadow-xl group hover:rotate-6 transition-all">
                        <Terminal size={28} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h2 className="text-4xl font-black text-green-dark tracking-tighter uppercase mb-2">Audit Pipeline</h2>
                        <div className="flex items-center gap-2">
                            <Activity size={12} className="text-green-500 animate-pulse" />
                            <p className="text-green-dark/30 font-black text-[0.65rem] tracking-[0.2em] uppercase leading-none">Global Event Buffer Active</p>
                        </div>
                    </div>
                </div>
                <button 
                  onClick={() => refetch()}
                  className="flex items-center gap-4 px-10 py-5 bg-white border border-green-light rounded-[2rem] font-black text-[10px] uppercase tracking-widest text-green-dark hover:bg-green-dark hover:text-white transition-all shadow-xl group active:scale-95"
                >
                    <RefreshCcw size={16} strokeWidth={4} className="group-hover:rotate-180 transition-transform duration-700" />
                    Synchronize
                </button>
            </header>

            <div className="bg-white rounded-[3.5rem] shadow-2xl border border-green-light/20 overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-full h-full bg-green-light/5 opacity-40 rounded-full blur-[100px] pointer-events-none"></div>
                
                <div className="overflow-x-auto relative min-h-[600px]">
                    <table className="w-full text-left border-collapse min-w-[1200px]">
                        <thead>
                            <tr className="bg-green-dark text-white border-b border-white/5">
                                <th className="p-10 font-black uppercase tracking-[0.2em] text-[0.6rem] border-r border-white/5">Event Mark</th>
                                <th className="p-10 font-black uppercase tracking-[0.2em] text-[0.6rem] border-r border-white/5">Sector Context</th>
                                <th className="p-10 font-black uppercase tracking-[0.2em] text-[0.6rem] border-r border-white/5 w-1/3">Detailed Flux</th>
                                <th className="p-10 font-black uppercase tracking-[0.2em] text-[0.6rem] border-r border-white/5">Origin Node</th>
                                <th className="p-10 font-black uppercase tracking-[0.2em] text-[0.6rem] text-right">Temporal Data</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-green-light/5">
                            {logs.map((log) => (
                                <tr key={log._id} className="group hover:bg-green-light/5 transition-all duration-300">
                                    <td className="p-10 border-r border-green-light/5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-4 h-4 rounded-full bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)] animate-pulse shrink-0"></div>
                                            <span className="font-mono text-[0.6rem] font-black text-green-dark/40 tracking-widest uppercase truncate max-w-[150px]">#{log._id.slice(-8)}</span>
                                        </div>
                                    </td>
                                    <td className="p-10 border-r border-green-light/5">
                                        <div className={`px-6 py-3 rounded-full border border-current flex items-center justify-center gap-3 transition-all duration-500 shadow-md ${getModuleColor(log.module)}`}>
                                            <Database size={14} strokeWidth={3} />
                                            <span className="font-black text-[0.65rem] uppercase tracking-widest">{log.module}</span>
                                        </div>
                                    </td>
                                    <td className="p-10 border-r border-green-light/5">
                                        <div className="group/detail">
                                            <p className="text-sm font-black text-green-dark uppercase tracking-tight group-hover:text-green-medium transition-colors mb-2">{log.action}</p>
                                            <div className="flex items-center gap-3 text-green-dark/20 group-hover:text-green-dark/40 transition-colors">
                                                <HardDrive size={12} strokeWidth={3} />
                                                <p className="text-[0.65rem] font-bold tracking-widest uppercase max-w-sm truncate italic">{log.details}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-10 border-r border-green-light/5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-green-light/20 flex items-center justify-center text-green-dark text-xs font-black shadow-inner border border-green-light/30">
                                                {log.userId?.name.charAt(0) || 'SYS'}
                                            </div>
                                            <div>
                                                <p className="text-[0.7rem] font-black text-green-dark tracking-tighter uppercase leading-none mb-1">{log.userId?.name || 'System Auto'}</p>
                                                <div className="flex items-center gap-2">
                                                    <Fingerprint size={10} className="text-green-dark/20" />
                                                    <span className="text-[0.55rem] font-bold text-green-dark/20 uppercase tracking-[0.2em]">{log.ip || '127.0.0.1'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-10 text-right">
                                        <p className="text-lg font-black text-green-dark tracking-tighter leading-none mb-1">{new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}</p>
                                        <p className="text-[0.6rem] font-bold text-green-dark/20 uppercase tracking-[0.2em]">{new Date(log.createdAt).toLocaleDateString([], { day: '2-digit', month: 'short' })}</p>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {logs.length === 0 && (
                        <div className="p-40 text-center flex flex-col items-center">
                            <ClipboardList size={80} className="text-green-dark/10 mb-8" />
                            <h3 className="text-2xl font-black text-green-dark/20 uppercase tracking-[0.3em]">Event Void Detected</h3>
                            <p className="text-green-dark/10 font-bold max-w-sm mt-4 italic font-mono uppercase text-xs">The audit buffer is currently empty. No system level events have been recorded in this memory sector.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Pagination Logistics */}
            <div className="flex justify-between items-center px-12 py-8 bg-green-dark rounded-[3rem] border border-white/5 shadow-2xl overflow-hidden relative group">
                <div className="absolute left-0 top-0 w-full h-full bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity blur-3xl pointer-events-none"></div>
                
                <div className="flex items-center gap-6 relative">
                  <div className="w-12 h-12 bg-white text-green-dark rounded-2xl flex items-center justify-center font-black shadow-2xl">
                    {page}
                  </div>
                  <div>
                    <p className="text-[0.7rem] font-black text-white uppercase tracking-[0.3em] leading-none mb-1">Sector Depth</p>
                    <p className="text-[0.55rem] font-bold text-white/30 uppercase tracking-[0.2em]">Validated Frame Buffer / {totalPages}</p>
                  </div>
                </div>

                <div className="flex gap-6 relative">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="group flex items-center gap-4 px-12 py-5 bg-white/5 text-white/40 border border-white/10 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] hover:bg-white hover:text-green-dark transition-all disabled:opacity-20 active:scale-95"
                    >
                        <ChevronLeft size={16} strokeWidth={4} className="group-hover:-translate-x-1 transition-transform" />
                        Previous Log
                    </button>
                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page >= totalPages}
                        className="group flex items-center gap-4 px-12 py-5 bg-white text-green-dark rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] hover:bg-green-medium hover:text-white transition-all disabled:opacity-20 shadow-2xl active:scale-95"
                    >
                        Forward Log
                        <ChevronRight size={16} strokeWidth={4} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminLogs;
