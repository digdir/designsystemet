import {
  Breadcrumbs,
  Button,
  Label,
  Link,
  Paragraph,
  Textarea,
} from '@digdir/designsystemet-react';
import { useEffect, useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';

import { type ColorTheme, useThemeStore } from '../../../common/store';

import type { CssColor } from '@adobe/leonardo-contrast-colors';
import { getDummyTheme } from '@common/dummyTheme';
import { generateThemeForColor } from '@digdir/designsystemet/color';
import { themeToFigmaFormat } from '../../../common/utils';
import classes from './Theme.module.css';

function Theme() {
  const { themeId } = useParams();
  const themes = useThemeStore((state) => state.themes);
  const setLoading = useThemeStore((state) => state.setLoading);
  const [theme, setTheme] = useState<ColorTheme>(getDummyTheme());
  const [command, setCommand] = useState('');
  const [themeIndex, setThemeIndex] = useState<number>(0);
  const setThemes = useThemeStore((state) => state.setThemes);
  const loading = useThemeStore((state) => state.loading);
  const codeSnippetError = useThemeStore((state) => state.codeSnipperError);
  const setCodeSnippetError = useThemeStore(
    (state) => state.setCodeSnippetError,
  );

  useEffect(() => {
    setThemeIndex(themes.findIndex((theme) => theme.themeModeId === themeId));
    setTheme(
      themes.find((theme) => theme.themeModeId === themeId)
        ?.colors as ColorTheme,
    );
  });

  const handleClick = () => {
    const pattern =
      /--accent\s+"(#\w{6})"\s+--neutral\s+"(#\w{6})"\s+--brand1\s+"(#\w{6})"\s+--brand2\s+"(#\w{6})"\s+--brand3\s+"(#\w{6})"/;
    const matches = command.replace(/\\/g, '').match(pattern);

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
      setCommand('');

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
    } else {
      console.log('No match');
      setCodeSnippetError(
        'Koden du limte inn er ikke gyldig. Prøv å lim inn på nytt.',
      );
    }
  };

  return (
    <div className={classes.content}>
      <div className={classes.header}>
        <div className={classes.headerLeft}>
          <Breadcrumbs size='sm'>
            <Breadcrumbs.Link aria-label='Tilbake til alle temaer' asChild>
              <RouterLink to='/'>Mine temaer</RouterLink>
            </Breadcrumbs.Link>
          </Breadcrumbs>
        </div>
      </div>
      <div className={classes.wrapper}>
        <Paragraph variant='long' size='sm'>
          Gå til{' '}
          <Link href='https://theme.designsystemet.no/' target='_blank'>
            Temabyggeren
          </Link>{' '}
          for å lage deg et tema og lim inn koden i feltet under. Det er kun
          fargene som blir oppdatert for øyeblikket. Vi jobber med å utvide
          pluginen med mer funksjonalitet senere.
        </Paragraph>
        <Label htmlFor='my-textarea'>Kodesnutt fra temabyggeren</Label>
        <Textarea
          size='sm'
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          name=''
          id='my-textarea'
          cols={22}
          className={classes.textarea}
          placeholder='Lim inn her...'
          error={codeSnippetError}
        ></Textarea>
        <Button
          className={classes.btn}
          size='sm'
          onClick={() => handleClick()}
          loading={loading}
        >
          Oppdater tema
        </Button>
      </div>
      <div className={classes.cards}></div>
    </div>
  );
}

export default Theme;
