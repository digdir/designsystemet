import {
  Button,
  Checkbox,
  Heading,
  Paragraph,
  Switch,
  ToggleGroup,
} from '@digdir/designsystemet-react';
import cl from 'clsx/lite';
import { useEffect, useState } from 'react';
import { type ColorTheme, useThemeStore } from '../../store';
import { generateColorVars } from '../../utils/generateColorVars';
import listClasses from './Card2.module.css';
import classes from './ColorPreview.module.css';

type ViewType = 'list' | 'grid';

export const ColorPreview = () => {
  const colors = useThemeStore((state) => state.colors);
  const [view, setView] = useState<ViewType>('grid');
  const colorScheme = useThemeStore((state) => state.colorScheme);

  type CardProps = {
    color: ColorTheme;
  };

  const CardWrapper = ({ color }: CardProps) => {
    if (view === 'list') {
      return <VerticalCard color={color} />;
    }
    return <HorizontalCard color={color} />;
  };

  const HorizontalCard = ({ color }: CardProps) => {
    useEffect(() => {}, []);

    const [valueOne, setValueOne] = useState(true);
    return (
      <div
        style={generateColorVars(color.colors, colorScheme)}
        className={classes.card}
      >
        <Heading className={classes.cardTitle} data-size='2xs'>
          {color.name}
        </Heading>
        <Paragraph data-size='sm' className={classes.cardDesc}>
          Livet er for kort til å være grått. Fyll deg selv og dine dager med
          farger.
        </Paragraph>
        <div className={classes.checkGroup}>
          <Checkbox
            data-size='sm'
            label='Checkbox 1'
            value='one'
            onChange={() => setValueOne(!valueOne)}
            checked={valueOne}
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
    const [isChecked, setIsChecked] = useState(true);
    const [isSwitch, setIsSwitch] = useState(true);
    return (
      <div
        style={generateColorVars(color.colors, colorScheme)}
        className={cl(classes.card, listClasses.card)}
      >
        <div className={listClasses.text}>
          <Heading className={listClasses.title} data-size='2xs'>
            {color.name}
          </Heading>
          <Paragraph className={classes.desc} data-size='sm'>
            Farger gjør livet mer fargerikt
          </Paragraph>
        </div>
        <div className={listClasses.checkGroup}>
          <Checkbox
            data-size='sm'
            label='Checkbox'
            value='value'
            checked={isChecked}
            onChange={() => setIsChecked(!isChecked)}
          />
          <Switch
            aria-labelledby=''
            position='start'
            data-size='sm'
            checked={isSwitch}
            onChange={() => setIsSwitch(!isSwitch)}
          >
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
  return (
    <div className={classes.page}>
      <div className={classes.header}>
        <div className={classes.headerLeft}>
          <Heading data-size='xs' className={classes.title}>
            Se fargene dine i bruk
          </Heading>
          <Paragraph data-size='sm' className={classes.desc}>
            Hver farge som blir valgt med verktøyet får sitt eget kort i
            seksjonen til høyre slik at du kan se hvordan fargene harmonerer
            sammen.
          </Paragraph>
          <Paragraph data-size='sm' className={classes.desc}>
            Merk at kontrastfargen inne i knappen endrer seg fra hvit til svart,
            avhengig av om den valgte fargen er lys eller mørk for å oppnå best
            mulig kontrast.
          </Paragraph>
        </div>
        <div className={classes.headerRight}>
          <ToggleGroup
            data-size='sm'
            defaultValue='grid'
            onChange={(value) => setView(value as ViewType)}
          >
            <ToggleGroup.Item value='grid'>Grid</ToggleGroup.Item>
            <ToggleGroup.Item value='list'>Liste</ToggleGroup.Item>
          </ToggleGroup>
        </div>
      </div>

      <div className='panel'>
        <div
          data-color-scheme={colorScheme}
          className={cl(
            classes.cards,
            view === 'grid' ? classes.grid : classes.list,
          )}
        >
          {colors.main.map((color, index) => (
            <CardWrapper key={index} color={color} />
          ))}
          {colors.neutral.map((color, index) => (
            <CardWrapper key={index} color={color} />
          ))}
          {colors.support.map((color, index) => (
            <CardWrapper key={index} color={color} />
          ))}
        </div>
      </div>
    </div>
  );
};
