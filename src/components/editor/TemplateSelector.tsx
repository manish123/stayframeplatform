import React, { useState } from 'react';

import Button from '../ui/Button';

interface Template {
  id: string;
  name: string;
  description: string;
}

interface TemplateSelectorProps {
  templates: Template[];
  onSelect: (templateId: string) => void;
  className?: string;
}

export default function TemplateSelector({ templates, onSelect, className = '' }: TemplateSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const handleToggle = () => setIsOpen(!isOpen);
  const handleSelect = (template: Template) => {
    setSelectedTemplate(template.id);
    onSelect(template.id);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <Button variant="primary" onClick={handleToggle} className="w-full text-left justify-between">
        {selectedTemplate ? templates.find(t => t.id === selectedTemplate)?.name : 'Select a Template'}
        <svg className={`w-5 h-5 ml-2 transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
      </Button>
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-neutral border border-gray-300 rounded shadow-lg max-h-60 overflow-y-auto">
          {templates.map(template => (
            <div
              key={template.id}
              onClick={() => handleSelect(template)}
              className="px-4 py-2 hover:bg-primary hover:text-white cursor-pointer"
            >
              <div className="font-medium">{template.name}</div>
              <div className="text-sm text-gray-600 truncate">{template.description}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
