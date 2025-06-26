// src/components/quote/QuoteSearch.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchQuotes } from '@/services/quoteService';
import { FlattenedQuote } from '@/types/quotes';
import { Button } from '@/components/ui/Button';
import { Loader2, RefreshCw } from 'lucide-react';

interface QuoteSearchProps {
  theme?: string;
  onQuoteSelect: (quote: FlattenedQuote) => void;
  className?: string;
}

const QUOTES_PER_PAGE = 10;

export function QuoteSearch({ 
  theme, 
  onQuoteSelect,
  className = '' 
}: QuoteSearchProps) {
  const [quotes, setQuotes] = useState<FlattenedQuote[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [selectedQuoteId, setSelectedQuoteId] = useState<string | null>(null);

  const loadQuotes = useCallback(async (newPage: number = 1, reset: boolean = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await fetchQuotes(theme, newPage, QUOTES_PER_PAGE);
      
      setQuotes(prev => reset ? data.quotes : [...prev, ...data.quotes]);
      setHasMore(data.hasMore);
      setPage(newPage);
    } catch (err) {
      console.error('Error loading quotes:', err);
      setError('Failed to load quotes. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [theme]);

  useEffect(() => {
    loadQuotes(1, true);
  }, [loadQuotes]);

  const handleQuoteClick = (quote: FlattenedQuote) => {
    setSelectedQuoteId(quote.id || null);
    onQuoteSelect(quote);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      loadQuotes(page + 1);
    }
  };

  const handleRefresh = () => {
    loadQuotes(1, true);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Select a Quote</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          disabled={loading}
          className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      {error && (
        <div className="p-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/10 rounded-md">
          {error}
        </div>
      )}
      
      <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
        {quotes.map((quote) => (
          <div
            key={quote.id}
            onClick={() => handleQuoteClick(quote)}
            className={`p-3 rounded-md cursor-pointer transition-colors ${
              selectedQuoteId === quote.id
                ? 'bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800'
                : 'hover:bg-gray-50 dark:hover:bg-gray-800/50 border border-transparent hover:border-gray-200 dark:hover:border-gray-700'
            }`}
          >
            <p className="text-sm text-gray-800 dark:text-gray-200">"{quote.quote}"</p>
            {quote.theme && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Theme: {quote.theme}
              </p>
            )}
          </div>
        ))}
        
        {loading && quotes.length === 0 && (
          <div className="flex justify-center p-4">
            <Loader2 className="h-5 w-5 animate-spin text-gray-500 dark:text-gray-400" />
          </div>
        )}
        
        {!loading && quotes.length === 0 && !error && (
          <div className="text-center p-6 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {theme 
                ? `No quotes found for "${theme}" theme. Try another theme.`
                : 'Select a theme to see quotes.'}
            </p>
          </div>
        )}
      </div>
      
      {hasMore && (
        <Button
          variant="outline"
          onClick={handleLoadMore}
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Loading...' : 'Load More'}
        </Button>
      )}
    </div>
  );
}