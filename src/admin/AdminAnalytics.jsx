import React from 'react';

const AdminAnalytics = () => {
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-green-dark">Sales Analytics</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { title: "Total Sales", value: "$12,345", color: "bg-blue-100 text-blue-800" },
                    { title: "Total Orders", value: "156", color: "bg-purple-100 text-purple-800" },
                    { title: "New Customers", value: "45", color: "bg-orange-100 text-orange-800" },
                    { title: "Pending Orders", value: "12", color: "bg-red-100 text-red-800" }
                ].map((stat, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-green-light">
                        <h3 className="text-gray-500 text-sm font-semibold">{stat.title}</h3>
                        <p className={`text-3xl font-bold mt-2 ${stat.color.split(' ')[1]}`}>{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-green-light min-h-[400px]">
                <h3 className="text-xl font-bold text-green-dark mb-4">Revenue Overview</h3>
                <div className="flex items-center justify-center h-64 text-gray-400">
                    chart placeholder (integrate chart.js or recharts later)
                </div>
            </div>
        </div>
    );
};

export default AdminAnalytics;
