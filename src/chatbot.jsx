import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Menu, Settings, Square, Copy, Check, RefreshCw, Edit2, Paperclip, X, File } from 'lucide-react';

export default function ChatbotInterface() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm Aeterna. I'm here to make things easier for you. What can I do for you?", sender: 'bot', timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const [regeneratingMessageId, setRegeneratingMessageId] = useState(null);
  const [hoveredMessageId, setHoveredMessageId] = useState(null);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editText, setEditText] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const responseTimeoutRef = useRef(null);

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
    if (!messageText.trim() && uploadedFiles.length === 0) return;

    // Upload files to backend if any
    let savedFiles = [];
    if (uploadedFiles.length > 0) {
      try {
        const formData = new FormData();
        uploadedFiles.forEach(fileObj => {
          formData.append('files', fileObj.file);
        });

        const response = await fetch('http://localhost:3001/api/upload', {
          method: 'POST',
          body: formData
        });

        const result = await response.json();
        if (result.success) {
          savedFiles = result.files;
          console.log('Files saved successfully:', savedFiles);
        }
      } catch (error) {
        console.error('Error uploading files:', error);
        // Continue anyway - files will be displayed but not saved
      }
    }

    // Create user message with text and/or files
    const userMessage = {
      id: messages.length + 1,
      text: messageText,
      sender: 'user',
      timestamp: new Date(),
      files: uploadedFiles.length > 0 ? [...uploadedFiles] : undefined,
      savedFiles: savedFiles.length > 0 ? savedFiles : undefined
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setUploadedFiles([]);
    setIsTyping(true);

    responseTimeoutRef.current = setTimeout(() => {
      const responses = savedFiles.length > 0 
        ? [
            `I've received and saved your ${savedFiles.length} file(s) to the uploads folder. Files: ${savedFiles.map(f => f.originalName).join(', ')}`,
            `Thank you for uploading ${savedFiles.length} file(s). They have been saved successfully!`,
            `Files saved! Your ${savedFiles.length} file(s) are now stored in the uploads directory.`
          ]
        : uploadedFiles.length > 0
        ? [
            `I received your ${uploadedFiles.length} file(s), but the backend server is not running. Please start the backend to save files.`,
            `Files uploaded but not saved. Make sure to run 'npm start' in the backend folder.`
          ]
        : [
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
      responseTimeoutRef.current = null;
    }, 1500);
  };

  const handleStop = () => {
    if (responseTimeoutRef.current) {
      clearTimeout(responseTimeoutRef.current);
      responseTimeoutRef.current = null;
    }
    setIsTyping(false);
    
    const stoppedMessage = {
      id: messages.length + 1,
      text: "Response stopped by user.",
      sender: 'bot',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, stoppedMessage]);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = async (text, messageId) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleRegenerate = (messageId) => {
    // Find the bot message being regenerated
    const botMessageIndex = messages.findIndex(msg => msg.id === messageId);
    if (botMessageIndex === -1) return;

    // Find the user message that prompted this bot response
    const userMessageIndex = botMessageIndex - 1;
    if (userMessageIndex < 0 || messages[userMessageIndex].sender !== 'user') return;

    // Remove the bot message being regenerated AND all subsequent messages
    const messagesToKeep = messages.slice(0, botMessageIndex);
    setMessages(messagesToKeep);
    
    setRegeneratingMessageId(messageId);
    setIsTyping(true);

    responseTimeoutRef.current = setTimeout(() => {
      const responses = [
        "I understand your query. I'm currently a demo interface, but I can be connected to powerful AI backends like Claude, GPT, or custom models to provide intelligent responses.",
        "Thanks for your message! This is a demonstration of the chatbot interface. Connect me to your preferred AI service to unlock my full potential.",
        "I'm processing your request. This UI supports real-time conversations, file uploads, and rich message formatting when connected to an AI backend."
      ];
      
      const newBotMessage = {
        id: Date.now(), // Use timestamp for unique ID
        text: responses[Math.floor(Math.random() * responses.length)],
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, newBotMessage]);
      setIsTyping(false);
      setRegeneratingMessageId(null);
      responseTimeoutRef.current = null;
    }, 1500);
  };

  const handleEditMessage = (messageId) => {
    const message = messages.find(msg => msg.id === messageId);
    if (message) {
      setEditingMessageId(messageId);
      setEditText(message.text);
    }
  };

  const handleSaveEdit = (messageId) => {
    if (!editText.trim()) return;

    const messageIndex = messages.findIndex(msg => msg.id === messageId);
    if (messageIndex !== -1) {
      // Update the user message
      const updatedMessages = [...messages];
      updatedMessages[messageIndex] = {
        ...updatedMessages[messageIndex],
        text: editText,
        timestamp: new Date()
      };
      
      // Remove subsequent bot responses (if any)
      const messagesToKeep = updatedMessages.slice(0, messageIndex + 1);
      setMessages(messagesToKeep);
      setEditingMessageId(null);
      setEditText('');
      setIsTyping(true);

      // Generate new bot response
      responseTimeoutRef.current = setTimeout(() => {
        const responses = [
          "I understand your query. I'm currently a demo interface, but I can be connected to powerful AI backends like Claude, GPT, or custom models to provide intelligent responses.",
          "Thanks for your message! This is a demonstration of the chatbot interface. Connect me to your preferred AI service to unlock my full potential.",
          "I'm processing your request. This UI supports real-time conversations, file uploads, and rich message formatting when connected to an AI backend."
        ];
        
        const botMessage = {
          id: Date.now(),
          text: responses[Math.floor(Math.random() * responses.length)],
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
        responseTimeoutRef.current = null;
      }, 1500);
    }
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditText('');
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    
    const fileObjects = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type || 'application/octet-stream',
      file: file,
      url: URL.createObjectURL(file)
    }));

    setUploadedFiles(prev => [...prev, ...fileObjects]);
    
    // Reset file input to allow uploading the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveFile = (fileId) => {
    setUploadedFiles(prev => {
      const fileToRemove = prev.find(f => f.id === fileId);
      if (fileToRemove && fileToRemove.url) {
        URL.revokeObjectURL(fileToRemove.url);
      }
      return prev.filter(f => f.id !== fileId);
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (type) => {
    return <File className="w-4 h-4" />;
  };

  return (
    <div className={`fixed inset-0 w-full h-full transition-colors duration-300 ${
      isDarkTheme 
        ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' 
        : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'
    }`}>
      <div className="w-full h-full flex overflow-hidden">
        
        {/* Compact Sidebar - Hidden by default, shown on click */}
        {showSidebar && (
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowSidebar(false)}
          />
        )}
        
        <div className={`${
          showSidebar ? 'translate-x-0' : '-translate-x-full'
        } fixed z-50 w-72 h-full ${
          isDarkTheme ? 'bg-slate-900/95' : 'bg-white/95'
        } backdrop-blur-sm border-r ${
          isDarkTheme ? 'border-purple-500/20' : 'border-purple-200'
        } transition-all duration-300 ease-in-out shadow-2xl`}>
          <div className="flex flex-col h-full p-6">
            <div className={`flex items-center gap-3 pb-6 border-b ${
              isDarkTheme ? 'border-purple-500/20' : 'border-purple-200'
            }`}>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className={`font-bold text-base ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>YEM PDC Chatbot</h2>
                <p className={`text-xs ${isDarkTheme ? 'text-purple-300' : 'text-purple-600'}`}>v0.0.2</p>
              </div>
            </div>
            
            <div className="flex-1"></div>

            <div className={`pt-6 border-t ${isDarkTheme ? 'border-purple-500/20' : 'border-purple-200'}`}>
              <button 
                onClick={() => setShowSettings(!showSettings)}
                className={`w-full px-4 py-3 ${
                  isDarkTheme ? 'text-gray-300 hover:bg-slate-800/50' : 'text-gray-700 hover:bg-purple-50'
                } rounded-xl transition-all duration-200 flex items-center gap-3 text-sm font-medium`}>
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className={`flex-1 flex flex-col transition-colors duration-300 ${
          isDarkTheme ? 'bg-gradient-to-b from-slate-800/30 to-slate-900/30' : 'bg-gradient-to-b from-white/30 to-purple-50/30'
        } h-full overflow-hidden`}>
          
          {/* Header */}
          <div className={`${
            isDarkTheme ? 'bg-slate-900/60' : 'bg-white/60'
          } backdrop-blur-sm p-4 md:p-5 border-b ${
            isDarkTheme ? 'border-purple-500/20' : 'border-purple-200'
          } flex-shrink-0 transition-all duration-300`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setShowSidebar(!showSidebar)}
                  className={`w-10 h-10 ${
                    isDarkTheme ? 'bg-purple-600/20 hover:bg-purple-600/30' : 'bg-purple-100 hover:bg-purple-200'
                  } rounded-xl flex items-center justify-center ${
                    isDarkTheme ? 'text-white' : 'text-purple-900'
                  } transition-colors`}
                >
                  <Menu className="w-5 h-5" />
                </button>
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
                  <Bot className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div>
                  <h1 className={`text-base md:text-xl font-bold ${
                    isDarkTheme ? 'text-white' : 'text-gray-900'
                  }`}>YEM PDC CHATBOT</h1>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <p className={`text-xs md:text-sm ${
                      isDarkTheme ? 'text-purple-300' : 'text-purple-600'
                    }`}>Online • Ready to assist</p>
                  </div>
                </div>
              </div>
              
              {/*
              <div className="hidden md:flex items-center gap-2">
                <div className={`px-3 py-1.5 ${
                  isDarkTheme ? 'bg-purple-600/20 border-purple-500/30' : 'bg-purple-100 border-purple-300'
                } border rounded-lg`}>
                  <span className={`text-xs font-medium ${
                    isDarkTheme ? 'text-purple-300' : 'text-purple-700'
                  }`}>AI Powered</span>
                </div>
              </div>
              */}
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
            {messages.length === 1 && (
              <div className="mb-6 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-purple-500/30">
                    <Bot className="w-8 h-8 text-white" />
                  </div>
                  <h2 className={`text-xl md:text-3xl font-bold ${
                    isDarkTheme ? 'text-white' : 'text-gray-900'
                  }`}>Welcome to YEM PDC Chatbot</h2>
                  <p className={`text-sm md:text-base max-w-md mx-auto px-4 ${
                    isDarkTheme ? 'text-purple-300' : 'text-purple-600'
                  }`}>
                    Your intelligent assistant powered by Azure AI Foundry. How can I help you today?
                  </p>
                </div>
              </div>
            )}

            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'} animate-in fade-in slide-in-from-bottom-2 duration-300 group`}
                style={{ animationDelay: `${index * 50}ms` }}
                onMouseEnter={() => setHoveredMessageId(message.id)}
                onMouseLeave={() => setHoveredMessageId(null)}
              >
                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg ${
                  message.sender === 'bot' 
                    ? 'bg-gradient-to-br from-purple-500 to-pink-500 shadow-purple-500/50' 
                    : 'bg-gradient-to-br from-orange-500 to-amber-500 shadow-orange-500/50'
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
                      : isDarkTheme
                        ? 'bg-white text-gray-900 shadow-xl'
                        : 'bg-orange-100 text-gray-900 shadow-xl border border-orange-500'
                  }`}>
                    {editingMessageId === message.id ? (
                      <div className="space-y-2">
                        <textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className={`w-full px-3 py-2 text-sm leading-relaxed ${
                            isDarkTheme 
                              ? 'bg-slate-100 text-gray-900' 
                              : 'bg-white text-gray-900'
                          } border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none overflow-hidden`}
                          rows={3}
                          autoFocus
                          onInput={(e) => {
                            e.target.style.height = 'auto';
                            e.target.style.height = e.target.scrollHeight + 'px';
                          }}
                        />
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={handleCancelEdit}
                            className={`px-3 py-1.5 text-xs rounded-lg ${
                              isDarkTheme ? 'bg-gray-200 hover:bg-gray-300 text-gray-700' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                            } transition-colors`}
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveEdit(message.id)}
                            className="px-3 py-1.5 text-xs bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
                          >
                            Save & Send
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm leading-relaxed">{message.text}</p>
                        {message.files && message.files.length > 0 && (
                          <div className="mt-3 space-y-2">
                            {message.files.map((file) => (
                              <div 
                                key={file.id}
                                className={`flex items-center gap-2 p-2 rounded-lg ${
                                  isDarkTheme ? 'bg-slate-700/50' : 'bg-gray-100'
                                }`}
                              >
                                {getFileIcon(file.type)}
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-medium truncate">{file.name}</p>
                                  <p className="text-xs opacity-60">{formatFileSize(file.size)}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1.5">
                    {message.sender === 'user' && (
                      <div className={`flex items-center gap-1 transition-all duration-300 ${
                        hoveredMessageId === message.id ? 'opacity-100 max-w-[100px]' : 'opacity-0 max-w-0 overflow-hidden'
                      }`}>
                        <button
                          onClick={() => handleCopy(message.text, message.id)}
                          className={`p-1 ${
                            isDarkTheme ? 'text-white hover:text-gray-200' : 'text-orange-600 hover:text-orange-700'
                          } transition-colors`}
                          title="Copy"
                        >
                          {copiedMessageId === message.id ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleEditMessage(message.id)}
                          className={`p-1 ${
                            isDarkTheme ? 'text-white hover:text-gray-200' : 'text-orange-600 hover:text-orange-700'
                          } transition-colors`}
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    <span className={`text-xs px-2 ${
                      message.sender === 'user'
                        ? isDarkTheme ? 'text-white' : 'text-orange-500'
                        : isDarkTheme ? 'text-purple-400/60' : 'text-purple-600/60'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {message.sender === 'bot' && message.id !== 1 && (
                      <>
                        <button
                          onClick={() => handleCopy(message.text, message.id)}
                          className={`p-1 ${
                            isDarkTheme ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-700'
                          } transition-colors`}
                          title="Copy"
                        >
                          {copiedMessageId === message.id ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleRegenerate(message.id)}
                          disabled={isTyping}
                          className={`p-1 ${
                            isDarkTheme ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-700'
                          } transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                          title="Refresh"
                        >
                          <RefreshCw className={`w-4 h-4 ${regeneratingMessageId === message.id ? 'animate-spin' : ''}`} />
                        </button>
                      </>
                    )}
                  </div>
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
          <div className="p-4 md:p-5 transition-colors duration-300">
            <div className="max-w-4xl mx-auto">
              {/* File Preview Area */}
              {uploadedFiles.length > 0 && (
                <div className={`mb-3 p-3 rounded-2xl border ${
                  isDarkTheme 
                    ? 'bg-slate-800/80 border-purple-500/30' 
                    : 'bg-white border-purple-200'
                } backdrop-blur-sm shadow-lg`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-medium ${
                      isDarkTheme ? 'text-purple-300' : 'text-purple-600'
                    }`}>
                      {uploadedFiles.length} file(s) attached
                    </span>
                  </div>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {uploadedFiles.map((file) => (
                      <div 
                        key={file.id}
                        className={`flex items-center gap-2 p-2 rounded-lg ${
                          isDarkTheme ? 'bg-slate-700/50' : 'bg-gray-50'
                        }`}
                      >
                        {getFileIcon(file.type)}
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-medium truncate ${
                            isDarkTheme ? 'text-white' : 'text-gray-900'
                          }`}>{file.name}</p>
                          <p className={`text-xs ${
                            isDarkTheme ? 'text-gray-400' : 'text-gray-500'
                          }`}>{formatFileSize(file.size)}</p>
                        </div>
                        <button
                          onClick={() => handleRemoveFile(file.id)}
                          className={`p-1 rounded-lg ${
                            isDarkTheme 
                              ? 'hover:bg-slate-600 text-gray-400 hover:text-white' 
                              : 'hover:bg-gray-200 text-gray-500 hover:text-gray-700'
                          } transition-colors`}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex gap-3 items-end">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="flex-1 relative">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isTyping}
                    className={`absolute left-3 bottom-3 p-2 ${
                      isDarkTheme 
                        ? 'text-purple-400 hover:text-purple-300 hover:bg-slate-700/50' 
                        : 'text-purple-600 hover:text-purple-700 hover:bg-purple-50'
                    } rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed z-10`}
                    title="Attach files"
                  >
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message here..."
                    rows={1}
                    disabled={isTyping}
                    className={`w-full pl-14 pr-4 py-3 ${
                      isDarkTheme 
                        ? 'bg-slate-800/80 border-purple-500/30 text-white placeholder-purple-300/50' 
                        : 'bg-white border-purple-200 text-gray-900 placeholder-purple-400/50'
                    } backdrop-blur-sm border rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-sm shadow-lg disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden`}
                    style={{ minHeight: '48px', maxHeight: '120px' }}
                  />
                </div>
                {isTyping ? (
                  <button
                    onClick={handleStop}
                    className="w-12 h-12 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl flex items-center justify-center hover:shadow-xl hover:shadow-red-500/50 transform hover:scale-105 transition-all duration-200 flex-shrink-0 shadow-lg"
                  >
                    <Square className="w-5 h-5" fill="currentColor" />
                  </button>
                ) : (
                  <button
                    onClick={() => handleSend()}
                    disabled={!input.trim() && uploadedFiles.length === 0}
                    className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl flex items-center justify-center hover:shadow-xl hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 flex-shrink-0 shadow-lg"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                )}
              </div>
              <p className={`text-center text-xs mt-3 ${
                isDarkTheme ? 'text-purple-400/40' : 'text-purple-600/40'
              }`}>
                Powered by Azure AI • Your conversations are secure
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
                      isDarkTheme ? 'bg-purple-600' : 'bg-gray-300'
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
                  YEM PDC Chatbot v0.0.2
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}