import { Button, Heading } from '@digdir/designsystemet-react';
import { ChevronLeftIcon } from '@navikt/aksel-icons';
import { useState } from 'react';
import { useThemeStore } from '../../../store';
import { LightnessInput } from '../../LightnessInput/LightnessInput';
import classes from './LightnessPage.module.css';

type LightnessPageProps = {
  onBackClicked: () => void;
};

export const LightnessPage = ({ onBackClicked }: LightnessPageProps) => {
  const colorMetadata = useThemeStore((state) => state.colorMetadata);
  const [mode, setMode] = useState<'light' | 'dark'>('light');

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

      <div data-size='sm' className={classes.btnGroup}>
        <Button variant='tertiary' onClick={() => setMode('light')}>
          Light mode
        </Button>
        <Button variant='tertiary' onClick={() => setMode('dark')}>
          Dark mode
        </Button>
      </div>

      <div className={classes.luminance}>
        <div className={classes.inputs}>
          {Object.values(colorMetadata)
            .filter((color) => !color.name.includes('base'))
            .map((color, index) => (
              <LightnessInput
                key={index}
                label={color.displayName}
                oneLiner
                handleReset={() => {}}
                initialValue={color.luminance[mode]}
              />
            ))}
        </div>
      </div>
    </div>
  );
};
