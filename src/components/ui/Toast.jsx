import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = () => {
  const { toast } = useApp();

  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <div className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-[100] animate-bounce-in max-w-md">
      <div className={`px-5 py-4 rounded-xl shadow-2xl backdrop-blur-md border flex items-center gap-3 transition-all duration-300 ${
        isSuccess 
          ? 'bg-[#063B32]/95 border-[#D8C7A1] text-[#F7F3EA]' 
          : isError
            ? 'bg-red-950/95 border-red-500 text-white'
            : 'bg-[#071B2A]/95 border-[#B98262] text-[#F7F3EA]'
      }`}>
        {isSuccess && <CheckCircle2 className="w-5 h-5 text-[#D8C7A1] shrink-0" />}
        {isError && <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />}
        {!isSuccess && !isError && <Info className="w-5 h-5 text-[#D8C7A1] shrink-0" />}
        
        <p className="text-sm font-medium tracking-wide">{toast.message}</p>
      </div>
    </div>
  );
};
