import React from 'react';
import { Icons } from './Icons';

export const SelfServiceResources = () => {
  const faqs = [
    { q: "How do I track my complaint status?", a: "You can track your complaint status directly from your Personal Dashboard. Status updates (Open, In Progress, Resolved) are updated in real-time by the business." },
    { q: "What happens if my issue isn't resolved?", a: "If your issue remains unresolved for more than 7 days, you can request an escalation. Our AI also flags urgent unresolved issues automatically." },
    { q: "How do I contact support?", a: "You can use the messaging feature within a specific complaint thread to communicate directly with the business representative." },
    { q: "Can I update my complaint after posting?", a: "You cannot edit the original complaint text to preserve the audit trail, but you can add comments to provide further details or updates." },
    { q: "How does the rating system work?", a: "Once your complaint is marked as resolved, you will have the option to rate your experience and the resolution quality on a scale of 1 to 5 stars." }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
          <Icons.Briefcase className="w-5 h-5 mr-2 text-indigo-600" />
          Troubleshooting Guides
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
           {/* Mock guides */}
           <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 hover:border-indigo-200 transition-colors cursor-pointer group">
              <h3 className="font-semibold text-slate-800 mb-2 group-hover:text-indigo-600">Internet Connectivity Issues</h3>
              <p className="text-sm text-slate-600">Step-by-step guide to diagnosing modem and router problems before filing a complaint.</p>
           </div>
           <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 hover:border-indigo-200 transition-colors cursor-pointer group">
              <h3 className="font-semibold text-slate-800 mb-2 group-hover:text-indigo-600">Billing Dispute Process</h3>
              <p className="text-sm text-slate-600">Understanding your rights and required documentation for billing errors.</p>
           </div>
           <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 hover:border-indigo-200 transition-colors cursor-pointer group">
              <h3 className="font-semibold text-slate-800 mb-2 group-hover:text-indigo-600">Product Return Policy</h3>
              <p className="text-sm text-slate-600">Learn about standard return windows, restocking fees, and how to print shipping labels.</p>
           </div>
           <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 hover:border-indigo-200 transition-colors cursor-pointer group">
              <h3 className="font-semibold text-slate-800 mb-2 group-hover:text-indigo-600">Account Security</h3>
              <p className="text-sm text-slate-600">Steps to take if you suspect unauthorized access to your account.</p>
           </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
          <Icons.BookOpen className="w-5 h-5 mr-2 text-indigo-600" />
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
              <h3 className="font-semibold text-slate-900 mb-1">{faq.q}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};