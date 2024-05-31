import { useEffect, useRef, useState } from 'react';
import { ChromePicker } from 'react-color';
import type { CssColor } from '@adobe/leonardo-contrast-colors';
import cl from 'clsx/lite';
import { useClickOutside } from '@react-awesome/use-click-outside';
import { CheckmarkIcon, ExclamationmarkIcon } from '@navikt/aksel-icons';
import { Link, Popover } from '@/packages/react';

import classes from './ColorPicker.module.css';

type colorErrorType = 'none' | 'decorative' | 'interaction';

type ColorPickerProps = {
  label: string;
  onColorChanged?: ((color: CssColor) => void) | undefined;
  defaultColor: CssColor;
  disabled?: boolean;
  colorError: colorErrorType;
};

export const ColorPicker = ({
  label,
  onColorChanged,
  defaultColor,
  disabled,
  colorError,
}: ColorPickerProps) => {
  const [color, setColor] = useState<string>('#0062BA');
  const [showModal, setShowModal] = useState(false);
  const handleClick = () => {
    setShowModal(!showModal);
  };
  const ref = useRef(null);

  useClickOutside(ref.current, () => {
    setShowModal(false);
  });

  useEffect(() => {
    setColor(defaultColor);
  }, [defaultColor]);

  const getStatus = () => {
    return (
      <div>
        <Popover
          onOpenChange={function Ya() {}}
          placement='top'
          size='small'
          variant={colorError === 'none' ? 'default' : 'warning'}
        >
          <Popover.Trigger asChild>
            <div
              className={cl(
                classes.status,
                colorError == 'decorative' && classes.statusYellow,
                colorError == 'interaction' && classes.statusOrange,
              )}
            >
              {colorError === 'none' && (
                <CheckmarkIcon title='Alt er OK med fargen' />
              )}
              {colorError === 'decorative' && (
                <ExclamationmarkIcon title='Viktig informasjon om fargen' />
              )}
              {colorError == 'interaction' && (
                <ExclamationmarkIcon title='Viktig informasjon om fargen' />
              )}
            </div>
          </Popover.Trigger>
          <Popover.Content style={{ width: '700px' }}>
            <div>
              {colorError === 'none' &&
                'Denne fargen har god nok kontrast og kan brukes normalt i systemet.'}
            </div>
            <div>
              {colorError == 'decorative' && (
                <div>
                  Base Default fargen har mindre enn 3:1 kontrast mot
                  bakgrunnsfargene og bør brukes varmsomt på viktige interaktive
                  komponenter og flater. Mer dokumentasjon kommer senere.
                </div>
              )}
              {colorError == 'interaction' && (
                <div>
                  Base Default fargen har ikke god nok kontrast mot hvit eller
                  svart tekst på tvers av Base fargene. Unngå bruk av enkelte
                  komponenter. Mer dokumentasjon kommer senere.
                </div>
              )}
            </div>
          </Popover.Content>
        </Popover>
      </div>
    );
  };

  return (
    <div
      ref={ref}
      className={cl(classes.whole, disabled && classes.disabled)}
    >
      <div className={classes.picker}>
        <div className={classes.label}>
          <div>{label}</div>
          {getStatus()}
        </div>
        <button
          className={classes.container}
          onClick={() => handleClick()}
        >
          <div
            style={{ backgroundColor: color }}
            className={classes.color}
          ></div>
          <div className={classes.input}>{color}</div>
        </button>
      </div>
      <div className={cl(classes.popup, showModal && classes.show)}>
        <ChromePicker
          onChange={({ hex }: { hex: string }) => {
            setColor(hex);
            onColorChanged && onColorChanged(hex as CssColor);
          }}
          color={color}
        />
      </div>
    </div>
  );
};
