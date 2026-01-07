import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Icons } from '../components/Icons';
import { UserRole } from '../types';

type ProfileTab = 'GENERAL' | 'SECURITY' | 'NOTIFICATIONS';

export const ProfilePage = () => {
  const { currentUser, updateProfile, isLoading } = useApp();
  const [activeTab, setActiveTab] = useState<ProfileTab>('GENERAL');
  
  // Local State for forms
  const [name, setName] = useState(currentUser?.name || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [companyName, setCompanyName] = useState(currentUser?.companyName || '');
  const [avatar, setAvatar] = useState(currentUser?.avatar || '');

  // Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [settings, setSettings] = useState(currentUser?.settings || {
    emailNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
    publicProfile: true,
  });

  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (!currentUser) return null;

  const handleGeneralSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile(currentUser.id, { name, bio, companyName, avatar });
      setMessage({ type: 'success', text: 'Identity settings saved successfully.' });
    } catch (e) {
      setMessage({ type: 'error', text: 'Error syncing profile data.' });
    }
  };

  const handleSecuritySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Confirm password must match new password.' });
      return;
    }
    try {
      await updateProfile(currentUser.id, { password: newPassword });
      setMessage({ type: 'success', text: 'Security credentials rotated successfully.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (e) {
      setMessage({ type: 'error', text: 'Critical error updating security layer.' });
    }
  };

  const handleSettingsToggle = async (key: keyof typeof settings) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    setSettings(newSettings);
    await updateProfile(currentUser.id, { settings: newSettings });
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Account Management</h1>
          <p className="text-slate-500">Configure your global identity and security preferences.</p>
        </div>
        <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${
          currentUser.role === UserRole.BUSINESS ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'
        }`}>
          {currentUser.role} Account
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-3">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden sticky top-24">
            <nav className="p-2 space-y-1">
              {[
                { id: 'GENERAL', label: 'Identity', icon: <Icons.User className="w-4 h-4" /> },
                { id: 'SECURITY', label: 'Security', icon: <Icons.Shield className="w-4 h-4" /> },
                { id: 'NOTIFICATIONS', label: 'Preferences', icon: <Icons.Bell className="w-4 h-4" /> },
              ].map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as ProfileTab)}
                  className={`w-full px-4 py-3 text-sm font-bold text-left flex items-center rounded-xl transition-all ${
                    activeTab === tab.id 
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <span className="mr-3">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="md:col-span-9">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            {message && (
               <div className={`m-6 p-4 rounded-2xl flex items-center animate-fade-in border ${
                 message.type === 'success' 
                 ? 'bg-emerald-50 text-emerald-800 border-emerald-100' 
                 : 'bg-red-50 text-red-800 border-red-100'
               }`}>
                 <span className="mr-3">{message.type === 'success' ? <Icons.CheckCircle className="w-5 h-5" /> : <Icons.AlertTriangle className="w-5 h-5" />}</span>
                 <span className="font-bold text-sm">{message.text}</span>
               </div>
            )}

            {activeTab === 'GENERAL' && (
              <form onSubmit={handleGeneralSubmit} className="p-8 space-y-8">
                 <div className="flex flex-col sm:flex-row items-center gap-8 pb-8 border-b border-slate-100">
                    <div className="relative group">
                      <img src={avatar} alt="Profile" className="w-24 h-24 rounded-3xl border-4 border-white shadow-xl object-cover ring-1 ring-slate-100" />
                      <div className="absolute inset-0 bg-slate-900/40 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Icons.Edit className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 w-full">
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Avatar Resource URL</label>
                        <input 
                          type="url" 
                          value={avatar}
                          onChange={(e) => setAvatar(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
                          placeholder="https://images.com/user-avatar.jpg"
                        />
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Display Name</label>
                      <input 
                        type="text" 
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">System Email</label>
                      <input 
                        type="email" 
                        disabled
                        value={currentUser.email}
                        className="w-full px-4 py-3 border border-slate-100 rounded-xl bg-slate-50 text-slate-400 cursor-not-allowed text-sm font-medium"
                      />
                    </div>
                 </div>

                 {currentUser.role === UserRole.BUSINESS && (
                    <div className="p-6 bg-indigo-50/50 rounded-2xl border border-indigo-100 animate-fade-in">
                      <div className="flex items-center gap-2 mb-4">
                        <Icons.Briefcase className="w-5 h-5 text-indigo-600" />
                        <h3 className="font-black text-indigo-900 uppercase text-xs tracking-widest">Business Identity</h3>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-indigo-700 mb-1">Company Registered Name</label>
                          <input 
                            type="text" 
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            className="w-full px-4 py-3 bg-white border border-indigo-200 rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm"
                            placeholder="e.g., kwibl Enterprises Ltd."
                          />
                        </div>
                        <p className="text-[10px] text-indigo-400 font-bold">This name is used to match your account with community complaints.</p>
                      </div>
                    </div>
                 )}

                 <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                      {currentUser.role === UserRole.BUSINESS ? 'Service Description' : 'Personal Bio'}
                    </label>
                    <textarea 
                       rows={5}
                       value={bio}
                       onChange={(e) => setBio(e.target.value)}
                       className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none resize-none"
                       placeholder={currentUser.role === UserRole.BUSINESS ? "Explain your business values and how you handle customer complaints..." : "Share a bit about your experiences or interests..."}
                    />
                 </div>

                 <div className="flex justify-end pt-4">
                    <button 
                      type="submit" 
                      disabled={isLoading}
                      className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-black text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50"
                    >
                       {isLoading ? 'Synchronizing...' : 'Save Configuration'}
                    </button>
                 </div>
              </form>
            )}

            {activeTab === 'SECURITY' && (
              <form onSubmit={handleSecuritySubmit} className="p-8 space-y-6 max-w-lg">
                <h3 className="text-xl font-black text-slate-900">Credential Rotation</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase mb-2">Current Secret</label>
                    <input type="password" required value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div className="h-px bg-slate-100 my-4"></div>
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase mb-2">New Password</label>
                    <input type="password" required minLength={6} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase mb-2">Verify New Password</label>
                    <input type="password" required minLength={6} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                </div>
                <div className="flex justify-end pt-6">
                    <button type="submit" disabled={isLoading} className="px-8 py-3 bg-slate-900 text-white rounded-xl font-black text-sm hover:bg-black shadow-xl">
                       Update Access Layer
                    </button>
                 </div>
              </form>
            )}

            {activeTab === 'NOTIFICATIONS' && (
              <div className="p-8 space-y-4">
                <h3 className="text-xl font-black text-slate-900 mb-6">Global Preferences</h3>
                {[
                  { key: 'emailNotifications', title: 'Critical Email Alerts', desc: 'Sync complaint status changes to your registered email inbox.' },
                  { key: 'pushNotifications', title: 'In-App Live Alerts', desc: 'Receive real-time notifications for replies and upvotes while browsing.' },
                  { key: 'marketingEmails', title: 'Community Newsletter', desc: 'Get weekly digests of top community resolutions and news.' },
                  { key: 'publicProfile', title: 'Profile Discoverability', desc: 'Allow other users to view your bio and resolution statistics.' },
                ].map((item, idx) => (
                  <div key={item.key} className={`flex items-center justify-between p-5 rounded-2xl transition-all border ${settings[item.key as keyof typeof settings] ? 'bg-slate-50 border-slate-200' : 'bg-white border-transparent'}`}>
                    <div className="pr-8">
                      <h4 className="text-sm font-black text-slate-900 mb-1 uppercase tracking-tighter">{item.title}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed font-medium">{item.desc}</p>
                    </div>
                    <button 
                      onClick={() => handleSettingsToggle(item.key as keyof typeof settings)}
                      className={`relative inline-flex h-7 w-12 flex-shrink-0 items-center rounded-full transition-all ring-2 ring-transparent focus:ring-indigo-500 outline-none ${settings[item.key as keyof typeof settings] ? 'bg-indigo-600' : 'bg-slate-300'}`}
                    >
                      <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform ${settings[item.key as keyof typeof settings] ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};