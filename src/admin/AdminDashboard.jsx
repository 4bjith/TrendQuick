import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { FaBox, FaList, FaShoppingCart, FaChartBar, FaBars, FaTimes, FaSignOutAlt } from 'react-icons/fa';

const AdminDashboard = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleLogout = () => {
        // Implement logout logic here
        navigate('/login');
    };

    const navItems = [
        { path: '/admin/sales-analytics', label: 'Sales Analytics', icon: <FaChartBar /> },
        { path: '/admin/products', label: 'Products', icon: <FaBox /> },
        { path: '/admin/categories', label: 'Categories', icon: <FaList /> },
        { path: '/admin/orders', label: 'Orders', icon: <FaShoppingCart /> },
    ];

    return (
        <div className="flex h-screen bg-cream overflow-hidden">
            {/* Mobile Toggle Button */}
            <div className="lg:hidden fixed top-4 left-4 z-50">
                <button
                    onClick={toggleSidebar}
                    className="p-2 bg-green-dark text-cream rounded-md shadow-lg"
                >
                    {isSidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                </button>
            </div>

            {/* Sidebar Overlay for Mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed lg:static inset-y-0 left-0 z-40
                    w-64 lg:w-1/5 
                    bg-green-dark text-cream
                    transform transition-transform duration-300
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                    flex flex-col
                    shadow-xl
                `}
            >
                <div className="p-6 text-center border-b border-green-medium">
                    <h1 className="text-2xl font-bold tracking-wider">Admin Panel</h1>
                </div>

                <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsSidebarOpen(false)} // Close on mobile click
                            className={({ isActive }) => `
                                flex items-center gap-3 px-4 py-3 rounded-lg
                                transition-all duration-200
                                ${isActive
                                    ? 'bg-cream text-green-dark shadow-md font-semibold'
                                    : 'hover:bg-green-medium/50 hover:pl-6'
                                }
                            `}
                        >
                            <span className="text-xl">{item.icon}</span>
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-green-medium">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-500/20 hover:text-red-100 transition-colors"
                    >
                        <FaSignOutAlt />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 h-screen overflow-y-auto w-full relative">
                <div className="p-6 lg:p-10 pt-16 lg:pt-10">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
