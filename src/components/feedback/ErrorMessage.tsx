import React from 'react';

interface ErrorMessageProps {
  message: string;
  className?: string;
  onClose?: () => void;
}

export default function ErrorMessage({ message, className = '', onClose }: ErrorMessageProps) {
  return (
    <div className={`bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-r shadow-md ${className}`} role="alert">
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          <svg className="w-5 h-5 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <p className="font-medium">Error</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-red-500 hover:text-red-700 focus:outline-none">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        )}
      </div>
      <p className="mt-1 text-sm">{message}</p>
    </div>
  );
}
