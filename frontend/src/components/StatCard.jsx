import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ label, value, subtext, icon, highlight }) => {
  return (
    <motion.div 
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="relative overflow-hidden rounded-2xl border border-[#334155]/50 bg-card p-6 shadow-lg backdrop-blur-xl"
      style={{ 
        boxShadow: highlight ? `0 10px 30px -10px ${highlight}30` : '0 10px 15px -3px rgba(0, 0, 0, 0.1)' 
      }}
    >
      {/* Decorative top border */}
      <div 
        className="absolute left-0 top-0 h-1 w-full"
        style={{ backgroundColor: highlight || 'var(--primary)' }}
      />
      
      {/* Background glow behind icon */}
      <div 
        className="absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-20 blur-2xl"
        style={{ backgroundColor: highlight || 'var(--primary)' }}
      />

      <div className="mb-4 flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-background/50 text-2xl border border-white/5 drop-shadow-md">
          {icon}
        </div>
        {subtext && (
          <span 
            className="rounded-lg border px-2 py-1 text-xs font-semibold tracking-wider"
            style={{
              borderColor: highlight ? `${highlight}40` : '#334155',
              color: highlight || '#94a3b8',
              backgroundColor: highlight ? `${highlight}10` : 'transparent'
            }}
          >
            {subtext}
          </span>
        )}
      </div>

      <div>
        <h3 className="text-sm font-semibold tracking-widest text-text-secondary uppercase mb-1">
          {label}
        </h3>
        <div className="flex items-baseline gap-2">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-black tracking-tight text-text-primary"
            style={{ textShadow: highlight ? `0 0 20px ${highlight}40` : 'none' }}
          >
            {value}
          </motion.span>
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;
