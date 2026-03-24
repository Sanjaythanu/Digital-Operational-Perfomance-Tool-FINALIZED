import React, { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import TelemetryTable from '../components/TelemetryTable';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Filter, CheckCircle, X, Server } from 'lucide-react';

const Operations = () => {
  const { user } = useContext(AuthContext);
  const [operations, setOperations] = useState([]);
  const [userList, setUserList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [successMessage, setSuccessMessage] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    department: '',
    assignedUser: '',
    performanceScore: ''
  });

  const fetchOperations = async () => {
    try {
      const { data } = await api.get('/operations');
      setOperations(data);
    } catch (error) {
      console.error("Error fetching operations", error);
    }
  };

  const fetchUsers = async () => {
    if (user?.role === 'admin') {
      try {
        const { data } = await api.get('/users');
        setUserList(data);
      } catch (error) {
        console.error("Error fetching users for dropdown", error);
      }
    }
  };

  useEffect(() => {
    fetchOperations();
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleDelete = async (id) => {
    if (user?.role !== 'admin') return;

    if (window.confirm('WARNING: Are you sure you want to terminate this operation node?')) {
      try {
        await api.delete(`/operations/${id}`);
        fetchOperations();
        setSuccessMessage('OPERATION TERMINATED SUCCESSFULLY');
        setTimeout(() => setSuccessMessage(null), 3000);
      } catch (error) {
        console.error(error);
        const msg = error.response?.data?.message || 'Termination failed';
        alert(`SYSTEM ERROR: ${msg}`);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.name || !formData.department || !formData.assignedUser || !formData.performanceScore) {
        alert('MISSING PARAMETERS: Please select all fields.');
        return;
      }

      const payload = {
        ...formData,
        performanceScore: Number(formData.performanceScore)
      };

      await api.post('/operations', payload);
      setShowModal(false);
      setFormData({ name: '', department: '', assignedUser: '', performanceScore: '' });
      fetchOperations();
      setSuccessMessage('OPERATION INITIALIZED SUCCESSFULLY');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || 'Initialization Failed';
      alert(`SYSTEM ERROR: ${msg}`);
    }
  };

  return (
    <div className="relative w-full pb-12">
      <AnimatePresence>
        {successMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed right-6 top-24 z-50 flex items-center gap-3 rounded-xl border border-success/30 bg-success/10 px-6 py-4 shadow-[0_0_20px_rgba(34,197,94,0.2)] backdrop-blur-md"
          >
            <CheckCircle className="h-5 w-5 text-success" />
            <span className="text-sm font-bold tracking-widest text-success">{successMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          <h1 className="text-3xl font-black tracking-tight text-text-primary glow-text flex items-center gap-3">
             <Server className="h-8 w-8 text-primary" /> SERVER OPERATIONS
          </h1>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          {user?.role === 'admin' && (
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
              <input
                placeholder="Search operations or nodes..."
                className="w-full rounded-xl border border-[#334155]/50 bg-card/50 py-2.5 pl-10 pr-4 text-sm tracking-wider text-text-primary backdrop-blur-sm transition-all placeholder:text-text-secondary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          )}

          <div className="flex gap-3">
            <button className="flex items-center gap-2 rounded-xl border border-[#334155]/50 bg-card/50 px-4 py-2.5 text-sm font-semibold tracking-widest text-text-secondary transition-all hover:bg-card hover:text-text-primary focus:outline-none">
              <Filter className="h-4 w-4" /> FILTER
            </button>

            {user?.role === 'admin' && (
              <button
                className="group relative flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-4 py-2.5 text-sm font-bold tracking-widest text-primary transition-all hover:bg-primary/20 hover:border-primary/50 shadow-[0_0_15px_rgba(99,102,241,0.15)] focus:outline-none focus:ring-2 focus:ring-primary/50"
                onClick={() => {
                  fetchUsers();
                  setShowModal(true);
                }}
              >
                <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
                INIT OPERATION
              </button>
            )}
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <TelemetryTable
          operations={operations.filter(op =>
            (op.name && op.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (op.department && op.department.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (op.assignedUser && op.assignedUser.toLowerCase().includes(searchTerm.toLowerCase()))
          )}
          onDelete={handleDelete}
          canDelete={user?.role === 'admin'}
        />
      </motion.div>

      <AnimatePresence>
        {showModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
               className="w-full max-w-lg overflow-hidden rounded-2xl border border-primary/20 bg-card shadow-[0_0_40px_rgba(99,102,241,0.15)]"
            >
              <div className="flex items-center justify-between border-b border-[#334155]/50 bg-background/50 px-6 py-4">
                <h2 className="text-lg font-bold tracking-widest text-text-primary flex items-center gap-2">
                  <Server className="h-5 w-5 text-primary" /> INITIALIZE NODE
                </h2>
                <button 
                  onClick={() => setShowModal(false)}
                  className="rounded-lg p-1 text-text-secondary hover:bg-white/5 hover:text-text-primary transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold tracking-wider text-text-secondary uppercase">Operation Designation</label>
                    <select
                      required
                      className="w-full appearance-none rounded-xl border border-[#334155] bg-background/50 px-4 py-3 text-sm text-text-primary transition-all focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary h-[46px]"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                    >
                      <option value="" className="bg-card text-text-secondary">Select Operation...</option>
                      <option value="System Latency Optimization" className="bg-card">System Latency Optimization</option>
                      <option value="Network Stability Audit" className="bg-card">Network Stability Audit</option>
                      <option value="Data Pipeline Health Check" className="bg-card">Data Pipeline Health Check</option>
                      <option value="Security Compliance Scan" className="bg-card">Security Compliance Scan</option>
                      <option value="Infrastructure Load Balancing" className="bg-card">Infrastructure Load Balancing</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold tracking-wider text-text-secondary uppercase">Sector Assignment</label>
                    <select
                      required
                      className="w-full appearance-none rounded-xl border border-[#334155] bg-background/50 px-4 py-3 text-sm text-text-primary transition-all focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary h-[46px]"
                      value={formData.department}
                      onChange={e => setFormData({ ...formData, department: e.target.value })}
                    >
                      <option value="" className="bg-card text-text-secondary">Select Department...</option>
                      <option value="IT Operations" className="bg-card">IT Operations</option>
                      <option value="Network Engineering" className="bg-card">Network Engineering</option>
                      <option value="Cloud Infrastructure" className="bg-card">Cloud Infrastructure</option>
                      <option value="DevOps" className="bg-card">DevOps</option>
                      <option value="Cybersecurity" className="bg-card">Cybersecurity</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold tracking-wider text-text-secondary uppercase">Assigned ID (Node ID)</label>
                    <select
                      required
                      className="w-full appearance-none rounded-xl border border-[#334155] bg-background/50 px-4 py-3 text-sm text-text-primary transition-all focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary h-[46px]"
                      value={formData.assignedUser}
                      onChange={e => setFormData({ ...formData, assignedUser: e.target.value })}
                    >
                      <option value="" className="bg-card text-text-secondary">Select User Node...</option>
                      {userList.map(u => (
                        <option key={u._id} value={u.userno} className="bg-card">
                          {u.name} (UUID: {u.userno || 'PENDING'})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold tracking-wider text-text-secondary uppercase">Target Performance Score</label>
                    <select
                      required
                      className="w-full appearance-none rounded-xl border border-[#334155] bg-background/50 px-4 py-3 text-sm text-text-primary transition-all focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary h-[46px]"
                      value={formData.performanceScore}
                      onChange={e => setFormData({ ...formData, performanceScore: e.target.value })}
                    >
                      <option value="" className="bg-card text-text-secondary">Select Target Score...</option>
                      <option value="90" className="bg-card">90 (OPTIMAL)</option>
                      <option value="80" className="bg-card">80 (NOMINAL)</option>
                      <option value="70" className="bg-card">70 (ACCEPTABLE)</option>
                      <option value="60" className="bg-card">60 (WARNING)</option>
                      <option value="50" className="bg-card">50 (CRITICAL)</option>
                    </select>
                  </div>

                  <div className="mt-8 flex items-center justify-end gap-3 pt-4 border-t border-[#334155]/50">
                    <button 
                      type="button" 
                      onClick={() => setShowModal(false)}
                      className="rounded-xl border border-[#334155]/50 bg-background/50 px-5 py-2.5 text-sm font-bold tracking-widest text-text-secondary transition-all hover:bg-card hover:text-text-primary focus:outline-none"
                    >
                      ABORT
                    </button>
                    <button 
                      type="submit" 
                      className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold tracking-widest text-white transition-all hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary shadow-[0_0_15px_rgba(99,102,241,0.4)]"
                    >
                      INITIALIZE
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Operations;
