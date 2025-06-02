// src/types/quotes.ts
export interface FlattenedQuote {
  theme: string;
  quote: string;
  id?: string;
  _id?: string;
}

export interface QuoteApiResponse {
  quotes: FlattenedQuote[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}