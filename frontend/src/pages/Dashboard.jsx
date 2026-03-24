import React, { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import TelemetryTable from '../components/TelemetryTable';
import StatCard from '../components/StatCard';
import IdentityCard from '../components/IdentityCard';
import HealthGauge from '../components/HealthGauge';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { RefreshCw, Activity, Server, Users, AlertTriangle } from 'lucide-react';

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState({
        totalOperations: 0,
        avgPerformance: "0",
        optimalStats: 0,
        criticalAlerts: 0
    });
    const [operations, setOperations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [initialLoad, setInitialLoad] = useState(true);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/analytics');
            setStats(data);
        } catch (error) {
            console.error("Failed to fetch stats", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchOperations = async () => {
        try {
            const { data } = await api.get('/operations');
            setOperations(data);
        } catch (error) {
            console.error("Failed to fetch operations", error);
        }
    };

    useEffect(() => {
        const initFetch = async () => {
            await Promise.all([fetchStats(), fetchOperations()]);
            setInitialLoad(false);
        };
        initFetch();
        const interval = setInterval(() => { fetchStats(); fetchOperations(); }, 30000);
        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (initialLoad) {
        return (
            <div className="flex h-full w-full items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent shadow-[0_0_15px_rgba(99,102,241,0.5)]"></div>
                    <p className="animate-pulse text-sm font-bold tracking-widest text-primary glow-text uppercase">Syncing Telemetry...</p>
                </div>
            </div>
        );
    }

    return (
        <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="w-full space-y-6 pb-12"
        >
            {/* Header Section */}
            <motion.div variants={itemVariants} className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-text-primary glow-text">PERSONAL HUB</h1>
                    <p className="mt-1 flex items-center gap-2 text-sm font-medium tracking-wider text-text-secondary uppercase">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse"></span>
                        Performance matrix for node: <span className="text-primary">{user?.name}</span>
                    </p>
                </div>
                <button
                    onClick={() => { fetchStats(); fetchOperations(); }}
                    disabled={loading}
                    className="group relative flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-5 py-2.5 text-sm font-bold tracking-widest text-primary transition-all hover:bg-primary/20 hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
                >
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : 'transition-transform group-hover:rotate-180'}`} />
                    {loading ? 'SYNCING...' : 'SYNC NODES'}
                </button>
            </motion.div>

            {/* Stats Grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    label="OPERATIONS"
                    value={stats.totalOperations}
                    icon={<Server className="h-6 w-6 text-[#3b82f6]" />}
                    subtext="PERSONAL QUEUE"
                    highlight="#3b82f6"
                />
                <StatCard
                    label="AVG PERFORMANCE"
                    value={`${stats.avgPerformance}%`}
                    icon={<Activity className="h-6 w-6 text-[#0ea5e9]" />}
                    subtext="REAL-TIME INDEX"
                    highlight="#0ea5e9"
                />
                <StatCard
                    label="OPTIMAL STATS"
                    value={stats.optimalStats}
                    icon={<Users className="h-6 w-6 text-[#22c55e]" />}
                    subtext="SCORE ≥ 70"
                    highlight="#22c55e"
                />
                <StatCard
                    label="CRITICAL ALERTS"
                    value={stats.criticalAlerts}
                    icon={<AlertTriangle className="h-6 w-6 text-[#ef4444]" />}
                    subtext="SCORE < 50"
                    highlight="#ef4444"
                />
            </motion.div>

            {/* Matrix & Identity Grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                
                {/* Sector Efficiency Matrix */}
                <div className="col-span-1 lg:col-span-2 relative overflow-hidden rounded-2xl border border-[#334155]/50 bg-card p-6 shadow-lg backdrop-blur-xl">
                    <div className="absolute top-0 right-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-primary/10 blur-3xl pointer-events-none"></div>
                    
                    <h3 className="mb-6 flex items-center gap-2 text-sm font-bold tracking-widest text-primary uppercase glow-text">
                        <Activity className="h-4 w-4" />
                        Sector Efficiency Matrix
                    </h3>
                    
                    <div className="h-[250px] w-full">
                        {stats.departmentStats && stats.departmentStats.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stats.departmentStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorPerf" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.2}/>
                                        </linearGradient>
                                    </defs>
                                    <XAxis 
                                        dataKey="department" 
                                        stroke="#94a3b8" 
                                        fontSize={10} 
                                        tickLine={false} 
                                        axisLine={false}
                                        tick={{ fill: '#94a3b8', fontWeight: 600 }}
                                        dy={10}
                                    />
                                    <YAxis 
                                        stroke="#94a3b8" 
                                        fontSize={10} 
                                        tickLine={false} 
                                        axisLine={false}
                                        tick={{ fill: '#334155' }}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '12px', color: '#fff', boxShadow: '0 4px 20px rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}
                                        itemStyle={{ color: '#E5E7EB', fontWeight: 700 }}
                                        cursor={{ fill: 'rgba(99, 102, 241, 0.1)' }}
                                    />
                                    <Bar dataKey="performance" fill="url(#colorPerf)" radius={[6, 6, 0, 0]} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-[#334155] bg-background/50 text-sm font-medium tracking-widest text-text-secondary uppercase">
                                No efficiency data available
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Gauge & Identity */}
                <div className="col-span-1 flex flex-col gap-6">
                    <HealthGauge value={parseFloat(stats.avgPerformance)} />
                    
                    <div className="rounded-2xl border border-[#334155]/50 bg-card p-6 shadow-lg backdrop-blur-xl">
                        <h3 className="mb-4 flex items-center gap-2 text-sm font-bold tracking-widest text-text-primary uppercase">
                            <Users className="h-4 w-4 text-primary" />
                            IDENTITY HUB
                        </h3>
                        <IdentityCard />
                    </div>
                </div>
            </motion.div>

            {/* Telemetry Table */}
            <motion.div variants={itemVariants} className="pt-2">
                <TelemetryTable operations={operations} canDelete={false} />
            </motion.div>
        </motion.div>
    );
};

export default Dashboard;
