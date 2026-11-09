import { describe, expect, it } from 'vitest';
import { parseColorOverrides } from '~/routes/themebuilder/_utils/use-themebuilder';
import {
  getColorOverride,
  isValidHex,
  setColorOverride,
} from './color-overrides';

describe('isValidHex', () => {
  it.each(['#abc', '#ABCD', '#a1b2c3', '#A1B2C3D4', ' #abc '])(
    'accepts %j',
    (value) => {
      expect(isValidHex(value)).toBe(true);
    },
  );

  it.each([
    '',
    '#',
    'abc',
    'a1b2c3',
    '#ab',
    '#abcde',
    '#abcdef1',
    '#abcdef123',
    '#ggg',
    '#abc def',
    'red',
  ])('rejects %j', (value) => {
    expect(isValidHex(value)).toBe(false);
  });
});

describe('getColorOverride', () => {
  it('returns undefined when the param is missing or empty', () => {
    expect(
      getColorOverride(null, 'accent', 'text-default', 'light'),
    ).toBeUndefined();
    expect(
      getColorOverride('', 'accent', 'text-default', 'light'),
    ).toBeUndefined();
  });

  it('returns undefined when there is no entry for the token', () => {
    const param =
      'accent|text-subtle|light:#111111 neutral|text-default|light:#222222';
    expect(
      getColorOverride(param, 'accent', 'text-default', 'light'),
    ).toBeUndefined();
  });

  it('returns undefined when the entry only has the other mode', () => {
    expect(
      getColorOverride(
        'accent|text-default|dark:#222222',
        'accent',
        'text-default',
        'light',
      ),
    ).toBeUndefined();
    expect(
      getColorOverride(
        'accent|text-default|light:#111111',
        'accent',
        'text-default',
        'dark',
      ),
    ).toBeUndefined();
  });

  it('returns each mode when both are set', () => {
    const param = 'accent|text-default|light:#111111|dark:#222222';
    expect(getColorOverride(param, 'accent', 'text-default', 'light')).toBe(
      '#111111',
    );
    expect(getColorOverride(param, 'accent', 'text-default', 'dark')).toBe(
      '#222222',
    );
  });

  it('reads modes regardless of their order in the entry', () => {
    const param = 'accent|text-default|dark:#222222|light:#111111';
    expect(getColorOverride(param, 'accent', 'text-default', 'light')).toBe(
      '#111111',
    );
    expect(getColorOverride(param, 'accent', 'text-default', 'dark')).toBe(
      '#222222',
    );
  });

  it('finds an entry among others and ignores extra separators', () => {
    const param =
      '  neutral|text-default|light:#000000   accent|text-default|dark:#222222 ';
    expect(getColorOverride(param, 'accent', 'text-default', 'dark')).toBe(
      '#222222',
    );
    expect(getColorOverride(param, 'neutral', 'text-default', 'light')).toBe(
      '#000000',
    );
  });

  it('does not match a token name that is a prefix of another token name', () => {
    const param = 'accent|text-default-x|light:#111111';
    expect(
      getColorOverride(param, 'accent', 'text-default', 'light'),
    ).toBeUndefined();
    expect(getColorOverride(param, 'accent', 'text-default-x', 'light')).toBe(
      '#111111',
    );
  });

  it('does not match a color name that is a prefix of another color name', () => {
    const param = 'accent2|text-default|light:#111111';
    expect(
      getColorOverride(param, 'accent', 'text-default', 'light'),
    ).toBeUndefined();
    expect(getColorOverride(param, 'accent2', 'text-default', 'light')).toBe(
      '#111111',
    );
  });

  it('picks the right entry when prefix-colliding entries come first', () => {
    const param =
      'accent2|text-default|light:#aaaaaa accent|text-default-x|light:#bbbbbb accent|text-default|light:#cccccc';
    expect(getColorOverride(param, 'accent', 'text-default', 'light')).toBe(
      '#cccccc',
    );
  });

  it('does not match on colorName|tokenName alone (prefix includes the trailing pipe)', () => {
    // `accent|text` is a string prefix of `accent|text-default|...`, but not an entry prefix
    expect(
      getColorOverride(
        'accent|text-default|light:#111111',
        'accent',
        'text',
        'light',
      ),
    ).toBeUndefined();
    // An entry without any mode part has no trailing pipe and is not matched
    expect(
      getColorOverride(
        'accent|text-default',
        'accent',
        'text-default',
        'light',
      ),
    ).toBeUndefined();
  });

  it('ignores malformed mode parts', () => {
    const cases = [
      'accent|text-default|light',
      'accent|text-default|light:',
      'accent|text-default|Light:#111111',
      'accent|text-default|foo:#111111',
      'accent|text-default|',
      'garbage',
      '|||',
    ];
    for (const param of cases) {
      expect(
        getColorOverride(param, 'accent', 'text-default', 'light'),
      ).toBeUndefined();
    }
  });

  it('still reads the valid mode next to a malformed one', () => {
    const param = 'accent|text-default|bogus|dark:#222222';
    expect(getColorOverride(param, 'accent', 'text-default', 'dark')).toBe(
      '#222222',
    );
  });

  it('uses the first entry when the same token appears twice', () => {
    const param =
      'accent|text-default|light:#111111 accent|text-default|light:#999999';
    expect(getColorOverride(param, 'accent', 'text-default', 'light')).toBe(
      '#111111',
    );
  });
});

