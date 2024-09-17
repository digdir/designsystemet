import { expandTypesMap, register } from '@tokens-studio/sd-transforms';
import type { ThemeObject } from '@tokens-studio/types';
import * as R from 'ramda';
import StyleDictionary from 'style-dictionary';
import type { Config, TransformedToken } from 'style-dictionary/types';
import { outputReferencesFilter } from 'style-dictionary/utils';

import * as formats from './formats/css.js';
import { jsTokens } from './formats/js-tokens.js';
import { nameKebab, sizeRem, typographyName, typographyShorthand } from './transformers.js';
import { permutateThemes as permutateThemes_ } from './utils/permutateThemes.js';
import type { PermutatedThemes } from './utils/permutateThemes.js';
import { pathStartsWithOneOf, typeEquals } from './utils/utils.js';

void register(StyleDictionary, { withSDBuiltins: false });
/** Use official W3C design token format
 @see https://v4.styledictionary.com/info/dtcg/
 @see https://design-tokens.github.io/community-group/format/ */
const usesDtcg = true;
export const prefix = 'ds';
export const basePxFontSize = 16;
export const separator = '_';

const fileHeader = () => [`These files are generated from design tokens defind using Token Studio`];

StyleDictionary.registerTransform(sizeRem);
StyleDictionary.registerTransform(nameKebab);
StyleDictionary.registerTransform(typographyShorthand);
StyleDictionary.registerTransform(typographyName);

StyleDictionary.registerFormat(jsTokens);
StyleDictionary.registerFormat(formats.colormode);
StyleDictionary.registerFormat(formats.semantic);
StyleDictionary.registerFormat(formats.typography);

const dsTransformers = [
  nameKebab.name,
  `ts/resolveMath`,
  'ts/size/px',
  sizeRem.name,
  'ts/typography/fontWeight',
  typographyName.name,
  typographyShorthand.name,
  'ts/color/modifiers',
  'ts/color/css/hexrgba',
  'ts/size/lineheight',
  'shadow/css/shorthand',
];

const paritionPrimitives = R.partition(R.test(/(?!.*global\.json).*primitives.*/));

const hasUnknownProps = R.pipe(R.values, R.none(R.equals('unknown')), R.not);

const outputColorReferences = (token: TransformedToken) => {
  if (
    R.test(/accent|neutral|brand1|brand2|brand3|success|danger|warning/, token.name) &&
    R.includes('semantic/color', token.filePath)
  ) {
    return true;
  }

  return false;
};

export type IsCalculatedToken = (token: TransformedToken, options?: Config) => boolean;

export const permutateThemes = ($themes: ThemeObject[]) =>
  permutateThemes_($themes, {
    separator,
  });

type GetConfig = (options: {
  mode?: string;
  theme?: string;
  semantic?: string;
  size?: string;
  typography?: string;
  outPath?: string;
}) => Config;

export const colorModeVariables: GetConfig = ({ mode = 'light', outPath, theme }) => {
  const selector = `${mode === 'light' ? ':root, ' : ''}[data-ds-color-mode="${mode}"]`;
  const layer = `ds.theme.color-mode.${mode}`;

  return {
    usesDtcg,
    log: { verbosity: 'silent' },
    preprocessors: ['tokens-studio'],
    platforms: {
      css: {
        // custom
        outPath,
        mode,
        theme,
        selector,
        layer,
        //
        prefix,
        buildPath: `${outPath}/${theme}/`,
        transforms: dsTransformers,
        files: [
          {
            destination: `color-mode/${mode}.css`,
            format: formats.colormode.name,
            filter: (token) => !token.isSource && typeEquals('color', token),
          },
        ],
        options: {
          fileHeader,
          outputReferences: (token, options) => outputColorReferences(token) && outputReferencesFilter(token, options),
        },
      },
    },
  };
};

