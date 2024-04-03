import type { QueryParams, SanityDocument } from 'next-sanity';
import { draftMode } from 'next/headers';

import { loadQuery } from '../../sanity/lib/store';

export async function getDocuments(query: string) {
  return await loadQuery<SanityDocument[]>(
    query,
    {},
    { perspective: draftMode().isEnabled ? 'previewDrafts' : 'published' },
  );
}

export async function getDocument(query: string, params: QueryParams) {
  return await loadQuery<SanityDocument>(query, params, {
    perspective: draftMode().isEnabled ? 'previewDrafts' : 'published',
  });
}
