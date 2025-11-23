
import React, { useState } from 'react';
import { Button } from './Button';

interface AuthScreenProps {
  onLogin: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col items-center justify-center p-6 text-center">
      
      {/* Brand */}
      <div className="mb-12 space-y-4">
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-banana-400 to-banana-600 mx-auto shadow-2xl shadow-banana-500/20 flex items-center justify-center">
             <span className="text-4xl">🍌</span>
        </div>
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tight">Banana <span className="text-banana-400">Remix</span></h1>
          <p className="text-gray-400 mt-2">Remix the world together.</p>
        </div>
      </div>

      {/* Forms */}
      <div className="w-full max-w-sm space-y-4">
        <div className="space-y-3">
            <input 
                type="email" 
                placeholder="Email address" 
                className="w-full bg-dark-surface border border-dark-border rounded-xl p-4 text-white placeholder-gray-500 focus:border-banana-400 focus:ring-1 focus:ring-banana-400 focus:outline-none"
            />
             <input 
                type="password" 
                placeholder="Password" 
                className="w-full bg-dark-surface border border-dark-border rounded-xl p-4 text-white placeholder-gray-500 focus:border-banana-400 focus:ring-1 focus:ring-banana-400 focus:outline-none"
            />
        </div>

        <Button 
            className="w-full py-4 text-lg font-bold" 
            onClick={onLogin}
        >
            {isLogin ? 'Log In' : 'Create Account'}
        </Button>

        <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-dark-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-dark-bg text-gray-500">Or continue with</span>
            </div>
        </div>

        <button 
            onClick={onLogin}
            className="w-full bg-white text-black font-semibold rounded-full p-3.5 flex items-center justify-center gap-3 hover:bg-gray-100 transition-colors"
        >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
            </svg>
            Google
        </button>
      </div>

      <div className="mt-auto pt-8">
        <p className="text-gray-400">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
                onClick={() => setIsLogin(!isLogin)} 
                className="text-banana-400 font-medium hover:underline"
            >
                {isLogin ? 'Sign up' : 'Log in'}
            </button>
        </p>
      </div>

    </div>
  );
};