describe('setColorOverride', () => {
  it('adds an entry to an empty or missing param', () => {
    expect(
      setColorOverride(null, 'accent', 'text-default', 'light', '#111111'),
    ).toBe('accent|text-default|light:#111111');
    expect(
      setColorOverride('', 'accent', 'text-default', 'dark', '#222222'),
    ).toBe('accent|text-default|dark:#222222');
  });

  it('adds the second mode to an existing entry with light before dark', () => {
    expect(
      setColorOverride(
        'accent|text-default|light:#111111',
        'accent',
        'text-default',
        'dark',
        '#222222',
      ),
    ).toBe('accent|text-default|light:#111111|dark:#222222');
    expect(
      setColorOverride(
        'accent|text-default|dark:#222222',
        'accent',
        'text-default',
        'light',
        '#111111',
      ),
    ).toBe('accent|text-default|light:#111111|dark:#222222');
  });

  it('normalises mode order when rewriting an entry', () => {
    expect(
      setColorOverride(
        'accent|text-default|dark:#222222|light:#111111',
        'accent',
        'text-default',
        'dark',
        '#333333',
      ),
    ).toBe('accent|text-default|light:#111111|dark:#333333');
  });

  it('replaces an existing value', () => {
    expect(
      setColorOverride(
        'accent|text-default|light:#111111|dark:#222222',
        'accent',
        'text-default',
        'light',
        '#abcdef',
      ),
    ).toBe('accent|text-default|light:#abcdef|dark:#222222');
  });

  it('removes one mode and keeps the other (undefined and empty hex)', () => {
    const param = 'accent|text-default|light:#111111|dark:#222222';
    expect(
      setColorOverride(param, 'accent', 'text-default', 'light', undefined),
    ).toBe('accent|text-default|dark:#222222');
    expect(setColorOverride(param, 'accent', 'text-default', 'dark', '')).toBe(
      'accent|text-default|light:#111111',
    );
    expect(
      setColorOverride(param, 'accent', 'text-default', 'dark', '   '),
    ).toBe('accent|text-default|light:#111111');
  });

  it('drops the entry when its last mode is removed', () => {
    expect(
      setColorOverride(
        'neutral|text-default|light:#000000 accent|text-default|dark:#222222',
        'accent',
        'text-default',
        'dark',
        undefined,
      ),
    ).toBe('neutral|text-default|light:#000000');
  });

  it("returns '' when the last entry is removed", () => {
    expect(
      setColorOverride(
        'accent|text-default|light:#111111',
        'accent',
        'text-default',
        'light',
        undefined,
      ),
    ).toBe('');
  });

  it('preserves the order of other entries when updating or removing', () => {
    const param =
      'a|text-default|light:#111111 b|text-default|light:#222222 c|text-default|light:#333333';
    expect(
      setColorOverride(param, 'b', 'text-default', 'dark', '#444444'),
    ).toBe(
      'a|text-default|light:#111111 b|text-default|light:#222222|dark:#444444 c|text-default|light:#333333',
    );
    expect(
      setColorOverride(param, 'b', 'text-default', 'light', undefined),
    ).toBe('a|text-default|light:#111111 c|text-default|light:#333333');
  });

  it('appends new entries at the end', () => {
    expect(
      setColorOverride(
        'a|text-default|light:#111111 b|text-default|light:#222222',
        'c',
        'text-default',
        'light',
        '#333333',
      ),
    ).toBe(
      'a|text-default|light:#111111 b|text-default|light:#222222 c|text-default|light:#333333',
    );
  });

  it('trims whitespace from the hex', () => {
    expect(
      setColorOverride(null, 'accent', 'text-default', 'light', '  #111111\n'),
    ).toBe('accent|text-default|light:#111111');
  });

  it('is a no-op when removing an override that does not exist', () => {
    const param = 'accent|text-default|light:#111111';
    expect(
      setColorOverride(param, 'accent', 'text-default', 'dark', undefined),
    ).toBe(param);
    expect(
      setColorOverride(param, 'neutral', 'text-default', 'light', undefined),
    ).toBe(param);
    expect(
      setColorOverride(null, 'accent', 'text-default', 'light', undefined),
    ).toBe('');
  });

  it('does not touch prefix-colliding entries', () => {
    const param =
      'accent2|text-default|light:#aaaaaa accent|text-default-x|light:#bbbbbb';
    expect(
      setColorOverride(param, 'accent', 'text-default', 'light', '#cccccc'),
    ).toBe(`${param} accent|text-default|light:#cccccc`);
    expect(
      setColorOverride(param, 'accent', 'text-default', 'light', undefined),
    ).toBe(param);
  });

  it('collapses extra separators in the param', () => {
    expect(
      setColorOverride(
        '  a|text-default|light:#111111   b|text-default|light:#222222 ',
        'a',
        'text-default',
        'dark',
        '#333333',
      ),
    ).toBe(
      'a|text-default|light:#111111|dark:#333333 b|text-default|light:#222222',
    );
  });

  it('drops malformed mode parts when rewriting an entry', () => {
    expect(
      setColorOverride(
        'accent|text-default|bogus|dark:#222222',
        'accent',
        'text-default',
        'light',
        '#111111',
      ),
    ).toBe('accent|text-default|light:#111111|dark:#222222');
  });
});

