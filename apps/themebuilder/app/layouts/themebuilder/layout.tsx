import { Card } from '@digdir/designsystemet-react';
import {
  BorderRadiusVariablesTable,
  BorderWidthVariablesTable,
  OpacityVariablesTable,
  ShadowVariablesTable,
  SizeVariablesTable,
} from '@internal/components';
import cl from 'clsx/lite';
import { ColorContrasts } from '~/_components/color-contrasts/color-contrasts';
import { ColorPreview } from '~/_components/color-preview/color-preview';
import { ColorTokens } from '~/_components/color-tokens/color-tokens';
import { ColorVariables } from '~/_components/color-variables';
import { Colors } from '~/_components/colors/colors';
import { OverviewComponents } from '~/_components/overview-components/overview-components';
import { useThemebuilder } from '../../routes/themebuilder/_utils/use-themebuilder';
import classes from './layout.module.css';

export const ThemePages = () => {
  const { colorScheme, baseBorderRadius, tab } = useThemebuilder();

  switch (tab) {
    case 'examples':
      return (
        <div
          className={classes.basicPanel}
          data-color-scheme={colorScheme}
          hidden={!(tab === 'examples')}
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
        <div className={classes.variablesPanel} hidden={!(tab === 'variables')}>
          <Card
            data-color='neutral'
            data-variant='tinted'
            data-color-scheme={colorScheme}
          >
            <ColorVariables />
          </Card>
          <Card
            data-color='neutral'
            data-variant='tinted'
            data-color-scheme={colorScheme}
          >
            <SizeVariablesTable withPreview />
          </Card>

          <Card
            data-color='neutral'
            data-variant='tinted'
            data-color-scheme={colorScheme}
          >
            <ShadowVariablesTable withPreview />
          </Card>
          <Card
            data-color='neutral'
            data-variant='tinted'
            data-color-scheme={colorScheme}
          >
            <BorderRadiusVariablesTable withPreview />
          </Card>
          <Card
            data-color='neutral'
            data-variant='tinted'
            data-color-scheme={colorScheme}
          >
            <BorderWidthVariablesTable withPreview />
          </Card>
          <Card
            data-color='neutral'
            data-variant='tinted'
            data-color-scheme={colorScheme}
          >
            <OpacityVariablesTable withPreview />
          </Card>
        </div>
      );
    default:
      return null;
  }
};
