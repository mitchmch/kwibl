import React, { useState } from 'react';
import { Icons } from '../Icons';

export const AdminTechStack = () => {
  const [activeTab, setActiveTab] = useState('Core');
  const tabs = ['Core', 'UI', 'Data', 'Backend', 'Integrations', 'Libraries', 'Tools'];

  return (
    <div className="space-y-8 animate-fade-in">
        <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 flex items-start gap-4">
            <div className="p-3 bg-white rounded-lg text-orange-500 shadow-sm">
                <Icons.Brain className="w-6 h-6" />
            </div>
            <div>
                <h2 className="text-2xl font-bold text-slate-900">Tech Stack & System Health</h2>
                <p className="text-slate-500">Platform technical infrastructure and monitoring</p>
            </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                 <div>
                     <h3 className="text-lg font-bold text-slate-900">System Health</h3>
                     <p className="text-sm text-slate-500">Real-time status of platform services</p>
                 </div>
                 <div className="text-sm text-slate-400">Last checked: {new Date().toLocaleTimeString()}</div>
            </div>

            <div className="p-4 bg-white border-2 border-green-100 rounded-xl flex items-center justify-between mb-8 shadow-sm">
                 <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                         <Icons.Activity className="w-6 h-6" />
                     </div>
                     <div>
                         <div className="font-bold text-slate-900">Overall System Status</div>
                         <div className="text-green-600 text-sm font-medium">All Systems Operational</div>
                     </div>
                 </div>
                 <button className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-green-200 shadow-lg">Refresh</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-5 border border-slate-200 rounded-xl hover:border-indigo-300 transition-colors">
                    <div className="flex items-center gap-3 mb-4">
                        <Icons.Database className="w-5 h-5 text-indigo-600" />
                        <span className="font-bold text-slate-900">Database</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-slate-500 text-sm">Database is operational</span>
                        <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold">Operational</span>
                    </div>
                </div>

                <div className="p-5 border border-slate-200 rounded-xl hover:border-indigo-300 transition-colors">
                    <div className="flex items-center gap-3 mb-4">
                        <Icons.Briefcase className="w-5 h-5 text-indigo-600" />
                        <span className="font-bold text-slate-900">Storage</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-slate-500 text-sm">All 5 buckets available</span>
                        <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold">Operational</span>
                    </div>
                </div>

                <div className="p-5 border border-slate-200 rounded-xl hover:border-indigo-300 transition-colors">
                    <div className="flex items-center gap-3 mb-4">
                        <Icons.Zap className="w-5 h-5 text-indigo-600" />
                        <span className="font-bold text-slate-900">Edge Functions</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-slate-500 text-sm">Checking runtime...</span>
                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs font-bold">Unknown</span>
                    </div>
                </div>
            </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
           <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Icons.Layers className="w-5 h-5" /> Technology Stack
           </h3>
           <div className="bg-slate-100 p-1 rounded-xl flex overflow-x-auto mb-8">
              {tabs.map(tab => (
                <button 
                  key={tab} 
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2 rounded-lg text-sm font-bold transition-colors whitespace-nowrap ${activeTab === tab ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
                >
                  {tab}
                </button>
              ))}
           </div>
           
           <div className="p-6 border border-slate-100 rounded-2xl bg-slate-50/50">
              <h4 className="font-bold text-slate-900 mb-2">{activeTab} framework and build tools</h4>
              <p className="text-sm text-slate-500 mb-6">Current infrastructure components powering the {activeTab} layer.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {[1, 2].map(i => (
                    <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs">
                             {activeTab[0]}
                          </div>
                          <span className="font-bold text-slate-700 text-sm">{activeTab} Component {i}</span>
                       </div>
                       <span className="text-xs text-slate-400 font-mono">v1.2.{i}</span>
                    </div>
                 ))}
              </div>
           </div>
        </div>
    </div>
  );
};

export const AdminSettingsGeneral = () => {
    return (
        <div className="space-y-8 animate-fade-in">
             <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                 <div className="flex items-center gap-4 mb-8">
                     <div className="p-3 bg-orange-50 rounded-xl text-orange-500">
                         <Icons.Settings className="w-6 h-6" />
                     </div>
                     <div>
                         <h2 className="text-2xl font-bold text-slate-900">Platform Settings</h2>
                         <p className="text-slate-500">Configure global platform settings and preferences</p>
                     </div>
                 </div>

                 <div className="space-y-8">
                     <div>
                         <h3 className="text-lg font-bold text-slate-900 mb-4">General Settings</h3>
                         <div className="space-y-4">
                             <div>
                                 <label className="block text-sm font-medium text-slate-700 mb-1">Platform Name</label>
                                 <input type="text" defaultValue="KAREN" className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none" />
                             </div>
                             <div>
                                 <label className="block text-sm font-medium text-slate-700 mb-1">Support Email</label>
                                 <input type="text" defaultValue="support@karen.app" className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none" />
                             </div>
                         </div>
                     </div>

                     <div>
                         <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                           <Icons.Shield className="w-4 h-4 text-slate-400" /> Moderation Settings
                         </h3>
                         <div className="space-y-4">
                             <div>
                                 <label className="block text-sm font-medium text-slate-700 mb-1">Auto-Approve Threshold (0-1)</label>
                                 <input type="number" step="0.1" defaultValue="0.8" className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none" />
                                 <p className="text-[10px] text-slate-400 mt-1">Complaints with AI confidence scores above this will bypass the queue.</p>
                             </div>
                         </div>
                     </div>
                 </div>
             </div>
        </div>
    );
};

export const AdminSettingsBranding = () => {
    return (
        <div className="space-y-8 animate-fade-in">
             <div className="flex justify-between items-center">
                 <div>
                    <h2 className="text-2xl font-bold text-slate-900">Branding</h2>
                    <p className="text-slate-500">Manage your site logo, favicon, and theme colors</p>
                 </div>
                 <button className="bg-orange-500 text-white px-6 py-2 rounded-lg font-bold shadow-lg shadow-orange-200">Save Changes</button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                     <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                         <Icons.Image className="w-4 h-4" /> Logo
                     </h3>
                     <p className="text-sm text-slate-500 mb-6">Upload your site logo (recommended: PNG, 200x50px)</p>
                     
                     <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex items-center justify-center bg-slate-50 mb-6">
                         <div className="text-2xl font-black text-slate-900 tracking-tighter">KAREN</div>
                     </div>
                     
                     <div className="flex gap-4">
                         <button className="flex-1 py-2 border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 flex items-center justify-center gap-2">
                             <Icons.Upload className="w-4 h-4" /> Upload Logo
                         </button>
                         <button className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50">Reset</button>
                     </div>
                 </div>

                 <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                     <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                         <Icons.Image className="w-4 h-4" /> Favicon
                     </h3>
                     <p className="text-sm text-slate-500 mb-6">Upload your site favicon (recommended: PNG/ICO, 32x32px)</p>
                     
                     <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex items-center justify-center bg-slate-50 mb-6">
                         <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center text-white text-2xl font-bold">K</div>
                     </div>
                     
                     <div className="flex gap-4">
                         <button className="flex-1 py-2 border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 flex items-center justify-center gap-2">
                             <Icons.Upload className="w-4 h-4" /> Upload Favicon
                         </button>
                         <button className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50">Reset</button>
                     </div>
                 </div>
             </div>

             <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <Icons.Activity className="w-4 h-4" /> Loading Logo
                </h3>
                <p className="text-sm text-slate-500 mb-8">Upload a custom loading animation logo with bounce and rotation effect</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="border-2 border-dashed border-slate-200 rounded-xl p-12 bg-slate-50 flex items-center justify-center">
                      <div className="text-xs font-black text-slate-300 uppercase tracking-[1em]">KAREN</div>
                   </div>
                   <div className="flex flex-col justify-center">
                      <h4 className="font-bold text-slate-900 text-sm mb-4">Live Animation Preview</h4>
                      <div className="w-20 h-20 bg-indigo-600 rounded-full animate-bounce mx-auto flex items-center justify-center text-white font-black">K</div>
                   </div>
                </div>
             </div>
        </div>
    );
};
