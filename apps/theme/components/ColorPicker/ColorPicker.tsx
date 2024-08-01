import type { CssColor } from '@adobe/leonardo-contrast-colors';
import { Popover } from '@digdir/designsystemet-react';
import { CheckmarkIcon, ExclamationmarkIcon } from '@navikt/aksel-icons';
import { useClickOutside } from '@react-awesome/use-click-outside';
import cl from 'clsx/lite';
import { useEffect, useRef, useState } from 'react';
import { ChromePicker } from 'react-color';

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
  const [color, setColor] = useState<string>('#FFF');
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
        <Popover.Root
          onOpenChange={function Ya() {}}
          placement='top'
          size='sm'
          variant={colorError === 'none' ? 'default' : 'warning'}
        >
          <Popover.Trigger asChild>
            <button
              className={cl(
                classes.status,
                'ds-focus',
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
            </button>
          </Popover.Trigger>
          <Popover.Content style={{ width: '800px' }}>
            <div>
              {colorError === 'none' &&
                'Denne fargen har god nok kontrast og kan brukes normalt i systemet.'}
            </div>
            <div>
              {colorError == 'decorative' && (
                <div>
                  Vær oppmerksom på at Base Default fargen har mindre enn 3:1
                  kontrast mot bakgrunnsfargene. Se alle kontrastgrensene inne
                  på hver farge.
                </div>
              )}
              {colorError == 'interaction' && (
                <div>
                  Base Default fargen har ikke god nok kontrast mot hvit eller
                  svart tekst på tvers av Base fargene.
                </div>
              )}
            </div>
          </Popover.Content>
        </Popover.Root>
      </div>
    );
  };

  return (
    <div ref={ref} className={cl(classes.whole, disabled && classes.disabled)}>
      <div className={classes.picker}>
        <div className={classes.label}>
          <span
            className={cl('ds-label', 'ds-label--md', 'ds-font-weight--medium')}
          >
            {label}
          </span>
          {getStatus()}
        </div>
        <button
          className={cl(classes.container, 'ds-focus')}
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
          onChangeComplete={({ hex }: { hex: string }) => {
            setColor(hex);
            onColorChanged?.(hex as CssColor);
          }}
          color={color}
        />
      </div>
    </div>
  );
};
