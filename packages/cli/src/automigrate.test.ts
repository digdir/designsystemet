import { beforeEach, describe, expect, it, vi } from 'vitest';
import { checkAutomigrate } from './automigrate.ts';
import { parseJsonc } from './schemas/helpers.ts';
import { dsfs } from './utils/filesystem.ts';

const confirm = vi.hoisted(() => vi.fn<() => Promise<boolean>>());
vi.mock('@inquirer/confirm', () => ({ default: confirm }));

type ParsedConfig = { outDir?: string; output?: unknown; themes: { theme: { colors: Record<string, unknown> } } };

// Eligible for both automigrations: the old color categories and the deprecated `outDir`.
const config = JSON.stringify({
  outDir: 'tokens',
  themes: { theme: { colors: { main: { accent: '#0062BA' }, support: {}, neutral: '#1E2B3C' } } },
});

describe('checkAutomigrate', () => {
  let written: string[];

  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    written = [];
    vi.spyOn(dsfs, 'writeFile').mockImplementation(async (_path, content) => {
      written.push(String(content));
    });
    confirm.mockReset();
  });

  it('does not write a declined migration when a later migration is accepted', async () => {
    // Decline flattening the color categories, accept the new output field.
    confirm.mockResolvedValueOnce(false).mockResolvedValueOnce(true);

    const runtimeConfig = parseJsonc<ParsedConfig>(await checkAutomigrate(config, 'designsystemet.config.json', false));
    const writtenConfig = parseJsonc<ParsedConfig>(written.at(-1) ?? '');

    // The file keeps the declined color categories, but gets the accepted `output`.
    expect(writtenConfig.themes.theme.colors).toEqual({ main: { accent: '#0062BA' }, support: {}, neutral: '#1E2B3C' });
    expect(writtenConfig.output).toBeDefined();
    expect(writtenConfig.outDir).toBeUndefined();

    // This run still uses the flattened colors, plus the accepted `output`.
    expect(runtimeConfig.themes.theme.colors).toEqual({ accent: '#0062BA', neutral: '#1E2B3C' });
    expect(runtimeConfig.output).toEqual(writtenConfig.output);
  });

  it('writes every accepted migration', async () => {
    confirm.mockResolvedValue(true);

    const runtimeConfig = await checkAutomigrate(config, 'designsystemet.config.json', false);

    expect(written.at(-1)).toBe(runtimeConfig);
    expect(parseJsonc<ParsedConfig>(runtimeConfig).themes.theme.colors).toEqual({
      accent: '#0062BA',
      neutral: '#1E2B3C',
    });
  });

  it('writes nothing when every migration is declined', async () => {
    confirm.mockResolvedValue(false);

    await checkAutomigrate(config, 'designsystemet.config.json', false);

    expect(written).toEqual([]);
  });
});
