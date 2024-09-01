import { Button } from '@digdir/designsystemet-react';
import {
  AlignVerticalSpaceAround,
  Check,
  Palette,
  Pencil,
  Shapes,
  Type,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Breadcrumbs } from '@ui/components/Breadcrumbs/Breadcrumbs';
import { Card } from '@ui/components/Card/Card';

import { type ColorTheme, useThemeStore } from '../../../common/store';

import type { CssColor } from '@adobe/leonardo-contrast-colors';
import { getDummyTheme } from '@common/dummyTheme';
import { generateThemeForColor } from '@digdir/designsystemet/color';
import { themeToFigmaFormat } from '../../../common/utils';
import classes from './Theme.module.css';

function Theme() {
  const { themeId } = useParams();
  const themes = useThemeStore((state) => state.themes);
  const [newName, setNewName] = useState('');
  const [editMode, setEditMode] = useState(false);
  const setLoading = useThemeStore((state) => state.setLoading);
  const [theme, setTheme] = useState<ColorTheme>(getDummyTheme());
  const [command, setCommand] = useState('');
  const [themeIndex, setThemeIndex] = useState<number>(0);
  const setThemes = useThemeStore((state) => state.setThemes);

  useEffect(() => {
    setThemeIndex(themes.findIndex((theme) => theme.themeModeId === themeId));
    setTheme(
      themes.find((theme) => theme.themeModeId === themeId)
        ?.colors as ColorTheme,
    );
  });

  const Tomato = (e: string) => {
    setNewName(e);
  };

  const changeName = () => {
    setLoading(true);
    setEditMode(false);
    setTimeout(() => {
      parent.postMessage(
        {
          pluginMessage: {
            type: 'renameTheme',
            renameTheme: {
              newName: newName,
              themeModeId: themes.find((theme) => theme.themeModeId === themeId)
                ?.themeModeId,
              themeId: themes.find((theme) => theme.themeModeId === themeId)
                ?.themeId,
            },
          },
        },
        '*',
      );
    }, 500);
  };

  const handleClick = () => {
    const pattern =
      /--accent\s+"(#\w{6})"\s+--neutral\s+"(#\w{6})"\s+--brand1\s+"(#\w{6})"\s+--brand2\s+"(#\w{6})"\s+--brand3\s+"(#\w{6})"/;
    const matches = command.match(pattern);

    if (matches) {
      const accent = matches[1] as CssColor;
      const neutral = matches[2] as CssColor;
      const brand1 = matches[3] as CssColor;
      const brand2 = matches[4] as CssColor;
      const brand3 = matches[5] as CssColor;

      console.log(
        `Accent: ${accent}, Neutral: ${neutral}, Brand1: ${brand1}, Brand2: ${brand2}, Brand3: ${brand3}`,
      );

      const newArray = Array.from(themes);
      newArray[themeIndex] = {
        ...newArray[themeIndex],
        colors: {
          ...newArray[themeIndex].colors,
          accent: themeToFigmaFormat(generateThemeForColor(accent)),
          neutral: themeToFigmaFormat(generateThemeForColor(neutral)),
          brand1: themeToFigmaFormat(generateThemeForColor(brand1)),
          brand2: themeToFigmaFormat(generateThemeForColor(brand2)),
          brand3: themeToFigmaFormat(generateThemeForColor(brand3)),
        },
      };

      setThemes(newArray);
      setLoading(true);

      setTimeout(() => {
        parent.postMessage(
          {
            pluginMessage: {
              type: 'updateVariables',
              themes: newArray,
            },
          },
          '*',
        );
      }, 500);
    }
  };

  const deleteClicked = () => {
    setLoading(true);
    setTimeout(() => {
      parent.postMessage(
        {
          pluginMessage: {
            type: 'deleteTheme',
            deleteTheme: {
              themeModeId: themes.find((theme) => theme.themeModeId === themeId)
                ?.themeModeId,
              themeId: themes.find((theme) => theme.themeModeId === themeId)
                ?.themeId,
            },
          },
        },
        '*',
      );
    }, 500);
  };

  return (
    <div className={classes.content}>
      <div className={classes.header}>
        <div className={classes.headerLeft}>
          <Breadcrumbs
            text={themes.find((theme) => theme.themeModeId === themeId)?.name}
            url='/'
          />

          {/* {!editMode && (
            <Pencil
              size={16}
              className={classes.edit}
              onClick={() => setEditMode(true)}
            />
          )}
          {editMode && (
            <>
              <input
                type='text'
                placeholder='Nytt navn...'
                onChange={(e) => Tomato(e.target.value)}
                className={classes.input}
              />
              <Check
                onClick={() => changeName()}
                size={18}
                className={classes.edit}
              />
            </>
          )} */}
        </div>
        {/* <div className={classes.headerRight}>
          <Button
            size='sm'
            color='danger'
            variant='tertiary'
            className={classes.removeBtn}
            onClick={() => deleteClicked()}
          >
            Slett tema
          </Button>
        </div> */}
      </div>
      <div>
        <textarea
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          name=''
          id=''
          style={{ width: 550, height: 200 }}
        ></textarea>
        <Button className={classes.btn} size='sm' onClick={() => handleClick()}>
          Oppdater variabler
        </Button>
      </div>
      <div className={classes.cards}>
        {/* <Card
          url={'/themes/' + themeId + '/colors'}
          title='Farger'
          icon={<Palette />}
        /> */}
        {/* <Card
          url='/themes/altinn/colors'
          title='Border Radius'
          icon={<Shapes />}
        />
        <Card
          url={'/themes/' + themeId + '/fonts'}
          title='Fonter'
          icon={<Type />}
        />
        <Card
          url='/themes/altinn/colors'
          title='Avstander'
          icon={<AlignVerticalSpaceAround />}
        /> */}
      </div>
    </div>
  );
}

export default Theme;
