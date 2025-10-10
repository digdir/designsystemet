import type { ActionFunctionArgs } from 'react-router';
import { processMdx } from '../../_utils/mdx.server';

type SmartResult = {
  content: string;
  sources: { title: string; url: string }[];
};

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const query = formData.get('query') as string;

  if (!query) {
    return Response.json({ error: 'Query is required', code: null });
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

    const content = await processMdx(data.answer);
    const result: SmartResult = {
      content: content || '',
      sources: data.sources || [],
    };

    return Response.json({
      success: true as const,
      result,
      query,
    });
  } catch (error) {
    console.error('Search error:', error);
    return Response.json({
      success: false as const,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to process search results',
      query,
    });
  }
}
