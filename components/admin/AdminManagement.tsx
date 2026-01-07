import React, { useState } from 'react';
import { Icons } from '../Icons';
import { analyzePolicy } from '../../services/geminiService';

export const AdminModeration = () => {
    return (
        <div className="space-y-8 animate-fade-in">
             <div className="flex justify-between items-end">
                 <div>
                    <h2 className="text-2xl font-bold text-slate-900">Moderation Queue</h2>
                    <p className="text-slate-500">0 complaints awaiting review</p>
                 </div>
             </div>

             <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center py-24 flex flex-col items-center">
                 <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4">
                     <Icons.CheckCircle className="w-10 h-10 text-green-500" />
                 </div>
                 <h2 className="text-2xl font-bold text-slate-900 mb-2">All caught up!</h2>
                 <p className="text-slate-500">No complaints pending review</p>
             </div>
        </div>
    );
};

export const AdminContentReports = () => {
    return (
        <div className="space-y-8 animate-fade-in">
             <div>
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <Icons.Flag className="w-6 h-6 text-orange-500" /> Content Reports
                </h2>
                <p className="text-slate-500">Review and manage reported complaints and comments</p>
             </div>

             <div className="flex gap-4 items-center">
                 <select className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 min-w-[200px]">
                     <option>All Types</option>
                     <option>Spam</option>
                     <option>Harassment</option>
                     <option>Misinformation</option>
                 </select>
             </div>

             <div className="bg-slate-100 p-1 rounded-xl w-fit flex gap-1">
                 {['Pending', 'Reviewed', 'Resolved', 'Dismissed', 'All Reports'].map((tab, i) => (
                     <button key={tab} className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${i === 0 ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>
                         {tab}
                     </button>
                 ))}
             </div>

             <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-24 text-center">
                 <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-100">
                     <Icons.AlertTriangle className="w-10 h-10 text-slate-400" />
                 </div>
                 <h3 className="text-xl font-bold text-slate-900 mb-2">No reports found</h3>
                 <p className="text-slate-500">No pending reports to review</p>
             </div>
        </div>
    );
};

export const AdminEscalations = () => {
    return (
        <div className="space-y-8 animate-fade-in">
             <div className="flex justify-between items-center">
                 <div>
                    <h2 className="text-2xl font-bold text-slate-900">Escalation Monitor</h2>
                    <p className="text-slate-500">Track and manage automatic complaint escalations</p>
                 </div>
                 <button className="bg-orange-500 text-white px-4 py-2.5 rounded-lg font-bold shadow-lg shadow-orange-200 flex items-center hover:bg-orange-600 transition-colors">
                     <Icons.Zap className="w-4 h-4 mr-2" /> Run Escalation Check
                 </button>
             </div>

             <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                 <div className="flex items-start gap-4">
                     <Icons.Clock className="w-5 h-5 text-slate-500 mt-1" />
                     <div>
                         <h4 className="font-bold text-slate-900 text-sm mb-1">Escalation Policy</h4>
                         <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
                             Complaints published for 7+ days without resolution are automatically escalated to higher priority levels. Each escalation level increases urgency and sends notifications to relevant stakeholders.
                         </p>
                     </div>
                 </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                     <div className="text-sm font-bold text-slate-700 mb-4">Total Escalations</div>
                     <div className="text-4xl font-bold text-slate-900 mb-1">0</div>
                 </div>
                 <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 shadow-sm">
                     <div className="text-sm font-bold text-orange-800 mb-4">Level 1</div>
                     <div className="text-4xl font-bold text-orange-600 mb-1">0</div>
                     <div className="text-xs text-orange-700 font-medium">Standard escalation</div>
                 </div>
                 <div className="bg-red-50 p-6 rounded-2xl border border-red-100 shadow-sm">
                     <div className="text-sm font-bold text-red-800 mb-4">Level 2</div>
                     <div className="text-4xl font-bold text-red-600 mb-1">0</div>
                     <div className="text-xs text-red-700 font-medium">High priority</div>
                 </div>
                 <div className="bg-red-100 p-6 rounded-2xl border border-red-200 shadow-sm">
                     <div className="text-sm font-bold text-red-900 mb-4">Level 3+</div>
                     <div className="text-4xl font-bold text-red-700 mb-1">0</div>
                     <div className="text-xs text-red-800 font-medium">Critical</div>
                 </div>
             </div>

             <div className="bg-red-50 border border-red-100 rounded-2xl p-6 flex items-center gap-4">
                 <div className="p-2 bg-white rounded-lg text-red-500 shadow-sm border border-red-100">
                     <Icons.AlertTriangle className="w-6 h-6" />
                 </div>
                 <div>
                     <h4 className="font-bold text-red-700">Complaints Pending Escalation</h4>
                     <p className="text-sm text-red-600">7 complaints are eligible for escalation. Run the escalation check to process them.</p>
                 </div>
             </div>

             <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                 <h3 className="text-xl font-bold text-slate-900 mb-2">Recent Escalations</h3>
                 <p className="text-sm text-slate-500">Track escalation history and complaint status</p>
                 {/* Table or list would go here */}
                 <div className="mt-8 text-center text-slate-400 text-sm italic">
                     No recent escalation history found.
                 </div>
             </div>
        </div>
    );
};

export const AdminPolicyAnalysis = () => {
    const [policyText, setPolicyText] = useState('');
    const [analysis, setAnalysis] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleAnalyze = async () => {
        if (!policyText.trim()) return;
        setLoading(true);
        const result = await analyzePolicy(policyText);
        setAnalysis(result);
        setLoading(false);
    };

    return (
        <div className="space-y-8 animate-fade-in">
             <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100">
                 <div className="flex items-center gap-4 mb-2">
                     <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                         <Icons.Brain className="w-6 h-6" />
                     </div>
                     <h2 className="text-2xl font-bold text-slate-900">Policy Analysis Assistant</h2>
                 </div>
                 <p className="text-slate-600">Karen Agent powered policy analysis for consumer rights compliance</p>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                 <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[600px]">
                     <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                         <Icons.FileText className="w-4 h-4" /> Policy Document
                     </h3>
                     <input type="text" placeholder="Policy Title (Optional)" defaultValue="e.g., Returns & Refunds Policy" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl mb-4 text-sm" />
                     <div className="relative flex-1">
                        <textarea 
                            className="w-full h-full p-4 bg-slate-50 border border-slate-200 rounded-xl resize-none focus:ring-2 focus:ring-orange-500 font-mono text-sm"
                            placeholder="Paste the policy document text here..."
                            value={policyText}
                            onChange={(e) => setPolicyText(e.target.value)}
                        ></textarea>
                     </div>
                     <div className="mt-4 flex justify-between items-center text-xs text-slate-400">
                         <span>{policyText.length} / 100 characters minimum</span>
                         <button 
                            onClick={handleAnalyze}
                            disabled={loading || policyText.length < 10}
                            className="bg-emerald-500 text-white px-6 py-2 rounded-lg font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-600 disabled:opacity-50 transition-colors"
                         >
                            {loading ? 'Analyzing...' : 'Analyze Policy'}
                         </button>
                     </div>
                 </div>

                 <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-[600px] overflow-y-auto">
                     <h3 className="font-bold text-slate-900 mb-4">Recent Analyses</h3>
                     {analysis ? (
                         <div className="prose prose-sm prose-slate">
                             <h4>Analysis Result</h4>
                             <div className="whitespace-pre-wrap">{analysis}</div>
                         </div>
                     ) : (
                         <div className="flex flex-col items-center justify-center h-full text-slate-400">
                             <Icons.FileText className="w-16 h-16 mb-4 opacity-20" />
                             <p className="font-medium text-lg text-slate-600 mb-1">No previous analyses</p>
                             <p className="text-sm">Start by analyzing a policy document</p>
                         </div>
                     )}
                 </div>
             </div>
        </div>
    );
};

export const AdminBusinesses = () => {
    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                   <h2 className="text-2xl font-bold text-slate-900">Business Management</h2>
                   <p className="text-slate-500">72 of 72 businesses</p>
                </div>
                <button className="bg-orange-500 text-white px-4 py-2 rounded-lg font-bold shadow-lg shadow-orange-200 flex items-center hover:bg-orange-600 transition-colors">
                    <Icons.Plus className="w-4 h-4 mr-2" /> Add Business
                </button>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-4">
                <div className="relative flex-1">
                    <Icons.Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <input type="text" placeholder="Search by name or industry..." className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-lg focus:ring-0 text-sm" />
                </div>
                <div className="px-4 py-2 border border-slate-200 rounded-lg flex items-center gap-2 text-slate-600 bg-white cursor-pointer hover:bg-slate-50">
                    <Icons.Sliders className="w-4 h-4" /> 
                    <span className="text-sm font-medium">All Businesses</span>
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {['Tesco', "Sainsbury's", 'ASDA'].map((name, i) => (
                    <div key={name} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-orange-200 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white shadow-sm shadow-orange-200">
                                <Icons.Building2 className="w-6 h-6" />
                            </div>
                            <div className="px-2 py-1 bg-green-500 text-white text-[10px] font-bold rounded-full flex items-center shadow-sm shadow-green-200">
                                <Icons.CheckCircle className="w-3 h-3 mr-1" /> Verified
                            </div>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">{name}</h3>
                        <div className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full inline-block mb-3 font-medium border border-slate-200">Retail</div>
                        <p className="text-sm text-slate-500 mb-2 line-clamp-2">Leading supermarket chain in the UK.</p>
                        <div className="text-xs text-indigo-500 mb-6 font-medium hover:underline cursor-pointer flex items-center gap-1">
                            <Icons.Globe className="w-3 h-3" /> https://www.{name.toLowerCase().replace("'", "")}.com
                        </div>

                        <div className="flex gap-2 mb-6">
                            <div className="px-3 py-1 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 flex items-center">
                                ↗ 0 Score
                            </div>
                            <div className="px-3 py-1 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 flex items-center">
                                🕒 0 Total
                            </div>
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                             <button className="text-slate-900 font-bold text-sm flex items-center hover:text-orange-500 transition-colors"><Icons.AlertCircle className="w-4 h-4 mr-2" /> View</button>
                             <div className="flex gap-2">
                                 <button className="text-slate-400 hover:text-slate-600 p-1"><Icons.Edit className="w-4 h-4" /></button>
                                 <button className="text-red-400 hover:text-red-600 p-1"><Icons.Trash className="w-4 h-4" /></button>
                             </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const AdminIndustries = () => {
    const industries = [
        { name: 'Banking & Finance', color: 'blue', tag: 'Landmark' },
        { name: 'Healthcare', color: 'green', tag: 'Activity' },
        { name: 'Retail', color: 'purple', tag: 'ShoppingBag' },
        { name: 'Utilities', color: 'amber', tag: 'Zap' },
        { name: 'Transport', color: 'sky', tag: 'Plane' },
        { name: 'Insurance', color: 'red', tag: 'Shield' }
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            <div>
               <h2 className="text-2xl font-bold text-slate-900">Industry Management</h2>
               <p className="text-slate-500">12 industries configured</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {industries.map((ind) => (
                    <div key={ind.name} className={`bg-white p-6 rounded-2xl border-l-4 border-slate-200 shadow-sm hover:shadow-md transition-shadow`} style={{ borderLeftColor: `var(--${ind.color}-500)` }}>
                         <div className="flex justify-between items-start mb-4">
                             <span className={`text-${ind.color}-600 font-medium text-sm flex items-center gap-1`}>
                                 {ind.tag}
                             </span>
                             <span className={`px-2 py-1 bg-${ind.color}-500 text-white rounded-full text-xs font-bold capitalize`}>
                                 {ind.color}
                             </span>
                         </div>
                         <h3 className="text-xl font-bold text-slate-900 mb-2">{ind.name}</h3>
                         <p className="text-sm text-slate-500 mb-6">Issues related to {ind.name.toLowerCase()} sector.</p>
                         <div className="text-xs text-slate-400 font-mono">Display Order: {industries.indexOf(ind) + 1}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};
