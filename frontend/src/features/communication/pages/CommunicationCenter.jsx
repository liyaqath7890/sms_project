import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, MessageSquare, Clock, Users, Search, Plus, Paperclip, Smile, Phone, Mail } from 'lucide-react';
import '../../components/premium/premium.css';

const CommunicationCenter = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const chats = [
    {
      id: 1,
      name: 'Class 5-A Teachers',
      type: 'group',
      lastMessage: 'Assignment submitted by 15 students',
      timestamp: '2 min ago',
      unread: 2,
      members: 5,
      avatar: '👨‍🏫'
    },
    {
      id: 2,
      name: 'Parent Communication Group',
      type: 'group',
      lastMessage: 'Sports day scheduled for next Friday',
      timestamp: '15 min ago',
      unread: 0,
      members: 45,
      avatar: '👨‍👩‍👧‍👦'
    },
    {
      id: 3,
      name: 'Academic Council',
      type: 'group',
      lastMessage: 'Quarterly review meeting confirmed',
      timestamp: '1 hour ago',
      unread: 0,
      members: 12,
      avatar: '📚'
    },
    {
      id: 4,
      name: 'Mrs. Priya Sharma',
      type: 'direct',
      lastMessage: 'Thank you for the update',
      timestamp: '3 hours ago',
      unread: 1,
      avatar: '👩‍🏫'
    },
    {
      id: 5,
      name: 'Mr. Rajesh Kumar',
      type: 'direct',
      lastMessage: 'Please send the student list',
      timestamp: 'Yesterday',
      unread: 0,
      avatar: '👨‍💼'
    }
  ];

  const messages = selectedChat ? [
    {
      id: 1,
      sender: 'Class 5-A Teachers',
      avatar: '👨‍🏫',
      text: 'Assignment results are in. Excellent performance overall!',
      timestamp: '10:30 AM',
      type: 'received'
    },
    {
      id: 2,
      sender: 'You',
      avatar: '👤',
      text: 'Great to hear! Can you share the summary report?',
      timestamp: '10:35 AM',
      type: 'sent'
    },
    {
      id: 3,
      sender: 'Class 5-A Teachers',
      avatar: '👨‍🏫',
      text: 'Attaching the detailed report now',
      timestamp: '10:40 AM',
      type: 'received'
    },
    {
      id: 4,
      sender: 'You',
      avatar: '👤',
      text: 'Perfect! I will review and send feedback',
      timestamp: '10:42 AM',
      type: 'sent'
    }
  ] : [];

  const quickActions = [
    { icon: MessageSquare, label: 'New Message', color: '#3b82f6' },
    { icon: Users, label: 'Create Group', color: '#10b981' },
    { icon: Phone, label: 'Schedule Call', color: '#f59e0b' },
    { icon: Mail, label: 'Bulk Email', color: '#8b5cf6' }
  ];

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 100px)', background: '#f9fafb' }}>
      {/* Left Sidebar */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        style={{
          width: '350px',
          background: 'white',
          borderRight: '1px solid #e5e7eb',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto'
        }}
      >
        {/* Header */}
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1f2937', marginBottom: '1rem' }}>
            Messages
          </h2>
          
          {/* Search */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: '#f3f4f6',
            borderRadius: '12px',
            padding: '0.5rem 1rem',
            marginBottom: '1rem'
          }}>
            <Search size={18} color="#9ca3af" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                marginLeft: '0.5rem',
                flex: 1,
                fontSize: '0.9rem',
                outline: 'none'
              }}
            />
          </div>

          {/* Quick Actions */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            {quickActions.map((action, idx) => (
              <motion.button
                key={idx}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: '#f3f4f6',
                  border: 'none',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.25rem',
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  transition: 'all 0.3s ease'
                }}
              >
                <action.icon size={18} color={action.color} />
                {action.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Chat List */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {filteredChats.map((chat, idx) => (
            <motion.div
              key={chat.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => setSelectedChat(chat)}
              whileHover={{ backgroundColor: '#f9fafb' }}
              style={{
                padding: '1rem',
                borderBottom: '1px solid #e5e7eb',
                cursor: 'pointer',
                background: selectedChat?.id === chat.id ? '#eff6ff' : 'transparent',
                borderLeft: selectedChat?.id === chat.id ? '4px solid #3b82f6' : 'none',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <div style={{
                  fontSize: '2rem',
                  width: '48px',
                  height: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#f3f4f6',
                  borderRadius: '50%',
                  flexShrink: 0
                }}>
                  {chat.avatar}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <h4 style={{ fontWeight: '600', color: '#1f2937', fontSize: '0.95rem' }}>
                      {chat.name}
                    </h4>
                    <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
                      {chat.timestamp}
                    </span>
                  </div>
                  <p style={{
                    fontSize: '0.85rem',
                    color: '#6b7280',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {chat.lastMessage}
                  </p>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', fontSize: '0.75rem', color: '#9ca3af' }}>
                    {chat.type === 'group' && <span>{chat.members} members</span>}
                    {chat.unread > 0 && (
                      <span style={{
                        background: '#ef4444',
                        color: 'white',
                        padding: '0.125rem 0.5rem',
                        borderRadius: '12px',
                        fontWeight: '600'
                      }}>
                        {chat.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Main Chat Area */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          background: 'white'
        }}
      >
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div style={{
              padding: '1.5rem',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ fontSize: '2rem' }}>{selectedChat.avatar}</div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1f2937', marginBottom: '0.25rem' }}>
                    {selectedChat.name}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                    {selectedChat.type === 'group' ? `${selectedChat.members} members` : 'Direct message'}
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <motion.button whileHover={{ scale: 1.1 }} style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#3b82f6'
                }}>
                  <Phone size={20} />
                </motion.button>
                <motion.button whileHover={{ scale: 1.1 }} style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#3b82f6'
                }}>
                  <Mail size={20} />
                </motion.button>
              </div>
            </div>

            {/* Messages */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    display: 'flex',
                    justifyContent: msg.type === 'sent' ? 'flex-end' : 'flex-start',
                    gap: '0.75rem'
                  }}
                >
                  {msg.type === 'received' && (
                    <div style={{ fontSize: '2rem' }}>{msg.avatar}</div>
                  )}
                  <div style={{
                    maxWidth: '60%',
                    background: msg.type === 'sent' ? '#3b82f6' : '#f3f4f6',
                    color: msg.type === 'sent' ? 'white' : '#1f2937',
                    padding: '0.75rem 1rem',
                    borderRadius: '12px',
                    wordBreak: 'break-word'
                  }}>
                    <p style={{ margin: '0 0 0.25rem 0' }}>{msg.text}</p>
                    <p style={{
                      fontSize: '0.75rem',
                      opacity: 0.7,
                      margin: 0
                    }}>
                      {msg.timestamp}
                    </p>
                  </div>
                  {msg.type === 'sent' && (
                    <div style={{ fontSize: '2rem' }}>{msg.avatar}</div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Message Input */}
            <div style={{
              padding: '1.5rem',
              borderTop: '1px solid #e5e7eb',
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'flex-end'
            }}>
              <motion.button whileHover={{ scale: 1.1 }} style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#9ca3af',
                fontSize: '1.25rem'
              }}>
                <Paperclip size={20} />
              </motion.button>

              <textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type your message..."
                style={{
                  flex: 1,
                  padding: '0.75rem 1rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '0.95rem',
                  fontFamily: 'inherit',
                  resize: 'none',
                  maxHeight: '100px',
                  outline: 'none',
                  transition: 'border-color 0.3s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                rows="1"
              />

              <motion.button whileHover={{ scale: 1.1 }} style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#9ca3af',
                fontSize: '1.25rem'
              }}>
                <Smile size={20} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setMessageText('')}
                style={{
                  background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.3s ease'
                }}
              >
                <Send size={18} />
                Send
              </motion.button>
            </div>
          </>
        ) : (
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#9ca3af'
          }}>
            <div style={{ textAlign: 'center' }}>
              <MessageSquare size={64} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
              <p style={{ fontSize: '1.1rem' }}>Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default CommunicationCenter;
