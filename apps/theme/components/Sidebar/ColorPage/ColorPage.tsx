import { generateThemeForColor } from '@digdir/designsystemet';
import { Button, Heading, Paragraph } from '@digdir/designsystemet-react';
import type { CssColor } from '@digdir/designsystemet/color';
import { PlusIcon } from '@navikt/aksel-icons';
import { useState } from 'react';
import { ColorService, useColor } from 'react-color-palette';
import { type ColorTheme, useThemeStore } from '../../../store';
import { ColorInput } from '../../ColorInput/ColorInput';
import { TokenModal } from '../../TokenModal/TokenModal';
import { ColorPane } from '../ColorPane/ColorPane';
import classes from './ColorPage.module.css';

type ColorPageProps = {
  onPrevClick?: () => void;
  onNextClick: () => void;
};

export const ColorPage = ({ onPrevClick, onNextClick }: ColorPageProps) => {
  type Pages = 'addColor' | 'editColor' | 'none';
  type ColorType = 'main' | 'neutral' | 'support';

  const removeColor = useThemeStore((state) => state.removeColor);
  const addColor = useThemeStore((state) => state.addColor);
  const updateColor = useThemeStore((state) => state.updateColor);
  const colors = useThemeStore((state) => state.colors);
  const [activePanel, setActivePanel] = useState<Pages>('none');
  const [color, setColor] = useColor('#0062ba');
  const [name, setName] = useState('');
  const [index, setIndex] = useState(0);
  const [colorType, setColorType] = useState<ColorType>('main');
  const [open, setOpen] = useState(false);

  const addNewColor = (color: string, name: string) => {
    const theme = generateThemeForColor(color as CssColor);
    addColor({ name: name, colors: theme }, colorType);
  };

  const updateExistingColor = (color: string, name: string) => {
    const theme = generateThemeForColor(color as CssColor);
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

  return (
    <div>
      <Heading data-size='xs' className={classes.heading}>
        Velg fargene dine
      </Heading>
      <Paragraph data-size='sm' className={classes.desc}>
        Logbook a sitting success parents' girl in it however, greater, full
        with he that pleasures up attention to hardly to power definitely hardly
      </Paragraph>
      {/* MAIN COLORS */}
      <div className={classes.group}>
        <div className={classes.groupHeader}>
          <Heading data-size='2xs'>Hovedfarger</Heading>
          {colors.main.length < 40 && (
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
          {colors.main.length >= 40 && (
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

      {/* SUPPORT COLORS */}
      <div className={classes.group}>
        <div className={classes.groupHeader}>
          <Heading data-size='2xs'>Støttefarger</Heading>
          {colors.support.length < 40 && (
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
          {colors.support.length >= 40 && (
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

      <div className={classes.bottom}>
        <div className={classes.btnGroup}>
          <TokenModal />
          {/* <Button data-size='sm' className={classes.btn} asChild>
            <NextLink href='result'>
              <SparklesIcon title='a11y-title' fontSize='1.5rem' />
              Fullfør tema
            </NextLink>
          </Button> */}
        </div>
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
