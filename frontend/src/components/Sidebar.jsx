import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Activity, Server, Users, LogOut, Hexagon } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const SidebarItem = ({ to, icon: Icon, label, onClick }) => {
  return (
    <NavLink 
      to={to} 
      onClick={onClick}
      className={({ isActive }) => 
        twMerge(
          "group relative flex items-center gap-3 rounded-xl px-4 py-3 mx-3 transition-all duration-300",
          "text-text-secondary hover:text-text-primary",
          isActive ? "bg-primary/10 text-primary font-medium" : "hover:bg-card"
        )
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.div 
              layoutId="active-nav"
              className="absolute left-0 top-0 h-full w-1 rounded-r-full bg-primary"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
          <Icon className={clsx("h-5 w-5", isActive ? "text-primary glow-text" : "text-text-secondary group-hover:text-primary")} />
          <span className="tracking-wide text-sm">{label}</span>
        </>
      )}
    </NavLink>
  );
};

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <motion.div 
      initial={{ x: -260 }}
      animate={{ x: 0 }}
      className="flex w-[260px] flex-col border-r border-[#334155]/50 bg-card/80 backdrop-blur-xl z-20 shadow-2xl"
    >
      <div className="flex items-center gap-3 px-6 py-8">
        <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 text-primary">
          <Hexagon className="h-6 w-6" />
          <div className="absolute inset-0 rounded-xl border border-primary/50 glow-text mix-blend-screen"></div>
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-widest text-text-primary glow-text">DOPT</h1>
          <p className="text-[10px] uppercase tracking-[0.2em] text-primary/80">Command Center</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-2 mt-4">
        <SidebarItem to="/dashboard" icon={Activity} label="TELEMETRY" />
        <SidebarItem to="/operations" icon={Server} label="OPERATIONS" />
        
        {user && user.role === 'admin' && (
          <SidebarItem to="/admin/users" icon={Users} label="ACCESS CONTROL" />
        )}
      </nav>

      <div className="mb-6 mt-auto px-4">
        <button 
          onClick={logout} 
          className="group flex w-full items-center gap-3 rounded-xl border border-danger/20 bg-danger/5 px-4 py-3 text-danger transition-all hover:bg-danger/20 hover:border-danger/40"
        >
          <LogOut className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
          <span className="text-sm font-semibold tracking-wider">TERMINATE SESSION</span>
        </button>
      </div>
    </motion.div>
  );
};

export default Sidebar;
