import type { CssColor } from '@adobe/leonardo-contrast-colors';
import { Link, Popover } from '@digdir/designsystemet-react';
import { ExclamationmarkIcon } from '@navikt/aksel-icons';
import { useClickOutside } from '@react-awesome/use-click-outside';
import cl from 'clsx/lite';
import { useEffect, useId, useRef, useState } from 'react';
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
    const popoverId = useId();
    return (
      <div>
        {colorError === 'decorative' && (
          <button
            popovertarget={popoverId}
            className={cl(
              classes.status,
              'ds-focus',
              colorError === 'decorative' && classes.statusYellow,
            )}
          >
            <ExclamationmarkIcon title='Viktig informasjon om fargen' />
          </button>
        )}
        <Popover
          style={{ width: '900px' }}
          id={popoverId}
          placement='top'
          size='sm'
          variant={colorError === 'none' ? 'default' : 'warning'}
        >
          <div>
            {colorError === 'decorative' && (
              <div>
                Fargen har mindre enn 3:1 kontrast mot bakgrunnsfargene. Når
                dette er tilfellet så er det enkelte ting det er viktig å være
                klar over. <br /> <br /> Les mer om hva dette betyr inne på
                <Link href='slik-bruker-du-verktoyet'>
                  {' '}
                  Slik bruker du verktøyet
                </Link>{' '}
                siden.
              </div>
            )}
          </div>
        </Popover>
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
          <div style={{ backgroundColor: color }} className={classes.color} />
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
