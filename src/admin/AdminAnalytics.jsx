import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axiosClient';
import { 
    Users, 
    Package, 
    Layers, 
    ShoppingBag, 
    TrendingUp, 
    ArrowUpRight, 
    Activity,
    DollarSign,
    Download
} from 'lucide-react';
import { 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    BarChart,
    Bar
} from 'recharts';

const AdminAnalytics = () => {
    const [timeframe, setTimeframe] = useState('6M');

    const { data: analytics, isLoading, isError } = useQuery({
        queryKey: ['admin-analytics', timeframe],
        queryFn: async () => {
            const res = await api.get(`/admin/analytics?timeframe=${timeframe}`);
            return res.data;
        }
    });

    const downloadCSV = () => {
        if (!analytics?.chartData) return;
        
        const headers = ["Month", "Revenue", "OrderCount"];
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        
        const rows = analytics.chartData.map(item => [
            monthNames[item._id - 1] || "Unk",
            item.revenue,
            item.count
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map(e => e.join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `tq_analytics_${timeframe}_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (isLoading) return (
        <div className="flex flex-col justify-center items-center py-40 gap-6">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-dark shadow-2xl"></div>
            <p className="font-black text-green-dark/40 uppercase tracking-[0.3em] text-xs">Parsing Global Metrics...</p>
        </div>
    );

    if (isError) return (
        <div className="text-center py-40">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
                <Activity size={40} />
            </div>
            <h2 className="text-2xl font-black text-green-dark uppercase tracking-tight">Telemetry Failed</h2>
            <p className="text-green-dark/60 font-medium font-mono uppercase text-xs tracking-widest mt-4">Unable to synchronize with the analytics core. Check network heartbeats.</p>
        </div>
    );

    const counts = analytics?.counts || { users: 0, products: 0, categories: 0, orders: 0, revenue: 0 };
    const chartData = analytics?.chartData || [];

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formattedChartData = chartData.map(item => ({
        name: monthNames[item._id - 1] || "Unk",
        revenue: item.revenue,
        orders: item.count
    }));

    const stats = [
        { title: "Total Revenue", value: `₹${counts.revenue.toLocaleString()}`, icon: <DollarSign />, color: "text-emerald-600", bg: "bg-emerald-500/10" },
        { title: "Network Users", value: counts.users, icon: <Users />, color: "text-blue-600", bg: "bg-blue-500/10" },
        { title: "Active Assets", value: counts.products, icon: <Package />, color: "text-amber-600", bg: "bg-amber-500/10" },
        { title: "Total Logistics", value: counts.orders, icon: <ShoppingBag />, color: "text-indigo-600", bg: "bg-indigo-500/10" },
    ];

    return (
        <div className="space-y-16">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                <div>
                    <h2 className="text-5xl font-black text-green-dark tracking-tighter mb-4 uppercase">Command Center</h2>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
                        <p className="text-green-dark/40 font-black text-xs tracking-[0.2em] uppercase">Intelligence Stream Active</p>
                    </div>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <button 
                        onClick={downloadCSV}
                        className="flex-1 md:flex-none px-6 py-4 bg-white border border-green-light rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-green-dark hover:bg-green-dark hover:text-white transition-all shadow-xl group flex items-center justify-center gap-3"
                    >
                        <Download size={14} strokeWidth={3} className="group-hover:-translate-y-1 transition-transform" />
                        Export Log (.csv)
                    </button>
                    <button className="flex-1 md:flex-none px-6 py-4 bg-green-dark text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:shadow-2xl transition-all shadow-xl">Deep Scan</button>
                </div>
            </header>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-green-light/20 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden">
                        <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-green-light/5 rounded-full blur-3xl group-hover:bg-green-medium/10 transition-all duration-500"></div>
                        <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center text-2xl mb-8 group-hover:scale-110 transition-transform duration-500 shadow-inner`}>
                            {stat.icon}
                        </div>
                        <div>
                            <p className="text-green-dark/40 text-[0.6rem] font-black uppercase tracking-[0.2em] mb-2">{stat.title}</p>
                            <div className="flex items-baseline gap-2">
                                <h3 className={`text-4xl font-black ${stat.color} tracking-tighter`}>{stat.value}</h3>
                                <div className="flex items-center text-[0.65rem] font-black text-green-500 bg-green-50 px-2 py-0.5 rounded-full">
                                    <ArrowUpRight size={12} strokeWidth={3} />
                                    12%
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
                {/* Revenue Chart */}
                <div className="xl:col-span-2 bg-white p-12 rounded-[3.5rem] shadow-2xl border border-green-light/20 flex flex-col min-h-[500px]">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8 mb-12">
                        <div>
                            <h3 className="text-xl font-black text-green-dark uppercase tracking-wider mb-1">Fiscal Trajectory</h3>
                            <p className="text-[0.65rem] font-bold text-green-dark/30 uppercase tracking-[0.2em]">Live Revenue Projection</p>
                        </div>
                        <div className="flex gap-2 p-1.5 bg-green-light/10 rounded-2xl shadow-inner">
                            {['1W', '1M', '6M', '1Y'].map(t => (
                                <button 
                                    key={t} 
                                    onClick={() => setTimeframe(t)}
                                    className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all ${t === timeframe ? 'bg-green-dark text-white shadow-lg scale-110' : 'text-green-dark/40 hover:bg-green-dark/5'}`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <div className="flex-1 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={formattedChartData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#111827" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#111827" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 800, fill: '#94a3b8'}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 800, fill: '#94a3b8'}} />
                                <Tooltip 
                                    contentStyle={{backgroundColor: '#111827', border: 'none', borderRadius: '16px', color: '#fff', padding: '12px'}}
                                    itemStyle={{fontSize: '12px', fontWeight: '900'}}
                                />
                                <Area 
                                    type="natural" 
                                    dataKey="revenue" 
                                    stroke="#111827" 
                                    strokeWidth={5} 
                                    fillOpacity={1} 
                                    fill="url(#colorRevenue)" 
                                    dot={{ r: 6, fill: '#111827', strokeWidth: 3, stroke: '#fff' }}
                                    activeDot={{ r: 10, strokeWidth: 0 }}
                                    connectNulls
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Logistic Distribution */}
                <div className="bg-green-dark p-12 rounded-[3.5rem] shadow-2xl flex flex-col text-white group overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-[100px] -mr-40 -mt-40 group-hover:bg-white/10 transition-all duration-700"></div>
                    
                    <h3 className="text-xl font-black text-white uppercase tracking-wider mb-2 relative">Logistics Node</h3>
                    <p className="text-[0.6rem] font-bold text-white/30 uppercase tracking-[0.2em] mb-12 relative text-white/40">Operational Fulfillment Stream</p>
                    
                    <div className="flex-1 w-full relative min-h-[150px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={formattedChartData}>
                                <Tooltip 
                                    cursor={{fill: 'rgba(255,255,255,0.05)'}}
                                    contentStyle={{display: 'none'}}
                                />
                                <Bar dataKey="orders" fill="rgba(255,255,255,0.2)" radius={[10, 10, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="mt-12 space-y-6 relative">
                        {[
                            { label: "Successful Link", value: "99.8%", color: "text-emerald-400" },
                            { label: "Asset Turnover", value: "x4.2", color: "text-blue-400" },
                            { label: "System Latency", value: "14ms", color: "text-amber-400" }
                        ].map((metric, i) => (
                            <div key={i} className="flex justify-between items-center border-b border-white/5 pb-4 last:border-0">
                                <span className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-white/30">{metric.label}</span>
                                <span className={`text-xl font-black ${metric.color}`}>{metric.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAnalytics;
