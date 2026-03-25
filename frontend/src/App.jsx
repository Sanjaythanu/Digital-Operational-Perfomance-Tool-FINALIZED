import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Operations from './pages/Operations';
import AdminUsers from './pages/AdminUsers';
import { ThemeProvider } from './context/ThemeContext';

// Layout for authenticated pages
const DashboardLayout = () => {
    const { user, loading } = useContext(AuthContext);
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

    // Prevent background scroll when sidebar is open
    React.useEffect(() => {
        if (isSidebarOpen) {
            document.body.classList.add('sidebar-open');
        } else {
            document.body.classList.remove('sidebar-open');
        }
    }, [isSidebarOpen]);

    if (loading) return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-4">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                <p className="text-text-secondary animate-pulse tracking-widest text-sm font-semibold">INITIALIZING PROTOCOL...</p>
            </div>
        </div>
    );
    
    if (!user) return <Navigate to="/login" />;

    return (
        <div className={`flex h-screen w-full overflow-hidden bg-background text-text-primary ${isSidebarOpen ? 'sidebar-open' : ''}`}>
            {/* Mobile Overlay */}
            <div 
                className="mobile-overlay" 
                onClick={() => setIsSidebarOpen(false)}
            />
            
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            <div className="flex flex-1 flex-col overflow-hidden relative">
                {/* Subtle background glow effect */}
                <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-primary/5 blur-[120px] pointer-events-none"></div>
                
                <Topbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
                <main className="flex-1 overflow-y-auto p-6 z-10 custom-scrollbar">
                    <div className="mx-auto max-w-7xl">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

// Admin Route Wrapper
const AdminRoute = () => {
    const { user } = useContext(AuthContext);
    return user && user.role === 'admin' ? <Outlet /> : <Navigate to="/dashboard" />;
};

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <Router>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        <Route path="/" element={<DashboardLayout />}>
                            <Route index element={<Navigate to="/dashboard" />} />
                            <Route path="dashboard" element={<Dashboard />} />
                            <Route path="operations" element={<Operations />} />

                            <Route path="admin" element={<AdminRoute />}>
                                <Route path="users" element={<AdminUsers />} />
                            </Route>
                        </Route>
                    </Routes>
                </Router>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
