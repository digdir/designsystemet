import cl from 'clsx/lite';
import {} from 'react';
import { ColorContrasts } from '~/_components/color-contrasts/color-contrasts';
import { ColorPreview } from '~/_components/color-preview/color-preview';
import { ColorTokens } from '~/_components/color-tokens/color-tokens';
import { Colors } from '~/_components/colors/colors';
import { OverviewComponents } from '~/_components/overview-components/overview-components';
import {} from '~/_utils/generate-color-vars';
import { useThemeStore } from '~/store';
import { useThemebuilder } from '../_utils/useThemebuilder';
import classes from './theme-pages.module.css';

export const ThemePages = () => {
  const themeTab = useThemeStore((state) => state.themeTab);
  const { colorScheme, colors, baseBorderRadius } = useThemebuilder();

  return (
    <>
      <div
        className={classes.basicPanel}
        data-color-scheme={colorScheme}
        hidden={!(themeTab === 'overview')}
      >
        <OverviewComponents
          colorScheme={colorScheme}
          color={colors.main[0]?.colors.light[11].hex}
          borderRadius={baseBorderRadius}
        />
      </div>

      {themeTab === 'colorsystem' ? (
        <>
          <div
            className={cl(classes.basicPanel, classes.colorsContainer)}
            data-color-scheme={colorScheme}
            hidden={!(themeTab === 'colorsystem')}
          >
            <Colors />
          </div>

          <div
            className={classes.panel}
            data-color-scheme={colorScheme}
            hidden={!(themeTab === 'colorsystem')}
          >
            <ColorPreview />
          </div>
          <div
            className={classes.panel}
            data-color-scheme={colorScheme}
            hidden={!(themeTab === 'colorsystem')}
          >
            <ColorTokens />
          </div>

          <div
            className={classes.panel}
            data-color-scheme={colorScheme}
            hidden={!(themeTab === 'colorsystem')}
          >
            <ColorContrasts />
          </div>
        </>
      ) : null}
    </>
  );
};
