import React, { useState } from 'react';
import { Icons } from '../Icons';
import { useApp } from '../../context/AppContext';
import { ComplaintStatus } from '../../types';

export const AdminAllComplaints = () => {
    const { complaints } = useApp();
    const [statusFilter, setStatusFilter] = useState('All Status');

    const filteredComplaints = statusFilter === 'All Status' 
        ? complaints 
        : complaints.filter(c => c.status === statusFilter);

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                   <h2 className="text-2xl font-bold text-slate-900">All Complaints</h2>
                   <p className="text-slate-500">View and manage all platform complaints</p>
                </div>
                <button className="flex items-center px-4 py-2 border border-slate-200 rounded-lg bg-white text-slate-600 hover:bg-slate-50 font-medium text-sm">
                    <Icons.Download className="w-4 h-4 mr-2" /> Export
                </button>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-4">
                <div className="relative flex-1">
                    <Icons.Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <input type="text" placeholder="Search complaints..." className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-lg focus:ring-0 text-sm" />
                </div>
                <div className="relative">
                    <select 
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="appearance-none bg-slate-50 border-none rounded-lg py-2 pl-4 pr-10 text-sm font-medium text-slate-700 cursor-pointer hover:bg-slate-100 focus:ring-0"
                    >
                        <option>All Status</option>
                        <option value={ComplaintStatus.OPEN}>OPEN</option>
                        <option value={ComplaintStatus.IN_PROGRESS}>IN_PROGRESS</option>
                        <option value={ComplaintStatus.RESOLVED}>RESOLVED</option>
                        <option value={ComplaintStatus.ESCALATED}>ESCALATED</option>
                    </select>
                    <div className="absolute right-3 top-2.5 pointer-events-none text-slate-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {filteredComplaints.map(complaint => (
                    <div key={complaint.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-indigo-200 transition-colors">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                                    complaint.status === ComplaintStatus.OPEN ? 'bg-green-100 text-green-700' :
                                    complaint.status === ComplaintStatus.RESOLVED ? 'bg-purple-100 text-purple-700' :
                                    complaint.status === ComplaintStatus.ESCALATED ? 'bg-red-100 text-red-700' :
                                    'bg-blue-100 text-blue-700'
                                }`}>
                                    {complaint.status === ComplaintStatus.OPEN ? 'Published' : complaint.status.replace('_', ' ')}
                                </span>
                                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">
                                    {complaint.category}
                                </span>
                                {complaint.sentiment?.label === 'Urgent' && (
                                    <span className="px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-100 text-xs font-bold uppercase">
                                        High Priority
                                    </span>
                                )}
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-1">{complaint.title}</h3>
                            <p className="text-sm text-slate-500 line-clamp-1">{complaint.description}</p>
                            <div className="text-xs text-slate-400 mt-2 flex items-center gap-2">
                                <span>By {complaint.authorName}</span>
                                <span>•</span>
                                <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
                                <span>•</span>
                                <span>{complaint.upvotedBy.length} votes</span>
                                <span>•</span>
                                <span>{complaint.comments.length} comments</span>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <button className="flex items-center px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50">
                                <Icons.AlertCircle className="w-4 h-4 mr-2" /> View
                            </button>
                        </div>
                    </div>
                ))}
                
                {filteredComplaints.length === 0 && (
                    <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                        <p className="text-slate-500">No complaints found matching filters.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export const AdminUsers = () => {
    const { users } = useApp();
    
    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                   <h2 className="text-2xl font-bold text-slate-900">User Management</h2>
                   <p className="text-slate-500">{users.length} registered users</p>
                </div>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold shadow-lg shadow-indigo-200 flex items-center">
                    <Icons.Plus className="w-4 h-4 mr-2" /> Add User
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold tracking-wider">
                            <th className="p-4">User</th>
                            <th className="p-4">Role</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Joined</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {users.map(user => (
                            <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full border border-slate-200" />
                                        <div>
                                            <div className="font-bold text-slate-900 text-sm">{user.name}</div>
                                            <div className="text-xs text-slate-500">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                        user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                                        user.role === 'BUSINESS' ? 'bg-indigo-100 text-indigo-700' :
                                        'bg-slate-100 text-slate-700'
                                    }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <span className="flex items-center text-sm text-green-600 font-medium">
                                        <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                                        Active
                                    </span>
                                </td>
                                <td className="p-4 text-sm text-slate-500">
                                    {new Date().toLocaleDateString()} 
                                </td>
                                <td className="p-4 text-right">
                                    <button className="p-2 text-slate-400 hover:text-indigo-600 rounded-full hover:bg-indigo-50 transition-colors">
                                        <Icons.Edit className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
