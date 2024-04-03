import { createClient } from '@sanity/client';

import { apiVersion, dataset, projectId } from '../env';

export const client = createClient({
  apiVersion,
  dataset,
  projectId,
  useCdn: true,
  // These settings will be overridden in
  // ./sanity/lib/store.ts when draftMode is enabled
  perspective: 'published',
  stega: {
    enabled: false,
    studioUrl: '/studio',
  },
});
