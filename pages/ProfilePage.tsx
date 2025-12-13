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
  
  // Settings State
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
      setMessage({ type: 'success', text: 'Profile updated successfully.' });
    } catch (e) {
      setMessage({ type: 'error', text: 'Failed to update profile.' });
    }
  };

  const handleSecuritySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    // Mock validation against current password would happen here in a real app
    try {
      await updateProfile(currentUser.id, { password: newPassword });
      setMessage({ type: 'success', text: 'Password updated successfully.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (e) {
      setMessage({ type: 'error', text: 'Failed to update password.' });
    }
  };

  const handleSettingsToggle = async (key: keyof typeof settings) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    setSettings(newSettings);
    // Auto-save settings
    await updateProfile(currentUser.id, { settings: newSettings });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Account Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Sidebar Navigation */}
        <div className="md:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <nav className="flex flex-col">
              <button 
                onClick={() => setActiveTab('GENERAL')}
                className={`px-4 py-3 text-sm font-medium text-left flex items-center transition-colors ${activeTab === 'GENERAL' ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600' : 'text-slate-600 hover:bg-slate-50 border-l-4 border-transparent'}`}
              >
                <Icons.User className="w-4 h-4 mr-3" />
                General
              </button>
              <button 
                onClick={() => setActiveTab('SECURITY')}
                className={`px-4 py-3 text-sm font-medium text-left flex items-center transition-colors ${activeTab === 'SECURITY' ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600' : 'text-slate-600 hover:bg-slate-50 border-l-4 border-transparent'}`}
              >
                <Icons.Shield className="w-4 h-4 mr-3" />
                Security
              </button>
              <button 
                onClick={() => setActiveTab('NOTIFICATIONS')}
                className={`px-4 py-3 text-sm font-medium text-left flex items-center transition-colors ${activeTab === 'NOTIFICATIONS' ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600' : 'text-slate-600 hover:bg-slate-50 border-l-4 border-transparent'}`}
              >
                <Icons.Activity className="w-4 h-4 mr-3" />
                Notifications
              </button>
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="md:col-span-9">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            
            {message && (
               <div className={`mb-6 p-4 rounded-lg flex items-center ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                 {message.type === 'success' ? <Icons.CheckCircle className="w-5 h-5 mr-2" /> : <Icons.AlertTriangle className="w-5 h-5 mr-2" />}
                 {message.text}
               </div>
            )}

            {/* General Tab */}
            {activeTab === 'GENERAL' && (
              <form onSubmit={handleGeneralSubmit} className="space-y-6">
                 <div className="flex items-center gap-6 pb-6 border-b border-slate-100">
                    <img src={avatar} alt="Profile" className="w-20 h-20 rounded-full border-2 border-slate-200 object-cover" />
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Avatar URL</label>
                        <input 
                          type="url" 
                          value={avatar}
                          onChange={(e) => setAvatar(e.target.value)}
                          className="w-full px-4 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                      <input 
                        type="text" 
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                      <input 
                        type="email" 
                        disabled
                        value={currentUser.email}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-500 cursor-not-allowed"
                      />
                    </div>
                 </div>

                 {currentUser.role === UserRole.BUSINESS && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
                      <input 
                        type="text" 
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full px-4 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                 )}

                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Bio / Description</label>
                    <textarea 
                       rows={4}
                       value={bio}
                       onChange={(e) => setBio(e.target.value)}
                       className="w-full px-4 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                       placeholder="Tell us a bit about yourself..."
                    />
                 </div>

                 <div className="flex justify-end pt-4">
                    <button 
                      type="submit" 
                      disabled={isLoading}
                      className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm"
                    >
                       {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                 </div>
              </form>
            )}

            {/* Security Tab */}
            {activeTab === 'SECURITY' && (
              <form onSubmit={handleSecuritySubmit} className="space-y-6 max-w-lg">
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Current Password</label>
                   <input 
                      type="password" 
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-4 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                   />
                </div>
                <div className="pt-2">
                   <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
                   <input 
                      type="password" 
                      required
                      minLength={6}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                   />
                </div>
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Confirm New Password</label>
                   <input 
                      type="password" 
                      required
                      minLength={6}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                   />
                </div>
                <div className="flex justify-end pt-4">
                    <button 
                      type="submit" 
                      disabled={isLoading}
                      className="px-6 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors shadow-sm"
                    >
                       Update Password
                    </button>
                 </div>
              </form>
            )}

            {/* Notifications Tab */}
            {activeTab === 'NOTIFICATIONS' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between py-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Email Notifications</h3>
                    <p className="text-xs text-slate-500">Receive updates about your complaints and comments via email.</p>
                  </div>
                  <button 
                    onClick={() => handleSettingsToggle('emailNotifications')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.emailNotifications ? 'bg-indigo-600' : 'bg-slate-200'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between py-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Push Notifications</h3>
                    <p className="text-xs text-slate-500">Receive real-time alerts on your device.</p>
                  </div>
                  <button 
                    onClick={() => handleSettingsToggle('pushNotifications')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.pushNotifications ? 'bg-indigo-600' : 'bg-slate-200'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.pushNotifications ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between py-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Marketing & Updates</h3>
                    <p className="text-xs text-slate-500">Receive news about kwibl features and partners.</p>
                  </div>
                  <button 
                    onClick={() => handleSettingsToggle('marketingEmails')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.marketingEmails ? 'bg-indigo-600' : 'bg-slate-200'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.marketingEmails ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between py-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Public Profile</h3>
                    <p className="text-xs text-slate-500">Allow other community members to see your basic profile info.</p>
                  </div>
                  <button 
                    onClick={() => handleSettingsToggle('publicProfile')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.publicProfile ? 'bg-indigo-600' : 'bg-slate-200'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.publicProfile ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};