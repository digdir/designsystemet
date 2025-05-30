import {
  Button,
  Checkbox,
  Heading,
  Paragraph,
  Switch,
  ToggleGroup,
} from '@digdir/designsystemet-react';
import cl from 'clsx/lite';
import { useState } from 'react';
import { generateColorVars } from '~/_utils/generate-color-vars';
import { type ColorTheme, useThemeStore } from '~/store';
import listClasses from './card.module.css';
import classes from './color-preview.module.css';

type ViewType = 'list' | 'grid';

const DEFAULT_VIEW: ViewType = 'grid';

export const ColorPreview = () => {
  const colors = useThemeStore((state) => state.colors);
  const [view, setView] = useState<ViewType>(DEFAULT_VIEW);

  const CardWrapper = ({ color }: CardProps) =>
    view === 'list' ? (
      <VerticalCard color={color} />
    ) : (
      <HorizontalCard color={color} />
    );

  const allColors = [...colors.main, ...colors.neutral, ...colors.support];

  return (
    <div className='panelContainer'>
      <div className='panelLeft'>
        <div className='panelTop'>
          <Heading data-size='xs'>Se fargene dine i bruk</Heading>
          <Paragraph data-size='sm'>
            Hver farge som blir valgt med verktøyet får sitt eget kort i
            seksjonen til høyre slik at du kan se hvordan fargene harmonerer
            sammen.
          </Paragraph>
          <Paragraph data-size='sm'>
            Merk at kontrastfargen inne i knappen endrer seg fra hvit til svart,
            avhengig av om den valgte fargen er lys eller mørk for å oppnå best
            mulig kontrast.
          </Paragraph>
        </div>
        <div className='panelBottom'>
          <div className={classes.label}>Visning:</div>
          <ToggleGroup
            data-size='sm'
            defaultValue={DEFAULT_VIEW}
            onChange={(value: string) => setView(value as ViewType)}
          >
            <ToggleGroup.Item value='grid'>Grid</ToggleGroup.Item>
            <ToggleGroup.Item value='list'>Liste</ToggleGroup.Item>
          </ToggleGroup>
        </div>
      </div>
      <div
        className={cl(
          'panelRight',
          view === 'grid' ? classes.grid : classes.list,
        )}
      >
        {allColors.map((color, index) => (
          <CardWrapper key={`${color.name}-${index}`} color={color} />
        ))}
      </div>
    </div>
  );
};

type CardProps = {
  color: ColorTheme;
};

const HorizontalCard = ({ color }: CardProps) => {
  const colorScheme = useThemeStore((state) => state.colorScheme);
  const colorStyles = generateColorVars(color.colors, colorScheme);

  return (
    <div style={colorStyles} className={classes.card}>
      <Heading className={classes.title} data-size='2xs'>
        {color.name}
      </Heading>
      <Paragraph data-size='sm' className={classes.desc}>
        Livet er for kort til å være grått. Fyll deg selv og dine dager med
        farger.
      </Paragraph>
      <div className={classes.checkGroup}>
        <Checkbox
          data-size='sm'
          label='Checkbox 1'
          value='one'
          defaultChecked
        />
        <Checkbox data-size='sm' label='Checkbox 2' value='two' />
      </div>
      <div className={classes.btnGroup}>
        <Button data-size='sm'>Primær</Button>
        <Button data-size='sm' variant='secondary'>
          Sekundær
        </Button>
      </div>
    </div>
  );
};
const VerticalCard = ({ color }: CardProps) => {
  const colorScheme = useThemeStore((state) => state.colorScheme);
  const colorStyles = generateColorVars(color.colors, colorScheme);

  return (
    <div style={colorStyles} className={cl(classes.card, listClasses.card)}>
      <div className={listClasses.text}>
        <Heading className={listClasses.title} data-size='2xs'>
          {color.name}
        </Heading>
        <Paragraph className={classes.desc} data-size='sm'>
          Farger gjør livet mer fargerikt
        </Paragraph>
      </div>
      <div className={listClasses.checkGroup}>
        <Checkbox data-size='sm' label='Checkbox' value='value' />
        <Switch aria-labelledby='' position='start' data-size='sm'>
          Switch
        </Switch>
      </div>
      <div className={classes.btnGroup}>
        <Button data-size='sm'>Primær</Button>
        <Button data-size='sm' variant='secondary'>
          Sekundær
        </Button>
      </div>
    </div>
  );
};
