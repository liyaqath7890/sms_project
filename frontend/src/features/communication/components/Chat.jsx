import React, { useState } from 'react';
import { Send, User, Search, Phone, Video, MoreVertical, Paperclip } from 'lucide-react';
import CustomCard from '../../../components/custom/CustomCard';

const dummyChats = [
  { id: 1, name: 'Dr. Sarah Wilson', role: 'Mathematics Teacher', status: 'Online', lastMsg: 'The midterm grades are...', time: '10:30 AM', avatar: 'SW' },
  { id: 2, name: 'Robert Smith', role: 'Guardian (Alice)', status: 'Offline', lastMsg: 'Thank you for the update.', time: 'Yesterday', avatar: 'RS' },
  { id: 3, name: 'Principal Office', role: 'Administration', status: 'Online', lastMsg: 'Please check the new memo.', time: '09:15 AM', avatar: 'PO' },
];

const dummyMessages = [
  { id: 1, senderId: 1, text: 'Hello! I noticed Alice was absent today.', time: '10:00 AM', isMe: false },
  { id: 2, senderId: 0, text: 'Yes, she has a mild fever. I have submitted the leave request.', time: '10:05 AM', isMe: true },
  { id: 3, senderId: 1, text: 'Understood. Hope she feels better soon!', time: '10:10 AM', isMe: false },
  { id: 4, senderId: 1, text: 'I will share the lesson notes with her.', time: '10:11 AM', isMe: false },
];

const Chat = () => {
  const [activeChat, setActiveChat] = useState(dummyChats[0]);
  const [messages, setMessages] = useState(dummyMessages);
  const [input, setInput] = useState('');

  // Simulate loading different messages for different contacts
  React.useEffect(() => {
    setMessages(dummyMessages.map(m => ({
      ...m,
      text: m.isMe ? m.text : `[${activeChat.name}]: ${m.text}`
    })));
  }, [activeChat]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const newMsg = {
      id: Date.now(),
      senderId: 0,
      text: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    };
    
    setMessages([...messages, newMsg]);
    setInput('');
  };

  return (
    <div className="animate-fade-in" style={{ height: 'calc(100vh - 180px)', display: 'grid', gridTemplateColumns: '350px 1fr' }}>
      {/* Sidebar */}
      <div style={{ borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', backgroundColor: 'white' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Messages</h2>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
            <input 
              type="text" 
              placeholder="Search conversations..."
              style={{ width: '100%', padding: '0.6rem 1rem 0.6rem 2.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', outline: 'none', fontSize: '0.875rem' }}
            />
          </div>
        </div>
        
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {dummyChats.map(chat => (
            <div 
              key={chat.id} 
              onClick={() => setActiveChat(chat)}
              style={{ 
                padding: '1.25rem', 
                cursor: 'pointer', 
                display: 'flex', 
                gap: '1rem',
                borderBottom: '1px solid var(--bg-main)',
                backgroundColor: activeChat.id === chat.id ? 'var(--primary-light)' : 'transparent',
                transition: 'var(--transition)'
              }}
            >
              <div style={{ 
                width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 
              }}>
                {chat.avatar}
              </div>
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{chat.name}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{chat.time}</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {chat.lastMsg}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-main)' }}>
        {/* Chat Header */}
        <div style={{ padding: '1rem 1.5rem', backgroundColor: 'white', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>
              {activeChat.avatar}
            </div>
            <div>
              <p style={{ fontWeight: 700, margin: 0 }}>{activeChat.name}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: activeChat.status === 'Online' ? 'var(--success)' : 'var(--text-light)' }}></div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{activeChat.status}</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-light)' }}>
            <Phone size={20} style={{ cursor: 'pointer' }} />
            <Video size={20} style={{ cursor: 'pointer' }} />
            <MoreVertical size={20} style={{ cursor: 'pointer' }} />
          </div>
        </div>

        {/* Messages Feed */}
        <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {messages.map(msg => (
            <div key={msg.id} style={{ 
              maxWidth: '70%', 
              alignSelf: msg.isMe ? 'flex-end' : 'flex-start',
              display: 'flex',
              flexDirection: 'column',
              alignItems: msg.isMe ? 'flex-end' : 'flex-start'
            }}>
              <div style={{ 
                padding: '0.75rem 1rem', 
                borderRadius: 'var(--radius-lg)', 
                backgroundColor: msg.isMe ? 'var(--primary)' : 'white',
                color: msg.isMe ? 'white' : 'var(--text-main)',
                boxShadow: 'var(--shadow-sm)',
                fontSize: '0.875rem',
                borderBottomRightRadius: msg.isMe ? '2px' : 'var(--radius-lg)',
                borderBottomLeftRadius: msg.isMe ? 'var(--radius-lg)' : '2px',
              }}>
                {msg.text}
              </div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-light)', marginTop: '0.25rem' }}>{msg.time}</span>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div style={{ padding: '1.5rem', backgroundColor: 'white', borderTop: '1px solid var(--border-color)' }}>
          <form onSubmit={handleSend} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button type="button" style={{ color: 'var(--text-light)' }}><Paperclip size={20} /></button>
            <input 
              type="text" 
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{ flex: 1, padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-color)', outline: 'none', backgroundColor: 'var(--bg-main)' }}
            />
            <button type="submit" 
              style={{ padding: '0.75rem', borderRadius: '50%', backgroundColor: 'var(--primary)', color: 'white', display: 'flex' }}
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
