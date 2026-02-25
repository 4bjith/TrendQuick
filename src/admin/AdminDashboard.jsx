import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { FaBox, FaList, FaShoppingCart, FaChartBar, FaBars, FaTimes, FaSignOutAlt, FaUserShield } from 'react-icons/fa';
import useUserStore from '../zustand/userStore';
import { useAuth } from '../hooks/useAuth';

const AdminDashboard = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const clearToken = useUserStore(state => state.clearToken);
    const { user, isLoading } = useAuth();

    useEffect(() => {
        if (!isLoading && (!user || user.role !== 'admin')) {
            navigate('/');
        }
    }, [user, isLoading, navigate]);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleLogout = () => {
        clearToken();
        navigate('/login');
    };

    const navItems = [
        { path: '/admin/sales-analytics', label: 'Dashboard', icon: <FaChartBar /> },
        { path: '/admin/products', label: 'Products', icon: <FaBox /> },
        { path: '/admin/categories', label: 'Categories', icon: <FaList /> },
        { path: '/admin/orders', label: 'Orders', icon: <FaShoppingCart /> },
    ];

    if (isLoading) return <div className="h-screen w-full flex items-center justify-center bg-cream text-green-dark font-bold">Verifying Admin Access...</div>

    return (
        <div className="flex h-screen bg-cream overflow-hidden selection:bg-green-medium selection:text-white">
            {/* Mobile Toggle Button */}
            <div className="lg:hidden fixed top-6 left-6 z-50">
                <button
                    onClick={toggleSidebar}
                    className="p-3 bg-green-dark text-cream rounded-2xl shadow-2xl hover:bg-green-medium transition-all"
                >
                    {isSidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
                </button>
            </div>

            {/* Sidebar Overlay for Mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-green-dark/40 backdrop-blur-sm z-30 lg:hidden transition-all"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed lg:static inset-y-0 left-0 z-40
                    w-72 lg:w-1/4 xl:w-1/5 
                    bg-green-dark text-cream
                    transform transition-transform duration-500 ease-in-out
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                    flex flex-col
                    shadow-[10px_0_30px_rgba(0,0,0,0.1)]
                `}
            >
                {/* Sidebar Header */}
                <div className="p-8 border-b border-white/10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-green-medium p-2 rounded-xl">
                            <FaUserShield className="text-2xl text-white" />
                        </div>
                        <h1 className="text-xl font-black tracking-tight">TrendQuik</h1>
                    </div>
                    <p className="text-[0.6rem] uppercase tracking-[0.2em] font-bold text-white/40 ml-1">Admin Control Panel</p>
                </div>

                {/* Nav Items */}
                <nav className="flex-1 overflow-y-auto py-8 px-6 space-y-3">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsSidebarOpen(false)}
                            className={({ isActive }) => `
                                flex items-center gap-4 px-5 py-4 rounded-2xl
                                transition-all duration-300 group
                                ${isActive
                                    ? 'bg-cream text-green-dark shadow-xl shadow-black/10 font-black'
                                    : 'hover:bg-white/5 text-white/70 hover:text-white'
                                }
                            `}
                        >
                            {({ isActive }) => (
                                <>
                                    <span className={`text-xl transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-green-medium' : ''}`}>
                                        {item.icon}
                                    </span>
                                    <span className="text-sm font-bold tracking-wide">{item.label}</span>
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* User Info & Logout */}
                <div className="p-6 border-t border-white/10 bg-white/5 backdrop-blur-md">
                    <div className="flex items-center gap-4 mb-6 px-2">
                        <div className="w-10 h-10 rounded-full bg-green-medium flex items-center justify-center font-black text-white shadow-lg">
                            {user?.name?.charAt(0) || 'A'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-black truncate">{user?.name || 'Admin User'}</p>
                            <p className="text-[0.65rem] text-white/40 truncate font-bold uppercase tracking-wider">Super Administrator</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-3 px-5 py-4 rounded-2xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-300 font-bold group"
                    >
                        <FaSignOutAlt className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm">Logout Session</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 h-screen overflow-y-auto bg-cream relative">
                <div className="max-w-[1600px] mx-auto p-6 lg:p-12">
                    <div className="animate-fade-in">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
