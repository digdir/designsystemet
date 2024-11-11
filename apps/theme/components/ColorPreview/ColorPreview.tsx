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
} from '@digdir/designsystemet-react';
import { useThemeStore } from '../../store';
import classes from './ColorPreview.module.css';

export const ColorPreview = () => {
  const colors = useThemeStore((state) => state.colors);

  type CardProps = {
    color: {
      name: string;
      colors: {
        light: ColorInfo[];
      };
    };
  };

  const setTokens = (lightColors: ColorInfo[], type: string) => {
    const previewElement = document.getElementById('preview');
    if (previewElement) {
      for (let i = 0; i < lightColors.length; i++) {
        previewElement.style.setProperty(
          '--' + type + '-' + (i + 1),
          lightColors[i].hex,
        );
      }
    }
  };

  const setStyle = (lightColors: ColorInfo[]) => {
    const style = {} as Record<string, string>;

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
    return (
      <div style={setStyle(color.colors.light)} className={classes.card}>
        <Heading className={classes.title} data-size='2xs'>
          {color.name}
        </Heading>
        <Paragraph data-size='sm'>
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
  return (
    <div className={classes.container}>
      <div className={classes.left}>
        <Heading data-size='xs'>Se fargene dine i bruk</Heading>
        <Paragraph data-size='sm'>
          TODO: Litt dokumentasjon om fargesystemet, kontraster og bruk av
          farger
        </Paragraph>
      </div>
      <div className={classes.right}>
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
