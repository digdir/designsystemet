import { data } from 'react-router';
import { clientKey, createRateLimiter } from '~/model/rate-limit.server';
import {
  isFromThemeBuilder,
  readSharedConfig,
  shareError,
} from '~/model/share-request.server';
import type { ShareThemeResult } from '~/model/shared-themes';
import { canShareThemes, saveSharedTheme } from '~/model/shared-themes.server';
import type { Route } from './+types/api-themes';

/* 10 new shared themes per 10 minutes from one client */
const withinLimit = createRateLimiter(10, 10 * 60_000);

const notAllowed = () =>
  new Response(null, { status: 405, headers: { Allow: 'POST' } });

/** There is nothing to read here; a shared theme is opened with its link */
export const loader = () => {
  throw notAllowed();
};

/** Saves the config a user has chosen to share, and returns the ids of the links to it. */
export const action = async ({ request }: Route.ActionArgs) => {
  if (request.method !== 'POST') throw notAllowed();
  if (!canShareThemes()) return shareError('not-found', 404);
  if (!isFromThemeBuilder(request)) return shareError('invalid', 403);
  if (!withinLimit(clientKey(request))) return shareError('rate-limited', 429);

  const input = await readSharedConfig(request);
  if ('error' in input) return shareError(input.error, input.status);

  const ids = await saveSharedTheme(input.config);
  return data<ShareThemeResult>(ids, { status: 201 });
};
