import { defaultBorderRadius } from '@digdir/designsystemet/internal';
import {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useContext,
  useMemo,
  useState,
} from 'react';
import type { SharedThemeIds } from './shared-themes';
import { resolveThemeColors, type ThemeColor } from './theme-colors';
import {
  type ThemeWorkspace,
  updateActiveTheme,
  type WorkspaceConfig,
  type WorkspaceTheme,
} from './theme-workspace';
import { type SyncStatus, useSharedThemeSync } from './use-shared-theme-sync';

type ThemeStore = {
  /** Every color of the theme that is shown, in the order of the config */
  colors: ThemeColor[];
  /** The config being edited and the theme that is shown. This is the only theme state in the theme builder. */
  workspace: ThemeWorkspace;
  setWorkspace: Dispatch<SetStateAction<ThemeWorkspace>>;
  /** Replaces the config with one from outside, such as an imported file */
  replaceWorkspace: (workspace: ThemeWorkspace) => void;
  /** Counts how many times the config has been replaced. Editors use it to start over, since what they were editing is gone. */
  revision: number;
  /** The theme that is shown */
  theme: WorkspaceTheme;
  /** The base border radius of the theme that is shown, in px */
  borderRadius: number;
  /** Edits the theme that is shown, see `updateActiveTheme` */
  updateTheme: (update: (theme: WorkspaceTheme) => WorkspaceTheme) => void;
  /** The id of the shared link the config is saved to as it is edited, or `null` when it is not shared */
  sharedId: string | null;
  /** The view id of that link, which opens the config without letting it be changed */
  sharedViewId: string | null;
  /** Whether the edits have reached the shared link, or `null` when the config is not shared */
  syncStatus: SyncStatus | null;
  /** Tries again now to save edits that could not be saved */
  retrySync: () => void;
  /** Records that `config` has been shared under the ids. Edits are saved to that link from then on. */
  markShared: (ids: SharedThemeIds, config: WorkspaceConfig) => void;
  /**
   * The view id of the link the config was opened from for viewing, or `null`. Edits are then not saved anywhere,
   * until the user shares the config under a link of their own.
   */
  viewOnlyId: string | null;
};

const ThemeStoreContext = createContext<ThemeStore | null>(null);

/**
 * Holds the config in memory. It is not saved in the browser: users download the config file to keep
 * their work, and import it to continue. A user can also choose to share the config as a link.
 * It is then saved on the server, and edits are saved to the link as they are made.
 * `initial` and `initialShared` are only read on the first render.
 */
export function ThemeStoreProvider({
  initial,
  initialShared,
  children,
}: {
  initial: ThemeWorkspace;
  /** The shared link `initial` was opened from. Without `id` it was opened for viewing. */
  initialShared?: { id: string | null; viewId: string } | null;
  children: ReactNode;
}) {
  const [workspace, setWorkspace] = useState(initial);
  const { sharedId, sharedViewId, syncStatus, retrySync, markShared } =
    useSharedThemeSync(
      workspace.config,
      initialShared?.id
        ? { id: initialShared.id, viewId: initialShared.viewId }
        : null,
    );
  const [openedViewId] = useState(
    initialShared && !initialShared.id ? initialShared.viewId : null,
  );
  const viewOnlyId = sharedId ? null : openedViewId;
  const [revision, setRevision] = useState(0);
  const theme = workspace.config.themes[workspace.activeTheme];

  /* The scales only depend on the colors and their overrides, so other edits, such as the border radius, do not regenerate them */
  const colorKey = JSON.stringify({
    colors: theme.colors,
    overrides: theme.overrides,
  });
  const colors = useMemo(
    () => resolveThemeColors(JSON.parse(colorKey)),
    [colorKey],
  );

  const store = useMemo(
    () => ({
      workspace,
      setWorkspace,
      replaceWorkspace: (workspace: ThemeWorkspace) => {
        setWorkspace(workspace);
        setRevision((previous) => previous + 1);
      },
      revision,
      theme,
      updateTheme: (update: (theme: WorkspaceTheme) => WorkspaceTheme) =>
        setWorkspace((previous) => updateActiveTheme(previous, update)),
      colors,
      borderRadius: theme.borderRadius ?? defaultBorderRadius,
      sharedId,
      sharedViewId,
      syncStatus,
      retrySync,
      markShared,
      viewOnlyId,
    }),
    [
      workspace,
      theme,
      colors,
      revision,
      sharedId,
      sharedViewId,
      syncStatus,
      retrySync,
      markShared,
      viewOnlyId,
    ],
  );

  return <ThemeStoreContext value={store}>{children}</ThemeStoreContext>;
}

export function useThemeStore() {
  const store = useContext(ThemeStoreContext);
  if (!store) throw new Error('useThemeStore needs a ThemeStoreProvider');
  return store;
}
