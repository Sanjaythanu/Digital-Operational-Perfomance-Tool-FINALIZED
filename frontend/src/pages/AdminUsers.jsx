import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Users, Trash2, Shield, User } from 'lucide-react';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/users');
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('WARNING: Establish permanent termination of this user node?')) {
      try {
        await api.delete(`/users/${id}`);
        fetchUsers();
      } catch (error) {
        alert('Failed to terminate user node');
      }
    }
  };

  const toggleRole = async (user) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    try {
      await api.put(`/users/${user._id}/role`, { role: newRole });
      fetchUsers();
    } catch (error) {
      alert('Failed to update clearance level');
    }
  };

  return (
    <div className="relative w-full pb-12">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          <h1 className="text-3xl font-black tracking-tight text-text-primary glow-text flex items-center gap-3">
             <Users className="h-8 w-8 text-primary" /> SYSTEM USERS
          </h1>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
          <input
            placeholder="Search by Node ID or Designation..."
            className="w-full rounded-xl border border-[#334155]/50 bg-card/50 py-2.5 pl-10 pr-4 text-sm tracking-wider text-text-primary backdrop-blur-sm transition-all placeholder:text-text-secondary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative overflow-hidden rounded-2xl border border-[#334155]/50 bg-card p-1 shadow-2xl backdrop-blur-xl">
            {/* Table Header Section */}
            <div className="flex items-center justify-between border-b border-[#334155]/50 bg-background/50 px-6 py-4">
                <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-primary glow-text" />
                    <h3 className="text-sm font-bold tracking-widest text-text-primary uppercase">ACCESS CONTROL DIRECTORY</h3>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="sticky top-0 bg-background/90 text-[10px] font-bold uppercase tracking-wider text-text-secondary backdrop-blur-md">
                        <tr>
                            <th className="px-6 py-4">S.No</th>
                            <th className="px-6 py-4">Node ID</th>
                            <th className="px-6 py-4">Designation</th>
                            <th className="px-6 py-4">Comms Link</th>
                            <th className="px-6 py-4">Clearance</th>
                            <th className="px-6 py-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#334155]/30">
                        <AnimatePresence>
                            {users.filter(u =>
                                (u.name && u.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                                (u.userno && u.userno.toLowerCase().includes(searchTerm.toLowerCase()))
                            ).map((u, index) => (
                                <motion.tr 
                                    key={u._id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2, delay: index * 0.05 }}
                                    className="group transition-colors hover:bg-white/5"
                                >
                                    <td className="px-6 py-4 font-mono text-xs text-text-secondary/50">
                                        {String(index + 1).padStart(3, '0')}
                                    </td>
                                    <td className="px-6 py-4 font-mono text-xs tracking-wider text-primary/80">
                                        {u.userno || 'PENDING'}
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-text-primary group-hover:text-primary transition-colors">
                                        {u.name}
                                    </td>
                                    <td className="px-6 py-4 text-text-secondary">
                                        {u.email}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => toggleRole(u)}
                                            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                                                u.role === 'admin' 
                                                ? 'border-primary/50 bg-primary/10 text-primary shadow-[0_0_10px_rgba(99,102,241,0.2)] focus:ring-primary hover:bg-primary/20' 
                                                : 'border-[#334155] bg-card text-text-secondary hover:bg-[#334155]/50 focus:ring-[#334155]'
                                            }`}
                                            title="Toggle Clearance Level"
                                        >
                                            {u.role === 'admin' ? <Shield className="h-3 w-3" /> : <User className="h-3 w-3" />}
                                            {u.role === 'admin' ? 'OMEGA' : 'STANDARD'}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleDelete(u._id)}
                                            className="inline-flex items-center justify-center rounded-lg border border-transparent p-2 text-text-secondary transition-all hover:border-danger/30 hover:bg-danger/10 hover:text-danger focus:outline-none focus:ring-2 focus:ring-danger/50"
                                            title="Terminate Node"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminUsers;
