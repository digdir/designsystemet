import { data } from 'react-router';
import { getSearchIndex, searchIndex } from '~/_utils/search-index.server';
import type { Route } from './+types/search';

export const loader = async ({ request }: Route.LoaderArgs) => {
  const url = new URL(request.url);
  const query = url.searchParams.get('q') || '';
  const lang = (url.searchParams.get('lang') as 'en' | 'no') || 'no';
  const type = url.searchParams.get('type');

  if (!query.trim()) {
    // List mode, used by the WebMCP list-components tool. The index has one
    // entry per documentation page, so keep only each component's overview.
    if (type === 'component') {
      const results = getSearchIndex()
        .filter(
          (item) =>
            item.lang === lang &&
            item.type === 'component' &&
            item.url.endsWith('/overview'),
        )
        .sort((a, b) => a.title.localeCompare(b.title))
        .map((item) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          url: item.url,
          type: item.type,
        }));

      return data({ results, query: '' });
    }

    return data({ results: [], query: '' });
  }

  const index = getSearchIndex();
  const results = searchIndex(index, query, lang, 15);

  return data({
    results: results.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      url: item.url,
      type: item.type,
    })),
    query,
  });
};
