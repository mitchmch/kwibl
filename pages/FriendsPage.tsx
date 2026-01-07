
import React, { useState } from 'react';
import { Icons } from '../components/Icons';

interface Person {
    id: string;
    name: string;
    role: string;
    avatar: string;
    following: boolean;
    location: string;
}

const MOCK_PEOPLE: Person[] = [
    { id: '1', name: 'James Wilson', role: 'Consumer Advocate', avatar: 'https://picsum.photos/seed/james/100/100', following: true, location: 'London, UK' },
    { id: '2', name: 'SkyNet Official', role: 'Business Channel', avatar: 'https://picsum.photos/seed/skynet/100/100', following: false, location: 'Global' },
    { id: '3', name: 'Emily Chen', role: 'Retail Enthusiast', avatar: 'https://picsum.photos/seed/emily/100/100', following: false, location: 'Manchester, UK' },
    { id: '4', name: 'Global Logistics', role: 'Verified Business', avatar: 'https://picsum.photos/seed/logistics/100/100', following: true, location: 'Rotterdam, NL' },
];

export const FriendsPage = () => {
    const [activeTab, setActiveTab] = useState<'MY_NETWORK' | 'DISCOVER'>('MY_NETWORK');
    const [search, setSearch] = useState('');

    const filtered = MOCK_PEOPLE.filter(p => {
        if (activeTab === 'MY_NETWORK') return p.following;
        return true;
    }).filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="animate-fade-in space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Connections</h1>
                    <p className="text-slate-500 font-medium">Manage your network of users and businesses.</p>
                </div>
                <div className="flex bg-slate-100 p-1.5 rounded-2xl">
                    <button 
                        onClick={() => setActiveTab('MY_NETWORK')}
                        className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                            activeTab === 'MY_NETWORK' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                        }`}
                    >
                        My Network
                    </button>
                    <button 
                        onClick={() => setActiveTab('DISCOVER')}
                        className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                            activeTab === 'DISCOVER' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                        }`}
                    >
                        Discover
                    </button>
                </div>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
                <Icons.Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                    type="text" 
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search people or companies..." 
                    className="w-full pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-3xl text-sm font-bold shadow-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
            </div>

            {/* Network Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filtered.map(person => (
                    <div key={person.id} className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all text-center group">
                        <div className="relative inline-block mb-6">
                            <img src={person.avatar} className="w-24 h-24 rounded-[2rem] object-cover shadow-2xl border-4 border-white group-hover:scale-105 transition-transform" alt="" />
                            <div className="absolute -bottom-2 -right-2 bg-indigo-600 p-1.5 rounded-xl text-white shadow-lg border-2 border-white">
                                <Icons.CheckCircle className="w-4 h-4" />
                            </div>
                        </div>
                        <h3 className="text-lg font-black text-slate-900 mb-1">{person.name}</h3>
                        <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-4">{person.role}</p>
                        <div className="flex items-center justify-center gap-1.5 text-slate-400 text-[10px] font-bold mb-8">
                            <Icons.Globe className="w-3.5 h-3.5" />
                            {person.location}
                        </div>
                        <div className="flex gap-2">
                            <button className="flex-1 py-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-[10px] font-black text-slate-900 uppercase tracking-widest transition-all">Profile</button>
                            <button className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                person.following ? 'bg-indigo-50 text-indigo-600' : 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
                            }`}>
                                {person.following ? 'Unfollow' : 'Follow'}
                            </button>
                        </div>
                    </div>
                ))}

                {filtered.length === 0 && (
                    <div className="col-span-full py-20 flex flex-col items-center opacity-30">
                        <Icons.Users className="w-16 h-16 text-slate-300 mb-4" />
                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-widest">No Results</h3>
                        <p className="text-sm font-bold text-slate-500">Try searching for something else or explore the discover tab.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
