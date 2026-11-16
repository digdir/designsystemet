import { describe, expect, it } from 'vitest';
import {
  addWorkspaceTheme,
  normalizeConfig,
  removeThemeColor,
  renameWorkspaceThemes,
  setColorOverride,
  setThemeColor,
  type ThemeWorkspace,
  updateActiveTheme,
} from './theme-workspace';

const config = {
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

describe('theme workspace', () => {
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
  it('edits the active theme and leaves the other themes and config settings as they are', () => {
    const workspace: ThemeWorkspace = { config, activeTheme: 'first' };
    const next = updateActiveTheme(workspace, (theme) => ({
      ...setThemeColor(theme, 'accent', 'accent', '#abcdef'),
      borderRadius: 12,
    }));

    expect(next.config.themes.first).toEqual({
      ...config.themes.first,
      colors: { accent: '#abcdef', neutral: '#333333' },
      borderRadius: 12,
    });
    expect(next.config.themes.second).toBe(config.themes.second);
    expect(next.config.outDir).toBe(config.outDir);
    expect(next.activeTheme).toBe('first');
    expect(config.themes.first.colors.accent).toBe('#123456');
    expect(updateActiveTheme(workspace, (theme) => theme)).toBe(workspace);
  });
  it("renames a color in every theme, keeping each theme's value, position and step overrides", () => {
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
    const next = updateActiveTheme(
      { config: withOverrides, activeTheme: 'first' },
      (theme) => setThemeColor(theme, 'accent', 'brand', '#123456'),
    );

    expect(Object.entries(next.config.themes.first.colors)).toEqual([
      ['brand', '#123456'],
      ['neutral', '#333333'],
    ]);
    expect(Object.entries(next.config.themes.second.colors)).toEqual([
      ['brand', '#654321'],
      ['neutral', '#444444'],
    ]);
    for (const [name, theme] of Object.entries(withOverrides.themes)) {
      expect(next.config.themes[name].overrides?.colors).toEqual({
        brand: theme.overrides.colors.accent,
      });
    }
  });
  it('adds and removes a color in every theme', () => {
    const added = updateActiveTheme({ config, activeTheme: 'first' }, (theme) =>
      setThemeColor(theme, undefined, 'brand', '#abcdef'),
    );
    expect(added.config.themes.first.colors).toEqual({
      accent: '#123456',
      neutral: '#333333',
      brand: '#abcdef',
    });
    expect(added.config.themes.second.colors).toEqual({
      accent: '#654321',
      neutral: '#444444',
      brand: '#abcdef',
    });

    const removed = updateActiveTheme(added, (theme) =>
      removeThemeColor(theme, 'accent'),
    );
    expect(removed.config.themes.first.colors).toEqual({
      neutral: '#333333',
      brand: '#abcdef',
    });
    expect(removed.config.themes.second.colors).toEqual({
      neutral: '#444444',
      brand: '#abcdef',
    });
  });
  it('removes the step overrides of a removed color from every theme, and keeps severity colors', () => {
    const withOverrides = {
      ...config,
      themes: Object.fromEntries(
        Object.entries(config.themes).map(([name, theme]) => [
          name,
          {
            ...theme,
            overrides: {
              colors: { accent: { 'text-default': { light: '#123456' } } },
              severity: { danger: '#ab1234' },
            },
          },
        ]),
      ),
    };
    const removed = updateActiveTheme(
      { config: withOverrides, activeTheme: 'first' },
      (theme) => removeThemeColor(theme, 'accent'),
    );

    for (const theme of Object.values(removed.config.themes)) {
      expect(theme.overrides).toEqual({ severity: { danger: '#ab1234' } });
    }
  });
  it('ignores a name taken by another color, and does not rename neutral', () => {
    const theme = config.themes.first;

    expect(setThemeColor(theme, 'accent', 'neutral', '#000000')).toBe(theme);
    expect(setThemeColor(theme, 'neutral', 'grey', '#000000')).toBe(theme);
    expect(setThemeColor(theme, 'accent', 'danger', '#000000').colors).toEqual({
      danger: '#000000',
      neutral: '#333333',
    });
    expect(setThemeColor(theme, undefined, 'accent', '#000000')).toBe(theme);
    expect(
      setThemeColor(theme, 'neutral', 'neutral', '#000000').colors,
    ).toEqual({ accent: '#123456', neutral: '#000000' });
  });
  it('sets and removes step overrides one color scheme at a time', () => {
    let theme = setColorOverride(
      config.themes.first,
      'accent',
      'text-default',
      'light',
      '#abcdef',
    );
    theme = setColorOverride(
      theme,
      'accent',
      'text-default',
      'dark',
      '#fedcba',
    );
    theme = setColorOverride(
      theme,
      'neutral',
      'border-subtle',
      'dark',
      '#111111',
    );
    expect(theme.overrides).toEqual({
      colors: {
        accent: { 'text-default': { light: '#abcdef', dark: '#fedcba' } },
        neutral: { 'border-subtle': { dark: '#111111' } },
      },
    });

    theme = setColorOverride(theme, 'accent', 'text-default', 'light', '');
    theme = setColorOverride(theme, 'neutral', 'border-subtle', 'dark', '');
    expect(theme.overrides).toEqual({
      colors: { accent: { 'text-default': { dark: '#fedcba' } } },
    });
    expect(
      setColorOverride(theme, 'accent', 'text-default', 'dark', '').overrides,
    ).toBeUndefined();
    expect(config.themes.first).not.toHaveProperty('overrides');
  });
  it('makes severity colors ordinary colors of an imported config', () => {
    const imported = normalizeConfig({
      outDir: './custom-tokens',
      themes: {
        plain: { colors: { accent: '#123456', neutral: '#333333' } },
        replaced: {
          colors: { warning: '#111111', accent: '#123456', neutral: '#333333' },
          overrides: {
            severity: { danger: '#ab1234', warning: '#222222' },
            colors: { danger: { 'text-default': { light: '#000000' } } },
          },
        },
      },
    });

    expect(imported.outDir).toBe('./custom-tokens');
    expect(Object.entries(imported.themes.plain.colors)).toEqual([
      ['accent', '#123456'],
      ['neutral', '#333333'],
      ['info', '#0A71C0'],
      ['success', '#068718'],
      ['warning', '#EA9B1B'],
      ['danger', '#C01B1B'],
    ]);
    expect(imported.themes.plain).not.toHaveProperty('overrides');
    expect(Object.entries(imported.themes.replaced.colors)).toEqual([
      ['warning', '#222222'],
      ['accent', '#123456'],
      ['neutral', '#333333'],
      ['info', '#0A71C0'],
      ['success', '#068718'],
      ['danger', '#ab1234'],
    ]);
    expect(imported.themes.replaced.overrides).toEqual({
      colors: { danger: { 'text-default': { light: '#000000' } } },
    });
  });
});
