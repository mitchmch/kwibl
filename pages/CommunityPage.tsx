
import React, { useState, useMemo } from 'react';
import { Icons } from '../components/Icons';
import { useApp } from '../context/AppContext';

interface Thread {
    id: string;
    title: string;
    content: string;
    author: string;
    category: string;
    replies: number;
    views: string;
    time: string;
    upvotes: number;
    timestamp: number;
    avatarSeed: string;
}

const INITIAL_THREADS: Thread[] = [
    { 
        id: '1', 
        title: 'Consumer Rights in 2025: What you need to know', 
        content: "As we move into 2025, several key updates to consumer protection laws are taking effect. Specifically regarding digital goods and automated service subscriptions. Make sure you check your recurring payments!",
        author: 'LegalEagle', 
        category: 'Education', 
        replies: 42, 
        views: '1.2k', 
        time: '2h ago',
        upvotes: 156,
        timestamp: Date.now() - 7200000,
        avatarSeed: 'LegalEagle'
    },
    { 
        id: '2', 
        title: 'Petition for better rural internet infrastructure', 
        content: "The current state of broadband in rural counties is unacceptable. We are organizing a petition to the regulatory body to mandate minimum speeds of 100Mbps. Join us!",
        author: 'RuralVoice', 
        category: 'Advocacy', 
        replies: 156, 
        views: '5.8k', 
        time: '5h ago',
        upvotes: 342,
        timestamp: Date.now() - 18000000,
        avatarSeed: 'RuralVoice'
    },
    { 
        id: '3', 
        title: 'TechCorp is ignoring refund requests, anyone else?', 
        content: "I've been trying to get a refund for a defective laptop for 3 weeks. Support just auto-closes my tickets. Is this happening to anyone else? We might need a class action.",
        author: 'DisappointedUser', 
        category: 'Support', 
        replies: 89, 
        views: '2.4k', 
        time: '1d ago',
        upvotes: 89,
        timestamp: Date.now() - 86400000,
        avatarSeed: 'DisappointedUser'
    },
];

const TOPICS = ['Refunds', 'Delivery', 'Policy', 'Rights', 'Privacy', 'UK Law', 'EU Rights', 'Education', 'Advocacy', 'Support'];

