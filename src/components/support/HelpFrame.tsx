import React from 'react';

interface HelpFrameProps {
  title: string;
  content: string | React.ReactNode;
  className?: string;
}

export default function HelpFrame({ title, content, className = '' }: HelpFrameProps) {
  return (
    <div className={`border border-primary bg-neutral p-4 rounded shadow-md ${className}`}>
      <h3 className="text-lg font-semibold text-primary mb-2">{title}</h3>
      <div className="text-gray-700">
        {typeof content === 'string' ? <p>{content}</p> : content}
      </div>
      <div className="mt-3 pt-3 border-t border-gray-300 text-sm text-gray-600">
        Need more help? Contact support or visit our <a href="#" className="text-primary hover:underline">Help Center</a>.
      </div>
    </div>
  );
}
