import React from 'react';
import { motion } from 'framer-motion';

const HealthGauge = ({ value }) => {
  const percentage = value || 0;
  
  let statusColor = "text-danger";
  let statusGlow = "shadow-[0_0_30px_rgba(239,68,68,0.4)]";
  let bgStyle = `conic-gradient(#ef4444 ${percentage}%, transparent 0)`;
  
  if (percentage >= 70) {
    statusColor = "text-success";
    statusGlow = "shadow-[0_0_30px_rgba(34,197,94,0.4)]";
    bgStyle = `conic-gradient(#22c55e ${percentage}%, transparent 0)`;
  } else if (percentage >= 50) {
    statusColor = "text-warning";
    statusGlow = "shadow-[0_0_30px_rgba(245,158,11,0.4)]";
    bgStyle = `conic-gradient(#f59e0b ${percentage}%, transparent 0)`;
  }

  return (
    <div className="flex flex-col items-center rounded-2xl border border-[#334155]/50 bg-card p-6 shadow-lg backdrop-blur-xl transition-all hover:bg-card/90">
      <div className="relative mb-6 flex h-40 w-40 items-center justify-center">
        {/* Background Track */}
        <div className="absolute inset-0 rounded-full border-[12px] border-[#1e293b]"></div>
        
        {/* Animated Gauge */}
        <motion.div
           initial={{ rotate: -90, opacity: 0 }}
           animate={{ rotate: 0, opacity: 1 }}
           transition={{ duration: 1, type: "spring" }}
           className={`absolute inset-0 rounded-full ${statusGlow}`}
           style={{
             background: bgStyle,
             WebkitMaskImage: 'radial-gradient(transparent 55%, black 56%)',
             maskImage: 'radial-gradient(transparent 55%, black 56%)'
           }}
        />

        {/* Inner Content */}
        <div className="absolute inset-0 m-auto flex h-24 w-24 flex-col items-center justify-center rounded-full bg-background shadow-inner border border-white/5">
          <motion.span 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className={`text-3xl font-black ${statusColor} drop-shadow-md`}
          >
            {Math.round(percentage)}%
          </motion.span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">INTEGRITY</span>
        </div>
      </div>

      <div className="text-center">
        <h3 className="mb-1 flex items-center justify-center gap-2 text-sm font-bold tracking-widest text-text-primary uppercase">
          <span className={`h-2 w-2 rounded-full bg-current ${statusColor} animate-pulse`}></span>
          SYSTEM BASELINE
        </h3>
        <p className="text-xs font-medium tracking-wider text-text-secondary">
          Personal performance integrity index.
        </p>
      </div>
    </div >
  );
};

export default HealthGauge;
