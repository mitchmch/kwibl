
import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Complaint, ComplaintStatus, UserRole, BusinessViewType, Priority, User } from '../types';
import { Icons } from '../components/Icons';
import { ComplaintDetail } from './ComplaintDetail';

export const KwibleManager = () => {
  const { currentUser, complaints, updateStatus, updateComplaint, deleteComplaint, users, addComplaint } = useApp();
  const [activeTab, setActiveTab] = useState<BusinessViewType>('BOARD');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [searchBoard, setSearchBoard] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const companyComplaints = useMemo(() => 
    complaints.filter(c => c.companyName === currentUser?.companyName),
    [complaints, currentUser]
  );

  const filteredComplaints = useMemo(() => 
    companyComplaints.filter(c => 
      c.title.toLowerCase().includes(searchBoard.toLowerCase()) ||
      c.taskKey.toLowerCase().includes(searchBoard.toLowerCase())
    ),
    [companyComplaints, searchBoard]
  );

  const businessUsers = useMemo(() => 
    users.filter(u => u.role === UserRole.BUSINESS && u.companyName === currentUser?.companyName),
    [users, currentUser]
  );

  const handleToggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBulkStatus = (status: ComplaintStatus) => {
    selectedIds.forEach(id => updateStatus(id, status));
    setSelectedIds([]);
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Delete ${selectedIds.length} tasks permanently?`)) {
      selectedIds.forEach(id => deleteComplaint(id));
      setSelectedIds([]);
    }
  };

  const handleBulkAssign = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    selectedIds.forEach(id => updateComplaint(id, { assigneeId: user.id, assigneeName: user.name }));
    setSelectedIds([]);
  };

  const PriorityIcon = ({ priority }: { priority: Priority }) => {
    switch(priority) {
      case Priority.CRITICAL: return <Icons.AlertTriangle className="w-4 h-4 text-red-600 fill-red-50" />;
      case Priority.HIGH: return <Icons.Activity className="w-4 h-4 text-orange-600" />;
      case Priority.MEDIUM: return <Icons.Activity className="w-4 h-4 text-amber-500 opacity-70" />;
      case Priority.LOW: return <Icons.Activity className="w-4 h-4 text-blue-400 opacity-50" />;
      default: return null;
    }
  };

  // --- Sub-Views ---

  const BacklogView = () => (
    <div className="flex-1 flex flex-col p-10 overflow-hidden bg-white">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Project Backlog</h2>
        <div className="flex gap-2">
           <div className="relative">
              <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Filter backlog..." 
                className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500 w-64"
              />
           </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto border border-slate-100 rounded-2xl">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-slate-50 border-b border-slate-100 z-10">
            <tr className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
              <th className="p-4 w-12 text-center">Type</th>
              <th className="p-4">Key</th>
              <th className="p-4">Summary</th>
              <th className="p-4">Assignee</th>
              <th className="p-4">Priority</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredComplaints.map(task => (
              <tr key={task.id} className="hover:bg-slate-50 transition-colors cursor-pointer group" onClick={() => setSelectedTaskId(task.id)}>
                <td className="p-4 flex justify-center items-center">
                  <div className="w-6 h-6 rounded-md bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <Icons.MessageSquare className="w-3 h-3" />
                  </div>
                </td>
                <td className="p-4 text-[11px] font-black text-slate-400 tracking-wider uppercase">{task.taskKey}</td>
                <td className="p-4">
                  <div className="text-sm font-bold text-slate-800 line-clamp-1">{task.title}</div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <img 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${task.assigneeName || 'unassigned'}`} 
                      className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200" 
                      alt="" 
                    />
                    <span className="text-xs font-medium text-slate-600">{task.assigneeName || 'Unassigned'}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <PriorityIcon priority={task.priority} />
                    <span className="text-[10px] font-black uppercase tracking-tighter text-slate-400">{task.priority}</span>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border ${
                    task.status === ComplaintStatus.RESOLVED ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                    'bg-slate-50 text-slate-500 border-slate-200'
                  }`}>
                    {task.status.replace('_', ' ')}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const ReportsView = () => (
    <div className="flex-1 flex flex-col p-10 overflow-y-auto bg-slate-50/30 custom-scrollbar">
      <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-8">Performance Analytics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { label: 'Created vs Resolved', val: `${companyComplaints.filter(c => c.status === ComplaintStatus.RESOLVED).length} / ${companyComplaints.length}`, icon: <Icons.Activity className="text-indigo-600" />, trend: 'Resolution health' },
          { label: 'Avg. Response Time', val: '< 1.4h', icon: <Icons.Clock className="text-emerald-600" />, trend: '↓ 12% this week' },
          { label: 'Customer CSAT', val: '4.8/5', icon: <Icons.Star className="text-amber-500" />, trend: 'Based on feedback' },
          { label: 'Escalation Rate', val: '2.4%', icon: <Icons.AlertTriangle className="text-red-500" />, trend: 'Requires attention' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
             <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-slate-50 rounded-2xl">{stat.icon}</div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.trend}</span>
             </div>
             <div className="text-2xl font-black text-slate-900 tracking-tight">{stat.val}</div>
             <div className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wider">{stat.label}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm h-96 flex flex-col">
          <h3 className="font-bold text-slate-900 mb-6">Resolution Trend</h3>
          <div className="flex-1 bg-slate-50 rounded-3xl border border-dashed border-slate-200 flex items-center justify-center italic text-slate-400 text-sm">
             [Dynamic Trend Visualization]
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm h-96 flex flex-col">
          <h3 className="font-bold text-slate-900 mb-6">Case Category Breakdown</h3>
          <div className="flex-1 space-y-6">
             {['Service Delay', 'Product Quality', 'Billing Dispute', 'Others'].map((cat, i) => (
               <div key={cat}>
                  <div className="flex justify-between items-center mb-1.5">
                     <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">{cat}</span>
                     <span className="text-xs font-black text-indigo-600">{[70, 45, 30, 15][i]}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                     <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${[70, 45, 30, 15][i]}%` }}></div>
                  </div>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );

  const ComponentsView = () => (
    <div className="flex-1 flex flex-col p-10 overflow-y-auto bg-white custom-scrollbar">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Platform Components</h2>
          <p className="text-sm text-slate-500 font-medium">Define sub-categories and team modules for task routing.</p>
        </div>
        <button className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200">Add Component</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { name: 'Billing & Invoicing', lead: 'Sarah Jenkins', cases: 14, color: 'bg-emerald-50 text-emerald-700' },
          { name: 'Hardware Support', lead: 'Mark Taylor', cases: 8, color: 'bg-indigo-50 text-indigo-700' },
          { name: 'Cloud Services', lead: 'Alan Turing', cases: 42, color: 'bg-purple-50 text-purple-700' },
          { name: 'Mobile App', lead: 'Ada Lovelace', cases: 5, color: 'bg-amber-50 text-amber-700' },
        ].map(comp => (
          <div key={comp.name} className="p-6 bg-white border border-slate-200 rounded-[2.5rem] shadow-sm hover:shadow-md transition-all group">
             <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-6 font-black ${comp.color}`}>
                {comp.name.charAt(0)}
             </div>
             <h4 className="text-lg font-bold text-slate-900 mb-1">{comp.name}</h4>
             <p className="text-xs text-slate-500 font-medium mb-6">Module lead: {comp.lead}</p>
             <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{comp.cases} active cases</span>
                <button className="text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"><Icons.Plus className="w-4 h-4" /></button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );

  const SettingsView = () => (
    <div className="flex-1 flex flex-col p-10 overflow-y-auto bg-slate-50/20 custom-scrollbar">
       <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-8">Business Settings</h2>
       <div className="max-w-3xl space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
             <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <Icons.User className="w-5 h-5 text-indigo-600" /> Identity
             </h3>
             <div className="space-y-6">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Public Business Name</label>
                  <input type="text" defaultValue={currentUser?.companyName} className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Service Highlight Bio</label>
                  <textarea rows={4} className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none resize-none" defaultValue={currentUser?.bio} />
                </div>
             </div>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
             <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <Icons.Bell className="w-5 h-5 text-indigo-600" /> Notification Engine
             </h3>
             <div className="space-y-4">
                {[
                  { label: 'Auto-reply on creation', val: true },
                  { label: 'Escalation alerts (Critical)', val: true },
                  { label: 'Weekly sentiment report', val: false },
                ].map(item => (
                  <div key={item.label} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                     <span className="text-sm font-bold text-slate-700">{item.label}</span>
                     <div className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-all ${item.val ? 'bg-indigo-600' : 'bg-slate-200'}`}>
                        <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-all ${item.val ? 'ml-auto' : ''}`} />
                     </div>
                  </div>
                ))}
             </div>
          </div>
          <div className="flex justify-end gap-3">
             <button className="px-8 py-3 bg-slate-100 text-slate-600 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-all">Reset Defaults</button>
             <button className="px-8 py-3 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100">Save Configuration</button>
          </div>
       </div>
    </div>
  );

  // --- Create Task Modal ---

  const CreateTaskModal = () => {
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [prio, setPrio] = useState<Priority>(Priority.MEDIUM);

    const handleCreate = async () => {
      if (!title.trim()) return;
      await addComplaint(title, desc, 'Business Internal', currentUser?.companyName || 'Unknown');
      setShowCreateModal(false);
      setTitle('');
      setDesc('');
    };

    return (
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden animate-fade-up">
           <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Create New Task</h3>
              <button onClick={() => setShowCreateModal(false)} className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-600 transition-all">
                 <Icons.Plus className="w-5 h-5 rotate-45" />
              </button>
           </div>
           <div className="p-8 space-y-6">
              <div>
                 <label className="block text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-2">Task Summary</label>
                 <input 
                   value={title}
                   onChange={e => setTitle(e.target.value)}
                   type="text" 
                   placeholder="Short, factual summary of the issue" 
                   className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all" 
                 />
              </div>
              <div>
                 <label className="block text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-2">Description</label>
                 <textarea 
                   value={desc}
                   onChange={e => setDesc(e.target.value)}
                   rows={4} 
                   placeholder="Add more details about this resolution path..." 
                   className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl font-medium text-sm outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all resize-none" 
                 />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-2">Priority</label>
                    <select 
                      value={prio}
                      onChange={e => setPrio(e.target.value as Priority)}
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all"
                    >
                       {Object.values(Priority).map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                 </div>
                 <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-2">Assignee</label>
                    <select className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all">
                       <option>Automatic (AI Routing)</option>
                       {businessUsers.map(u => <option key={u.id}>{u.name}</option>)}
                    </select>
                 </div>
              </div>
           </div>
           <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-3">
              <button onClick={() => setShowCreateModal(false)} className="flex-1 py-4 bg-white border border-slate-200 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-500 hover:bg-slate-100 transition-all">Cancel</button>
              <button onClick={handleCreate} className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all">Create Task</button>
           </div>
        </div>
      </div>
    );
  };

  const Column = ({ title, status, count }: { title: string, status: ComplaintStatus, count: number }) => (
    <div className="flex-1 min-w-[340px] bg-slate-50/50 rounded-2xl p-5 border border-slate-200/60 flex flex-col h-full shadow-sm">
      <div className="flex items-center justify-between mb-5 px-1">
        <div className="flex items-center gap-2">
          <span className={`text-[11px] font-black uppercase tracking-[0.2em] ${
            status === ComplaintStatus.OPEN ? 'text-slate-500' :
            status === ComplaintStatus.IN_PROGRESS ? 'text-indigo-600' :
            status === ComplaintStatus.RESOLVED ? 'text-emerald-600' : 'text-red-600'
          }`}>{title}</span>
          <span className="bg-slate-200/80 text-slate-600 px-2.5 py-0.5 rounded-full text-[10px] font-black">{count}</span>
        </div>
        <button className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors" onClick={() => setShowCreateModal(true)}><Icons.Plus className="w-4 h-4" /></button>
      </div>
      
      <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar pr-1">
        {filteredComplaints.filter(c => c.status === status).map(task => {
          const isSelected = selectedIds.includes(task.id);
          return (
            <div 
              key={task.id}
              onClick={() => setSelectedTaskId(task.id)}
              className={`bg-white p-5 rounded-[1.5rem] border-2 transition-all group relative ${
                isSelected ? 'border-indigo-500 shadow-lg ring-4 ring-indigo-50' : 'border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-slate-200'
              }`}
            >
              <div className="absolute top-4 left-4 z-10">
                <button 
                  onClick={(e) => handleToggleSelect(task.id, e)}
                  className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${
                    isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-200 opacity-0 group-hover:opacity-100'
                  }`}
                >
                  {isSelected && <Icons.CheckCircle className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="flex justify-between items-start mb-3 pl-7">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{task.taskKey}</span>
                  <p className="text-sm font-bold text-slate-800 leading-snug line-clamp-2">
                    {task.title}
                  </p>
                </div>
                <div className="relative group/prio">
                  <div className="p-1 rounded hover:bg-slate-50 cursor-pointer transition-colors">
                    <PriorityIcon priority={task.priority} />
                  </div>
                  <div className="absolute right-0 top-full mt-1 hidden group-hover/prio:block bg-white border border-slate-200 rounded-xl shadow-xl z-[70] p-1 w-32 animate-fade-in">
                    {Object.values(Priority).map(p => (
                      <button 
                        key={p}
                        onClick={(e) => { e.stopPropagation(); updateComplaint(task.id, { priority: p }); }}
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-colors ${task.priority === p ? 'text-indigo-600' : 'text-slate-500'}`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-50">
                <div className="flex items-center gap-2">
                  <div className="relative group/status">
                    <button 
                      onClick={(e) => e.stopPropagation()}
                      className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all ${
                        task.status === ComplaintStatus.OPEN ? 'bg-slate-50 border-slate-200 text-slate-500' :
                        task.status === ComplaintStatus.IN_PROGRESS ? 'bg-indigo-50 border-indigo-200 text-indigo-600' :
                        task.status === ComplaintStatus.RESOLVED ? 'bg-emerald-50 border-emerald-200 text-emerald-600' :
                        'bg-red-50 border-red-200 text-red-600'
                      }`}
                    >
                      {task.status.replace('_', ' ')}
                    </button>
                    <div className="absolute left-0 bottom-full mb-1 hidden group-hover/status:block bg-white border border-slate-200 rounded-xl shadow-xl z-[70] p-1 w-36">
                      {Object.values(ComplaintStatus).map(s => (
                        <button 
                          key={s}
                          onClick={(e) => { e.stopPropagation(); updateStatus(task.id, s); }}
                          className="w-full text-left px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 text-slate-600"
                        >
                          {s.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-tighter leading-none mb-1">Assignee</p>
                    <p className="text-[10px] font-bold text-slate-600">{task.assigneeName || 'Unassigned'}</p>
                  </div>
                  <div className="relative group/assignee">
                    {task.assigneeId ? (
                      <img 
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${task.assigneeName}`} 
                        className="w-8 h-8 rounded-xl border-2 border-white shadow-md bg-slate-100 object-cover" 
                        alt="assignee" 
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-300 bg-slate-50">
                        <Icons.User className="w-4 h-4" />
                      </div>
                    )}
                    <div className="absolute right-0 bottom-full mb-1 hidden group-hover/assignee:block bg-white border border-slate-200 rounded-xl shadow-xl z-[70] p-1 w-48">
                      <p className="px-3 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 mb-1">Assign to...</p>
                      {businessUsers.map(u => (
                        <button 
                          key={u.id}
                          onClick={(e) => { e.stopPropagation(); updateComplaint(task.id, { assigneeId: u.id, assigneeName: u.name }); }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                        >
                          <img src={u.avatar} className="w-5 h-5 rounded-full border border-slate-200" alt="" />
                          {u.name}
                        </button>
                      ))}
                      <button 
                        onClick={(e) => { e.stopPropagation(); updateComplaint(task.id, { assigneeId: undefined, assigneeName: undefined }); }}
                        className="w-full text-left px-3 py-2 rounded-lg text-[10px] font-black uppercase text-red-500 hover:bg-red-50"
                      >
                        Unassign
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderActiveView = () => {
    switch(activeTab) {
      case 'BACKLOG': return <BacklogView />;
      case 'REPORTS': return <ReportsView />;
      case 'COMPONENTS': return <ComponentsView />;
      case 'SETTINGS': return <SettingsView />;
      default: return (
        <main className="flex-1 flex flex-col overflow-hidden bg-white/50">
          <div className="p-10 pb-6">
             <div className="flex items-center gap-3 text-[9px] text-slate-400 font-black uppercase tracking-[0.3em] mb-3">
                <span>Projects</span> 
                <Icons.Plus className="w-2.5 h-2.5 rotate-90" /> 
                <span className="text-slate-900">{currentUser?.companyName}</span>
             </div>
             <div className="flex items-center justify-between mb-10">
                <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Active Board</h1>
                <div className="flex gap-3">
                  <button className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:text-indigo-600 transition-all hover:border-indigo-100"><Icons.Activity className="w-5 h-5" /></button>
                  <button className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:text-indigo-600 transition-all hover:border-indigo-100"><Icons.Download className="w-5 h-5" /></button>
                </div>
             </div>
             
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="relative">
                     <Icons.Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                     <input 
                       type="text" 
                       value={searchBoard}
                       onChange={(e) => setSearchBoard(e.target.value)}
                       className="pl-11 pr-6 py-3 border-2 border-slate-100 rounded-2xl text-xs outline-none focus:border-indigo-500 w-72 transition-all font-bold shadow-sm"
                       placeholder="Filter by title or KB key..."
                     />
                  </div>
                  <div className="flex -space-x-2">
                     {businessUsers.slice(0, 4).map(u => (
                       <img key={u.id} src={u.avatar} className="w-10 h-10 rounded-2xl border-4 border-white shadow-xl ring-1 ring-slate-100" alt="team" title={u.name} />
                     ))}
                     {businessUsers.length > 4 && (
                        <div className="w-10 h-10 rounded-2xl bg-slate-100 border-4 border-white flex items-center justify-center text-xs font-black text-slate-500 shadow-xl ring-1 ring-slate-100">+{businessUsers.length - 4}</div>
                     )}
                  </div>
                  <div className="w-px h-8 bg-slate-200 mx-2" />
                  <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors flex items-center gap-2">
                    <Icons.Sliders className="w-4 h-4" /> View Options
                  </button>
                </div>
                <div className="flex items-center gap-3">
                   <button className="px-6 py-3 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95">Complete Sprint</button>
                </div>
             </div>
          </div>

          <div className="flex-1 flex gap-8 px-10 pb-10 overflow-x-auto min-h-0 custom-scrollbar">
             <Column 
                title="To Do" 
                status={ComplaintStatus.OPEN} 
                count={companyComplaints.filter(c => c.status === ComplaintStatus.OPEN).length} 
             />
             <Column 
                title="In Progress" 
                status={ComplaintStatus.IN_PROGRESS} 
                count={companyComplaints.filter(c => c.status === ComplaintStatus.IN_PROGRESS).length} 
             />
             <Column 
                title="Resolved" 
                status={ComplaintStatus.RESOLVED} 
                count={companyComplaints.filter(c => c.status === ComplaintStatus.RESOLVED).length} 
             />
             <Column 
                title="Escalated" 
                status={ComplaintStatus.ESCALATED} 
                count={companyComplaints.filter(c => c.status === ComplaintStatus.ESCALATED).length} 
             />
          </div>
        </main>
      );
    }
  };

  if (selectedTaskId && activeTab === 'BOARD') {
    const task = companyComplaints.find(t => t.id === selectedTaskId);
    if (task) {
      return <ComplaintDetail complaint={task} onBack={() => setSelectedTaskId(null)} />;
    }
  }

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden animate-fade-in font-sans">
      {showCreateModal && <CreateTaskModal />}
      {/* Bulk Action Toolbar */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] animate-fade-up">
          <div className="bg-slate-900 text-white rounded-[2.5rem] px-8 py-5 flex items-center gap-10 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] border border-white/10 ring-1 ring-white/20 backdrop-blur-3xl">
            <div className="flex items-center gap-4 border-r border-white/10 pr-10">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center font-black shadow-lg">
                {selectedIds.length}
              </div>
              <span className="text-xs font-black uppercase tracking-[0.3em]">Selected Items</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative group/bulkStatus">
                <button className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-widest border border-white/10 flex items-center gap-2">
                   Bulk Status <Icons.LayoutDashboard className="w-3.5 h-3.5" />
                </button>
                <div className="absolute bottom-full left-0 mb-4 hidden group-hover/bulkStatus:block bg-slate-800 border border-white/10 rounded-2xl shadow-2xl p-1 w-48">
                  {Object.values(ComplaintStatus).map(s => (
                    <button key={s} onClick={() => handleBulkStatus(s)} className="w-full text-left px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/5">
                      {s.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative group/bulkAssign">
                <button className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-widest border border-white/10 flex items-center gap-2">
                   Bulk Assign <Icons.User className="w-3.5 h-3.5" />
                </button>
                <div className="absolute bottom-full left-0 mb-4 hidden group-hover/bulkAssign:block bg-slate-800 border border-white/10 rounded-2xl shadow-2xl p-1 w-56">
                  {businessUsers.map(u => (
                    <button key={u.id} onClick={() => handleBulkAssign(u.id)} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/5">
                       <img src={u.avatar} className="w-5 h-5 rounded-full" alt="" />
                       {u.name}
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={handleBulkDelete} className="px-5 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 text-[10px] font-black uppercase tracking-widest border border-red-500/20 flex items-center gap-2">
                 Bulk Delete <Icons.Trash className="w-3.5 h-3.5" />
              </button>

              <button onClick={() => setSelectedIds([])} className="px-5 py-2.5 rounded-xl hover:bg-white/5 text-slate-400 text-[10px] font-black uppercase tracking-widest border border-transparent">
                 Deselect All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Jira-style Top Header */}
      <header className="h-16 border-b border-slate-200/80 flex items-center justify-between px-8 bg-white/80 backdrop-blur-md sticky top-0 z-[60]">
        <div className="flex items-center gap-12">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => setActiveTab('BOARD')}>
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
              <span className="font-black italic text-lg">k</span>
            </div>
            <span className="font-black text-slate-900 tracking-tighter text-xl">Kwible Manager</span>
          </div>
          
          <nav className="hidden lg:flex items-center gap-2">
            {['Your work', 'Projects', 'Filters', 'Dashboards'].map(link => (
              <button key={link} className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-all flex items-center gap-2">
                {link} <Icons.LogOut className="w-3 h-3 rotate-90 opacity-30" />
              </button>
            ))}
          </nav>

          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-slate-950 text-white px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200"
          >
            Create Task
          </button>
        </div>

        <div className="flex items-center gap-6">
           <div className="relative group hidden xl:block">
              <Icons.Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-11 pr-6 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 w-64 transition-all font-medium"
              />
           </div>
           <div className="flex items-center gap-1">
              <button className="p-2.5 text-slate-400 hover:bg-slate-100 rounded-xl transition-colors"><Icons.Bell className="w-5 h-5" /></button>
              <button className="p-2.5 text-slate-400 hover:bg-slate-100 rounded-xl transition-colors"><Icons.Settings className="w-5 h-5" /></button>
              <div className="w-px h-6 bg-slate-200 mx-2" />
              <img src={currentUser?.avatar} className="w-9 h-9 rounded-xl border-2 border-white shadow-md ml-1 ring-1 ring-slate-200" alt="me" />
           </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Jira-style Project Sidebar */}
        <aside className="w-72 border-r border-slate-200 bg-slate-50/30 flex flex-col">
           <div className="p-8">
              <div className="flex items-center gap-4 mb-12">
                 <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-xl border border-slate-100">
                    <Icons.Briefcase className="w-7 h-7 text-indigo-600" />
                 </div>
                 <div className="min-w-0">
                    <h3 className="text-base font-black text-slate-900 leading-tight tracking-tight truncate">{currentUser?.companyName}</h3>
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">Resolution Center</p>
                 </div>
              </div>

              <div className="space-y-1.5">
                 {[
                   { id: 'BOARD', label: 'Board', icon: <Icons.LayoutDashboard className="w-4 h-4" /> },
                   { id: 'BACKLOG', label: 'Backlog', icon: <Icons.List className="w-4 h-4" /> },
                   { id: 'REPORTS', label: 'Reports', icon: <Icons.Activity className="w-4 h-4" /> },
                   { id: 'COMPONENTS', label: 'Components', icon: <Icons.Database className="w-4 h-4" /> },
                   { id: 'SETTINGS', label: 'Settings', icon: <Icons.Settings className="w-4 h-4" /> },
                 ].map(item => (
                   <button 
                     key={item.id}
                     onClick={() => setActiveTab(item.id as any)}
                     className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${
                        activeTab === item.id 
                        ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-200 ring-4 ring-indigo-50' 
                        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                     }`}
                   >
                     {item.icon} {item.label}
                   </button>
                 ))}
              </div>
           </div>

           <div className="mt-auto p-8 border-t border-slate-100">
              <div className="bg-indigo-950 rounded-3xl p-6 text-white relative overflow-hidden group/upgrade">
                 <Icons.Zap className="absolute -right-4 -bottom-4 w-24 h-24 opacity-10 group-hover/upgrade:scale-125 transition-transform" />
                 <h4 className="text-xs font-black uppercase tracking-widest mb-2 relative z-10">AI Insights Pro</h4>
                 <p className="text-[10px] text-indigo-300 font-bold mb-5 relative z-10">Unlock deep sentiment forecasting.</p>
                 <button className="w-full py-2.5 bg-white text-indigo-950 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg relative z-10 hover:bg-indigo-50 transition-colors">Upgrade Now</button>
              </div>
           </div>
        </aside>

        {/* Dynamic Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white/50">
          {renderActiveView()}
        </div>
      </div>
    </div>
  );
};
