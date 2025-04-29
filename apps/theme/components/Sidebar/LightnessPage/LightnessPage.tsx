import { Button, Heading } from '@digdir/designsystemet-react';
import { ChevronLeftIcon } from '@navikt/aksel-icons';
import cl from 'clsx/lite';
import { useState } from 'react';
import { useThemeStore } from '../../../store';
import { LightnessInput } from '../../LightnessInput/LightnessInput';
import classes from './LightnessPage.module.css';

type LightnessPageProps = {
  onBackClicked: () => void;
};

export const LightnessPage = ({ onBackClicked }: LightnessPageProps) => {
  const colorMetadata = useThemeStore((state) => state.colorMetadata);
  const referenceColorMetadata = useThemeStore(
    (state) => state.referenceColorMetadata,
  );

  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const setLuminance = useThemeStore((state) => state.setLuminance);

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
        <Button
          variant='tertiary'
          onClick={() => setMode('light')}
          className={cl(classes.btn, mode === 'light' ? classes.activeBtn : '')}
        >
          Light mode
        </Button>
        <Button
          variant='tertiary'
          onClick={() => setMode('dark')}
          className={cl(classes.btn, mode === 'dark' ? classes.activeBtn : '')}
        >
          Dark mode
        </Button>
      </div>

      <div className={classes.luminance}>
        <div className={classes.inputs}>
          {Object.values(colorMetadata)
            .filter((color) => !color.name.includes('base'))
            .map((color, index) =>
              index === 11 ? null : (
                <LightnessInput
                  key={index}
                  label={color.name}
                  oneLiner
                  value={color.luminance[mode]}
                  initialValue={
                    referenceColorMetadata[color.name].luminance[mode]
                  }
                  onChange={(value) => {
                    colorMetadata[color.name].luminance[mode] = value;
                    setLuminance(colorMetadata, mode, color.name);
                  }}
                  onReset={(value) => {
                    colorMetadata[color.name].luminance[mode] = value;
                    setLuminance(colorMetadata, mode, color.name);
                  }}
                />
              ),
            )}
        </div>
      </div>
    </div>
  );
};
