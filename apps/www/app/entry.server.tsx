import { PassThrough } from 'node:stream';
import { createReadableStreamFromReadable } from '@react-router/node';
import { createInstance } from 'i18next';
import { isbot } from 'isbot';
import type { RenderToPipeableStreamOptions } from 'react-dom/server';
import { renderToPipeableStream } from 'react-dom/server';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import type { AppLoadContext, EntryContext } from 'react-router';
import { ServerRouter } from 'react-router';
import en from '~/locales/en';
import no from '~/locales/no';
import i18n from './i18n';
import i18next from './i18next.server';

// Keep the same timeout constant as Vercel's default implementation
export const streamTimeout = 5_000;

// Support the extra Vercel features (skew protection cookie + nonce) while preserving per-request i18n
const vercelDeploymentId = process.env.VERCEL_DEPLOYMENT_ID;
const vercelSkewProtectionEnabled =
  process.env.VERCEL_SKEW_PROTECTION_ENABLED === '1';
// Align function signature with Vercel's handleRequest so the platform recognizes it
export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
  // loadContext is currently unused but kept for signature parity / future use
  _loadContext?: AppLoadContext,
  // Render options passed by callers (e.g. nonce)
  options?: {
    [K in keyof RenderToPipeableStreamOptions]?: RenderToPipeableStreamOptions[K];
  },
) {
  const instance = createInstance();
  const ns = i18next.getRouteNamespaces(routerContext);

  const url = new URL(request.url);
  const lng = url.pathname.startsWith('/no')
    ? 'no'
    : url.pathname.startsWith('/en')
      ? 'en'
      : 'no';

  await instance.use(initReactI18next).init({
    ...i18n,
    lng,
    ns,
    resources: {
      en: {
        translation: en,
      },
      no: {
        translation: no,
      },
    },
  });

  return new Promise<Response>((resolve, reject) => {
    let shellRendered = false;
    const userAgent = request.headers.get('user-agent');

    // Ensure requests from bots and SPA Mode renders wait for all content to load before responding
    // https://react.dev/reference/react-dom/server/renderToPipeableStream#waiting-for-all-content-to-load-for-crawlers-and-static-generation
    const readyOption: keyof RenderToPipeableStreamOptions =
      (userAgent && isbot(userAgent)) || routerContext.isSpaMode
        ? 'onAllReady'
        : 'onShellReady';

    const { pipe, abort } = renderToPipeableStream(
      <I18nextProvider i18n={instance}>
        <ServerRouter
          context={routerContext}
          url={request.url}
          // Forward nonce if supplied in options for CSP compatibility
          nonce={options?.nonce as string | undefined}
        />
      </I18nextProvider>,
      {
        ...options,
        [readyOption]() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set('Content-Type', 'text/html');
          // Replicate Vercel's skew protection cookie behavior
          if (vercelSkewProtectionEnabled && vercelDeploymentId) {
            responseHeaders.append(
              'Set-Cookie',
              `__vdpl=${vercelDeploymentId}; HttpOnly`,
            );
          }
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode,
            }),
          );
          pipe(body);
        },
        onShellError(error: unknown) {
          reject(error);
        },
        onError(error: unknown) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        },
      },
    );

    // Abort the rendering stream after the `streamTimeout` so it has time to
    // flush down the rejected boundaries
    setTimeout(abort, streamTimeout + 1000);
  });
}
