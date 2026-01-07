
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Icons } from '../components/Icons';

interface Chat {
    id: string;
    name: string;
    avatar: string;
    lastMessage: string;
    time: string;
    unread?: number;
    online?: boolean;
}

const MOCK_CHATS: Chat[] = [
    { id: '1', name: 'TechCorp Support', avatar: 'https://picsum.photos/seed/techcorp/100/100', lastMessage: 'We have updated your ticket status.', time: '10:30 AM', unread: 2, online: true },
    { id: '2', name: 'SkyNet Rep', avatar: 'https://picsum.photos/seed/skynet/100/100', lastMessage: 'Please provide your account number.', time: 'Yesterday', online: false },
    { id: '3', name: 'Sarah Miller', avatar: 'https://picsum.photos/seed/sarah/100/100', lastMessage: 'That really helped, thank you!', time: 'Monday', online: true },
];

export const MessagesPage = () => {
    const { currentUser } = useApp();
    const [selectedChat, setSelectedChat] = useState<Chat | null>(MOCK_CHATS[0]);
    const [message, setMessage] = useState('');

    return (
        <div className="h-[calc(100vh-140px)] animate-fade-in flex gap-6">
            {/* Conversations List */}
            <div className="w-[380px] bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <h2 className="text-xl font-black text-slate-900 mb-4">Messages</h2>
                    <div className="relative">
                        <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Search conversations..." 
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                    {MOCK_CHATS.map(chat => (
                        <div 
                            key={chat.id}
                            onClick={() => setSelectedChat(chat)}
                            className={`p-4 rounded-2xl flex items-center gap-4 cursor-pointer transition-all ${
                                selectedChat?.id === chat.id ? 'bg-indigo-50 border-indigo-100' : 'hover:bg-slate-50 border-transparent'
                            } border`}
                        >
                            <div className="relative">
                                <img src={chat.avatar} className="w-12 h-12 rounded-2xl object-cover border border-slate-100 shadow-sm" alt={chat.name} />
                                {chat.online && <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-0.5">
                                    <h4 className="text-sm font-bold text-slate-900 truncate">{chat.name}</h4>
                                    <span className="text-[10px] font-bold text-slate-400">{chat.time}</span>
                                </div>
                                <p className={`text-xs truncate ${chat.unread ? 'text-slate-900 font-bold' : 'text-slate-500'}`}>{chat.lastMessage}</p>
                            </div>
                            {chat.unread ? (
                                <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-lg shadow-indigo-100">
                                    {chat.unread}
                                </div>
                            ) : null}
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Window */}
            <div className="flex-1 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
                {selectedChat ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                            <div className="flex items-center gap-4">
                                <img src={selectedChat.avatar} className="w-10 h-10 rounded-xl object-cover border border-slate-200" alt={selectedChat.name} />
                                <div>
                                    <h3 className="text-sm font-black text-slate-900 leading-none mb-1">{selectedChat.name}</h3>
                                    <div className="flex items-center gap-1.5">
                                        <div className={`w-1.5 h-1.5 rounded-full ${selectedChat.online ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{selectedChat.online ? 'Active Now' : 'Offline'}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-slate-100"><Icons.Shield className="w-5 h-5" /></button>
                                <button className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-slate-100"><Icons.Edit className="w-5 h-5" /></button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-[radial-gradient(at_top_right,rgba(79,70,229,0.02)_0%,transparent_50%)]">
                            <div className="flex justify-center">
                                <span className="px-4 py-1.5 bg-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] rounded-full">Today</span>
                            </div>
                            
                            <div className="flex flex-col gap-6">
                                {/* Opponent Message */}
                                <div className="flex gap-4 max-w-[80%]">
                                    <img src={selectedChat.avatar} className="w-8 h-8 rounded-lg mt-auto" alt="" />
                                    <div className="bg-slate-50 p-4 rounded-2xl rounded-bl-none border border-slate-100 text-sm text-slate-700 leading-relaxed shadow-sm">
                                        {selectedChat.lastMessage}
                                    </div>
                                </div>

                                {/* User Message */}
                                <div className="flex flex-col items-end gap-1.5 ml-auto max-w-[80%]">
                                    <div className="bg-indigo-600 p-4 rounded-2xl rounded-br-none text-sm text-white leading-relaxed shadow-lg shadow-indigo-100 font-medium">
                                        I see, thank you for the update. How long will it take for the refund to process?
                                    </div>
                                    <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mr-2">Sent • 11:20 AM</span>
                                </div>
                            </div>
                        </div>

                        {/* Input Area */}
                        <div className="p-6 border-t border-slate-100">
                            <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-100 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:bg-white transition-all">
                                <button className="p-2.5 text-slate-400 hover:text-indigo-600 transition-colors"><Icons.Paperclip className="w-5 h-5" /></button>
                                <input 
                                    type="text" 
                                    value={message}
                                    onChange={e => setMessage(e.target.value)}
                                    placeholder="Type your message..." 
                                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium placeholder:text-slate-400"
                                />
                                <button className="p-2.5 text-slate-400 hover:text-indigo-600 transition-colors"><Icons.Smile className="w-5 h-5" /></button>
                                <button 
                                    className={`p-3 rounded-xl shadow-lg transition-all ${message.trim() ? 'bg-indigo-600 text-white shadow-indigo-200' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                                >
                                    <Icons.Plus className="w-5 h-5 rotate-45" />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center opacity-40">
                        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                            <Icons.MessageSquare className="w-12 h-12 text-slate-300" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-widest mb-2">Select a Conversation</h3>
                        <p className="text-sm font-bold text-slate-500 max-w-xs">Direct messages between you and businesses or other community members will appear here.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
