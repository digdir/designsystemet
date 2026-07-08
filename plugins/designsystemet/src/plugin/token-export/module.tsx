import type { UiModule } from '../../ui/shell';
import { tokenExportManifest } from './manifest';
import { TokenExport } from './TokenExport';

export function createTokenExportModule(): UiModule {
  return {
    manifest: tokenExportManifest,
    Component: TokenExport,
  };
}
