import { getColorOverride, setColorOverride } from '~/_utils/color-overrides';
import { useThemebuilder } from '~/routes/themebuilder/_utils/use-themebuilder';
import { useThemeSearchParams } from './use-theme-search-params';

/**
 * Read and write the override for one color step (`colorName` + semantic `tokenName`)
 * in the color scheme currently shown in the themebuilder.
 */
export function useColorOverride(colorName: string, tokenName: string) {
  const { colorScheme } = useThemebuilder();
  const [params, setParams] = useThemeSearchParams();

  const override = getColorOverride(
    params.get('color-overrides'),
    colorName,
    tokenName,
    colorScheme,
  );

  const write = (hex: string | undefined) => {
    setParams(
      (previous) => {
        const next = new URLSearchParams(previous);
        const value = setColorOverride(
          previous.get('color-overrides'),
          colorName,
          tokenName,
          colorScheme,
          hex,
        );
        if (value) next.set('color-overrides', value);
        else next.delete('color-overrides');
        return next;
      },
      { replace: true, preventScrollReset: true },
    );
  };

  return {
    /** The color scheme the override applies to */
    colorScheme,
    /** Override hex for the current color scheme, undefined when the generated color is used */
    override,
    isOverridden: override !== undefined,
    setOverride: (hex: string) => write(hex),
    resetOverride: () => write(undefined),
  };
}
