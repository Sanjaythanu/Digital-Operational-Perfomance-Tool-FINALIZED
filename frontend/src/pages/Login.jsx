import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Key, Mail, Lock, Hexagon, Activity, Cpu, Server, Eye, EyeOff } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            console.error('Login error:', err);
            setError(err.response?.data?.message || 
                   (err.request ? 'CONNECTION FAILED: Backend unreachable' : 'ACCESS DENIED: Invalid credentials'));
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen w-full bg-background text-text-primary relative overflow-hidden">
            {/* Golden Background elements */}
            <div className="absolute top-1/4 -left-1/4 h-[800px] w-[800px] rounded-full bg-[#fbbf24]/10 blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-0 h-[600px] w-[600px] rounded-full bg-[#fbbf24]/5 blur-[100px] pointer-events-none"></div>

            <div className="flex w-full z-10">
                {/* Left Side: Branding / DOPT */}
                <div className="hidden lg:flex flex-col justify-center w-1/2 p-16 relative border-r border-[#334155]/30">
                    <motion.div 
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-2xl"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="h-16 w-16 flex items-center justify-center rounded-2xl bg-[#fbbf24]/10 border border-[#fbbf24]/30 shadow-[0_0_20px_rgba(251,191,36,0.2)]">
                                <Activity className="h-8 w-8 text-[#fbbf24]" />
                            </div>
                            <div className="h-px bg-[#fbbf24]/30 flex-1 shadow-[0_0_10px_rgba(251,191,36,0.5)]"></div>
                        </div>

                        <h1 className="text-4xl xl:text-5xl font-bold tracking-widest text-[#f8fafc] drop-shadow-[0_0_15px_rgba(251,191,36,0.3)] mb-4 uppercase leading-tight">
                            Digital Operational<br/>Performance Tool
                        </h1>
                        
                        <h2 className="text-xl text-[#fbbf24] tracking-widest font-semibold mb-8">
                            COMMAND CENTER
                        </h2>

                        <p className="text-text-secondary text-lg leading-relaxed max-w-lg mb-12">
                            Advanced system monitoring and operational analytics matrix. Maintain optimal performance across all strategic nodes.
                        </p>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="glass-panel p-5 rounded-xl border border-[#fbbf24]/20 bg-card/40 hover:border-[#fbbf24]/40 transition-colors">
                                <Cpu className="h-6 w-6 text-[#fbbf24] mb-3" />
                                <h3 className="text-[#f8fafc] font-semibold tracking-wider text-sm mb-1 uppercase">Real-Time Telemetry</h3>
                                <p className="text-text-secondary text-xs">Live metric processing and subsystem diagnostics.</p>
                            </div>
                            <div className="glass-panel p-5 rounded-xl border border-[#fbbf24]/20 bg-card/40 hover:border-[#fbbf24]/40 transition-colors">
                                <Server className="h-6 w-6 text-[#fbbf24] mb-3" />
                                <h3 className="text-[#f8fafc] font-semibold tracking-wider text-sm mb-1 uppercase">Node Management</h3>
                                <p className="text-text-secondary text-xs">Secure authentication and operator clearance protocols.</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Right Side: Login Form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="w-full max-w-md z-10"
                    >
                        <div className="glass-panel p-8 md:p-10 rounded-2xl relative overflow-hidden border-t border-l border-[#f8fafc]/5 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                            
                            <div className="absolute -right-10 -top-10 text-[#fbbf24]/5">
                                <Hexagon size={150} strokeWidth={1} />
                            </div>

                            <div className="mb-8 flex flex-col items-center">
                                <div className="relative mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-card border border-[#fbbf24]/30 shadow-[0_0_15px_rgba(251,191,36,0.2)]">
                                    <Shield className="h-8 w-8 text-[#fbbf24]" />
                                </div>
                                <h2 className="text-2xl font-bold tracking-widest text-[#f8fafc]">SYSTEM ACCESS</h2>
                                <p className="mt-1 text-sm tracking-widest text-text-secondary">AUTHENTICATION REQUIRED</p>
                            </div>

                            {error && (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="mb-6 rounded-lg border border-danger/30 bg-danger/10 p-3 text-center text-sm font-semibold text-danger drop-shadow-[0_0_8px_rgba(239,68,68,0.3)]"
                                >
                                    {error}
                                </motion.div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold tracking-wider text-[#fbbf24]/80 uppercase">Operator ID</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-secondary" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full rounded-xl border border-[#334155] bg-background/50 py-3 pl-10 pr-4 text-text-primary transition-all placeholder:text-text-secondary/50 focus:border-[#fbbf24] focus:outline-none focus:ring-1 focus:ring-[#fbbf24] shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]"
                                            placeholder="Enter your email"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-semibold tracking-wider text-[#fbbf24]/80 uppercase">Passcode</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-secondary" />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full rounded-xl border border-[#334155] bg-background/50 py-3 pl-10 pr-12 text-text-primary transition-all placeholder:text-text-secondary/50 focus:border-[#fbbf24] focus:outline-none focus:ring-1 focus:ring-[#fbbf24] shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]"
                                            placeholder="••••••••"
                                            required
                                        />
                                        <button 
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-[#fbbf24] transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={isLoading}
                                    className="group relative mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#fbbf24]/20 border border-[#fbbf24]/50 py-3 font-semibold text-[#fbbf24] transition-all hover:bg-[#fbbf24]/30 hover:shadow-[0_0_20px_rgba(251,191,36,0.3)] focus:outline-none focus:ring-2 focus:ring-[#fbbf24] focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50"
                                >
                                    {isLoading ? (
                                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#fbbf24] border-t-transparent"></div>
                                    ) : (
                                        <>
                                            <Key className="h-4 w-4 transition-transform group-hover:rotate-12" />
                                            <span className="tracking-wider">INITIALIZE PROTOCOL</span>
                                        </>
                                    )}
                                </button>
                            </form>

                            <div className="mt-8 text-center text-sm font-medium text-text-secondary relative z-10">
                                New Operator?{' '}
                                <Link to="/register" className="text-[#fbbf24] hover:text-[#fbbf24]/80 hover:underline transition-colors drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]">
                                    Request Access
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Login;
