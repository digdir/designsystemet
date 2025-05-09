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
  const referenceColorMetadata = useThemeStore(
    (state) => state.referenceColorMetadata,
  );
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const onColorThemeChange = useThemeStore((state) => state.onColorThemeChange);
  const setOnColorThemeChange = useThemeStore(
    (state) => state.setOnColorThemeChange,
  );
  const updateColorTheme = useThemeStore((state) => state.updateColorTheme);
  const colors = useThemeStore((state) => state.colors);

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
          {Object.values(referenceColorMetadata)
            .filter((color) => !color.name.includes('base'))
            .map((color, refIndex) =>
              refIndex === 11 ? null : (
                <LightnessInput
                  key={refIndex}
                  label={color.displayName}
                  oneLiner
                  value={color.lightness[mode]}
                  initialValue={
                    referenceColorMetadata[color.name].lightness[mode]
                  }
                  onChange={(value) => {
                    colors.main.map((colorTheme, i) => {
                      colorTheme.colorMetadata[color.name].lightness[mode] =
                        value;
                      updateColorTheme(colorTheme, i, 'main');
                    });

                    setOnColorThemeChange(onColorThemeChange + 1);
                  }}
                  onReset={(value) => {}}
                />
              ),
            )}
        </div>
      </div>
    </div>
  );
};
