import React, { useContext, useState, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { Bell, Moon, Sun, User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Topbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { isDark, toggleTheme } = useContext(ThemeContext);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Handle clicks outside the profile dropdown to close it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative sticky top-0 z-[100] flex h-20 items-center justify-between border-b border-[#334155]/50 bg-background/80 px-8 backdrop-blur-xl">
            <div className="flex flex-col">
                <h2 className="text-xl font-bold tracking-tight text-text-primary">
                    DIGITAL OPERATIONAL PERFORMANCE TOOL
                </h2>
                <div className="flex items-center gap-2 text-xs font-medium tracking-widest text-[#94a3b8]">
                    <span className="flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-success shadow-[0_0_8px_#22c55e]"></span>
                        SYSTEM ONLINE
                    </span>
                    <span className="text-primary/50">|</span>
                    <span className="text-primary/80">
                        {user?.role === 'admin' ? 'SYSTEM ACCESS LEVEL: OMEGA' : 'STANDARD ACCESS'}
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-6">
                <button
                    onClick={toggleTheme}
                    className="relative rounded-full p-2 text-text-secondary transition-colors hover:bg-card hover:text-primary focus:outline-none"
                    title="Toggle Theme"
                >
                    {isDark ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                </button>

                <button className="relative rounded-full p-2 text-text-secondary transition-colors hover:bg-card hover:text-primary focus:outline-none">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1.5 right-2 h-2 w-2 rounded-full bg-danger shadow-[0_0_8px_#ef4444]"></span>
                </button>

                <div className="h-8 w-px bg-[#334155]/50"></div>

                <div className="relative" ref={dropdownRef}>
                    <button 
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center gap-3 rounded-xl border border-transparent p-1 px-2 transition-colors hover:border-[#334155]/50 hover:bg-card focus:outline-none"
                    >
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/20 font-bold text-primary shadow-[0_0_12px_rgba(99,102,241,0.2)]">
                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="hidden flex-col items-start md:flex">
                            <span className="text-sm font-semibold text-text-primary">{user?.name || 'Operator'}</span>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                                {user?.role || 'Guest'}
                            </span>
                        </div>
                        <ChevronDown className={`h-4 w-4 text-text-secondary transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                        {isProfileOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                transition={{ duration: 0.15 }}
                                className="absolute right-0 top-[100%] mt-3 w-64 rounded-xl border border-[#334155]/80 bg-card p-2 shadow-[0_10px_40px_rgba(0,0,0,0.8)] backdrop-blur-2xl z-[150] origin-top-right ring-1 ring-white/5"
                            >
                                <div className="mb-2 flex flex-col px-3 py-2">
                                    <span className="text-sm font-bold text-text-primary truncate">{user?.name}</span>
                                    <span className="text-xs text-text-secondary truncate">{user?.email}</span>
                                </div>
                                <div className="h-px bg-[#334155]/50 mb-2"></div>
                                <button
                                    onClick={() => setIsProfileOpen(false)} 
                                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-text-secondary transition-colors hover:bg-primary/10 hover:text-primary focus:outline-none"
                                >
                                    <User className="h-4 w-4" /> Profile
                                </button>
                                <button 
                                    onClick={() => setIsProfileOpen(false)}
                                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-text-secondary transition-colors hover:bg-primary/10 hover:text-primary focus:outline-none"
                                >
                                    <Settings className="h-4 w-4" /> Preferences
                                </button>
                                <button 
                                    onClick={() => {
                                        setIsProfileOpen(false);
                                        logout();
                                    }}
                                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-danger transition-colors hover:bg-danger/10 mt-1 focus:outline-none focus:bg-danger/20"
                                >
                                    <LogOut className="h-4 w-4" /> Terminate Session
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default Topbar;
