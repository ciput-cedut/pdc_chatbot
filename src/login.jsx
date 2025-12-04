import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Sparkles, AlertCircle, ArrowRight, Settings, Bot } from 'lucide-react';
import { useTheme } from './ThemeContext';


export default function LoginPage() {
  const { isDarkTheme, toggleTheme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  // Dummy credentials for testing
  const DUMMY_EMAIL = 'dev@yamaha.com';
  const DUMMY_PASSWORD = 'yamaha123';

  const handleSubmit = async () => {
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      
      // Check dummy credentials
      if (email === DUMMY_EMAIL && password === DUMMY_PASSWORD) {
        console.log('Login successful');
        // Navigate to chatbot after successful login
        window.location.href = '/chatbot';
      } else {
        setError('Invalid email or password. Try dev@yamaha.com / yamaha123');
      }
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className={`fixed inset-0 w-full h-full ${
      isDarkTheme 
        ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900'
        : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'
    } flex items-center justify-center p-4 overflow-hidden`}>
      
      {/* Settings Button */}
      <button
        onClick={() => setShowSettings(true)}
        className={`fixed top-6 right-6 z-50 w-12 h-12 ${
          isDarkTheme 
            ? 'bg-slate-800/80 border-purple-500/30 hover:border-purple-500/50' 
            : 'bg-white border-purple-200 hover:border-purple-400'
        } backdrop-blur-sm rounded-xl border flex items-center justify-center transition-all hover:scale-105 shadow-lg`}
      >
        <Settings className={`w-5 h-5 ${isDarkTheme ? 'text-purple-400' : 'text-purple-600'}`} />
      </button>
      
      {/* Animated background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute top-1/4 left-1/4 w-96 h-96 ${
          isDarkTheme ? 'bg-purple-500/20' : 'bg-purple-300/30'
        } rounded-full blur-3xl animate-pulse`}></div>
        <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 ${
          isDarkTheme ? 'bg-pink-500/20' : 'bg-pink-300/30'
        } rounded-full blur-3xl animate-pulse`} style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative w-full max-w-md z-10">
        
        {/* Logo/Brand Section */}
        <div className="text-center mb-8 animate-in fade-in slide-in-from-top duration-500">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full mb-4 shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/70 transition-all hover:scale-105">
            <Bot className="w-10 h-10 text-white" />
          </div>
          <h1 className={`text-3xl md:text-4xl font-bold mb-2 tracking-tight ${
            isDarkTheme ? 'text-white' : 'text-gray-900'
          }`}>Welcome</h1>
          <p className={`text-sm md:text-base ${
            isDarkTheme ? 'text-purple-300' : 'text-purple-600'
          }`}>Log in to use the YEM PDC Chatbot</p>
        </div>

        {/* Login Card */}
        <div className={`${
          isDarkTheme 
            ? 'bg-slate-800/80 border-purple-500/20 hover:border-purple-500/40' 
            : 'bg-white border-purple-200 hover:border-purple-400'
        } backdrop-blur-xl rounded-3xl shadow-2xl p-6 md:p-8 border transition-all duration-300 animate-in fade-in slide-in-from-bottom duration-500`}>
          
          {/* Error Message */}
          {error && (
            <div className={`mb-6 p-4 ${
              isDarkTheme 
                ? 'bg-red-500/10 border-red-500/30' 
                : 'bg-red-50 border-red-200'
            } border rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top duration-300`}>
              <AlertCircle className={`w-5 h-5 ${
                isDarkTheme ? 'text-red-400' : 'text-red-600'
              } flex-shrink-0 mt-0.5`} />
              <p className={`text-sm ${isDarkTheme ? 'text-red-300' : 'text-red-700'}`}>{error}</p>
            </div>
          )}

          <div className="space-y-5">
            
            {/* Email Field */}
            <div>
              <label htmlFor="email" className={`block text-sm font-medium mb-2 ${
                isDarkTheme ? 'text-purple-300' : 'text-purple-700'
              }`}>
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className={`w-5 h-5 ${
                    isDarkTheme ? 'text-purple-400 group-focus-within:text-purple-300' : 'text-purple-500 group-focus-within:text-purple-600'
                  } transition-colors`} />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="yourname@music.yamaha.com"
                  className={`w-full pl-12 pr-4 py-3.5 ${
                    isDarkTheme 
                      ? 'bg-slate-900/50 border-purple-500/30 text-white placeholder-purple-400/50' 
                      : 'bg-white border-purple-200 text-gray-900 placeholder-purple-400/50'
                  } border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm md:text-base shadow-lg`}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className={`block text-sm font-medium mb-2 ${
                isDarkTheme ? 'text-purple-300' : 'text-purple-700'
              }`}>
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className={`w-5 h-5 ${
                    isDarkTheme ? 'text-purple-400 group-focus-within:text-purple-300' : 'text-purple-500 group-focus-within:text-purple-600'
                  } transition-colors`} />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="••••••••"
                  className={`w-full pl-12 pr-12 py-3.5 ${
                    isDarkTheme 
                      ? 'bg-slate-900/50 border-purple-500/30 text-white placeholder-purple-400/50' 
                      : 'bg-white border-purple-200 text-gray-900 placeholder-purple-400/50'
                  } border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm md:text-base shadow-lg`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute inset-y-0 right-0 pr-4 flex items-center ${
                    isDarkTheme ? 'hover:text-purple-300' : 'hover:text-purple-700'
                  } transition-colors`}
                >
                  
                  {showPassword ? (
                    <EyeOff className={`w-5 h-5 ${isDarkTheme ? 'text-purple-400' : 'text-purple-500'}`} />
                  ) : (
                    <Eye className={`w-5 h-5 ${isDarkTheme ? 'text-purple-400' : 'text-purple-500'}`} />
                  )}
                </button>
              </div>
            </div>

             {/* ###Remember Me & Forgot Password### */}     
             {/*     
            <div className="flex items-center justify-between text-sm">
            
              <label className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  className={`w-4 h-4 text-purple-600 ${
                    isDarkTheme ? 'bg-slate-900/50 border-purple-500/30' : 'bg-white border-purple-300'
                  } rounded focus:ring-purple-500 focus:ring-2 cursor-pointer`}
                />                
                <span className={`ml-2 ${
                  isDarkTheme ? 'text-purple-300 group-hover:text-purple-200' : 'text-purple-700 group-hover:text-purple-800'
                } transition-colors`}>Remember me</span>
              </label>

              <a href="#" className={`${
                isDarkTheme ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-700'
              } font-medium transition-colors`}>
                Forgot password?
              </a>
            </div>
              */}
              
            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3.5 px-4 rounded-xl font-medium hover:shadow-xl hover:shadow-purple-500/50 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 text-sm md:text-base shadow-lg"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Login</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>

          {/* Divider for social login button and Sign In */}
          
          <div className="my-6 flex items-center gap-4">
            <div className={`flex-1 h-px ${
              isDarkTheme ? 'bg-purple-500/20' : 'bg-purple-200'
            }`}></div>
            
           
            <span className={`text-sm whitespace-nowrap ${
              isDarkTheme ? 'text-purple-400/60' : 'text-purple-600/60'
            }`}>Or continue with</span>
          
            <div className={`flex-1 h-px ${
              isDarkTheme ? 'bg-purple-500/20' : 'bg-purple-200'
            }`}></div>
          </div>
          


          {/* Social Login Button */}
        
          <div className="w-full">
            <button 
              onClick={() => window.location.href = 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=your-client-id&response_type=code&redirect_uri=your-redirect-uri&response_mode=query&scope=openid%20profile%20email&state=12345'}
              className={`w-full flex items-center justify-center gap-2 px-4 py-3 ${
              isDarkTheme 
                ? 'bg-slate-900/50 border-purple-500/30 hover:bg-slate-900/80 hover:border-purple-500/50' 
                : 'bg-purple-50 border-purple-200 hover:bg-purple-100 hover:border-purple-300'
            } border rounded-xl active:scale-95 transition-all text-sm shadow-lg group`}>
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                <path fill="#F25022" d="M1 1h10v10H1z"/>
                <path fill="#00A4EF" d="M13 1h10v10H13z"/>
                <path fill="#7FBA00" d="M1 13h10v10H1z"/>
                <path fill="#FFB900" d="M13 13h10v10H13z"/>
              </svg>
              <span className={`font-medium ${
                isDarkTheme ? 'text-white group-hover:text-purple-200' : 'text-gray-800 group-hover:text-purple-700'
              } transition-colors`}>Continue with Microsoft</span>
            </button>
          </div>
          

          {/* Sign Up Link */}
          
          <p className={`mt-6 text-center text-sm ${
            isDarkTheme ? 'text-purple-300' : 'text-purple-700'
          }`}>
            Don't have an account?{' '}
            <a href="#" className={`${
              isDarkTheme ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-700'
            } font-semibold transition-colors`}>
              Sign up
            </a>
          </p>
            
        </div>

        {/* Footer */}
        <p className={`mt-6 text-center text-xs ${
          isDarkTheme ? 'text-purple-400/60' : 'text-purple-600/60'
        } animate-in fade-in duration-700`}>
          By signing in, you agree to our{' '}
          <a href="#" className={`${
            isDarkTheme ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-700'
          } transition-colors font-medium`}>
            Terms
          </a>{' '}
          and{' '}
          <a href="#" className={`${
            isDarkTheme ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-700'
          } transition-colors font-medium`}>
            Privacy Policy
          </a>
        </p>


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
                    onClick={toggleTheme}
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
  );
}