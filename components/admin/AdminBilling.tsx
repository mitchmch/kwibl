import React from 'react';
import { Icons } from '../Icons';

export const AdminBilling = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Billing & Subscriptions</h2>
        <p className="text-slate-500">Monitor revenue and business partner accounts</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-lg text-slate-900 mb-6">Recent Transactions</h3>
            <div className="space-y-4">
               {[1, 2, 3, 4, 5].map((i) => (
                 <div key={i} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 font-bold">$</div>
                       <div>
                          <div className="font-bold text-sm text-slate-900">TechCorp - Enterprise Monthly</div>
                          <div className="text-xs text-slate-500">Oct 24, 2025 • Ref: #829374</div>
                       </div>
                    </div>
                    <div className="text-right">
                       <div className="font-bold text-slate-900">$299.00</div>
                       <div className="text-[10px] uppercase font-bold text-green-600">Success</div>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
           <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-4">Plan Distribution</h3>
              <div className="space-y-4">
                 <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Free (Individuals)</span>
                    <span className="font-bold text-slate-900">4,281</span>
                 </div>
                 <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Business Pro</span>
                    <span className="font-bold text-slate-900">142</span>
                 </div>
                 <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Enterprise</span>
                    <span className="font-bold text-slate-900">18</span>
                 </div>
              </div>
              <button className="w-full mt-6 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold">Manage Pricing</button>
           </div>

           <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl">
              <h4 className="font-bold text-emerald-900 text-sm mb-2 flex items-center gap-2">
                 <Icons.CheckCircle className="w-4 h-4" /> Payments are live
              </h4>
              <p className="text-xs text-emerald-700">All Stripe webhooks are functioning correctly. Next automated payout is tomorrow at 4 PM.</p>
           </div>
        </div>
      </div>
    </div>
  );
};
