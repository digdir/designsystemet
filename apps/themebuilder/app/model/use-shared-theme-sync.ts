import { useCallback, useEffect, useRef, useState } from 'react';
import { SHARE_THEME_PATH, type SharedThemeIds } from './shared-themes';
import type { WorkspaceConfig } from './theme-workspace';

/** How long the user must pause before the config is saved, in ms */
const SAVE_DELAY = 600;
/** How long to wait before a save that failed is tried again, in ms. The wait doubles for each failure in a row, up to the longest. */
const RETRY_DELAY = 5000;
const LONGEST_RETRY_DELAY = 60_000;
/** Browsers only let a request outlive the page when its body is at most this large, in bytes */
const KEEPALIVE_LIMIT = 64 * 1024;

/**
 * Whether the config is the one its shared link has:
 * - `synced`: it is
 * - `syncing`: there are edits that are being saved, or wait to be
 * - `failed`: the last save failed, such as when the server cannot be reached. It is tried again.
 * - `too-large`, `rejected`: the server does not take the config as it is now, so it is not tried again until it is edited
 * - `gone`: the link no longer exists. The config is no longer linked to it, and nothing is saved.
 */
export type SyncStatus =
  | 'synced'
  | 'syncing'
  | 'failed'
  | 'too-large'
  | 'rejected'
  | 'gone';

const putTheme = (
  id: string,
  body: string,
  options: { keepalive?: boolean; signal?: AbortSignal } = {},
) =>
  fetch(`${SHARE_THEME_PATH}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body,
    ...options,
  });

const bodyOf = (config: WorkspaceConfig) => JSON.stringify({ config });

/** A save that is on its way: the link and config it saves, and what stops it */
type Saving = {
  id: string;
  config: WorkspaceConfig;
  controller: AbortController;
};

/**
 * Saves the config to its shared link as it is edited. Until a link is made, nothing is saved.
 *
 * The theme builder never waits for the server: an edit is shown at once and saved in the background
 * when the user pauses. A save that fails changes nothing on screen but the status; the edits are kept
 * and the save is tried again, with longer and longer waits. One save runs at a time for a link, so an older
 * config does not land after a newer one. When the link no longer exists, the config is no longer linked to it.
 */
export function useSharedThemeSync(
  config: WorkspaceConfig,
  initialShared?: SharedThemeIds | null,
) {
  /* The links, and the config the server has for them */
  const [shared, setShared] = useState(
    initialShared ? { ...initialShared, config } : null,
  );
  /* How many saves in a row have failed in a way that may pass, such as when the server cannot be reached,
   * and when the next one can be tried. Edits in the meantime do not push that time further away. */
  const [retry, setRetry] = useState({ failures: 0, at: 0 });
  /* A config the server has turned down, such as one that is too large. Saving it again would end the same way. */
  const [rejected, setRejected] = useState<{
    config: WorkspaceConfig;
    isTooLarge: boolean;
  } | null>(null);
  const [isGone, setGone] = useState(false);
  const isRejected = rejected?.config === config;
  const isUnsaved = shared !== null && shared.config !== config && !isRejected;

  /* What `save` reads, so that it saves the config as it is when it runs, not as it was when it was scheduled */
  const latest = useRef({
    config,
    shared,
    isRejected,
    saving: null as Saving | null,
  });
  useEffect(() => {
    latest.current.config = config;
    latest.current.shared = shared;
    latest.current.isRejected = isRejected;
  });

  const save = useCallback(async () => {
    const { config, shared } = latest.current;
    if (!shared || shared.config === config) return;
    /* A save to a link the config no longer has, as after a copy is made, does not hold back the saves to its new link */
    if (latest.current.saving?.id === shared.id) return;
    const saving = { id: shared.id, config, controller: new AbortController() };
    latest.current.saving = saving;
    const response = await putTheme(shared.id, bodyOf(config), {
      signal: saving.controller.signal,
    }).catch(() => null);
    if (latest.current.saving === saving) latest.current.saving = null;
    /* The config has been given another link while this was saved, and the outcome says nothing about that link */
    if (latest.current.shared?.id !== shared.id) return;
    if (saving.controller.signal.aborted) {
      /* It was stopped as the page was left. A page that comes back, as from the back button, saves again. */
      setRetry(({ failures }) => ({ failures, at: 0 }));
    } else if (response?.ok) {
      setRetry({ failures: 0, at: 0 });
      /* Edits made while it was saved make the config differ from this one, which schedules the next save */
      setShared({ ...shared, config });
    } else if (response?.status === 404) {
      setShared(null);
      setGone(true);
    } else if (!response || response.status >= 500 || response.status === 429)
      setRetry(({ failures }) => ({
        failures: failures + 1,
        at:
          Date.now() +
          Math.min(RETRY_DELAY * 2 ** failures, LONGEST_RETRY_DELAY),
      }));
    else setRejected({ config, isTooLarge: response.status === 413 });
  }, []);

  /* A new config and a save that is finished, failed or turned down all restart the wait */
  useEffect(() => {
    if (!isUnsaved) return;
    const delay = Math.max(SAVE_DELAY, retry.at - Date.now());
    const timer = setTimeout(save, delay);
    return () => clearTimeout(timer);
  }, [isUnsaved, config, shared, rejected, retry, save]);

  /* Edits that have not been saved when the page is left are sent on the way out, in a request that outlives the page */
  useEffect(() => {
    const flush = () => {
      const { config, shared, isRejected, saving } = latest.current;
      if (!shared || shared.config === config || isRejected) return;
      const body = bodyOf(config);
      /* A config that is too large is sent in a plain request, which the browser may drop when the page is gone */
      const keepalive = new Blob([body]).size <= KEEPALIVE_LIMIT;
      const onItsWay = saving?.id === shared.id ? saving : null;
      if (onItsWay?.config === config) {
        /* The save that is on its way already has these edits, and a plain request would not do better */
        if (!keepalive) return;
      } else {
        /* A save with older edits is stopped, so that it does not land after this one */
        onItsWay?.controller.abort();
      }
      void putTheme(shared.id, body, { keepalive }).catch(() => {});
    };
    window.addEventListener('pagehide', flush);
    return () => window.removeEventListener('pagehide', flush);
  }, []);

  let syncStatus: SyncStatus | null = isGone ? 'gone' : null;
  if (shared) {
    if (isRejected) syncStatus = rejected.isTooLarge ? 'too-large' : 'rejected';
    else if (!isUnsaved) syncStatus = 'synced';
    else syncStatus = retry.failures ? 'failed' : 'syncing';
  }

  return {
    sharedId: shared?.id ?? null,
    sharedViewId: shared?.viewId ?? null,
    syncStatus,
    /** Tries a save that failed again now, without waiting for the next try */
    retrySync: useCallback(() => {
      setRetry(({ failures }) => ({ failures, at: 0 }));
      void save();
    }, [save]),
    markShared: useCallback((ids: SharedThemeIds, config: WorkspaceConfig) => {
      latest.current.shared = { ...ids, config };
      setShared({ ...ids, config });
      setRetry({ failures: 0, at: 0 });
      setRejected(null);
      setGone(false);
    }, []),
  };
}
