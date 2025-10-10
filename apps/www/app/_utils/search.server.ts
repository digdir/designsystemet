import { bundleMDX } from 'mdx-bundler';

type QuickResult = {
  title: string;
  content: string;
  url: string;
  type: 'component' | 'guide' | 'pattern' | 'blog';
  sources?: { title: string; url: string }[];
};

type SmartResult = {
  content: string;
  sources: { title: string; url: string }[];
};

export async function searchAction(query: string) {
  'use server';

  if (!query || query.trim().length === 0) {
    throw new Error('Query is required');
  }

  let results: QuickResult[] = [];

  try {
    const response = await fetch(`http://localhost:3001/api/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: query }),
    });

    if (!response.ok) {
      throw new Error(`Search API error: ${response.status}`);
    }
    const data = await response.json();
    results = data.results || [];

    return {
      success: true as const,
      results,
      query,
    };
  } catch (error) {
    console.error('Search error:', error);
    return {
      success: false as const,
      results,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to process search results',
      query,
    };
  }
}

export async function aiSearchAction(query: string) {
  'use server';

  if (!query || query.trim().length === 0) {
    throw new Error('Query is required');
  }

  try {
    const response = await fetch(`http://localhost:3001/api/ai-search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: query }),
    });

    if (!response.ok) {
      throw new Error(`Search API error: ${response.status}`);
    }
    const data = await response.json();

    const { code } = await bundleMDX({
      source: data.answer,
    });
    const result: SmartResult = {
      content: code || '',
      sources: data.sources || [],
    };

    return {
      success: true as const,
      result,
      query,
    };
  } catch (error) {
    console.error('Search error:', error);
    return {
      success: false as const,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to process search results',
      query,
    };
  }
}