export const CommunityPage = () => {
    const { currentUser } = useApp();
    const [threads, setThreads] = useState<Thread[]>(INITIAL_THREADS);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [sort, setSort] = useState<'HOT' | 'NEW'>('HOT');
    
    // Modals State
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showGuidelines, setShowGuidelines] = useState(false);
    const [showInsight, setShowInsight] = useState(false);
    const [selectedThread, setSelectedThread] = useState<Thread | null>(null);

    // Derived State
    const filteredThreads = useMemo(() => {
        let result = [...threads];
        if (activeCategory) {
            result = result.filter(t => t.category === activeCategory || (t.category === 'Support' && activeCategory === 'Refunds')); // Simple loose matching for demo
        }
        if (sort === 'NEW') {
            result.sort((a, b) => b.timestamp - a.timestamp);
        } else {
            result.sort((a, b) => b.upvotes - a.upvotes);
        }
        return result;
    }, [threads, activeCategory, sort]);

    const handleCreateThread = (newThread: Thread) => {
        setThreads([newThread, ...threads]);
        setShowCreateModal(false);
    };

    return (
        <div className="animate-fade-in space-y-10 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Community</h1>
                    <p className="text-slate-500 font-medium">Connect, learn, and share with fellow consumers.</p>
                </div>
                <button 
                    onClick={() => setShowCreateModal(true)}
                    className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-black transition-all flex items-center gap-2 active:scale-95"
                >
                    <Icons.Plus className="w-4 h-4" /> Start Discussion
                </button>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 space-y-6">
                    {/* Featured Thread Card */}
                    <div className="bg-indigo-600 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-indigo-200 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-1000">
                            <Icons.Globe className="w-48 h-48" />
                        </div>
                        <div className="relative z-10">
                            <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-[10px] font-black uppercase tracking-widest mb-6 inline-block">Featured Insight</span>
                            <h2 className="text-3xl md:text-4xl font-black leading-tight mb-6 max-w-lg tracking-tighter">How AI is changing the way we handle disputes.</h2>
                            <p className="text-indigo-100 text-lg font-medium mb-10 max-w-md">Our latest platform update introduces neural-sync analysis to help businesses understand you better.</p>
                            <button 
                                onClick={() => setShowInsight(true)}
                                className="bg-white text-indigo-600 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:shadow-xl transition-all"
                            >
                                Read More
                            </button>
                        </div>
                    </div>

                    {/* Filter Bar */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-4">
                            <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em]">
                                {activeCategory ? `Topic: ${activeCategory}` : 'Trending Discussions'}
                            </h3>
                            <div className="flex gap-4">
                                <button 
                                    onClick={() => setSort('HOT')}
                                    className={`text-[10px] font-black uppercase tracking-widest transition-colors ${sort === 'HOT' ? 'text-indigo-600' : 'text-slate-300 hover:text-slate-900'}`}
                                >
                                    Hot
                                </button>
                                <button 
                                    onClick={() => setSort('NEW')}
                                    className={`text-[10px] font-black uppercase tracking-widest transition-colors ${sort === 'NEW' ? 'text-indigo-600' : 'text-slate-300 hover:text-slate-900'}`}
                                >
                                    New
                                </button>
                                {activeCategory && (
                                    <button 
                                        onClick={() => setActiveCategory(null)}
                                        className="text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-600"
                                    >
                                        Clear Filter
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Thread List */}
                        {filteredThreads.length > 0 ? (
                            filteredThreads.map(thread => (
                                <div 
                                    key={thread.id} 
                                    onClick={() => setSelectedThread(thread)}
                                    className="bg-white p-6 rounded-3xl border border-slate-200 hover:border-indigo-300 shadow-sm transition-all group cursor-pointer flex items-center gap-6"
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:text-indigo-500 group-hover:bg-indigo-50 transition-all shadow-inner">
                                        <Icons.MessageSquare className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <span className="px-2 py-0.5 bg-slate-100 rounded-md text-[9px] font-black text-slate-500 uppercase tracking-tighter">{thread.category}</span>
                                            <span className="text-[10px] font-bold text-slate-300">• {thread.time}</span>
                                        </div>
                                        <h4 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug line-clamp-1">{thread.title}</h4>
                                        <div className="flex items-center gap-4 mt-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                            <span className="flex items-center gap-1.5"><Icons.User className="w-3.5 h-3.5" /> {thread.author}</span>
                                            <span className="flex items-center gap-1.5"><Icons.MessageSquare className="w-3.5 h-3.5" /> {thread.replies} Replies</span>
                                            <span className="flex items-center gap-1.5"><Icons.ThumbsUp className="w-3.5 h-3.5" /> {thread.upvotes}</span>
                                            <span className="flex items-center gap-1.5"><Icons.Globe className="w-3.5 h-3.5" /> {thread.views} Views</span>
                                        </div>
                                    </div>
                                    <Icons.Link className="w-5 h-5 text-slate-200 group-hover:text-indigo-400 transition-colors opacity-0 group-hover:opacity-100" />
                                </div>
                            ))
                        ) : (
                            <div className="py-20 text-center bg-white rounded-[2.5rem] border border-dashed border-slate-200">
                                <Icons.MessageSquare className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                                <h3 className="text-xl font-black text-slate-900 mb-2">No discussions found</h3>
                                <p className="text-slate-400 text-sm">Be the first to start a conversation in this topic!</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Tags */}
                    <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-6">Popular Topics</h3>
                        <div className="flex flex-wrap gap-2">
                            {TOPICS.map(tag => (
                                <button 
                                    key={tag} 
                                    onClick={() => setActiveCategory(activeCategory === tag ? null : tag)}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                                        activeCategory === tag 
                                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-200' 
                                        : 'bg-slate-50 text-slate-600 border-slate-100 hover:bg-slate-100 hover:text-slate-900'
                                    }`}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Community Shield */}
                    <div className="bg-slate-950 rounded-3xl p-8 text-white shadow-2xl shadow-slate-200">
                        <Icons.Shield className="w-8 h-8 text-emerald-400 mb-4" />
                        <h4 className="text-lg font-black tracking-tight mb-2">Community Shield</h4>
                        <p className="text-xs text-slate-400 font-bold leading-relaxed mb-6">Our community is moderated by AI to ensure civil and productive discussion. Always protect your private data.</p>
                        <button 
                            onClick={() => setShowGuidelines(true)}
                            className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] transition-all"
                        >
                            View Guidelines
                        </button>
                    </div>

                    {/* Top Contributors */}
                    <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-6">Top Contributors</h3>
                        <div className="space-y-4">
                            {[
                                { name: 'LegalEagle', pts: '1.2k', rank: 1 },
                                { name: 'ConsumerRights', pts: '890', rank: 2 },
                                { name: 'HelperBot', pts: '760', rank: 3 },
                            ].map(user => (
                                <div key={user.name} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} className="w-8 h-8 rounded-lg shadow-sm" alt="" />
                                        <span className="text-xs font-bold text-slate-900">{user.name}</span>
                                    </div>
                                    <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{user.pts} pts</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {showCreateModal && (
                <CreateDiscussionModal 
                    onClose={() => setShowCreateModal(false)} 
                    onSubmit={handleCreateThread} 
                    currentUser={currentUser}
                />
            )}
            {showGuidelines && (
                <GuidelinesModal onClose={() => setShowGuidelines(false)} />
            )}
            {showInsight && (
                <FeaturedInsightModal onClose={() => setShowInsight(false)} />
            )}
            {selectedThread && (
                <ThreadViewModal 
                    thread={selectedThread} 
                    onClose={() => setSelectedThread(null)} 
                />
            )}
        </div>
    );
};

// --- Sub-Components ---

const CreateDiscussionModal = ({ onClose, onSubmit, currentUser }: any) => {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('General');
    const [content, setContent] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newThread: Thread = {
            id: `t${Date.now()}`,
            title,
            category,
            content,
            author: currentUser?.name || 'Anonymous',
            replies: 0,
            views: '0',
            time: 'Just now',
            upvotes: 0,
            timestamp: Date.now(),
            avatarSeed: currentUser?.name || 'Anonymous'
        };
        onSubmit(newThread);
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-slate-900">Start a Discussion</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <Icons.Plus className="w-6 h-6 rotate-45" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Topic Title</label>
                        <input required value={title} onChange={e => setTitle(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500" placeholder="What's on your mind?" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                        <select value={category} onChange={e => setCategory(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500">
                            {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
                            <option value="General">General</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Content</label>
                        <textarea required value={content} onChange={e => setContent(e.target.value)} rows={5} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 resize-none" placeholder="Elaborate on your topic..." />
                    </div>
                    <div className="pt-2 flex justify-end gap-2">
                        <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl text-slate-500 font-bold hover:bg-slate-50">Cancel</button>
                        <button type="submit" className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition-colors">Post Discussion</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const GuidelinesModal = ({ onClose }: any) => (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in relative">
            <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full hover:bg-slate-200">
                <Icons.Plus className="w-5 h-5 rotate-45 text-slate-600" />
            </button>
            <div className="bg-slate-950 p-8 text-white">
                <Icons.Shield className="w-10 h-10 text-emerald-400 mb-4" />
                <h3 className="text-2xl font-black">Community Guidelines</h3>
                <p className="text-slate-400 text-sm mt-2">Keeping kwibl safe for everyone.</p>
            </div>
            <div className="p-8 space-y-6">
                {[
                    { title: 'Be Respectful', text: 'Civil discourse is mandatory. No harassment or hate speech.' },
                    { title: 'Protect Privacy', text: 'Do not post personal information (doxing) of yourself or others.' },
                    { title: 'Stay On Topic', text: 'Keep discussions relevant to consumer rights, complaints, and advice.' },
                    { title: 'No Spam', text: 'Automated content and excessive self-promotion will be removed.' }
                ].map((item, i) => (
                    <div key={i} className="flex gap-4">
                        <div className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">{i + 1}</div>
                        <div>
                            <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                            <p className="text-xs text-slate-500 leading-relaxed">{item.text}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100">
                <button onClick={onClose} className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-sm">I Understand</button>
            </div>
        </div>
    </div>
);

const FeaturedInsightModal = ({ onClose }: any) => (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in relative">
            <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-black/20 text-white rounded-full hover:bg-black/40 z-20 backdrop-blur-sm">
                <Icons.Plus className="w-6 h-6 rotate-45" />
            </button>
            <div className="h-64 bg-indigo-600 relative overflow-hidden flex items-end p-8">
                <Icons.Globe className="absolute -top-10 -right-10 w-64 h-64 text-indigo-500 opacity-50" />
                <div className="relative z-10">
                     <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-[10px] font-black uppercase tracking-widest text-white mb-4 inline-block">Featured Insight</span>
                     <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">How AI is changing dispute resolution.</h2>
                </div>
            </div>
            <div className="p-8 md:p-12 space-y-6">
                <p className="text-lg font-medium text-slate-800 leading-relaxed">
                    The landscape of customer support is shifting beneath our feet. With the introduction of Large Language Models (LLMs) like Gemini, businesses are now able to process thousands of complaints in real-time, identifying sentiment, urgency, and even predicting potential legal risks before a human agent intervenes.
                </p>
                <div className="p-6 bg-slate-50 border-l-4 border-indigo-500 rounded-r-xl">
                    <h4 className="font-bold text-slate-900 mb-2">Key Takeaway</h4>
                    <p className="text-slate-600 text-sm italic">"Neural-sync analysis allows kwibl to match your complaint's emotional tone with the exact department capable of resolving it, bypassing generic support scripts."</p>
                </div>
                <p className="text-slate-600 leading-relaxed">
                    For consumers, this means faster resolution times. Instead of waiting 3-5 business days for a generic email, our platform's AI negotiates on your behalf, categorizing your issue into specific regulatory frameworks (like the Consumer Rights Act 2015) to give your complaint legal weight instantly.
                </p>
                <p className="text-slate-600 leading-relaxed">
                    We are rolling out these features over the next quarter. Stay tuned for "Auto-Escalate," a feature that automatically drafts formal letters if a business fails to respond within their Service Level Agreement (SLA).
                </p>
            </div>
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end">
                <button onClick={onClose} className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold shadow-lg">Close Article</button>
            </div>
        </div>
    </div>
);

const ThreadViewModal = ({ thread, onClose }: { thread: Thread, onClose: () => void }) => (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col animate-fade-in">
            <div className="p-6 md:p-8 border-b border-slate-100 flex justify-between items-start bg-slate-50 rounded-t-3xl">
                <div className="flex gap-4">
                    <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${thread.avatarSeed}`} className="w-12 h-12 rounded-2xl shadow-sm border border-slate-200" alt="" />
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 leading-snug max-w-md">{thread.title}</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-bold text-indigo-600">{thread.author}</span>
                            <span className="text-[10px] text-slate-400">• {thread.time}</span>
                            <span className="px-2 py-0.5 bg-slate-200 rounded text-[9px] font-bold text-slate-600 uppercase">{thread.category}</span>
                        </div>
                    </div>
                </div>
                <button onClick={onClose} className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors">
                    <Icons.Plus className="w-5 h-5 rotate-45 text-slate-500" />
                </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8">
                <div className="prose prose-slate max-w-none">
                    <p className="text-slate-700 text-lg leading-relaxed whitespace-pre-wrap">{thread.content}</p>
                </div>
                
                <div className="mt-12 pt-8 border-t border-slate-100">
                    <h4 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <Icons.MessageSquare className="w-4 h-4" /> Discussion ({thread.replies})
                    </h4>
                    {/* Mock Comments for Thread View */}
                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0" />
                            <div className="bg-slate-50 p-4 rounded-2xl rounded-tl-none border border-slate-100 flex-1">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-bold text-slate-900">CommunityMember_1</span>
                                    <span className="text-[10px] text-slate-400">1h ago</span>
                                </div>
                                <p className="text-sm text-slate-600">Great points raised here. Especially about the subscription traps.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex-shrink-0" />
                            <div className="bg-indigo-50 p-4 rounded-2xl rounded-tl-none border border-indigo-100 flex-1">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-bold text-indigo-900">Mod_Bot</span>
                                    <span className="text-[10px] text-indigo-400">Just now</span>
                                </div>
                                <p className="text-sm text-indigo-800">This topic has been pinned to the "Education" category for visibility.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-3xl flex gap-3">
                 <input type="text" placeholder="Add to the discussion..." className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm" />
                 <button className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-black">Post</button>
            </div>
        </div>
    </div>
);
