import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Layers, 
  Users, 
  ClipboardList, 
  LogOut, 
  Settings,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  ShoppingBag,
  Menu
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import * as Tooltip from '@radix-ui/react-tooltip';

const AdminSidebar = ({ onLogout, isCollapsed, onToggle }) => {
  const { user } = useAuth();
  const location = useLocation();

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/admin', exact: true },
    { icon: <Package size={20} />, label: 'Products', path: '/admin/dashboard/product' },
    { icon: <Layers size={20} />, label: 'Categories', path: '/admin/dashboard/category' },
    { icon: <ShoppingBag size={20} />, label: 'Orders', path: '/admin/dashboard/order' },
    { icon: <Users size={20} />, label: 'Users', path: '/admin/dashboard/users' },
    { icon: <ClipboardList size={20} />, label: 'Audit Logs', path: '/admin/dashboard/logs' },
  ];

  return (
    <Tooltip.Provider>
      <aside className={`h-screen flex flex-col bg-green-dark border-r border-white/5 sticky top-0 overflow-y-auto no-scrollbar transition-all duration-500 ease-in-out ${isCollapsed ? 'w-24' : 'w-72'}`}>
        {/* Branding & Toggle */}
        <div className={`p-8 flex items-center justify-between transition-all duration-500 ${isCollapsed ? 'flex-col gap-8' : 'flex-row'}`}>
          <div className="flex items-center gap-4">
            <div className={`shrink-0 w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/10 shadow-inner group-hover:scale-110 transition-transform cursor-pointer`}>
              <ShieldCheck className="text-white" size={24} />
            </div>
            {!isCollapsed && (
              <div className="animate-fade-in">
                <h2 className="text-xl font-black text-white tracking-widest leading-none">TQ ADMIN</h2>
                <p className="text-[0.6rem] font-bold text-white/30 uppercase tracking-[0.3em] mt-1.5">Hyper Control</p>
              </div>
            )}
          </div>
          <button 
            onClick={onToggle}
            className="hidden lg:flex p-2 bg-white/5 hover:bg-white/10 text-white/40 hover:text-white rounded-xl transition-all shadow-xl active:scale-95"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className={`flex-1 px-4 py-4 space-y-3`}>
          {menuItems.map((item) => {
            const isActive = item.exact 
              ? location.pathname === item.path 
              : location.pathname.startsWith(item.path);

            const NavItem = (
              <NavLink
                key={item.label}
                to={item.path}
                className={`
                  group flex items-center transition-all duration-300 relative
                  ${isCollapsed ? 'justify-center p-4' : 'px-5 py-4 justify-between'}
                  rounded-2xl
                  ${isActive 
                    ? 'bg-white text-green-dark shadow-xl shadow-black/20 font-black scale-[1.02]' 
                    : 'text-white/40 hover:bg-white/5 hover:text-white/80 font-bold'
                  }
                `}
              >
                <div className="flex items-center gap-4">
                  <span className={`transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-green-dark' : 'text-inherit'}`}>
                    {item.icon}
                  </span>
                  {!isCollapsed && (
                    <span className="text-xs uppercase tracking-[0.22em] animate-fade-in whitespace-nowrap">{item.label}</span>
                  )}
                </div>
                {!isCollapsed && isActive && <ChevronRight size={14} className="opacity-40 animate-fade-in" />}
                
                {isActive && isCollapsed && (
                    <div className="absolute right-0 w-1 h-8 bg-green-dark rounded-l-full"></div>
                )}
              </NavLink>
            );

            if (isCollapsed) {
              return (
                <Tooltip.Root key={item.label} delayDuration={0}>
                  <Tooltip.Trigger asChild>
                    {NavItem}
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content 
                      side="right" 
                      sideOffset={12}
                      className="bg-white text-green-dark px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-2xl z-[100] animate-slide-right-small"
                    >
                      {item.label}
                      <Tooltip.Arrow className="fill-white" />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              );
            }

            return NavItem;
          })}
        </nav>

        {/* User Context */}
        <div className={`p-6 mt-auto transition-all duration-500 overflow-hidden ${isCollapsed ? 'opacity-0 h-0 scale-90 translate-y-10' : 'opacity-100 h-auto'}`}>
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10 shadow-2xl relative group">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="flex items-center gap-4 mb-6 relative">
              <div className="w-11 h-11 bg-white text-green-dark rounded-2xl flex items-center justify-center font-black shadow-lg">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-black text-white truncate uppercase tracking-tighter">{user?.name || 'Administrator'}</p>
                <p className="text-[0.6rem] font-bold text-white/30 uppercase tracking-[0.2em] mt-0.5">Primary Node</p>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-3 py-4 bg-red-500/10 text-red-500 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-red-500 hover:text-white transition-all shadow-inner active:scale-95 group"
            >
              <LogOut size={14} className="group-hover:-translate-x-1 transition-transform" />
              Terminate
            </button>
          </div>
        </div>
      </aside>
    </Tooltip.Provider>
  );
};

export default AdminSidebar;
