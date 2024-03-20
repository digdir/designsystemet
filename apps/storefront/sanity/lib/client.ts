import type { SanityClient } from 'next-sanity';
import { createClient } from '@sanity/client';

import { apiVersion, dataset, projectId } from '../env';

export function getClient(previewToken?: string): SanityClient {
  return createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: !previewToken,
    perspective: previewToken ? 'previewDrafts' : 'published',
    stega: {
      enabled: previewToken ? true : false,
      studioUrl: '/studio',
    },
    token: previewToken,
  });
}
