import React, { useState } from 'react';

interface TextEditorProps {
  initialContent?: string;
  onChange?: (content: string) => void;
  className?: string;
}

export default function TextEditor({ initialContent = '', onChange, className = '' }: TextEditorProps) {
  const [content, setContent] = useState(initialContent);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    if (onChange) {
      onChange(newContent);
    }
  };

  const handleToolbarClick = (action: string) => {
    // Placeholder for toolbar actions like bold, italic, etc.
    // Implementation would depend on a rich text editor library like Quill or Draft.js
  };

  return (
    <div className={`border border-gray-300 rounded ${className}`}>
      <div className="flex items-center justify-between bg-gray-100 p-2 border-b border-gray-300">
        <div className="flex space-x-2">
          <button onClick={() => handleToolbarClick('bold')} className="p-1 hover:bg-gray-200 rounded">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          </button>
          <button onClick={() => handleToolbarClick('italic')} className="p-1 hover:bg-gray-200 rounded">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5h6l-2 14H9l2-14z" /></svg>
          </button>
          <button onClick={() => handleToolbarClick('underline')} className="p-1 hover:bg-gray-200 rounded">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 012-2h2a2 2 0 012 2v6M9 19h6M5 21h14" /></svg>
          </button>
        </div>
      </div>
      <textarea
        value={content}
        onChange={handleChange}
        className="w-full h-40 p-2 focus:outline-none rounded-b"
        placeholder="Start typing..."
      />
    </div>
  );
}
