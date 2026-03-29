import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import useUserStore from '../zustand/userStore';
import { useAuth } from '../hooks/useAuth';
import AdminSidebar from '../components/AdminSidebar';
import * as Dialog from '@radix-ui/react-dialog';
import { Menu, X } from 'lucide-react';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const clearToken = useUserStore(state => state.clearToken);
    const { user, isLoading } = useAuth();

    useEffect(() => {
        if (!isLoading && (!user || user.role !== 'admin')) {
            navigate('/');
        }
    }, [user, isLoading, navigate]);

    const handleLogout = () => {
        clearToken();
        navigate('/login');
    };

    if (isLoading) return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-green-dark text-white font-black uppercase tracking-[0.5em] animate-pulse">
            <div className="w-20 h-20 border-4 border-white border-t-transparent rounded-full animate-spin mb-8 shadow-2xl"></div>
            Authenticating Node...
        </div>
    );

    return (
        <div className="flex h-screen bg-green-dark overflow-hidden selection:bg-green-medium selection:text-white relative">
            {/* Desktop Sidebar */}
            <div className={`hidden lg:block h-full shrink-0 transition-all duration-500 ease-in-out ${isSidebarCollapsed ? 'w-24' : 'w-72'}`}>
                <AdminSidebar onLogout={handleLogout} isCollapsed={isSidebarCollapsed} onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
            </div>

            {/* Mobile Sidebar (Radix Dialog) */}
            <Dialog.Root open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-green-dark/80 backdrop-blur-sm z-[60] animate-fade-in" />
                    <Dialog.Content className="fixed top-0 left-0 h-screen w-80 bg-green-dark shadow-2xl z-[70] animate-slide-right">
                        <div className="p-4 flex justify-end">
                            <Dialog.Close asChild>
                                <button className="p-4 text-white hover:bg-white/5 rounded-2xl transition-all">
                                    <X size={24} />
                                </button>
                            </Dialog.Close>
                        </div>
                        <AdminSidebar onLogout={handleLogout} isCollapsed={false} />
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>

            {/* Main Content Area */}
            <main className="flex-1 h-screen overflow-y-auto bg-cream relative lg:shadow-[-50px_0_100px_rgba(0,0,0,0.2)]">
                {/* Mobile Header Bar */}
                <div className="lg:hidden p-6 flex justify-between items-center border-b border-green-light bg-white/40 backdrop-blur-md sticky top-0 z-50">
                    <h1 className="font-black text-green-dark tracking-tighter uppercase">TQ Control</h1>
                    <button 
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="p-3 bg-green-dark text-white rounded-2xl shadow-xl active:scale-95 transition-all"
                    >
                        <Menu size={20} />
                    </button>
                </div>

                <div className="max-w-[1700px] mx-auto p-8 lg:p-16">
                    <div className="animate-fade-in-up">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
