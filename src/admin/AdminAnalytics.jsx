import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axiosClient';
import { FaChartLine, FaUsers, FaShoppingCart, FaWallet } from 'react-icons/fa';

const AdminAnalytics = () => {
    const { data: analytics, isLoading, isError } = useQuery({
        queryKey: ['admin-analytics'],
        queryFn: async () => {
            const res = await api.get('/orders/analytics');
            return res.data;
        }
    });

    if (isLoading) return <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-medium"></div>
    </div>;

    if (isError) return <div className="text-center py-20 text-red-500 font-black uppercase tracking-widest italic">Signal Lost: Analytics sync failed</div>;

    const stats = analytics?.stats || [];
    const icons = [<FaWallet />, <FaShoppingCart />, <FaChartLine />, <FaUsers />];

    return (
        <div className="space-y-12">
            <header>
                <h2 className="text-4xl font-black text-green-dark tracking-tight mb-2">Operation Insights</h2>
                <p className="text-green-dark/40 font-bold text-sm tracking-widest uppercase ml-1">Real-time Performance Metrics</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white/60 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-xl border border-white/40 hover:shadow-2xl transition-all duration-500 group">
                        <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-inner group-hover:scale-110 transition-transform duration-500`}>
                            {icons[idx] || <FaChartLine />}
                        </div>
                        <h3 className="text-green-dark/40 text-[0.65rem] font-bold uppercase tracking-widest mb-1">{stat.title}</h3>
                        <p className={`text-4xl font-black ${stat.color} tracking-tighter`}>{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white/40 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-2xl border border-white/40 min-h-[500px] flex flex-col">
                    <div className="flex justify-between items-center mb-10">
                        <h3 className="text-xl font-black text-green-dark uppercase tracking-wider">Revenue Trajectory</h3>
                        <div className="px-4 py-2 bg-green-dark text-cream text-[0.6rem] font-black uppercase tracking-widest rounded-xl shadow-lg">Last 6 Months</div>
                    </div>
                    <div className="flex-1 flex items-center justify-center border-2 border-dashed border-green-light/20 rounded-[2rem] bg-green-light/5">
                        <div className="text-center space-y-4">
                            <FaChartLine size={60} className="mx-auto text-green-dark/10" />
                            <p className="text-green-dark/30 font-black uppercase tracking-[0.2em] text-sm italic">Neural visualization engine initializing...</p>
                        </div>
                    </div>
                </div>

                <div className="bg-green-dark p-10 rounded-[2.5rem] shadow-2xl flex flex-col text-cream">
                    <h3 className="text-xl font-black uppercase tracking-wider mb-8">Quick Reports</h3>
                    <div className="space-y-6 flex-1">
                        {[
                            { label: "Inventory Health", value: "94%", color: "text-green-400" },
                            { label: "Client Retention", value: "82%", color: "text-blue-400" },
                            { label: "Refetch Rate", value: "12ms", color: "text-purple-400" }
                        ].map((report, i) => (
                            <div key={i} className="bg-white/5 p-6 rounded-2xl border border-white/10">
                                <p className="text-[0.6rem] font-bold uppercase tracking-widest text-white/40 mb-1">{report.label}</p>
                                <p className={`text-2xl font-black ${report.color}`}>{report.value}</p>
                            </div>
                        ))}
                    </div>
                    <button className="mt-8 w-full py-5 bg-white text-green-dark rounded-2xl font-black uppercase tracking-widest hover:bg-green-medium hover:text-white transition-all shadow-xl active:scale-95">Generate Full PDF</button>
                </div>
            </div>
        </div>
    );
};

export default AdminAnalytics;
