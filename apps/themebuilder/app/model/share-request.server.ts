import { data } from 'react-router';
import { validateConfig } from './import-config';
import { clientKey, createRateLimiter } from './rate-limit.server';
import {
  isWithinShareLimits,
  MAX_SHARED_THEME_BYTES,
  type ShareThemeResult,
} from './shared-themes';
import type { WorkspaceConfig } from './theme-workspace';

type ShareError = Extract<ShareThemeResult, { error: string }>['error'];

/** The response for a request to share or update a theme that is turned down */
export const shareError = (error: ShareError, status: number) =>
  data<ShareThemeResult>({ error }, { status });

/** Reads the body as text, or returns `null` when it is larger than `maxBytes`. The length header is not trusted. */
async function readBody(request: Request, maxBytes: number) {
  if (Number(request.headers.get('content-length')) > maxBytes) return null;
  const reader = request.body?.getReader();
  if (!reader) return '';
  const decoder = new TextDecoder();
  let text = '';
  let bytes = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) return text + decoder.decode();
    bytes += value.byteLength;
    if (bytes > maxBytes) {
      await reader.cancel();
      return null;
    }
    text += decoder.decode(value, { stream: true });
  }
}

/**
 * Whether a request to share or update a theme comes from the theme builder itself.
 * Browsers say where a request comes from, and other sites cannot send JSON here either,
 * as that needs a CORS approval this server never gives.
 */
export function isFromThemeBuilder(request: Request) {
  const site = request.headers.get('sec-fetch-site');
  return (
    (!site || site === 'same-origin') &&
    !!request.headers.get('content-type')?.startsWith('application/json')
  );
}

/**
 * Reads the config of a request to share or update a theme. The config goes through the same check
 * as an imported config file, so only a config the CLI accepts is saved. It is saved in full, as it was written.
 */
export async function readSharedConfig(
  request: Request,
): Promise<
  { config: WorkspaceConfig } | { error: ShareError; status: number }
> {
  const body = await readBody(request, MAX_SHARED_THEME_BYTES);
  if (body === null) return { error: 'too-large', status: 413 };

  let input: { config?: unknown };
  try {
    input = JSON.parse(body);
  } catch {
    return { error: 'invalid', status: 400 };
  }
  const result = validateConfig(input?.config);
  if (!('config' in result)) return { error: 'invalid', status: 400 };
  return isWithinShareLimits(result.config)
    ? { config: result.config }
    : { error: 'too-large', status: 413 };
}

/* 30 ids that do not exist per 10 minutes from one client, counted across opening and updating themes.
 * An id is all it takes to change a theme, so this is what keeps ids from being guessed in bulk. */
const misses = createRateLimiter(30, 10 * 60_000);

/** Whether the client has asked for so many themes that do not exist that it is not answered for a while */
export const hasGuessedTooOften = (request: Request) =>
  misses.isUsedUp(clientKey(request));

/** Counts that the client asked for a theme that does not exist */
export const countMissedTheme = (request: Request) => {
  misses(clientKey(request));
};
