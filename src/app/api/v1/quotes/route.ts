// src/app/api/v1/quotes/route.ts
import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

interface QuoteTheme {
  name: string;
  quotes: string[];
}

interface QuotesData {
  themes: QuoteTheme[];
}

interface FlattenedQuote {
  theme: string;
  quote: string;
  id: string;
}

function flattenQuotes(json: QuotesData): FlattenedQuote[] {
  const result: FlattenedQuote[] = [];
  json.themes?.forEach((themeObj) => {
    themeObj.quotes?.forEach((q: string) => {
      result.push({ 
        theme: themeObj.name, 
        quote: q,
        id: `${themeObj.name}-${q.substring(0, 10)}-${Math.random().toString(36).substring(2, 9)}`
      });
    });
  });
  return result;
}

// Mock data for quotes
const mockQuotes = [
  {
    id: '1',
    content: 'The only way to do great work is to love what you do.',
    author: 'Steve Jobs',
    theme: 'inspiration',
  },
  {
    id: '2',
    content: 'Innovation distinguishes between a leader and a follower.',
    author: 'Steve Jobs',
    theme: 'innovation',
  },
  {
    id: '3',
    content: 'The future belongs to those who believe in the beauty of their dreams.',
    author: 'Eleanor Roosevelt',
    theme: 'inspiration',
  },
  {
    id: '4',
    content: 'Success is not final, failure is not fatal: It is the courage to continue that counts.',
    author: 'Winston Churchill',
    theme: 'motivation',
  },
  {
    id: '5',
    content: 'The only limit to our realization of tomorrow is our doubts of today.',
    author: 'Franklin D. Roosevelt',
    theme: 'motivation',
  },
];

// Get all quotes with optional theme filtering
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const theme = searchParams.get('theme');
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);

  try {
    // Filter quotes by theme if provided
    let filteredQuotes = theme 
      ? mockQuotes.filter(quote => quote.theme.toLowerCase() === theme.toLowerCase())
      : [...mockQuotes];

    // Simple pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedQuotes = filteredQuotes.slice(startIndex, endIndex);

    return NextResponse.json({
      data: paginatedQuotes,
      meta: {
        total: filteredQuotes.length,
        page,
        limit,
        totalPages: Math.ceil(filteredQuotes.length / limit),
      },
    });
  } catch (error) {
    console.error('Error in GET /api/v1/quotes:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to fetch quotes' },
      { status: 500 }
    );
  }
}

// Add a new quote (for future use)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newQuote = {
      id: (mockQuotes.length + 1).toString(),
      ...body,
    };
    
    mockQuotes.push(newQuote);
    
    return NextResponse.json(newQuote, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create quote' },
      { status: 500 }
    );
  }
}