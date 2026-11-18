import { useCallback, useEffect, useRef, useState } from 'react';
import { SHARE_THEME_PATH, type SharedThemeIds } from './shared-themes';
import type { WorkspaceConfig } from './theme-workspace';

/** How long the user must pause before the config is saved, in ms */
const SAVE_DELAY = 600;
/** How long to wait before a save that failed is tried again, in ms. The wait doubles for each failure in a row, up to the longest. */
const RETRY_DELAY = 5000;
const LONGEST_RETRY_DELAY = 60_000;

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

const putTheme = (id: string, config: WorkspaceConfig, keepalive = false) =>
  fetch(`${SHARE_THEME_PATH}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ config }),
    keepalive,
  });

/**
 * Saves the config to its shared link as it is edited. Until a link is made, nothing is saved.
 *
 * The theme builder never waits for the server: an edit is shown at once and saved in the background
 * when the user pauses. A save that fails changes nothing on screen but the status; the edits are kept
 * and the save is tried again, with longer and longer waits. One save runs at a time, so an older config
 * can never land after a newer one. When the link no longer exists, the config is no longer linked to it.
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
  const latest = useRef({ config, shared, isSaving: false });
  useEffect(() => {
    latest.current.config = config;
    latest.current.shared = shared;
  });

  const save = useCallback(async () => {
    const { config, shared, isSaving } = latest.current;
    if (!shared || isSaving || shared.config === config) return;
    latest.current.isSaving = true;
    const response = await putTheme(shared.id, config).catch(() => null);
    latest.current.isSaving = false;
    /* The config has been given another link while this was saved, and the outcome says nothing about that link */
    if (latest.current.shared?.id !== shared.id) return;
    if (response?.ok) {
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

  /* Edits that have not been saved when the page is left are sent on the way out */
  useEffect(() => {
    const flush = () => {
      const { config, shared } = latest.current;
      if (shared && shared.config !== config)
        void putTheme(shared.id, config, true).catch(() => {});
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