describe('round trip with parseColorOverrides', () => {
  it('produces a param the loader parses into the expected object', () => {
    let param: string | null = null;
    param = setColorOverride(
      param,
      'accent',
      'text-default',
      'light',
      '#111111',
    );
    param = setColorOverride(
      param,
      'accent',
      'text-default',
      'dark',
      '#222222',
    );
    param = setColorOverride(param, 'accent', 'text-subtle', 'dark', '#333333');
    param = setColorOverride(
      param,
      'neutral',
      'surface-default',
      'light',
      ' #444 ',
    );
    param = setColorOverride(
      param,
      'accent2',
      'text-default',
      'light',
      '#555555',
    );
    param = setColorOverride(
      param,
      'accent',
      'text-default',
      'light',
      '#666666',
    );

    expect(parseColorOverrides(param)).toEqual({
      accent: {
        'text-default': { light: '#666666', dark: '#222222' },
        'text-subtle': { dark: '#333333' },
      },
      neutral: { 'surface-default': { light: '#444' } },
      accent2: { 'text-default': { light: '#555555' } },
    });

    for (const [colorName, tokens] of Object.entries(
      parseColorOverrides(param),
    )) {
      for (const [tokenName, modes] of Object.entries(tokens)) {
        expect(getColorOverride(param, colorName, tokenName, 'light')).toBe(
          modes.light,
        );
        expect(getColorOverride(param, colorName, tokenName, 'dark')).toBe(
          modes.dark,
        );
      }
    }
  });

  it('parses removals correctly', () => {
    let param =
      'accent|text-default|light:#111111|dark:#222222 neutral|text-default|dark:#333333';
    param = setColorOverride(
      param,
      'accent',
      'text-default',
      'light',
      undefined,
    );
    expect(parseColorOverrides(param)).toEqual({
      accent: { 'text-default': { dark: '#222222' } },
      neutral: { 'text-default': { dark: '#333333' } },
    });
    param = setColorOverride(param, 'neutral', 'text-default', 'dark', '');
    expect(parseColorOverrides(param)).toEqual({
      accent: { 'text-default': { dark: '#222222' } },
    });
    param = setColorOverride(
      param,
      'accent',
      'text-default',
      'dark',
      undefined,
    );
    expect(param).toBe('');
    expect(parseColorOverrides(param)).toEqual({});
  });
});
