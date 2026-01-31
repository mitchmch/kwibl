
import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Icons } from '../components/Icons';

interface Message {
  id: string;
  sender: 'me' | 'them';
  text: string;
  timestamp: Date;
  type: 'text' | 'image' | 'system';
}

interface Chat {
    id: string;
    name: string;
    avatar: string;
    role: string;
    lastMessage: string;
    time: string;
    unread: number;
    online: boolean;
    messages: Message[];
    isBlocked?: boolean;
}

const COMMON_EMOJIS = ['👍', '👋', '😊', '😂', '❤️', '🎉', '🤔', '👀', '🔥', '✨'];

const INITIAL_CHATS: Chat[] = [
    { 
        id: '1', 
        name: 'TechCorp Support', 
        avatar: 'https://picsum.photos/seed/techcorp/100/100', 
        role: 'Support Agent',
        lastMessage: 'We have updated your ticket status.', 
        time: '10:30 AM', 
        unread: 2, 
        online: true,
        messages: [
            { id: 'm1', sender: 'me', text: 'Hi, I have an issue with my recent order #12345.', timestamp: new Date(Date.now() - 86400000), type: 'text' },
            { id: 'm2', sender: 'them', text: 'Hello! I can certainly help with that. Could you please describe the issue?', timestamp: new Date(Date.now() - 86300000), type: 'text' },
            { id: 'm3', sender: 'me', text: 'The item arrived damaged. The packaging was crushed.', timestamp: new Date(Date.now() - 86200000), type: 'text' },
            { id: 'm4', sender: 'them', text: 'I am sorry to hear that. I have updated your ticket status and initiated a replacement.', timestamp: new Date(Date.now() - 3600000), type: 'text' },
            { id: 'm5', sender: 'them', text: 'We have updated your ticket status.', timestamp: new Date(Date.now() - 1800000), type: 'text' }
        ]
    },
    { 
        id: '2', 
        name: 'SkyNet Rep', 
        avatar: 'https://picsum.photos/seed/skynet/100/100', 
        role: 'Billing Specialist',
        lastMessage: 'Please provide your account number.', 
        time: 'Yesterday', 
        unread: 0, 
        online: false,
        messages: [
             { id: 'm1', sender: 'them', text: 'We noticed a discrepancy in your billing address.', timestamp: new Date(Date.now() - 172800000), type: 'text' },
             { id: 'm2', sender: 'them', text: 'Please provide your account number.', timestamp: new Date(Date.now() - 86400000), type: 'text' }
        ]
    },
    { 
        id: '3', 
        name: 'Sarah Miller', 
        avatar: 'https://picsum.photos/seed/sarah/100/100', 
        role: 'Community Member',
        lastMessage: 'That really helped, thank you!', 
        time: 'Mon', 
        unread: 0, 
        online: true,
        messages: [
            { id: 'm1', sender: 'me', text: 'Hey Sarah, did you get the refund from TechCorp?', timestamp: new Date(Date.now() - 259200000), type: 'text' },
            { id: 'm2', sender: 'them', text: 'Yes! It took about 5 days but it came through.', timestamp: new Date(Date.now() - 258200000), type: 'text' },
            { id: 'm3', sender: 'me', text: 'Great to know, thanks.', timestamp: new Date(Date.now() - 258100000), type: 'text' },
            { id: 'm4', sender: 'them', text: 'That really helped, thank you!', timestamp: new Date(Date.now() - 258000000), type: 'text' }
        ]
    },
];

