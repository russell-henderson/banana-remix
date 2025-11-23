import React, { useState, useRef } from 'react';
import { User } from '../types';
import { Button } from './Button';
import { X, Camera, Upload } from 'lucide-react';

interface EditProfileModalProps {
  user: User;
  onClose: () => void;
  onSave: (updatedData: Partial<User>) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ user, onClose, onSave }) => {
  const [name, setName] = useState(user.name);
  const [handle, setHandle] = useState(user.handle);
  const [bio, setBio] = useState(user.bio || '');
  const [avatar, setAvatar] = useState(user.avatar);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    onSave({
      name,
      handle,
      bio,
      avatar
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-dark-surface w-full max-w-md rounded-2xl border border-dark-border overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-dark-border flex justify-between items-center">
          <h2 className="text-lg font-bold text-white">Edit Profile</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-banana-400">
                <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera size={24} className="text-white" />
              </div>
            </div>
            <button 
                onClick={() => fileInputRef.current?.click()}
                className="text-banana-400 text-sm font-medium hover:underline"
            >
                Change Photo
            </button>
            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleFileChange}
            />
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-400 uppercase">Display Name</label>
              <input 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-dark-bg border border-dark-border rounded-xl p-3 text-white focus:border-banana-400 focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-400 uppercase">Handle</label>
              <input 
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                className="w-full bg-dark-bg border border-dark-border rounded-xl p-3 text-white focus:border-banana-400 focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-400 uppercase">Bio</label>
              <textarea 
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={150}
                rows={3}
                className="w-full bg-dark-bg border border-dark-border rounded-xl p-3 text-white focus:border-banana-400 focus:outline-none resize-none"
              />
              <p className="text-xs text-right text-gray-500">{bio.length}/150</p>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-dark-border bg-dark-surface">
          <Button onClick={handleSubmit} className="w-full">
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};