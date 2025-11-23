
import React, { useState, useRef } from 'react';
import { X, Upload, Search, Image as ImageIcon, Heart, Clock } from 'lucide-react';
import { Post } from '../types';

interface ImagePickerProps {
  onClose: () => void;
  onSelect: (imageUrl: string, sourceId?: string) => void;
  posts: Post[];
}

// Simulated stock data (Mock Unsplash)
const STOCK_CATEGORIES = {
  'Nature': ['https://picsum.photos/seed/nature1/300/300', 'https://picsum.photos/seed/nature2/300/300', 'https://picsum.photos/seed/nature3/300/300', 'https://picsum.photos/seed/nature4/300/300'],
  'City': ['https://picsum.photos/seed/city1/300/300', 'https://picsum.photos/seed/city2/300/300', 'https://picsum.photos/seed/city3/300/300', 'https://picsum.photos/seed/city4/300/300'],
  'Abstract': ['https://picsum.photos/seed/abs1/300/300', 'https://picsum.photos/seed/abs2/300/300', 'https://picsum.photos/seed/abs3/300/300', 'https://picsum.photos/seed/abs4/300/300'],
  'Animals': ['https://picsum.photos/seed/anim1/300/300', 'https://picsum.photos/seed/anim2/300/300', 'https://picsum.photos/seed/anim3/300/300', 'https://picsum.photos/seed/anim4/300/300'],
};

export const ImagePicker: React.FC<ImagePickerProps> = ({ onClose, onSelect, posts }) => {
  const [activeTab, setActiveTab] = useState<'UPLOAD' | 'STOCK' | 'COMMUNITY'>('UPLOAD');
  const [stockSearch, setStockSearch] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onSelect(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getStockImages = () => {
    if (!stockSearch) return Object.values(STOCK_CATEGORIES).flat();
    const key = Object.keys(STOCK_CATEGORIES).find(k => k.toLowerCase().includes(stockSearch.toLowerCase()));
    if (key) return STOCK_CATEGORIES[key as keyof typeof STOCK_CATEGORIES];
    // Fallback simulated search
    return [1,2,3,4].map(i => `https://picsum.photos/seed/${stockSearch}${i}/300/300`);
  };

  // Sort posts by Popularity (likes) then Time
  const sortedPosts = [...posts].sort((a, b) => {
    if (b.likes !== a.likes) return b.likes - a.likes; // Visual Weight: Popularity
    return b.createdAt - a.createdAt;
  });

  return (
    <div className="fixed inset-0 z-[70] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-dark-surface rounded-2xl border border-dark-border flex flex-col h-[70vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-dark-border flex justify-between items-center">
          <h2 className="font-bold text-white">Add Ingredient Image</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-dark-border">
          <button 
            onClick={() => setActiveTab('UPLOAD')}
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'UPLOAD' ? 'border-banana-400 text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
          >
            Upload
          </button>
          <button 
            onClick={() => setActiveTab('STOCK')}
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'STOCK' ? 'border-banana-400 text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
          >
            Free Stock
          </button>
          <button 
            onClick={() => setActiveTab('COMMUNITY')}
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'COMMUNITY' ? 'border-banana-400 text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
          >
            Community
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          
          {/* UPLOAD TAB */}
          {activeTab === 'UPLOAD' && (
            <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-dark-border rounded-xl hover:border-banana-400/50 hover:bg-white/5 transition-all cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <Upload size={48} className="text-gray-500 mb-4" />
              <p className="text-gray-300 font-medium">Click to Upload Photo</p>
              <p className="text-xs text-gray-500 mt-2">JPG, PNG supported</p>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleUpload} />
            </div>
          )}

          {/* STOCK TAB */}
          {activeTab === 'STOCK' && (
            <div className="space-y-4">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-3 text-gray-500" />
                <input 
                  type="text" 
                  placeholder="Search (e.g. Nature, City)..." 
                  value={stockSearch}
                  onChange={(e) => setStockSearch(e.target.value)}
                  className="w-full bg-dark-bg border border-dark-border rounded-full py-2 pl-9 pr-4 text-sm text-white focus:border-banana-400 focus:outline-none"
                />
              </div>
              
              {!stockSearch && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {Object.keys(STOCK_CATEGORIES).map(cat => (
                        <button key={cat} onClick={() => setStockSearch(cat)} className="px-3 py-1 rounded-full bg-dark-bg border border-dark-border text-xs hover:border-banana-400 transition-colors whitespace-nowrap">
                            {cat}
                        </button>
                    ))}
                </div>
              )}

              <div className="grid grid-cols-3 gap-2">
                {getStockImages().map((url, i) => (
                  <div key={i} className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity" onClick={() => onSelect(url)}>
                    <img src={url} alt="Stock" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <p className="text-xs text-center text-gray-500 mt-4">Images from Unsplash Source (Simulated)</p>
            </div>
          )}

          {/* COMMUNITY TAB */}
          {activeTab === 'COMMUNITY' && (
            <div className="space-y-4">
               <div className="flex justify-between items-center px-1">
                   <p className="text-xs text-gray-400">Sorted by Popularity</p>
                   <Heart size={12} className="text-gray-600" />
               </div>
               <div className="grid grid-cols-2 gap-2">
                  {sortedPosts.map(post => (
                    <div 
                        key={post.id} 
                        className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group border border-dark-border"
                        onClick={() => onSelect(post.imageUrl, post.id)}
                    >
                      <img src={post.imageUrl} alt="Post" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-100 flex flex-col justify-end p-2">
                         <div className="flex items-center justify-between">
                             <span className="text-[10px] text-gray-300 font-medium truncate w-16">Gen {post.generation}</span>
                             <div className="flex items-center gap-1 text-red-400">
                                 <Heart size={10} fill="currentColor" />
                                 <span className="text-[10px] font-bold">{post.likes}</span>
                             </div>
                         </div>
                      </div>
                    </div>
                  ))}
               </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
