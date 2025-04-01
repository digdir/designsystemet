import { Button, Heading, Textfield } from '@digdir/designsystemet-react';
import type { ColorMetadata } from '@digdir/designsystemet/color';
import { ChevronLeftIcon } from '@navikt/aksel-icons';
import { useThemeStore } from '../../../store';
import classes from './LightnessPage.module.css';

type LightnessPageProps = {
  onBackClicked: () => void;
};

export const LightnessPage = ({ onBackClicked }: LightnessPageProps) => {
  const colorMetadata = useThemeStore((state) => state.colorMetadata);

  const Input = ({ label, color }: { label: string; color: ColorMetadata }) => {
    return (
      <Textfield
        className={classes.input}
        counter={0}
        defaultValue={color.luminance.light}
        description=''
        error=''
        label={label}
        data-size='sm'
        onChange={(e) => {
          const newColorMetadata = { ...colorMetadata };
          const test = parseFloat(e.target.value);

          if (color.name in newColorMetadata) {
            newColorMetadata[
              color.name as keyof typeof newColorMetadata
            ].luminance.light = test;
          }
          useThemeStore.setState({
            colorMetadata: newColorMetadata,
          });
        }}
      />
    );
  };

  return (
    <div className={classes.page}>
      <Button
        data-size='sm'
        variant='tertiary'
        onClick={() => {
          onBackClicked();
        }}
        className={classes.back}
      >
        <ChevronLeftIcon aria-hidden fontSize='1.5rem' /> Gå tilbake
      </Button>
      <Heading data-size='xs'>Velg lightness</Heading>

      <div className={classes.luminance}>
        <div className={classes.inputs}>
          {Object.values(colorMetadata)
            .filter((color) => !color.name.includes('base'))
            .map((color, index) => (
              <Input key={index} color={color} label={color.name} />
            ))}
        </div>
      </div>
    </div>
  );
};
