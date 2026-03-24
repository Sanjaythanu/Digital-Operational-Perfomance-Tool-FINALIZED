import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Activity, AlertTriangle, CheckCircle2 } from 'lucide-react';

const TelemetryTable = ({ operations, onDelete, canDelete }) => {
    return (
        <div className="relative overflow-hidden rounded-2xl border border-[#334155]/50 bg-card p-1 shadow-2xl backdrop-blur-xl">
            {/* Table Header Section */}
            <div className="flex items-center justify-between border-b border-[#334155]/50 bg-background/50 px-6 py-4">
                <div className="flex items-center gap-3">
                    <Activity className="h-5 w-5 text-primary glow-text" />
                    <h3 className="text-sm font-bold tracking-widest text-text-primary uppercase">OPERATIONAL TELEMETRY</h3>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-3 py-1 shadow-[0_0_10px_rgba(34,197,94,0.1)]">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-success"></span>
                    <span className="text-[10px] font-bold tracking-widest text-success">LIVE SYNC</span>
                </div>
            </div>

            <div className="overflow-x-auto">
                {operations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center space-y-3 p-12 text-center">
                        <div className="rounded-full bg-[#334155]/20 p-4">
                            <AlertTriangle className="h-8 w-8 text-text-secondary/50" />
                        </div>
                        <p className="text-sm font-medium tracking-widest text-text-secondary/70 uppercase">
                            NO OPERATIONAL NODES DETECTED
                        </p>
                    </div>
                ) : (
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="sticky top-0 bg-background/90 text-[10px] font-bold uppercase tracking-wider text-text-secondary backdrop-blur-md">
                            <tr>
                                <th className="px-6 py-4">Operation Name</th>
                                <th className="px-6 py-4">Department</th>
                                <th className="px-6 py-4">Assigned ID</th>
                                <th className="px-6 py-4 text-center">Score</th>
                                <th className="px-6 py-4">Health Status</th>
                                {canDelete && <th className="px-6 py-4 text-right">Action</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#334155]/30">
                            <AnimatePresence>
                                {operations.map((op, index) => (
                                    <motion.tr 
                                        key={String(op._id)}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.2, delay: index * 0.05 }}
                                        className="group transition-colors hover:bg-white/5"
                                    >
                                        <td className="px-6 py-4 font-semibold text-text-primary group-hover:text-primary transition-colors">
                                            {String(op.name)}
                                        </td>
                                        <td className="px-6 py-4 text-text-secondary">
                                            {String(op.department)}
                                        </td>
                                        <td className="px-6 py-4 font-mono text-xs tracking-wider text-text-secondary/70">
                                            {String(op.assignedUser)}
                                        </td>
                                        <td className="px-6 py-4 text-center font-bold text-text-primary">
                                            {String(op.performanceScore)}
                                        </td>
                                        <td className="px-6 py-4">
                                            {op.performanceScore >= 70 ? (
                                                <span className="inline-flex items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-success shadow-[0_0_10px_rgba(34,197,94,0.1)]">
                                                    <CheckCircle2 className="h-3 w-3" /> OPTIMAL
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 rounded-full border border-danger/30 bg-danger/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-danger shadow-[0_0_10px_rgba(239,68,68,0.1)]">
                                                    <AlertTriangle className="h-3 w-3" /> CRITICAL
                                                </span>
                                            )}
                                        </td>
                                        {canDelete && (
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => onDelete(op._id)}
                                                    className="inline-flex items-center justify-center rounded-lg border border-transparent p-2 text-text-secondary transition-all hover:border-danger/30 hover:bg-danger/10 hover:text-danger focus:outline-none focus:ring-2 focus:ring-danger/50"
                                                    title="Terminate Node"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </td>
                                        )}
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default TelemetryTable;
