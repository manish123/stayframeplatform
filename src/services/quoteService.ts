// src/services/quoteService.ts
import { FlattenedQuote } from '@/types/quotes';
import quotesData from '@/data/quotes/quotes_merged_final.json';

// Flatten the nested quotes data into a single array of FlattenedQuote
const allQuotes: FlattenedQuote[] = [];
let uniqueId = 1; // Simple counter for generating unique IDs

quotesData.themes.forEach(theme => {
  theme.quotes.forEach(quote => {
    allQuotes.push({
      id: `quote-${uniqueId++}`,
      theme: theme.name,
      quote: quote,
    });
  });
});

export const fetchQuotes = async (
  theme?: string, 
  page: number = 1, 
  limit: number = 10
): Promise<{ quotes: FlattenedQuote[]; hasMore: boolean }> => {
  try {
    // Filter by theme if provided (skip if 'all' is selected)
    let filteredQuotes = theme && theme !== 'all'
      ? allQuotes.filter(q => q.theme === theme)
      : allQuotes;

    // Calculate pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedQuotes = filteredQuotes.slice(startIndex, endIndex);
    
    // Determine if there are more quotes to load
    const hasMore = endIndex < filteredQuotes.length;

    return {
      quotes: paginatedQuotes,
      hasMore
    };
  } catch (error) {
    console.error('Error processing quotes:', error);
    return {
      quotes: [],
      hasMore: false
    };
  }
};

export const fetchThemes = async (): Promise<string[]> => {
  try {
    // Return all unique theme names
    const themeNames = Array.from(new Set(quotesData.themes.map(theme => theme.name)));
    return themeNames;
  } catch (error) {
    console.error('Error fetching themes:', error);
    return [];
  }
};