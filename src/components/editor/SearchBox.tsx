import React, { useState } from 'react';

import Button from '../ui/Button';

interface SearchResult {
  id: string;
  title: string;
  snippet: string;
}

interface SearchBoxProps {
  onSearch: (query: string) => void;
  results: SearchResult[];
  className?: string;
}

export default function SearchBox({ onSearch, results, className = '' }: SearchBoxProps) {
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    if (newQuery.trim().length > 2) {
      onSearch(newQuery);
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    setShowResults(false);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center border border-gray-300 rounded focus-within:ring-2 focus-within:ring-primary focus-within:border-primary">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Search..."
          className="px-4 py-2 w-full rounded focus:outline-none"
        />
        {query && (
          <button onClick={handleClear} className="p-1 mr-2 text-gray-500 hover:text-gray-700">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        )}
        <Button variant="primary" className="rounded-l-none h-10" onClick={() => onSearch(query)}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </Button>
      </div>
      {showResults && results.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-neutral border border-gray-300 rounded shadow-lg max-h-60 overflow-y-auto">
          {results.map(result => (
            <div
              key={result.id}
              className="px-4 py-2 hover:bg-primary hover:text-white cursor-pointer"
            >
              <div className="font-medium">{result.title}</div>
              <div className="text-sm text-gray-600 truncate">{result.snippet}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
