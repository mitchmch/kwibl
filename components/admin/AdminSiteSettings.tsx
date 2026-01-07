import React from 'react';
import { Icons } from '../Icons';

export const AdminPageBanners = () => {
    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                   <h2 className="text-2xl font-bold text-slate-900">Page Banners</h2>
                   <p className="text-slate-500">Manage geo-targeted banner images for different countries</p>
                </div>
                <button className="bg-orange-500 text-white px-4 py-2 rounded-lg font-bold shadow-lg shadow-orange-200 flex items-center">
                    <Icons.Plus className="w-4 h-4 mr-2" /> Add Banner
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-orange-500">
                        <Icons.Globe className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-slate-900">22</div>
                        <div className="text-sm text-slate-500">Total Countries</div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500">
                        <Icons.Image className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-slate-900">21</div>
                        <div className="text-sm text-slate-500">Active Banners</div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-yellow-50 rounded-full flex items-center justify-center text-yellow-500">
                        <Icons.AlertCircle className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-slate-900">1</div>
                        <div className="text-sm text-slate-500">Inactive Banners</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                    { country: 'Australia', code: 'AU', img: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?auto=format&fit=crop&w=400&q=80', label: 'Sydney Opera House' },
                    { country: 'Austria', code: 'AT', img: 'https://images.unsplash.com/photo-1516550893723-4d4563af88d6?auto=format&fit=crop&w=400&q=80', label: 'Schönbrunn Palace' },
                    { country: 'Belgium', code: 'BE', img: 'https://images.unsplash.com/photo-1491557345352-5929e343eb89?auto=format&fit=crop&w=400&q=80', label: 'Grand Place Brussels' },
                    { country: 'Canada', code: 'CA', img: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&w=400&q=80', label: 'Banff National Park' },
                    { country: 'Czech Republic', code: 'CZ', img: 'https://images.unsplash.com/photo-1541849546-2165492d06d6?auto=format&fit=crop&w=400&q=80', label: 'Prague' },
                    { country: 'Germany', code: 'DE', img: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=400&q=80', label: 'Neuschwanstein Castle' },
                ].map(item => (
                    <div key={item.code} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden group">
                        <div className="relative h-48 bg-slate-100 overflow-hidden">
                            <img src={item.img} alt={item.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                                Active
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
                                <div className="font-bold text-sm">{item.label}</div>
                            </div>
                        </div>
                        <div className="p-4">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <div className="font-bold text-slate-900">{item.country}</div>
                                    <div className="text-xs text-slate-500 font-mono">{item.code}</div>
                                </div>
                                <div className="w-12 h-6 bg-orange-500 rounded-full p-1 cursor-pointer">
                                    <div className="w-4 h-4 bg-white rounded-full ml-auto shadow-sm"></div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button className="flex-1 py-2 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 flex items-center justify-center gap-2">
                                    <Icons.Edit className="w-3 h-3" /> Edit
                                </button>
                                <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50">
                                    <Icons.Upload className="w-4 h-4 text-slate-400" />
                                </button>
                                <button className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                                    <Icons.Trash className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const AdminNavigation = () => {
    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                   <h2 className="text-2xl font-bold text-slate-900">Navigation Management</h2>
                   <p className="text-slate-500">Manage the main navigation bar items and their display order</p>
                </div>
                <button className="bg-orange-500 text-white px-4 py-2 rounded-lg font-bold shadow-lg shadow-orange-200 flex items-center">
                    <Icons.Plus className="w-4 h-4 mr-2" /> Add Menu Item
                </button>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-lg text-slate-900 mb-2 flex items-center gap-2">
                    <Icons.AlertCircle className="w-5 h-5" /> Live Preview
                </h3>
                <p className="text-sm text-slate-500 mb-6">Preview of how the navigation will appear</p>
                
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 flex items-center gap-4">
                    <div className="w-8 h-8 bg-orange-500 rounded text-white flex items-center justify-center font-bold">K</div>
                    <div className="text-sm font-bold text-slate-700 uppercase tracking-wide">Karen Home</div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-lg text-slate-900 mb-2 flex items-center gap-2">
                    <Icons.Sliders className="w-5 h-5" /> Header Tools
                </h3>
                <p className="text-sm text-slate-500 mb-6">Control visibility of header action buttons</p>

                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl bg-white hover:border-slate-300 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-orange-50 text-orange-500 rounded-lg">
                                <Icons.Globe className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="font-bold text-slate-900">Language Switcher</div>
                                <div className="text-xs text-slate-500">Show the language selection dropdown in the header</div>
                            </div>
                        </div>
                        <div className="w-12 h-6 bg-slate-200 rounded-full p-1 cursor-pointer">
                            <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl bg-white hover:border-slate-300 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-orange-50 text-orange-500 rounded-lg">
                                <Icons.MessageSquare className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="font-bold text-slate-900">Voice Commands</div>
                                <div className="text-xs text-slate-500">Show the voice-to-text button in the header</div>
                            </div>
                        </div>
                        <div className="w-12 h-6 bg-orange-500 rounded-full p-1 cursor-pointer">
                            <div className="w-4 h-4 bg-white rounded-full ml-auto shadow-sm"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const AdminTranslations = () => {
    return (
        <div className="space-y-8 animate-fade-in">
            <div>
               <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                   <span className="text-3xl">文</span> Translation Management
               </h2>
               <p className="text-slate-500">Review, edit, and approve KAREN Agent generated translations</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="text-sm font-medium text-slate-500 mb-2">Total Keys</div>
                    <div className="text-3xl font-bold text-slate-900">103</div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="text-sm font-medium text-slate-500 mb-2">Translated</div>
                    <div className="text-3xl font-bold text-blue-600">0</div>
                    <div className="text-xs text-slate-400 mt-1">0% complete</div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="text-sm font-medium text-slate-500 mb-2">Pending Review</div>
                    <div className="text-3xl font-bold text-orange-600">0</div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="w-full md:w-64">
                    <div className="relative">
                        <select className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl appearance-none">
                            <option>🇪🇸 Español</option>
                            <option>🇫🇷 Français</option>
                            <option>🇩🇪 Deutsch</option>
                        </select>
                        <div className="absolute top-3.5 right-4 pointer-events-none text-slate-400">▼</div>
                    </div>
                </div>
                
                <div className="flex-1 relative w-full">
                    <Icons.Search className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                    <input type="text" placeholder="Search keys or text..." className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl" />
                </div>

                <button className="bg-orange-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-orange-200 flex items-center whitespace-nowrap">
                    <Icons.Zap className="w-4 h-4 mr-2" /> Generate All Missing
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="flex border-b border-slate-200 bg-slate-50 p-2 overflow-x-auto">
                    {['Common', 'Navigation', 'Authentication', 'Complaints', 'Dashboard', 'Footer'].map(tab => (
                        <button key={tab} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'Common' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}>
                            {tab}
                        </button>
                    ))}
                </div>
                
                <div className="p-6">
                    <h3 className="font-bold text-xl text-slate-900 mb-1">Common Translations</h3>
                    <p className="text-sm text-slate-500 mb-6">Manage translations for the common namespace</p>

                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-xs font-bold text-slate-400 uppercase border-b border-slate-100">
                                <th className="pb-3 w-1/4">Key</th>
                                <th className="pb-3 w-1/4">English (Source)</th>
                                <th className="pb-3 w-1/4">Translation</th>
                                <th className="pb-3 w-1/6">Status</th>
                                <th className="pb-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            <tr className="group">
                                <td className="py-4 text-sm font-mono text-slate-600">buttons.submit</td>
                                <td className="py-4 text-sm text-slate-900">Submit</td>
                                <td className="py-4 text-sm text-slate-400 italic">Not translated</td>
                                <td className="py-4">
                                    <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200">Missing</span>
                                </td>
                                <td className="py-4 text-right flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100"><Icons.Zap className="w-4 h-4" /></button>
                                    <button className="p-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-100"><Icons.Edit className="w-4 h-4" /></button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export const AdminFooter = () => {
    return (
        <div className="space-y-8 animate-fade-in">
            <div>
               <h2 className="text-2xl font-bold text-slate-900">Footer Management</h2>
               <p className="text-slate-500">Manage footer sections, links, and settings</p>
            </div>

            <div className="bg-slate-100 p-2 rounded-xl flex gap-2 w-fit mb-6">
                {['Sections', 'Links', 'Social Media', 'Settings'].map(tab => (
                    <button key={tab} className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${tab === 'Sections' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>
                        {tab}
                    </button>
                ))}
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-xl text-slate-900 mb-2">Add New Section</h3>
                <p className="text-sm text-slate-500 mb-6">Create a new footer column</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                        <input type="text" defaultValue="Platform" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Display Order</label>
                        <input type="number" defaultValue="0" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg" />
                    </div>
                    <div className="md:col-span-1">
                        <button className="bg-orange-300 text-white w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2">
                            <Icons.Plus className="w-4 h-4" /> Add Section
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-xl text-slate-900 mb-2">Existing Sections</h3>
                <p className="text-sm text-slate-500 mb-6">Drag to reorder sections</p>

                <div className="space-y-4">
                    {[
                        { title: 'Platform', order: 1 },
                        { title: 'Company', order: 2 },
                    ].map((sec) => (
                        <div key={sec.title} className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-white hover:border-slate-300 transition-colors">
                            <div className="flex items-center gap-4">
                                <Icons.Menu className="w-5 h-5 text-slate-400 cursor-move" />
                                <div>
                                    <div className="font-bold text-slate-900">{sec.title}</div>
                                    <div className="text-xs text-slate-500">Order: {sec.order}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-6 bg-orange-200 rounded-full p-1 cursor-pointer relative">
                                    <div className="w-4 h-4 bg-white rounded-full absolute right-1 shadow-sm"></div>
                                </div>
                                <button className="text-slate-400 hover:text-slate-600 font-medium text-sm">Edit</button>
                                <button className="text-slate-400 hover:text-red-500"><Icons.Trash className="w-4 h-4" /></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export const AdminHomepage = () => {
    return (
        <div className="space-y-8 animate-fade-in">
            <div>
               <h2 className="text-2xl font-bold text-slate-900">Homepage Management</h2>
               <p className="text-slate-500">Manage homepage content and sections</p>
            </div>

            <div className="bg-slate-100 p-2 rounded-xl flex flex-wrap gap-2 mb-6">
                <button className="px-4 py-2 rounded-lg text-sm font-bold bg-white shadow-sm text-slate-900">Section Visibility</button>
                {['Multimedia', 'Hero', 'Key Features', 'Process', 'For Individuals', 'For Businesses', 'Community', 'Sections', 'Announcements'].map(tab => (
                    <button key={tab} className="px-4 py-2 rounded-lg text-sm font-medium text-slate-500 hover:text-slate-700">
                        {tab}
                    </button>
                ))}
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-xl text-slate-900 mb-2">Section Visibility</h3>
                <p className="text-sm text-slate-500 mb-8">Enable or disable homepage sections and reorder them</p>

                <table className="w-full">
                    <thead>
                        <tr className="text-left text-xs font-bold text-slate-500 uppercase">
                            <th className="pb-4 pl-4">Section</th>
                            <th className="pb-4">Status</th>
                            <th className="pb-4">Background</th>
                            <th className="pb-4">Title Color</th>
                            <th className="pb-4">Description Color</th>
                            <th className="pb-4 text-right pr-4">Enabled</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {[
                            { name: 'Hero Banner', key: '(hero)', bg: 'bg-red-500' },
                            { name: 'Multimedia Gallery', key: '(multimedia_gallery)', bg: 'bg-white border border-slate-200' },
                            { name: 'Customer Complaints', key: '(complaints_feed)', bg: 'bg-blue-100' },
                            { name: 'Fast 3 Step Process', key: '(3_step_process)', bg: 'bg-orange-50 border border-orange-200' },
                        ].map((row, i) => (
                            <tr key={row.name} className="hover:bg-slate-50">
                                <td className="py-4 pl-4">
                                    <div className="flex items-center gap-3">
                                        <Icons.Menu className="w-4 h-4 text-slate-400 cursor-move" />
                                        <div>
                                            <div className="font-bold text-sm text-slate-900">{row.name}</div>
                                            <div className="text-xs text-slate-400 font-mono">{row.key}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4">
                                    <div className="flex items-center text-green-600 text-sm font-bold">
                                        <Icons.CheckCircle className="w-4 h-4 mr-1" /> Visible
                                    </div>
                                </td>
                                <td className="py-4">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-8 h-6 rounded ${row.bg}`}></div>
                                        <span className="text-xs text-slate-500 cursor-pointer hover:underline">Reset</span>
                                    </div>
                                </td>
                                <td className="py-4"><div className="w-8 h-6 rounded border border-slate-300 bg-white"></div></td>
                                <td className="py-4"><div className="w-8 h-6 rounded bg-gray-500"></div></td>
                                <td className="py-4 pr-4 text-right">
                                    <div className="w-10 h-6 bg-orange-500 rounded-full p-1 ml-auto cursor-pointer relative">
                                        <div className="w-4 h-4 bg-white rounded-full absolute right-1 shadow-sm"></div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
