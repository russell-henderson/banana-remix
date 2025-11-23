
import React from 'react';
import { Home, PlusSquare, User, Zap, Trophy } from 'lucide-react';
import { AppView } from '../types';

interface NavbarProps {
  currentView: AppView;
  onChangeView: (view: AppView) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onChangeView }) => {
  const navItems = [
    { id: AppView.FEED, icon: <Home size={24} />, label: 'Feed' },
    { id: AppView.TRENDING, icon: <Zap size={24} />, label: 'Trending' },
    { id: AppView.CREATE_POST, icon: <PlusSquare size={24} />, label: 'Post' },
    { id: AppView.LEADERBOARD, icon: <Trophy size={24} />, label: 'Rank' },
    { id: AppView.PROFILE, icon: <User size={24} />, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-dark-surface/90 backdrop-blur-md border-t border-dark-border pb-safe">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto px-4">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onChangeView(item.id)}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
              currentView === item.id ? 'text-banana-400' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {item.icon}
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};
