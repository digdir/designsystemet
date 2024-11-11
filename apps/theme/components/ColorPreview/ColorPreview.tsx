import {
  type ColorInfo,
  type ColorNumber,
  getColorNameFromNumber,
} from '@/packages/cli/dist/src/colors';
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
import { useThemeStore } from '../../store';
import listClasses from './Card2.module.css';
import classes from './ColorPreview.module.css';

type ViewType = 'list' | 'grid';

export const ColorPreview = () => {
  const colors = useThemeStore((state) => state.colors);
  const [view, setView] = useState<ViewType>('list');
  const appearance = useThemeStore((state) => state.appearance);

  type CardProps = {
    color: {
      name: string;
      colors: {
        light: ColorInfo[];
        dark: ColorInfo[];
      };
    };
  };

  const setStyle = (colors: {
    light: ColorInfo[];
    dark: ColorInfo[];
  }) => {
    const style = {} as Record<string, string>;

    let lightColors = colors.light;

    if (appearance === 'dark') {
      lightColors = colors.dark;
    }

    for (let i = 0; i < lightColors.length; i++) {
      const number = (i + 1) as ColorNumber;
      style[
        `--ds-color-accent-${getColorNameFromNumber(number)
          .replace(/\s+/g, '-')
          .toLowerCase()}`
      ] = lightColors[i].hex;
    }
    return style;
  };

  const Card = ({ color }: CardProps) => {
    if (view === 'list') {
      return <Card2 color={color} />;
    }
    return <Card1 color={color} />;
  };

  const Card1 = ({ color }: CardProps) => {
    return (
      <div style={setStyle(color.colors)} className={classes.card}>
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
            label='Checkbox label'
            value='value'
            checked
          />
          <Checkbox data-size='sm' label='Checkbox label' value='value' />
        </div>
        <div className={classes.btnGroup}>
          <Button data-size='sm'>Opprett</Button>
          <Button data-size='sm' variant='secondary'>
            Avbryt
          </Button>
        </div>
      </div>
    );
  };
  const Card2 = ({ color }: CardProps) => {
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
          <Checkbox data-size='sm' label='Checkbox' value='value' checked />
          <Switch description='' position='left' size='sm' checked>
            Switch
          </Switch>
        </div>
        <div className={classes.btnGroup}>
          <Button data-size='sm'>Opprett</Button>
          <Button data-size='sm' variant='secondary'>
            Avbryt
          </Button>
        </div>
      </div>
    );
  };
  return (
    <div className={classes.container}>
      <div className={classes.left}>
        <Heading data-size='xs'>Se fargene dine i bruk</Heading>
        <Paragraph data-size='sm'>
          TODO: Litt dokumentasjon om fargesystemet, kontraster og bruk av
          farger
        </Paragraph>
        <div className={classes.bottom}>
          <div className={classes.label}>Visning:</div>
          <ToggleGroup
            data-size='sm'
            defaultValue='list'
            name='toggle-group-nuts'
            onChange={(value) => setView(value as ViewType)}
          >
            <ToggleGroup.Item value='list'>Liste</ToggleGroup.Item>
            <ToggleGroup.Item value='grid'>Grid</ToggleGroup.Item>
          </ToggleGroup>
        </div>
      </div>
      <div className={cl(classes.right, view === 'grid' && classes.grid)}>
        {colors.main.map((color, index) => (
          <Card key={index} color={color} />
        ))}
        {colors.neutral.map((color, index) => (
          <Card key={index} color={color} />
        ))}
        {colors.support.map((color, index) => (
          <Card key={index} color={color} />
        ))}
      </div>
    </div>
  );
};
