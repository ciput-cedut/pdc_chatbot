import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Menu, Settings, MessageSquare, Zap, Shield } from 'lucide-react';

export default function ChatbotInterface() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi! I'm your PDC AI Assistant. I'm here to help you with any questions or tasks. What would you like to know?", sender: 'bot', timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const quickActions = [
    { icon: MessageSquare, label: 'General Help', prompt: 'I need help with general information' },
    { icon: Zap, label: 'Quick Tips', prompt: 'Give me some quick tips' },
    { icon: Shield, label: 'Support', prompt: 'I need support' }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [input]);

  const handleSend = async (messageText = input) => {
    if (!messageText.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: messageText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const responses = [
        "I understand your query. I'm currently a demo interface, but I can be connected to powerful AI backends like Claude, GPT, or custom models to provide intelligent responses.",
        "Thanks for your message! This is a demonstration of the chatbot interface. Connect me to your preferred AI service to unlock my full potential.",
        "I'm processing your request. This UI supports real-time conversations, file uploads, and rich message formatting when connected to an AI backend."
      ];
      
      const botMessage = {
        id: messages.length + 2,
        text: responses[Math.floor(Math.random() * responses.length)],
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickAction = (prompt) => {
    handleSend(prompt);
  };

  return (
    <div className={`fixed inset-0 w-full h-full ${
      isDarkTheme 
        ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' 
        : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'
    }`}>
      <div className="w-full h-full flex overflow-hidden">
        
        {/* Sidebar - Overlay on mobile, fixed on desktop */}
        {showSidebar && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setShowSidebar(false)}
          />
        )}
        
        <div className={`${
          showSidebar ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 fixed md:relative z-50 w-64 h-full ${
          isDarkTheme ? 'bg-slate-900/95' : 'bg-white/95'
        } backdrop-blur-sm border-r ${
          isDarkTheme ? 'border-purple-500/20' : 'border-purple-200'
        } transition-transform duration-300 ease-in-out`}>
          <div className="flex flex-col h-full p-4">
            <div className={`flex items-center gap-3 pb-4 border-b ${
              isDarkTheme ? 'border-purple-500/20' : 'border-purple-200'
            }`}>
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className={`font-semibold text-sm ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>PDC AI</h2>
                <p className={`text-xs ${isDarkTheme ? 'text-purple-300' : 'text-purple-600'}`}>v2.0 Pro</p>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-2 mt-4">
              <button className={`w-full px-4 py-3 ${
                isDarkTheme ? 'bg-purple-600/20 hover:bg-purple-600/30 text-white border-purple-500/30' : 'bg-purple-100 hover:bg-purple-200 text-purple-900 border-purple-300'
              } rounded-xl transition-all duration-200 flex items-center gap-3 border`}>
                <MessageSquare className="w-4 h-4" />
                <span className="text-sm">New Chat</span>
              </button>
              
              <div className="pt-4 space-y-1">
                <p className={`text-xs font-semibold uppercase tracking-wider px-2 ${
                  isDarkTheme ? 'text-purple-300' : 'text-purple-700'
                }`}>Recent Chats</p>
                <div className="space-y-1">
                  <button className={`w-full px-3 py-2 ${
                    isDarkTheme ? 'text-gray-300 hover:bg-slate-800/50' : 'text-gray-700 hover:bg-purple-50'
                  } rounded-lg transition-all duration-200 text-left text-sm truncate`}>
                    General inquiry...
                  </button>
                  <button className={`w-full px-3 py-2 ${
                    isDarkTheme ? 'text-gray-300 hover:bg-slate-800/50' : 'text-gray-700 hover:bg-purple-50'
                  } rounded-lg transition-all duration-200 text-left text-sm truncate`}>
                    Product support...
                  </button>
                  <button className={`w-full px-3 py-2 ${
                    isDarkTheme ? 'text-gray-300 hover:bg-slate-800/50' : 'text-gray-700 hover:bg-purple-50'
                  } rounded-lg transition-all duration-200 text-left text-sm truncate`}>
                    Technical help...
                  </button>
                </div>
              </div>
            </div>

            <div className={`pt-4 border-t ${isDarkTheme ? 'border-purple-500/20' : 'border-purple-200'}`}>
              <button 
                onClick={() => setShowSettings(!showSettings)}
                className={`w-full px-4 py-2 ${
                  isDarkTheme ? 'text-gray-300 hover:bg-slate-800/50' : 'text-gray-700 hover:bg-purple-50'
                } rounded-lg transition-all duration-200 flex items-center gap-3 text-sm`}>
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className={`flex-1 flex flex-col ${
          isDarkTheme ? 'bg-gradient-to-b from-slate-800/30 to-slate-900/30' : 'bg-gradient-to-b from-white/30 to-purple-50/30'
        } h-full overflow-hidden`}>
          
          {/* Header */}
          <div className={`${
            isDarkTheme ? 'bg-slate-900/60' : 'bg-white/60'
          } backdrop-blur-sm p-4 md:p-5 border-b ${
            isDarkTheme ? 'border-purple-500/20' : 'border-purple-200'
          } flex-shrink-0`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setShowSidebar(!showSidebar)}
                  className={`md:hidden w-10 h-10 ${
                    isDarkTheme ? 'bg-purple-600/20 hover:bg-purple-600/30' : 'bg-purple-100 hover:bg-purple-200'
                  } rounded-xl flex items-center justify-center ${
                    isDarkTheme ? 'text-white' : 'text-purple-900'
                  } transition-colors`}
                >
                  <Menu className="w-5 h-5" />
                </button>
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center animate-pulse shadow-lg shadow-purple-500/50">
                  <Bot className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div>
                  <h1 className={`text-base md:text-xl font-bold ${
                    isDarkTheme ? 'text-white' : 'text-gray-900'
                  }`}>PDC AI Assistant</h1>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <p className={`text-xs md:text-sm ${
                      isDarkTheme ? 'text-purple-300' : 'text-purple-600'
                    }`}>Online • Ready to assist</p>
                  </div>
                </div>
              </div>
              
              <div className="hidden md:flex items-center gap-2">
                <div className={`px-3 py-1.5 ${
                  isDarkTheme ? 'bg-purple-600/20 border-purple-500/30' : 'bg-purple-100 border-purple-300'
                } border rounded-lg`}>
                  <span className={`text-xs font-medium ${
                    isDarkTheme ? 'text-purple-300' : 'text-purple-700'
                  }`}>AI Powered</span>
                </div>
              </div>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
            {messages.length === 1 && (
              <div className="mb-6 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-purple-500/30">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h2 className={`text-xl md:text-3xl font-bold ${
                    isDarkTheme ? 'text-white' : 'text-gray-900'
                  }`}>Welcome to PDC AI</h2>
                  <p className={`text-sm md:text-base max-w-md mx-auto px-4 ${
                    isDarkTheme ? 'text-purple-300' : 'text-purple-600'
                  }`}>
                    Your intelligent assistant powered by advanced AI. How can I help you today?
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto mt-6 px-4">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickAction(action.prompt)}
                      className={`p-4 ${
                        isDarkTheme 
                          ? 'bg-slate-800/50 hover:bg-slate-800/80 border-purple-500/20 hover:border-purple-500/40' 
                          : 'bg-white/50 hover:bg-white/80 border-purple-200 hover:border-purple-400'
                      } border rounded-xl transition-all duration-200 group`}
                    >
                      <action.icon className={`w-6 h-6 mb-2 group-hover:scale-110 transition-transform ${
                        isDarkTheme ? 'text-purple-400' : 'text-purple-600'
                      }`} />
                      <p className={`text-sm font-medium ${
                        isDarkTheme ? 'text-white' : 'text-gray-900'
                      }`}>{action.label}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg ${
                  message.sender === 'bot' 
                    ? 'bg-gradient-to-br from-purple-500 to-pink-500 shadow-purple-500/50' 
                    : 'bg-gradient-to-br from-blue-500 to-cyan-500 shadow-blue-500/50'
                }`}>
                  {message.sender === 'bot' ? (
                    <Bot className="w-5 h-5 text-white" />
                  ) : (
                    <User className="w-5 h-5 text-white" />
                  )}
                </div>
                
                <div className={`max-w-[75%] md:max-w-[70%] ${message.sender === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                  <div className={`px-4 py-3 rounded-2xl backdrop-blur-sm ${
                    message.sender === 'bot'
                      ? isDarkTheme 
                        ? 'bg-slate-800/80 text-gray-100 shadow-xl border border-purple-500/20'
                        : 'bg-white text-gray-900 shadow-xl border border-purple-200'
                      : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-xl shadow-blue-500/20'
                  }`}>
                    <p className="text-sm leading-relaxed">{message.text}</p>
                  </div>
                  <span className={`text-xs mt-1.5 px-2 ${
                    isDarkTheme ? 'text-purple-400/60' : 'text-purple-600/60'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-500/50">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className={`${
                  isDarkTheme 
                    ? 'bg-slate-800/80 border-purple-500/20' 
                    : 'bg-white border-purple-200'
                } backdrop-blur-sm px-4 py-3 rounded-2xl shadow-xl border`}>
                  <div className="flex gap-1.5">
                    <div className={`w-2 h-2 rounded-full animate-bounce ${
                      isDarkTheme ? 'bg-purple-400' : 'bg-purple-600'
                    }`} style={{ animationDelay: '0ms' }}></div>
                    <div className={`w-2 h-2 rounded-full animate-bounce ${
                      isDarkTheme ? 'bg-purple-400' : 'bg-purple-600'
                    }`} style={{ animationDelay: '150ms' }}></div>
                    <div className={`w-2 h-2 rounded-full animate-bounce ${
                      isDarkTheme ? 'bg-purple-400' : 'bg-purple-600'
                    }`} style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className={`p-4 md:p-5 ${
            isDarkTheme ? 'bg-slate-900/60 border-purple-500/20' : 'bg-white/60 border-purple-200'
          } backdrop-blur-sm border-t flex-shrink-0`}>
            <div className="flex gap-3 items-end max-w-4xl mx-auto">
              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message here..."
                  rows={1}
                  className={`w-full px-4 py-3 ${
                    isDarkTheme 
                      ? 'bg-slate-800/80 border-purple-500/30 text-white placeholder-purple-300/50' 
                      : 'bg-white border-purple-200 text-gray-900 placeholder-purple-400/50'
                  } backdrop-blur-sm border rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-sm shadow-lg`}
                  style={{ minHeight: '48px', maxHeight: '120px' }}
                />
              </div>
              <button
                onClick={() => handleSend()}
                disabled={!input.trim()}
                className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl flex items-center justify-center hover:shadow-xl hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 flex-shrink-0 shadow-lg"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className={`text-center text-xs mt-3 ${
              isDarkTheme ? 'text-purple-400/40' : 'text-purple-600/40'
            }`}>
              Powered by advanced AI • Your conversations are secure
            </p>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowSettings(false)}>
          <div 
            className={`${
              isDarkTheme ? 'bg-slate-800 border-purple-500/20' : 'bg-white border-purple-200'
            } rounded-2xl p-6 max-w-md w-full shadow-2xl border`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl font-bold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>Settings</h2>
              <button 
                onClick={() => setShowSettings(false)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  isDarkTheme ? 'hover:bg-slate-700' : 'hover:bg-gray-100'
                } transition-colors`}
              >
                <span className={`text-xl ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>×</span>
              </button>
            </div>

            <div className="space-y-4">
              <div className={`p-4 rounded-xl border ${
                isDarkTheme ? 'border-purple-500/20 bg-slate-900/50' : 'border-purple-200 bg-purple-50'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={`font-semibold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>Theme</h3>
                    <p className={`text-sm ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
                      {isDarkTheme ? 'Dark Mode' : 'Light Mode'}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsDarkTheme(!isDarkTheme)}
                    className={`relative w-14 h-8 rounded-full transition-colors ${
                      isDarkTheme ? 'bg-purple-600' : 'bg-purple-400'
                    }`}
                  >
                    <div 
                      className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${
                        isDarkTheme ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className={`p-4 rounded-xl border ${
                isDarkTheme ? 'border-purple-500/20' : 'border-purple-200'
              }`}>
                <h3 className={`font-semibold mb-2 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>About</h3>
                <p className={`text-sm ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
                  PDC AI Assistant v2.0 Pro
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}