export const semanticVariables: GetConfig = ({ outPath, theme }) => {
  const selector = `:root`;
  const layer = `ds.theme.semantic`;

  /**
   * This is a workaround for our formatters to support transative transformers while retaining outputReference.
   *
   * This function will wrap formatted token in `calc()`
   *
   * @example  --ds-spacing-1: var(--ds-spacing-base)*1; ->  --ds-spacing-0: calc(var(--ds-spacing-base)*1);
   */
  const isCalculatedToken: IsCalculatedToken = (token: TransformedToken) =>
    pathStartsWithOneOf(['spacing', 'sizing', 'border-radius'], token);

  return {
    usesDtcg,
    log: { verbosity: 'silent' },
    preprocessors: ['tokens-studio'],
    platforms: {
      css: {
        // custom
        outPath,
        theme,
        basePxFontSize,
        isCalculatedToken,
        selector,
        layer,
        //
        prefix,
        buildPath: `${outPath}/${theme}/`,
        transforms: dsTransformers,
        files: [
          {
            destination: `semantic.css`,
            format: formats.semantic.name,
            filter: (token) =>
              (!token.isSource || isCalculatedToken(token)) &&
              !typeEquals(['color', 'fontWeight', 'fontFamily'], token),
          },
        ],
        options: {
          fileHeader,
          outputReferences: (token, options) => isCalculatedToken(token) && outputReferencesFilter(token, options),
        },
      },
    },
  };
};

export const typescriptTokens: GetConfig = ({ mode = 'unknown', outPath, theme }) => {
  return {
    usesDtcg,
    log: { verbosity: 'silent' },
    preprocessors: ['tokens-studio'],
    platforms: {
      ts: {
        prefix,
        basePxFontSize,
        transforms: dsTransformers,
        buildPath: `${outPath}/${theme}/`,
        files: [
          {
            destination: `${mode}.ts`,
            format: jsTokens.name,
            outputReferences: outputColorReferences,
            filter: (token: TransformedToken) => {
              if (R.test(/primitives\/modes|\/themes/, token.filePath)) return false;
              if (pathStartsWithOneOf(['border-width'], token)) return false;

              if (
                R.test(/accent|neutral|brand1|brand2|brand3|success|danger|warning/, token.name) ||
                R.includes('semantic', token.filePath)
              ) {
                return true;
              }

              return false;
            },
          },
        ],
        options: {
          fileHeader,
        },
      },
    },
  };
};

export const typographyVariables: GetConfig = ({ outPath, theme, typography }) => {
  const selector = `${typography === 'primary' ? ':root, ' : ''}[data-ds-typography="${typography}"]`;
  const layer = `ds.theme.typography.${typography}`;

  return {
    usesDtcg: true,
    log: { verbosity: 'silent' },
    preprocessors: ['tokens-studio'],
    expand: {
      include: ['typography'],
      typesMap: { ...expandTypesMap, typography: { ...expandTypesMap.typography, letterSpacing: 'dimension' } },
    },
    platforms: {
      css: {
        prefix,
        typography,
        selector,
        layer,
        buildPath: `${outPath}/${theme}/`,
        basePxFontSize,
        transforms: [
          nameKebab.name,
          'ts/size/px',
          sizeRem.name,
          'ts/size/lineheight',
          'ts/typography/fontWeight',
          typographyName.name,
        ],
        files: [
          {
            destination: `typography/${typography}.css`,
            format: formats.typography.name,
            filter: (token) => {
              const included = typeEquals(
                ['typography', 'fontweight', 'fontFamily', 'lineheight', 'fontsize', 'dimension', 'font'],
                token,
              );

              return (
                included &&
                !pathStartsWithOneOf(
                  ['spacing', 'sizing', 'border-width', 'border-radius', 'theme', 'theme2', 'theme3', 'theme4'],
                  token,
                )
              );
            },
          },
        ],
        options: {
          fileHeader,
        },
      },
    },
  };
};

type getConfigs = (
  getConfig: GetConfig,
  outPath: string,
  tokensDir: string,
  themes: PermutatedThemes,
) => { mode: string; theme: string; semantic: string; size: string; typography: string; config: Config }[];

export const getConfigs: getConfigs = (getConfig, outPath, tokensDir, permutatedThemes) =>
  permutatedThemes
    .map((permutatedTheme) => {
      const {
        selectedTokenSets = [],
        mode = 'unknown',
        theme = 'unknown',
        semantic = 'unknown',
        size = 'unknown',
        typography = 'unknown',
      } = permutatedTheme;

      if (hasUnknownProps(permutatedTheme)) {
        throw Error(`Theme ${permutatedTheme.name} has unknown props: ${JSON.stringify(permutatedTheme)}`);
      }

      const setsWithPaths = selectedTokenSets.map((x) => `${tokensDir}/${x}.json`);

      const [source, include] = paritionPrimitives(setsWithPaths);

      const config_ = getConfig({
        outPath,
        theme,
        mode,
        semantic,
        size,
        typography,
      });

      const config = {
        ...config_,
        source,
        include,
      };

      return { mode, theme, semantic, size, typography, config };
    })
    .sort();
