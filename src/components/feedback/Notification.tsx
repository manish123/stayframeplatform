import React, { useEffect, useState } from 'react';

interface NotificationProps {
  message: string;
  className?: string;
  onClose?: () => void;
  autoDismiss?: boolean;
  duration?: number; // in milliseconds
}

export default function Notification({ message, className = '', onClose, autoDismiss = true, duration = 5000 }: NotificationProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (autoDismiss) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [autoDismiss, duration, onClose]);

  if (!visible) return null;

  return (
    <div className={`bg-green-100 border-l-4 border-accent text-green-700 p-4 rounded-r shadow-md animate-fade-in ${className}`} role="status">
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          <svg className="w-5 h-5 mr-2 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <p className="font-medium">Success</p>
        </div>
        {onClose && (
          <button onClick={() => { setVisible(false); onClose(); }} className="text-green-500 hover:text-green-700 focus:outline-none">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        )}
      </div>
      <p className="mt-1 text-sm">{message}</p>
    </div>
  );
}
