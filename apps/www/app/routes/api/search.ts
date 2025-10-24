import type { ActionFunctionArgs } from 'react-router';

type QuickResult = {
  title: string;
  content: string;
  url: string;
  type: 'component' | 'guide' | 'pattern' | 'blog';
  sources?: { title: string; url: string }[];
};

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const query = formData.get('query') as string;

  if (!query) {
    return Response.json({ error: 'Query is required', code: null });
  }

  let results: QuickResult[] = [];

  try {
    const searchResponse = await fetch(`http://localhost:3001/api/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: query }),
    });

    if (!searchResponse.ok) {
      throw new Error(`Search API error: ${searchResponse.status}`);
    }
    const data = await searchResponse.json();
    results = data.results || [];

    return Response.json({
      success: true as const,
      results,
      query,
    });
  } catch (error) {
    console.error('Search error:', error);
    return Response.json({
      success: false as const,
      results,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to process search results',
      query,
    });
  }
}
