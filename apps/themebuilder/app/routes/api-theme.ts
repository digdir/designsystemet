import { clientKey, createRateLimiter } from '~/model/rate-limit.server';
import {
  countMissedTheme,
  hasGuessedTooOften,
  isFromThemeBuilder,
  readSharedConfig,
  shareError,
} from '~/model/share-request.server';
import {
  canShareThemes,
  updateSharedTheme,
} from '~/model/shared-themes.server';
import type { Route } from './+types/api-theme';

/* 120 updates per minute from one client. The theme builder saves when the user pauses, so it stays far below this. */
const withinLimit = createRateLimiter(120, 60_000);

const notAllowed = () =>
  new Response(null, { status: 405, headers: { Allow: 'PUT' } });

/** There is nothing to read here; a shared theme is opened with its link */
export const loader = () => {
  throw notAllowed();
};

/**
 * Replaces the config of a shared theme with the one the user has now. The id is all that is needed:
 * a shared theme can be changed by anyone who has its link.
 */
export const action = async ({ request, params }: Route.ActionArgs) => {
  if (request.method !== 'PUT') throw notAllowed();
  if (!canShareThemes()) return shareError('not-found', 404);
  if (!isFromThemeBuilder(request)) return shareError('invalid', 403);
  if (!withinLimit(clientKey(request)) || hasGuessedTooOften(request))
    return shareError('rate-limited', 429);

  const input = await readSharedConfig(request);
  if ('error' in input) return shareError(input.error, input.status);

  if (!(await updateSharedTheme(params.id, input.config))) {
    countMissedTheme(request);
    return shareError('not-found', 404);
  }
  return new Response(null, { status: 204 });
};
