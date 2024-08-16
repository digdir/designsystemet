import { useParams } from 'react-router-dom';
import { NativeSelect, Textfield } from '@digdir/designsystemet-react';
import cl from 'clsx/lite';
import { useState } from 'react';

import { useThemeStore } from '../../../common/store';
import { Breadcrumbs } from '../../components/Breadcrumbs/Breadcrumbs';

import classes from './Font.module.css';

function Font() {
  const themes = useThemeStore((state) => state.themes);

  const fonts = useThemeStore((state) => state.fonts);
  const { themeId } = useParams<string>();

  const getTheme = () => {
    return themes.find((theme) => theme.themeModeId === themeId) || null;
  };

  const getFontOptions = () => {
    return fonts.map((font) => {
      return (
        <option
          key={font.name}
          value={font.name}
        >
          {font.name}
        </option>
      );
    });
  };

  const getFontWeights = (name: string) => {
    return fonts
      .find((font) => font.name === name)
      ?.styles.map((style) => {
        return (
          <option
            key={style}
            value={style}
          >
            {style}
          </option>
        );
      });
  };

  // Primary font
  const [primaryName, setPrimaryName] = useState<string>('Inter');
  const [primaryRegular, setPrimaryRegular] = useState<string>('Regular');
  const [primaryBold, setPrimaryBold] = useState<string>('Medium');
  const [primaryExtraBold, setPrimaryExtraBold] = useState<string>('Semi Bold');

  return (
    <div className={classes.content}>
      <Breadcrumbs
        className={classes.breadcrumbs}
        text={'Fonter (' + getTheme()?.name + ')'}
        url={'/themes/' + themeId}
      />

      <h2 className='pageTitle'>Primærfont</h2>

      <div className={classes.fields}>
        <div className={cl(classes.nameSelect)}>
          <NativeSelect
            label='Navn'
            size='sm'
            value={primaryName}
            onChange={(e) => setPrimaryName(e.target.value)}
            className={cl('select', classes.weightSelect)}
          >
            {getFontOptions()}
          </NativeSelect>
        </div>
        <div className={classes.weightSelects}>
          <NativeSelect
            label='Regular font weight'
            size='sm'
            value={primaryRegular}
            className={cl('select', classes.weightSelect)}
          >
            {getFontWeights(primaryName)}
          </NativeSelect>
          <NativeSelect
            label='Bold font weight'
            size='sm'
            value={primaryBold}
            className={cl('select', classes.weightSelect)}
          >
            {getFontWeights(primaryName)}
          </NativeSelect>
          <NativeSelect
            label='Extra bold font weight'
            size='sm'
            value={primaryExtraBold}
            className={cl('select', classes.weightSelect)}
          >
            {getFontWeights(primaryName)}
          </NativeSelect>
        </div>
      </div>

      <h2 className='pageTitle'>Sekundærfont</h2>
      <div className={classes.grid}>
        <div className={classes.fields}>
          <Textfield
            label='Font family'
            className={classes.textfield + ' textfield'}
          />
          <Textfield
            label='Regular font weight'
            className={classes.textfield + ' textfield'}
          />
          <Textfield
            label='Bold font weight'
            className={classes.textfield + ' textfield'}
          />
          <Textfield
            label='Extra bold font weight'
            className={classes.textfield + ' textfield'}
          />
        </div>
        <div className={classes.preview}>
          <div>Regular font weight</div>
          <div>Bold font weight</div>
          <div>Extra bold font weight</div>
        </div>
      </div>
    </div>
  );
}

export default Font;
