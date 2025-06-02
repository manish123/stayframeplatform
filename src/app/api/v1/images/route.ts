// src/app/api/v1/images/route.ts
import { NextResponse } from 'next/server';

interface UnsplashImage {
  id: string;
  urls: {
    regular: string;
    small: string;
    thumb: string;
  };
  user: {
    name: string;
    username: string;
    links: {
      html: string;
    };
  };
  links: {
    html: string;
  };
  width: number;
  height: number;
  description: string | null;
  alt_description: string | null;
}

interface UnsplashResponse {
  total: number;
  total_pages: number;
  results: UnsplashImage[];
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const perPage = 10;

    if (!process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY) {
      console.error('Unsplash access key not configured');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    if (!query.trim()) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      );
    }

    const url = new URL('https://api.unsplash.com/search/photos');
    url.searchParams.append('query', query);
    url.searchParams.append('page', page.toString());
    url.searchParams.append('per_page', perPage.toString());
    url.searchParams.append('orientation', 'landscape');

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Client-ID ${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`,
        'Accept-Version': 'v1',
      },
    });

    if (!response.ok) {
      console.error('Unsplash API error:', await response.text());
      return NextResponse.json(
        { error: 'Failed to fetch images' },
        { status: response.status }
      );
    }

    const data: UnsplashResponse = await response.json();

    // Transform the response to match our frontend needs
    const images = data.results.map((image) => ({
      id: image.id,
      urls: {
        regular: image.urls.regular,
        small: image.urls.small,
        thumb: image.urls.thumb,
      },
      user: {
        name: image.user.name,
        username: image.user.username,
        link: image.user.links.html,
      },
      links: {
        html: image.links.html,
      },
      width: image.width,
      height: image.height,
      alt: image.alt_description || image.description || 'Unsplash image',
    }));

    return NextResponse.json({
      total: data.total,
      total_pages: data.total_pages,
      results: images,
    });
  } catch (error) {
    console.error('Error in images API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
