import { describe, expect, it } from 'vitest';
import {
  addWorkspaceTheme,
  editorParams,
  readWorkspace,
  renameWorkspaceThemes,
  updateWorkspace,
  workspaceParams,
} from './theme-workspace';

// A current config, where a theme only has the severity colors in its `colors`: these themes have none.
const config = {
  $schema: 'https://designsystemet.no/schemas/config/2.0.0.json',
  outDir: './custom-tokens',
  themes: {
    first: {
      colors: { accent: '#123456', neutral: '#333333' },
      borderRadius: 8,
      typography: { fontFamily: 'Georgia' },
    },
    second: {
      colors: { accent: '#654321', neutral: '#444444' },
      borderRadius: 2,
    },
  },
};

describe('compressed theme workspace', () => {
  it('adds an independent copy of the active theme and retains config settings', () => {
    const workspace = addWorkspaceTheme(
      { config, activeTheme: 'first' },
      'new-theme',
    );
    expect(workspace.activeTheme).toBe('new-theme');
    expect(workspace.config.outDir).toBe(config.outDir);
    expect(workspace.config.themes['new-theme']).toEqual(config.themes.first);
    expect(workspace.config.themes['new-theme']).not.toBe(config.themes.first);
    workspace.config.themes['new-theme'].colors.accent = '#abcdef';
    expect(config.themes.first.colors.accent).toBe('#123456');
    expect(readWorkspace(workspaceParams(workspace))).toEqual(workspace);
  });
  it('renames and adds themes in order, keeping the active theme selected', () => {
    const workspace = renameWorkspaceThemes({ config, activeTheme: 'first' }, [
      { from: 'second', name: 'dark' },
      { from: 'first', name: 'light' },
      { from: null, name: 'extra' },
    ]);
    expect(Object.keys(workspace.config.themes)).toEqual([
      'dark',
      'light',
      'extra',
    ]);
    expect(workspace.activeTheme).toBe('light');
    expect(workspace.config.outDir).toBe(config.outDir);
    expect(workspace.config.themes.light).toEqual(config.themes.first);
    expect(workspace.config.themes.extra).toEqual(config.themes.first);
    expect(workspace.config.themes.extra).not.toBe(config.themes.first);
  });
  it('removes themes left out, falling back to the first theme when the active one is removed', () => {
    const workspace = renameWorkspaceThemes({ config, activeTheme: 'first' }, [
      { from: 'second', name: 'second' },
    ]);
    expect(Object.keys(workspace.config.themes)).toEqual(['second']);
    expect(workspace.activeTheme).toBe('second');
    expect(() =>
      renameWorkspaceThemes({ config, activeTheme: 'first' }, []),
    ).toThrow('A workspace needs at least one theme');
  });
  it('rejects invalid or duplicate names when renaming', () => {
    const workspace = { config, activeTheme: 'first' };
    expect(() =>
      renameWorkspaceThemes(workspace, [
        { from: 'first', name: 'same' },
        { from: 'second', name: 'same' },
      ]),
    ).toThrow('Theme already exists');
    expect(() =>
      renameWorkspaceThemes(workspace, [{ from: 'first', name: 'Bad Name' }]),
    ).toThrow('Invalid theme name');
    expect(() =>
      renameWorkspaceThemes(workspace, [{ from: 'missing', name: 'ok' }]),
    ).toThrow('Unknown theme');
  });
  it('rejects duplicate and invalid theme names without changing the workspace', () => {
    const workspace = { config, activeTheme: 'first' };
    expect(() => addWorkspaceTheme(workspace, 'first')).toThrow(
      'Theme already exists',
    );
    for (const name of ['', 'New Theme', '__proto__', 'bad--name']) {
      expect(() => addWorkspaceTheme(workspace, name)).toThrow(
        'Invalid theme name',
      );
    }
    expect(Object.keys(config.themes)).toEqual(['first', 'second']);
  });
  it('round-trips the whole config without injecting defaults', () => {
    const params = workspaceParams({ config, activeTheme: 'second' });
    expect(readWorkspace(params)).toEqual({ config, activeTheme: 'second' });
    expect(params.has('colors')).toBe(false);
    expect(params.get('config')?.length).toBeLessThan(
      encodeURIComponent(JSON.stringify(config)).length,
    );
  });
  it('preserves inactive themes and settings through edits and switching', () => {
    const params = workspaceParams({ config, activeTheme: 'first' });
    const edited = editorParams(params);
    edited.set('border-radius', '12');
    edited.set('colors', 'accent:#abcdef neutral:#333333');
    const next = updateWorkspace(params, edited);
    expect(readWorkspace(next)?.config.themes.first.overrides).toBeUndefined();
    expect(readWorkspace(next)?.config.themes.second).toEqual(
      config.themes.second,
    );
    expect(readWorkspace(next)?.config.outDir).toBe(config.outDir);
    expect(readWorkspace(next)?.config.themes.first.typography).toEqual(
      config.themes.first.typography,
    );
    next.set('theme', 'second');
    expect(editorParams(next).get('border-radius')).toBe('2');
    next.set('theme', 'first');
    expect(editorParams(next).get('border-radius')).toBe('12');
  });
  it('renames shared colors without losing theme values or token overrides', () => {
    const withOverrides = {
      ...config,
      themes: Object.fromEntries(
        Object.entries(config.themes).map(([name, theme]) => [
          name,
          {
            ...theme,
            overrides: {
              colors: {
                accent: {
                  'base-default': {
                    light: name === 'first' ? '#abcdef' : '#fedcba',
                  },
                  'text-default': { dark: '#112233' },
                },
              },
            },
          },
        ]),
      ),
    };
    const params = workspaceParams({
      config: withOverrides,
      activeTheme: 'first',
    });
    const edited = editorParams(params);
    edited.set('colors', 'brand:#123456 neutral:#333333');
    const next = readWorkspace(updateWorkspace(params, edited));
    expect(next?.config.themes.second.colors).toEqual({
      brand: '#654321',
      neutral: '#444444',
    });
    expect(next?.config.themes.first.colors.brand).toBe('#123456');
    for (const [name, theme] of Object.entries(withOverrides.themes)) {
      expect(
        next?.config.themes[name].overrides?.colors?.accent,
      ).toBeUndefined();
      expect(next?.config.themes[name].overrides?.colors?.brand).toEqual(
        theme.overrides.colors.accent,
      );
    }
  });
  it('keeps legacy links and rejects corrupt or unknown workspaces', () => {
    const legacy = new URLSearchParams('colors=accent%3A%23123456');
    expect(editorParams(legacy).toString()).toBe(legacy.toString());
    expect(() => readWorkspace(new URLSearchParams('config=broken'))).toThrow();
    expect(() => readWorkspace(new URLSearchParams('config='))).toThrow();
    const params = workspaceParams({ config, activeTheme: 'missing' });
    expect(() => readWorkspace(params)).toThrow();
  });
  it('adds and removes shared colors while preserving theme values', () => {
    const params = workspaceParams({ config, activeTheme: 'first' });
    const edited = editorParams(params);
    edited.set('colors', 'accent:#123456 neutral:#333333 brand:#abcdef');
    const added = updateWorkspace(params, edited);
    expect(readWorkspace(added)?.config.themes.second.colors).toEqual({
      accent: '#654321',
      neutral: '#444444',
      brand: '#abcdef',
    });
    const removed = editorParams(added);
    removed.set('colors', 'neutral:#333333 brand:#abcdef');
    expect(
      readWorkspace(updateWorkspace(added, removed))?.config.themes.second
        .colors,
    ).toEqual({ neutral: '#444444', brand: '#abcdef' });
  });
  it('deletes color overrides from every theme without deleting severity colors', () => {
    const withOverrides = {
      ...config,
      themes: Object.fromEntries(
        Object.entries(config.themes).map(([name, theme]) => [
          name,
          {
            ...theme,
            colors: { ...theme.colors, danger: '#ab1234' },
            overrides: {
              colors: { accent: { 'text-default': { light: '#123456' } } },
            },
          },
        ]),
      ),
    };
    const params = workspaceParams({
      config: withOverrides,
      activeTheme: 'first',
    });
    const edited = editorParams(params);
    expect(edited.get('severity')).toBe('danger:#ab1234');
    expect(edited.get('severity-removed')).toBe('info success warning');
    edited.set('colors', 'neutral:#333333');
    const removed = readWorkspace(updateWorkspace(params, edited));
    for (const theme of Object.values(removed?.config.themes || {})) {
      expect(theme.overrides?.colors).toBeUndefined();
      expect(theme.overrides?.severity).toBeUndefined();
      expect(theme.colors.danger).toBe('#ab1234');
      expect(Object.keys(theme.colors)).toEqual(['neutral', 'danger']);
    }
  });
  it('adds and removes severity colors in every theme, as colors', () => {
    const params = workspaceParams({ config, activeTheme: 'first' });
    const edited = editorParams(params);
    // The themes have no severity colors
    expect(edited.get('severity-removed')).toBe('info success warning danger');

    // Adds danger with its own color, and info with the default color
    edited.set('severity', 'danger:#ab1234');
    edited.set('severity-removed', 'success warning');
    const added = updateWorkspace(params, edited);
    expect(readWorkspace(added)?.config.themes.first.colors).toEqual({
      accent: '#123456',
      neutral: '#333333',
      info: '#0A71C0',
      danger: '#ab1234',
    });
    expect(readWorkspace(added)?.config.themes.second.colors).toEqual({
      accent: '#654321',
      neutral: '#444444',
      info: '#0A71C0',
      danger: '#ab1234',
    });
    expect(
      readWorkspace(added)?.config.themes.first.overrides?.severity,
    ).toBeUndefined();
    expect(added.has('severity-removed')).toBe(false);

    // Removes both again
    const removed = editorParams(added);
    removed.delete('severity');
    removed.set('severity-removed', 'info success warning danger');
    const removedWorkspace = readWorkspace(updateWorkspace(added, removed));
    expect(removedWorkspace?.config.themes.first.colors).toEqual(
      config.themes.first.colors,
    );
    expect(removedWorkspace?.config.themes.second.colors).toEqual(
      config.themes.second.colors,
    );
  });
  it('gives a config from before severity colors were optional the ones it had by default', () => {
    const legacy = {
      themes: {
        first: {
          colors: { accent: '#123456' },
          overrides: { severity: { danger: '#ab1234' } },
        },
      },
    };
    const workspace = readWorkspace(
      workspaceParams({ config: legacy, activeTheme: 'first' }),
    );
    expect(workspace?.config.themes.first).toEqual({
      colors: {
        accent: '#123456',
        info: '#0A71C0',
        success: '#068718',
        warning: '#EA9B1B',
        danger: '#ab1234',
      },
    });
    expect(workspace?.config.$schema).toBe(
      'https://designsystemet.no/schemas/config/2.0.0.json',
    );
  });
  it('preserves per-theme overrides regardless of the legacy severity flag', () => {
    const params = workspaceParams({ config, activeTheme: 'first' });
    const edited = editorParams(params);
    edited.set(
      'color-overrides',
      'accent|text-default|light:#abcdef|dark:#fedcba',
    );
    const next = updateWorkspace(params, edited);
    expect(editorParams(next).get('color-overrides')).toBe(
      edited.get('color-overrides'),
    );
    const severity = editorParams(next);
    severity.set('severity-enabled', 'false');
    const flagged = updateWorkspace(next, severity);
    expect(flagged.has('severity-enabled')).toBe(false);
    expect(readWorkspace(flagged)?.config.themes.second).toEqual(
      config.themes.second,
    );
  });
});
