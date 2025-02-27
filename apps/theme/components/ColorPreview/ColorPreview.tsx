import {
  type Color,
  type ColorNumber,
  getColorMetadataByNumber,
} from '@digdir/designsystemet';
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
import { useThemeStore } from '../../store';
import listClasses from './Card2.module.css';
import classes from './ColorPreview.module.css';

type ViewType = 'list' | 'grid';

export const ColorPreview = () => {
  const colors = useThemeStore((state) => state.colors);
  const [view, setView] = useState<ViewType>('grid');
  const colorScheme = useThemeStore((state) => state.colorScheme);

  type CardProps = {
    color: {
      name: string;
      colors: {
        light: Color[];
        dark: Color[];
      };
    };
  };

  const setStyle = (colors: {
    light: Color[];
    dark: Color[];
  }) => {
    const style = {} as Record<string, string>;

    let lightColors = colors.light;

    if (colorScheme === 'dark') {
      lightColors = colors.dark;
    }

    for (let i = 0; i < lightColors.length; i++) {
      const number = (i + 1) as ColorNumber;
      style[
        `--ds-color-accent-${getColorMetadataByNumber(number)
          .name.replace(/\s+/g, '-')
          .toLowerCase()}`
      ] = lightColors[i].hex;
      style[
        `--ds-color-${getColorMetadataByNumber(number)
          .name.replace(/\s+/g, '-')
          .toLowerCase()}`
      ] = lightColors[i].hex;
    }

    return style;
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
      <div style={setStyle(color.colors)} className={classes.card} id='preview'>
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
        style={setStyle(color.colors)}
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
    <div className='panelContainer'>
      <div className='panelLeft'>
        <Heading data-size='xs'>Se fargene dine i bruk</Heading>
        <Paragraph data-size='sm'>
          Hver farge som blir valgt med verktøyet får sitt eget kort i seksjonen
          til høyre slik at du kan se hvordan fargene harmonerer sammen.
        </Paragraph>
        <Paragraph data-size='sm'>
          Merk at kontrastfargen inne i knappen endrer seg fra hvit til svart,
          avhengig av om den valgte fargen er lys eller mørk for å oppnå best
          mulig kontrast.
        </Paragraph>
        <div className='panelBottom'>
          <div className={classes.label}>Visning:</div>
          <ToggleGroup
            data-size='sm'
            defaultValue='grid'
            name='toggle-group-nuts'
            onChange={(value) => setView(value as ViewType)}
          >
            <ToggleGroup.Item value='grid'>Grid</ToggleGroup.Item>
            <ToggleGroup.Item value='list'>Liste</ToggleGroup.Item>
          </ToggleGroup>
        </div>
      </div>
      <div className={cl('panelRight', view === 'grid' && classes.grid)}>
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
  );
};
