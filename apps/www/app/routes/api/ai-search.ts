import { bundleMDX } from 'mdx-bundler';
import type { ActionFunctionArgs } from 'react-router';

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
    /*TODO: perhaps we should omit "Show more" button and make it always expanded for short answers.
    Easiest way is to just check length of data.answer here with a threshold of say 300 characters
    and add a boolean to SmartResult
    */

    const { code } = await bundleMDX({
      source: data.answer,
    });
    const result: SmartResult = {
      content: code || '',
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
