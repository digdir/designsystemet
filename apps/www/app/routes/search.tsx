import { data } from 'react-router';
import type { Route } from './+types/search';
import {
  getSearchIndex,
  searchIndex,
} from '~/_utils/search-index.server';

export const loader = async ({ request }: Route.LoaderArgs) => {
  const url = new URL(request.url);
  const query = url.searchParams.get('q') || '';
  const lang = (url.searchParams.get('lang') as 'en' | 'no') || 'no';

  if (!query.trim()) {
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
