import React from 'react';
import { Icons } from '../Icons';

export const AdminNews = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Platform News & Updates</h2>
          <p className="text-slate-500">Manage announcements for customers and businesses</p>
        </div>
        <button className="bg-orange-500 text-white px-4 py-2 rounded-lg font-bold shadow-lg shadow-orange-200 flex items-center">
          <Icons.Plus className="w-4 h-4 mr-2" /> Create Post
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex gap-4">
          <button className="px-4 py-1.5 bg-white shadow-sm border border-slate-200 rounded-lg text-sm font-bold text-slate-900">All Posts</button>
          <button className="px-4 py-1.5 text-sm font-medium text-slate-500 hover:text-slate-900">Drafts</button>
          <button className="px-4 py-1.5 text-sm font-medium text-slate-500 hover:text-slate-900">Scheduled</button>
        </div>

        <div className="divide-y divide-slate-100">
          {[
            { title: 'New Privacy Shield Features', author: 'Admin', date: 'Oct 24, 2025', status: 'Published' },
            { title: 'Holiday Support Hours Announcement', author: 'Admin', date: 'Oct 20, 2025', status: 'Published' },
            { title: 'System Maintenance: Sunday 2 AM', author: 'DevTeam', date: 'Oct 15, 2025', status: 'Published' },
          ].map((post, i) => (
            <div key={i} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                  <Icons.Newspaper className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{post.title}</h4>
                  <div className="text-xs text-slate-400 mt-1">By {post.author} • {post.date}</div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full">{post.status}</span>
                <div className="flex gap-2">
                  <button className="p-2 text-slate-400 hover:text-slate-600"><Icons.Edit className="w-4 h-4" /></button>
                  <button className="p-2 text-slate-400 hover:text-red-500"><Icons.Trash className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
