import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Fingerprint } from 'lucide-react';

const IdentityCard = () => {
    const { user } = useContext(AuthContext);

    return (
        <motion.div 
            whileHover={{ scale: 1.02 }}
            className="relative flex items-center gap-5 rounded-2xl border border-[#334155]/50 bg-background/50 p-4 transition-all hover:bg-background shadow-inner"
        >
            <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary shadow-[0_0_20px_rgba(99,102,241,0.4)]">
                <span className="text-2xl font-black text-white glow-text">
                    {user?.name.charAt(0).toUpperCase()}
                </span>
                <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-background border hover:border-success/50 border-success/30 shadow-[0_0_8px_#22c55e]">
                    <div className="h-2.5 w-2.5 rounded-full bg-success animate-pulse"></div>
                </div>
            </div>
            
            <div className="flex flex-col overflow-hidden">
                <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="truncate text-lg font-bold tracking-widest text-text-primary">
                        {user?.name.toUpperCase()}
                    </h3>
                    <Fingerprint className="h-4 w-4 text-primary opacity-70" />
                </div>
                <p className="truncate text-xs tracking-wider text-text-secondary opacity-80 mb-2">
                    {user?.email}
                </p>
                
                <div className="mt-auto flex items-center gap-2">
                    <span className="inline-flex items-center rounded-md border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-primary">
                        {user?.role === 'admin' ? 'OMEGA CLEARANCE' : 'STANDARD CLEARANCE'}
                    </span>
                </div>
            </div>
            
            {/* Background cyber pattern hint */}
            <div className="absolute right-0 top-0 h-full w-24 overflow-hidden rounded-r-2xl opacity-[0.03] pointer-events-none">
                <div className="h-full w-full bg-[radial-gradient(circle_at_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
            </div>
        </motion.div>
    );
};

export default IdentityCard;
