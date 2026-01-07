import React, { useState } from 'react';
import { Icons } from '../Icons';

export const AdminCompliance = () => {
    const [reportType, setReportType] = useState('GDPR Data Export');
    const [frequency, setFrequency] = useState('Weekly');

    return (
        <div className="space-y-8 animate-fade-in">
             <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                 <div className="flex items-center gap-4 mb-8">
                     <div className="p-3 bg-indigo-50 rounded-xl text-indigo-500">
                         <Icons.FileBarChart className="w-6 h-6" />
                     </div>
                     <div>
                         <h2 className="text-2xl font-bold text-slate-900">Compliance Reporting</h2>
                         <p className="text-slate-500">Automated regulatory compliance reports for UK consumer protection laws</p>
                     </div>
                 </div>

                 <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl mb-8 flex items-start gap-3">
                     <Icons.Settings className="w-5 h-5 text-slate-400 mt-0.5" />
                     <div>
                         <h4 className="font-bold text-slate-900 text-sm">Scheduled Reports</h4>
                         <p className="text-sm text-slate-600 mt-1">To enable automated scheduling, set up a cron job to call the send-compliance-report edge function. Contact support for assistance with cron job configuration.</p>
                     </div>
                 </div>

                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                     {/* Generator */}
                     <div className="border border-slate-200 rounded-2xl p-6">
                         <h3 className="font-bold text-lg text-slate-900 mb-1 flex items-center gap-2">
                             <Icons.Zap className="w-5 h-5" /> Generate Report Now
                         </h3>
                         <p className="text-slate-500 text-sm mb-6">Create and send a compliance report immediately</p>

                         <div className="space-y-4">
                             <div>
                                 <label className="block text-sm font-medium text-slate-700 mb-1">Report Type</label>
                                 <div className="space-y-2">
                                     {['GDPR Data Export', 'Consumer Rights Act 2015', 'FCA Regulations', 'Complaint Summary'].map(type => (
                                         <div 
                                            key={type}
                                            onClick={() => setReportType(type)}
                                            className={`p-3 rounded-lg border cursor-pointer text-sm font-medium transition-all ${
                                                reportType === type 
                                                ? 'bg-emerald-50 border-emerald-500 text-emerald-700 flex items-center justify-between' 
                                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                            }`}
                                         >
                                             {type}
                                             {reportType === type && <Icons.CheckCircle className="w-4 h-4" />}
                                         </div>
                                     ))}
                                 </div>
                             </div>

                             <div>
                                 <label className="block text-sm font-medium text-slate-700 mb-1">Time Period</label>
                                 <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm">
                                     <option>Last 7 days</option>
                                     <option>Last 30 days</option>
                                     <option>This Quarter</option>
                                     <option>Custom Range</option>
                                 </select>
                             </div>

                             <button className="w-full bg-orange-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-orange-200 hover:bg-orange-600 transition-colors mt-4">
                                 Generate & Send Report
                             </button>
                         </div>
                     </div>

                     {/* Scheduler */}
                     <div className="border border-slate-200 rounded-2xl p-6 bg-slate-50/50">
                         <h3 className="font-bold text-lg text-slate-900 mb-1 flex items-center gap-2">
                             <Icons.Clock className="w-5 h-5" /> Schedule Configuration
                         </h3>
                         <p className="text-slate-500 text-sm mb-6">Configure automated report scheduling</p>

                         <div className="space-y-4">
                             <div>
                                 <label className="block text-sm font-medium text-slate-700 mb-1">Frequency</label>
                                 <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                                     {['Daily', 'Weekly', 'Monthly', 'Quarterly'].map(freq => (
                                         <div 
                                            key={freq}
                                            onClick={() => setFrequency(freq)}
                                            className={`p-3 text-sm cursor-pointer border-b border-slate-100 last:border-0 ${
                                                frequency === freq 
                                                ? 'bg-emerald-500 text-white font-bold flex items-center gap-2' 
                                                : 'text-slate-600 hover:bg-slate-50'
                                            }`}
                                         >
                                             {frequency === freq && <Icons.CheckCircle className="w-4 h-4" />}
                                             {freq}
                                         </div>
                                     ))}
                                 </div>
                             </div>

                             <div className="bg-slate-100 p-4 rounded-xl border border-slate-200 text-sm text-slate-600 flex items-start gap-3">
                                 <Icons.MessageSquare className="w-5 h-5 mt-0.5" />
                                 <div>
                                     <p className="mb-1 text-slate-900 font-medium">Reports are automatically sent to all admin users via email.</p>
                                     <p className="text-xs">Configure recipients in user management.</p>
                                 </div>
                             </div>

                             <div className="pt-4">
                                 <label className="block text-sm font-medium text-slate-700 mb-2">Schedule Status:</label>
                                 <div className="inline-flex items-center px-3 py-1 rounded-full border border-slate-300 bg-white text-xs font-bold text-slate-700">
                                     <Icons.Calendar className="w-3 h-3 mr-2" /> Manual triggering enabled
                                 </div>
                             </div>
                         </div>
                     </div>
                 </div>
             </div>
        </div>
    );
};
