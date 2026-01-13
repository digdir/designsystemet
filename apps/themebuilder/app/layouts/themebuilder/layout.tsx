import cl from 'clsx/lite';
import { ColorContrasts } from '~/_components/color-contrasts/color-contrasts';
import { ColorPreview } from '~/_components/color-preview/color-preview';
import { ColorTokens } from '~/_components/color-tokens/color-tokens';
import { Colors } from '~/_components/colors/colors';
import { OverviewComponents } from '~/_components/overview-components/overview-components';
import { OverviewVariables } from '~/_components/overview-variables/overview-variables';
import { useThemebuilder } from '../../routes/themebuilder/_utils/use-themebuilder';
import classes from './layout.module.css';

export const ThemePages = () => {
  const { colorScheme, colors, baseBorderRadius, tab } = useThemebuilder();

  switch (tab) {
    case 'overview':
      return (
        <div
          className={classes.basicPanel}
          data-color-scheme={colorScheme}
          hidden={!(tab === 'overview')}
        >
          <OverviewComponents
            colorScheme={colorScheme}
            color={colors.main[0]?.colors.light[11].hex}
            borderRadius={baseBorderRadius}
          />
        </div>
      );
    case 'colorsystem':
      return (
        <>
          <div
            className={cl(classes.basicPanel, classes.colorsContainer)}
            data-color-scheme={colorScheme}
            hidden={!(tab === 'colorsystem')}
          >
            <Colors />
          </div>

          <div
            className={classes.panel}
            data-color-scheme={colorScheme}
            hidden={!(tab === 'colorsystem')}
          >
            <ColorPreview />
          </div>
          <div
            className={classes.panel}
            data-color-scheme={colorScheme}
            hidden={!(tab === 'colorsystem')}
          >
            <ColorTokens />
          </div>

          <div
            className={classes.panel}
            data-color-scheme={colorScheme}
            hidden={!(tab === 'colorsystem')}
          >
            <ColorContrasts />
          </div>
        </>
      );
    case 'variables':
      return (
        <div
          className={classes.basicPanel}
          data-color-scheme={colorScheme}
          hidden={!(tab === 'variables')}
        >
          <OverviewVariables />
        </div>
      );
    default:
      return null;
  }
};
