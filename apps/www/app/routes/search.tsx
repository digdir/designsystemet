import { data } from 'react-router';
import {
  getSearchIndex,
  type SearchLang,
  searchIndex,
} from '~/_utils/search-index.server';
import i18n from '~/i18n';
import type { Route } from './+types/search';

const MAX_QUERY_LENGTH = 100;
const MAX_RESULTS = 15;

export const loader = async ({ request }: Route.LoaderArgs) => {
  const url = new URL(request.url);
  const query = (url.searchParams.get('q') || '')
    .trim()
    .slice(0, MAX_QUERY_LENGTH);
  const langParam = url.searchParams.get('lang') || '';
  const lang = (
    i18n.supportedLngs.includes(langParam) ? langParam : i18n.fallbackLng
  ) as SearchLang;

  if (!query) {
    return data({ results: [], query: '' });
  }

  const results = searchIndex(getSearchIndex(), query, lang, MAX_RESULTS);

  return data(
    { results, query },
    {
      // Results only change when the site is deployed
      headers: { 'Cache-Control': 'public, max-age=300' },
    },
  );
};
