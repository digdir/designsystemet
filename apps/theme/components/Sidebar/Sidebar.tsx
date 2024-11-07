import { generateThemeForColor } from '@/packages/cli/dist/src/colors';
import type { CssColor } from '@adobe/leonardo-contrast-colors';
import { Button, Heading, Textfield } from '@digdir/designsystemet-react';
import { ArrowLeftIcon, PlusIcon } from '@navikt/aksel-icons';
import cl from 'clsx/lite';
import { useState } from 'react';
import { ColorPicker, useColor } from 'react-color-palette';
import { useThemeStore } from '../../store';
import { ColorInput } from '../ColorInput/ColorInput';
import colorClasses from './Color.module.css';
import classes from './Sidebar.module.css';

export const Sidebar = () => {
  type Pages = 'colors' | 'typography' | 'spacing' | 'components' | 'none';

  const mainColors = useThemeStore((state) => state.mainColors);
  const [activeNav, setActiveNav] = useState<Pages>('none');
  const [color, setColor] = useColor('#561ecb');
  const [name, setName] = useState('');
  const addMainColor = useThemeStore((state) => state.addMainColor);

  const saveColor = () => {
    const theme = generateThemeForColor(color.hex as CssColor, 'aa');
    addMainColor({ name: name, colors: theme });
    setActiveNav('none');
  };

  return (
    <div className={classes.sidebar}>
      <div
        className={cl(
          classes.colorPage,
          activeNav === 'colors' && classes.show,
        )}
      >
        <Button
          data-size='sm'
          variant='tertiary'
          onClick={() => setActiveNav('none')}
          className={colorClasses.back}
        >
          <ArrowLeftIcon title='a11y-title' fontSize='1.5rem' /> Gå tilbake
        </Button>
        <Heading data-size='sm' className={colorClasses.title}>
          Legg til ny hovedfarge
        </Heading>

        <Textfield
          placeholder='Skriv navnet her...'
          label='Navn'
          className={colorClasses.name}
          data-size='sm'
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className={colorClasses.label}>Farge</div>
        <div
          style={{ backgroundColor: color.hex }}
          className={colorClasses.colorPreview}
        ></div>
        <ColorPicker hideAlpha color={color} onChange={setColor} />
        <div className={colorClasses.btnGroup}>
          <Button color='neutral' onClick={() => saveColor()}>
            Legg til
          </Button>

          <Button color='neutral' variant='secondary'>
            Avbryt
          </Button>
        </div>
      </div>
      <Heading className={classes.title} data-size='sm'>
        Konfigurer tema
      </Heading>

      <div className={classes.group}>
        <div className={classes.groupHeader}>
          <Heading data-size='2xs'>Hovedfarger</Heading>
          {mainColors.length < 4 && (
            <Button
              variant='tertiary'
              data-size='sm'
              onClick={() => setActiveNav('colors')}
            >
              <PlusIcon title='a11y-title' fontSize='1.5rem' />
              Legg til
            </Button>
          )}
        </div>
        <div className={classes.colors}>
          {mainColors.map((color, index) => (
            <ColorInput
              key={index}
              color={color.colors.light[8].hex}
              name={color.name}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
