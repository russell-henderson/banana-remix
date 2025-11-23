import React, { useEffect } from 'react';
import { X, Check, Info, AlertCircle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastProps {
  toast: ToastMessage;
  onClose: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, 3000);
    return () => clearTimeout(timer);
  }, [toast.id, onClose]);

  const icons = {
    success: <Check size={18} className="text-green-400" />,
    error: <AlertCircle size={18} className="text-red-400" />,
    info: <Info size={18} className="text-blue-400" />
  };

  const borders = {
    success: 'border-green-500/20 bg-green-500/10',
    error: 'border-red-500/20 bg-red-500/10',
    info: 'border-blue-500/20 bg-blue-500/10'
  };

  return (
    <div className={`flex items-center gap-3 p-4 rounded-xl border backdrop-blur-md shadow-xl animate-in slide-in-from-top-2 fade-in duration-300 min-w-[300px] ${borders[toast.type]}`}>
      <div className="flex-shrink-0">{icons[toast.type]}</div>
      <p className="text-sm font-medium text-white flex-1">{toast.message}</p>
      <button onClick={() => onClose(toast.id)} className="text-white/50 hover:text-white transition-colors">
        <X size={16} />
      </button>
    </div>
  );
};

export const ToastContainer: React.FC<{ toasts: ToastMessage[]; removeToast: (id: string) => void }> = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-4 left-0 right-0 z-[100] flex flex-col items-center gap-2 pointer-events-none px-4">
      {toasts.map(t => (
        <div key={t.id} className="pointer-events-auto">
          <Toast toast={t} onClose={removeToast} />
        </div>
      ))}
    </div>
  );
};