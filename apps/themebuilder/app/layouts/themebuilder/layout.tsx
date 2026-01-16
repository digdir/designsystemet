import { Heading } from '@digdir/designsystemet-react';
import {
  BorderRadiusVariablesTable,
  OpacityVariablesTable,
  ShadowVariablesTable,
  SizeVariablesTable,
} from '@internal/components';
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
  const { colorScheme, baseBorderRadius, tab } = useThemebuilder();

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
          className={classes.variablesPanel}
          data-color-scheme={colorScheme}
          hidden={!(tab === 'variables')}
        >
          <Heading level={2} data-size='lg' className={classes['rainbow-box']}>
            Mia
          </Heading>
          <div className={classes.basicPanel}>
            <OverviewVariables />
          </div>
          <div className={classes.basicPanel}>
            <SizeVariablesTable withPreview />
          </div>
          <div className={classes.basicPanel}>
            <BorderRadiusVariablesTable withPreview />
          </div>
          <div className={classes.basicPanel}>
            <ShadowVariablesTable withPreview />
          </div>
          <div className={classes.basicPanel}>
            <OpacityVariablesTable withPreview />
          </div>
        </div>
      );
    default:
      return null;
  }
};