export const MessagesPage = () => {
    const { currentUser } = useApp();
    const [chats, setChats] = useState<Chat[]>(INITIAL_CHATS);
    const [selectedChatId, setSelectedChatId] = useState<string | null>('1');
    const [inputText, setInputText] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const selectedChat = chats.find(c => c.id === selectedChatId);

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [selectedChat?.messages]);

    const handleSendMessage = () => {
        if (!inputText.trim() || !selectedChat) return;

        const newMessage: Message = {
            id: `new_${Date.now()}`,
            sender: 'me',
            text: inputText,
            timestamp: new Date(),
            type: 'text'
        };

        setChats(prev => prev.map(c => {
            if (c.id === selectedChatId) {
                return {
                    ...c,
                    messages: [...c.messages, newMessage],
                    lastMessage: 'You: ' + inputText,
                    time: 'Just now'
                };
            }
            return c;
        }));

        setInputText('');
        setShowEmojiPicker(false);

        // Simulate reply
        if (selectedChat.id === '1') {
            setTimeout(() => {
                const reply: Message = {
                    id: `rep_${Date.now()}`,
                    sender: 'them',
                    text: 'Thank you for that information. I am checking our system now.',
                    timestamp: new Date(),
                    type: 'text'
                };
                setChats(prev => prev.map(c => {
                    if (c.id === selectedChatId) {
                        return {
                            ...c,
                            messages: [...c.messages, reply],
                            lastMessage: reply.text,
                            time: 'Just now'
                        };
                    }
                    return c;
                }));
            }, 1500);
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0] && selectedChat) {
            // In a real app, upload to server. Here we just pretend.
            const newMessage: Message = {
                id: `img_${Date.now()}`,
                sender: 'me',
                text: 'Sent an image',
                timestamp: new Date(),
                type: 'image'
            };
            
            setChats(prev => prev.map(c => {
                if (c.id === selectedChatId) {
                    return {
                        ...c,
                        messages: [...c.messages, newMessage],
                        lastMessage: 'Sent an attachment',
                        time: 'Just now'
                    };
                }
                return c;
            }));
        }
    };

    const handleBlock = () => {
        if (!selectedChat) return;
        setChats(prev => prev.map(c => {
            if (c.id === selectedChatId) {
                const isBlocked = !c.isBlocked;
                return {
                    ...c,
                    isBlocked,
                    messages: [...c.messages, {
                        id: `sys_${Date.now()}`,
                        sender: 'me',
                        text: isBlocked ? 'You blocked this contact.' : 'You unblocked this contact.',
                        timestamp: new Date(),
                        type: 'system'
                    }]
                };
            }
            return c;
        }));
    };

    const filteredChats = chats.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="h-[calc(100vh-140px)] animate-fade-in flex gap-6">
            {/* Conversations List */}
            <div className="w-full md:w-[380px] bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-black text-slate-900">Messages</h2>
                        <button className="p-2 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 hover:text-indigo-600 transition-colors">
                            <Icons.Edit className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="relative">
                        <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                            type="text" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search conversations..." 
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                    {filteredChats.map(chat => (
                        <div 
                            key={chat.id}
                            onClick={() => setSelectedChatId(chat.id)}
                            className={`p-4 rounded-2xl flex items-center gap-4 cursor-pointer transition-all border ${
                                selectedChatId === chat.id 
                                ? 'bg-indigo-50 border-indigo-100 shadow-sm' 
                                : 'bg-white hover:bg-slate-50 border-transparent hover:border-slate-100'
                            }`}
                        >
                            <div className="relative flex-shrink-0">
                                <img src={chat.avatar} className="w-12 h-12 rounded-2xl object-cover border border-slate-100 shadow-sm" alt={chat.name} />
                                {chat.online && <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-0.5">
                                    <h4 className={`text-sm font-bold truncate ${selectedChatId === chat.id ? 'text-indigo-900' : 'text-slate-900'}`}>{chat.name}</h4>
                                    <span className="text-[10px] font-bold text-slate-400">{chat.time}</span>
                                </div>
                                <p className={`text-xs truncate ${chat.unread ? 'text-slate-900 font-bold' : 'text-slate-500'}`}>{chat.lastMessage}</p>
                            </div>
                            {chat.unread > 0 && (
                                <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-lg shadow-indigo-100">
                                    {chat.unread}
                                </div>
                            )}
                        </div>
                    ))}
                    {filteredChats.length === 0 && (
                        <div className="text-center py-10 opacity-50">
                            <p className="text-sm font-bold text-slate-400">No conversations found.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Chat Window */}
            <div className={`flex-1 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col overflow-hidden ${!selectedChat ? 'hidden md:flex' : 'flex'}`}>
                {selectedChat ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 backdrop-blur-sm z-10">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                   <img src={selectedChat.avatar} className="w-10 h-10 rounded-xl object-cover border border-slate-200 shadow-sm" alt={selectedChat.name} />
                                   {selectedChat.isBlocked && <div className="absolute inset-0 bg-slate-900/50 rounded-xl flex items-center justify-center"><Icons.Activity className="w-5 h-5 text-white" /></div>}
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-slate-900 leading-none mb-1">{selectedChat.name}</h3>
                                    <div className="flex items-center gap-1.5">
                                        {selectedChat.isBlocked ? (
                                             <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Blocked</span>
                                        ) : (
                                            <>
                                                <div className={`w-1.5 h-1.5 rounded-full ${selectedChat.online ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{selectedChat.role} • {selectedChat.online ? 'Active Now' : 'Offline'}</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={handleBlock}
                                    className={`p-2.5 rounded-xl transition-all shadow-sm border border-transparent ${
                                        selectedChat.isBlocked 
                                        ? 'bg-red-50 text-red-600 border-red-100' 
                                        : 'text-slate-400 hover:text-indigo-600 hover:bg-white hover:border-slate-100'
                                    }`}
                                    title={selectedChat.isBlocked ? "Unblock User" : "Block User"}
                                >
                                    <Icons.Shield className="w-5 h-5" />
                                </button>
                                <button className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-slate-100">
                                    <Icons.Settings className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[radial-gradient(at_top_right,rgba(79,70,229,0.02)_0%,transparent_50%)]">
                            <div className="flex justify-center">
                                <span className="px-4 py-1.5 bg-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] rounded-full">Conversation Started</span>
                            </div>
                            
                            {selectedChat.messages.map((msg, idx) => {
                                const isLast = idx === selectedChat.messages.length - 1;
                                
                                if (msg.type === 'system') {
                                    return (
                                        <div key={msg.id} className="flex justify-center my-4">
                                            <span className="text-xs text-slate-400 font-medium italic bg-slate-50 px-3 py-1 rounded-full border border-slate-100">{msg.text}</span>
                                        </div>
                                    );
                                }

                                return (
                                    <div key={msg.id} className={`flex gap-4 max-w-[85%] ${msg.sender === 'me' ? 'ml-auto flex-row-reverse' : ''}`}>
                                        <img 
                                            src={msg.sender === 'me' ? currentUser?.avatar : selectedChat.avatar} 
                                            className={`w-8 h-8 rounded-lg mt-auto shadow-sm border border-white ${msg.sender === 'me' ? 'order-1' : ''}`} 
                                            alt="" 
                                        />
                                        <div className={`flex flex-col gap-1 ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}>
                                            <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm relative group ${
                                                msg.sender === 'me' 
                                                ? 'bg-indigo-600 text-white rounded-br-none shadow-indigo-100' 
                                                : 'bg-slate-50 text-slate-700 rounded-bl-none border border-slate-100'
                                            }`}>
                                                {msg.type === 'image' ? (
                                                    <div className="flex items-center gap-2 italic opacity-90">
                                                        <Icons.Image className="w-4 h-4" /> Attached Image
                                                    </div>
                                                ) : msg.text}
                                                
                                                {/* Timestamp Tooltip */}
                                                <div className={`absolute bottom-full mb-2 px-2 py-1 bg-black text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 ${
                                                    msg.sender === 'me' ? 'right-0' : 'left-0'
                                                }`}>
                                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                            {isLast && msg.sender === 'me' && (
                                                <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mr-1">Delivered</span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        {selectedChat.isBlocked ? (
                            <div className="p-6 border-t border-slate-100 bg-slate-50 text-center">
                                <p className="text-sm font-bold text-slate-400">You cannot reply to this conversation.</p>
                                <button onClick={handleBlock} className="mt-2 text-xs font-black text-indigo-600 hover:underline uppercase tracking-widest">Unblock</button>
                            </div>
                        ) : (
                            <div className="p-6 border-t border-slate-100 bg-white relative">
                                {showEmojiPicker && (
                                    <div className="absolute bottom-24 left-6 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 grid grid-cols-5 gap-2 animate-fade-in z-20">
                                        {COMMON_EMOJIS.map(emoji => (
                                            <button 
                                                key={emoji}
                                                onClick={() => { setInputText(prev => prev + emoji); setShowEmojiPicker(false); }}
                                                className="p-2 hover:bg-slate-50 rounded-lg transition-colors text-xl"
                                            >
                                                {emoji}
                                            </button>
                                        ))}
                                    </div>
                                )}
                                <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-100 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:bg-white transition-all shadow-sm">
                                    <button 
                                        onClick={() => fileInputRef.current?.click()}
                                        className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-xl transition-all"
                                        title="Attach File"
                                    >
                                        <Icons.Paperclip className="w-5 h-5" />
                                    </button>
                                    <input 
                                        type="file" 
                                        ref={fileInputRef} 
                                        className="hidden" 
                                        onChange={handleFileUpload} 
                                    />
                                    
                                    <input 
                                        type="text" 
                                        value={inputText}
                                        onChange={e => setInputText(e.target.value)}
                                        onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                                        placeholder="Type your message..." 
                                        className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium placeholder:text-slate-400"
                                    />
                                    
                                    <button 
                                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                        className={`p-3 rounded-xl transition-all ${showEmojiPicker ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400 hover:text-indigo-600 hover:bg-white'}`}
                                        title="Emojis"
                                    >
                                        <Icons.Smile className="w-5 h-5" />
                                    </button>
                                    
                                    <button 
                                        onClick={handleSendMessage}
                                        disabled={!inputText.trim()}
                                        className={`p-3 rounded-xl shadow-lg transition-all flex items-center justify-center ${
                                            inputText.trim() 
                                            ? 'bg-indigo-600 text-white shadow-indigo-200 hover:scale-105 active:scale-95' 
                                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                        }`}
                                    >
                                        <Icons.Plus className="w-5 h-5 rotate-90" />
                                    </button>
                                </div>
                            </div>
                        )}
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
