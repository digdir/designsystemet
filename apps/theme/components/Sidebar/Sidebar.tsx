import {
  type ColorMode,
  generateThemeForColor,
} from '@/packages/cli/dist/src/colors';
import type { CssColor } from '@adobe/leonardo-contrast-colors';
import { Button, Heading } from '@digdir/designsystemet-react';
import { PlusIcon, StarIcon } from '@navikt/aksel-icons';
import cl from 'clsx/lite';
import { useEffect, useState } from 'react';
import { ColorService, useColor } from 'react-color-palette';
import { type ColorTheme, useThemeStore } from '../../store';
import { ColorInput } from '../ColorInput/ColorInput';
import { Toggle } from '../Toggle/Toggle';
import { ColorPane } from './ColorPane/ColorPane';
import classes from './Sidebar.module.css';

export const Sidebar = () => {
  type Pages = 'addColor' | 'editColor' | 'none';
  type ColorType = 'main' | 'neutral' | 'support';

  const colors = useThemeStore((state) => state.colors);
  const [activePanel, setActivePanel] = useState<Pages>('none');
  const [color, setColor] = useColor('#0062ba');
  const [name, setName] = useState('');
  const [index, setIndex] = useState(0);
  const [colorType, setColorType] = useState<ColorType>('main');
  const removeColor = useThemeStore((state) => state.removeColor);
  const addColor = useThemeStore((state) => state.addColor);
  const updateColor = useThemeStore((state) => state.updateColor);
  const appearance = useThemeStore((state) => state.appearance);
  const setAppearance = useThemeStore((state) => state.setAppearance);
  const [isSticky, setSticky] = useState(false);

  const addNewColor = (color: string, name: string) => {
    const theme = generateThemeForColor(color as CssColor, 'aa');
    addColor({ name: name, colors: theme }, colorType);
  };

  const updateExistingColor = (color: string, name: string) => {
    const theme = generateThemeForColor(color as CssColor, 'aa');
    updateColor({ name: name, colors: theme }, index, colorType);
  };

  const setupEditState = (
    color: ColorTheme,
    index: number,
    type: ColorType,
  ) => {
    setActivePanel('editColor');
    setColor(ColorService.convert('hex', color.colors.light[8].hex));
    setName(color.name);
    setIndex(index);
    setColorType(type);
  };

  useEffect(() => {
    const handleScroll = () => {
      setSticky(window.scrollY > 135);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className={cl(classes.sidebar, isSticky && classes.sticky)}>
      <Heading className={classes.title} data-size='xs'>
        Konfigurer tema
      </Heading>

      <div className={classes.themeMode}>
        <div className={classes.group}>
          <div className={classes.label}>Visning</div>
          <Toggle
            type='appearance'
            items={[
              { name: 'Lys', type: 'sm', value: 'light' },
              { name: 'Mørk', type: 'sm', value: 'dark' },
              { name: 'Kontrast', type: 'sm', value: 'contrast' },
            ]}
            onChange={(value) => {
              const val = value;
              setAppearance(val as ColorMode);
            }}
          />
        </div>
      </div>

      <div className={classes.group}>
        <div className={classes.groupHeader}>
          <Heading data-size='2xs'>Hovedfarger</Heading>
          {colors.main.length < 4 && (
            <Button
              variant='tertiary'
              data-size='sm'
              className={classes.AddBtn}
              onClick={() => {
                setActivePanel('addColor');
                setColorType('main');
              }}
            >
              Legg til
              <PlusIcon title='a11y-title' fontSize='1.5rem' />
            </Button>
          )}
          {colors.main.length >= 4 && (
            <div className={classes.error}>Maks 4 hovedfarger</div>
          )}
        </div>
        <div className={classes.colors}>
          {colors.main.map((color, index) => (
            <ColorInput
              key={index}
              color={color.colors.light[8].hex}
              name={color.name}
              onClick={() => setupEditState(color, index, 'main')}
            />
          ))}
        </div>
      </div>
      <div className={classes.separator}></div>
      <div className={classes.group}>
        <div className={classes.colors}>
          {colors.neutral.map((color, index) => (
            <ColorInput
              key={index}
              color={color.colors.light[8].hex}
              name={color.name}
              onClick={() => setupEditState(color, index, 'neutral')}
            />
          ))}
        </div>
      </div>

      <div className={classes.group}>
        <div className={classes.groupHeader}>
          <Heading data-size='2xs'>Støttefarger</Heading>
          {colors.support.length < 4 && (
            <Button
              variant='tertiary'
              data-size='sm'
              className={classes.AddBtn}
              onClick={() => {
                setActivePanel('addColor');
                setColorType('support');
              }}
            >
              Legg til
              <PlusIcon title='a11y-title' fontSize='1.5rem' />
            </Button>
          )}
          {colors.support.length >= 4 && (
            <div className={classes.error}>Maks 4 støttefarger</div>
          )}
        </div>
        <div className={classes.colors}>
          {colors.support.map((color, index) => (
            <ColorInput
              key={index}
              color={color.colors.light[8].hex}
              name={color.name}
              onClick={() => setupEditState(color, index, 'support')}
            />
          ))}
        </div>
      </div>

      <div className={classes.group}>
        <div className={classes.groupHeader}>
          <Heading data-size='2xs'>Border radius</Heading>
        </div>
        <div>
          <Toggle
            type='radius'
            showLabel={true}
            items={[
              { name: 'Ingen', type: 'sm', value: '0px' },
              { name: 'Small', type: 'sm', value: '4px' },
              { name: 'Medium', type: 'sm', value: '7px' },
              { name: 'Large', type: 'sm', value: '10px' },
              { name: 'Full', type: 'sm', value: '9999px' },
            ]}
          />
        </div>
      </div>

      <div className={classes.bottom}>
        <Button data-size='sm'>
          <StarIcon title='a11y-title' fontSize='1.5rem' />
          Ta i bruk tema
        </Button>
        <Button data-size='sm' variant='secondary'>
          Del tema
        </Button>
      </div>

      <ColorPane
        onClose={() => {
          setColor(ColorService.convert('hex', '#0062ba'));
          setName('');
          setActivePanel('none');
        }}
        onPrimaryClicked={(color, name) => {
          if (name === '') {
            return;
          }
          if (activePanel === 'addColor') {
            addNewColor(color, name);
          } else {
            updateExistingColor(color, name);
          }
          setColor(ColorService.convert('hex', '#0062ba'));
          setName('');
          setActivePanel('none');
        }}
        onRemove={() => {
          removeColor(index, colorType);
          setName('');
          setActivePanel('none');
        }}
        type={activePanel}
        color={color}
        name={name}
        setColor={setColor}
        setName={setName}
        colorType={colorType}
      />
    </div>
  );
};
