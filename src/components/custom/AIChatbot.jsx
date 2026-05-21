import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, X, Minimize2, Maximize2, Loader2 } from 'lucide-react';
import { sendChatMessage } from '../../services/aiService';
import './AIChatbot.css';

const AIChatbot = ({ userRole = 'student' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Hello! I\'m your Edustrem AI Assistant. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await sendChatMessage(inputMessage, { role: userRole });
      
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response.response,
        suggestions: response.suggestedActions,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickQuestions = [
    'How do I check my attendance?',
    'What are my exam results?',
    'How do I pay my fees?',
    'When is the next holiday?'
  ];

  return (
    <>
      {/* Chat Toggle Button */}
      <button 
        className="chat-toggle-btn"
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          border: 'none',
          cursor: 'pointer',
          display: isOpen ? 'none' : 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
          zIndex: 1000
        }}
      >
        <Bot size={28} color="white" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div 
          className={`chat-window ${isMinimized ? 'minimized' : ''}`}
          style={{
            position: 'fixed',
            bottom: isMinimized ? '20px' : '20px',
            right: '20px',
            width: isMinimized ? '300px' : '400px',
            height: isMinimized ? '60px' : '500px',
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
            zIndex: 1000,
            overflow: 'hidden',
            transition: 'all 0.3s ease'
          }}
        >
          {/* Chat Header */}
          <div 
            style={{
              padding: '15px 20px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer'
            }}
            onClick={() => setIsMinimized(!isMinimized)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Bot size={24} />
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>AI Assistant</h3>
                <span style={{ fontSize: '12px', opacity: 0.8 }}>Edustrem Smart Helper</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }}
                style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
              >
                {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
                style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Chat Body */}
          {!isMinimized && (
            <>
              <div 
                style={{
                  height: '340px',
                  overflowY: 'auto',
                  padding: '15px',
                  background: '#f8f9fa'
                }}
              >
                {messages.map((msg) => (
                  <div 
                    key={msg.id}
                    className={`message ${msg.type}`}
                    style={{
                      display: 'flex',
                      justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start',
                      marginBottom: '12px'
                    }}
                  >
                    <div 
                      style={{
                        maxWidth: '75%',
                        padding: '12px 16px',
                        borderRadius: msg.type === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                        background: msg.type === 'user' 
                          ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                          : 'white',
                        color: msg.type === 'user' ? 'white' : '#333',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                        fontSize: '14px',
                        lineHeight: 1.5
                      }}
                    >
                      {msg.content}
                      {msg.suggestions && (
                        <div style={{ marginTop: '10px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                          {msg.suggestions.map((suggestion, idx) => (
                            <button
                              key={idx}
                              onClick={() => setInputMessage(suggestion)}
                              style={{
                                padding: '4px 10px',
                                fontSize: '11px',
                                background: msg.type === 'user' ? 'rgba(255,255,255,0.2)' : '#f0f0f0',
                                border: 'none',
                                borderRadius: '12px',
                                color: msg.type === 'user' ? 'white' : '#666',
                                cursor: 'pointer'
                              }}
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '12px' }}>
                    <div 
                      style={{
                        padding: '12px 16px',
                        borderRadius: '18px 18px 18px 4px',
                        background: 'white',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <Loader2 size={16} className="spin" />
                      <span style={{ fontSize: '13px', color: '#666' }}>Thinking...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Questions */}
              <div 
                style={{
                  padding: '10px 15px',
                  borderTop: '1px solid #eee',
                  display: 'flex',
                  gap: '8px',
                  overflowX: 'auto'
                }}
              >
                {quickQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => setInputMessage(q)}
                    style={{
                      padding: '6px 12px',
                      fontSize: '12px',
                      background: '#f0f0f0',
                      border: 'none',
                      borderRadius: '16px',
                      color: '#666',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* Input Area */}
              <div 
                style={{
                  padding: '15px',
                  borderTop: '1px solid #eee',
                  display: 'flex',
                  gap: '10px',
                  background: 'white'
                }}
              >
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    border: '1px solid #ddd',
                    borderRadius: '24px',
                    outline: 'none',
                    fontSize: '14px'
                  }}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    background: inputMessage.trim() 
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                      : '#ccc',
                    border: 'none',
                    cursor: inputMessage.trim() ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Send size={18} color="white" />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default AIChatbot;