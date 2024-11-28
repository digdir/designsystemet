import {
  Breadcrumbs,
  Button,
  Label,
  Link,
  Paragraph,
  Textarea,
  ValidationMessage,
} from '@digdir/designsystemet-react';
import { useEffect, useId, useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';

import type { CssColor } from '@adobe/leonardo-contrast-colors';
import { getDummyTheme } from '@common/dummyTheme';
import { colorCliOptions } from '@digdir/designsystemet';
import { generateThemeForColor } from '@digdir/designsystemet/color';
import { type ColorTheme, useThemeStore } from '../../../common/store';
import { themeToFigmaFormat } from '../../../common/utils';
import classes from './Theme.module.css';

function Theme() {
  const { themeId } = useParams();
  const errorId = useId();
  const themes = useThemeStore((state) => state.themes);
  const setLoading = useThemeStore((state) => state.setLoading);
  const [, setTheme] = useState<ColorTheme>(getDummyTheme());
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
    // split input into lines
    const lines = command.split('\\\n');

    // helper regex for extracting color info
    const colorRegex = /"([^:]+):(#\w{6})"/g;

    const result: {
      mainColors: { name: string; hex: CssColor }[];
      neutralColor: CssColor | null;
      supportColors: { name: string; hex: CssColor }[];
    } = {
      mainColors: [],
      neutralColor: null,
      supportColors: [],
    };

    for (const line of lines) {
      if (line.includes(`--${colorCliOptions.main}`)) {
        const matches = [...line.matchAll(colorRegex)];
        result.mainColors = matches.map((match) => ({
          name: match[1],
          hex: match[2] as CssColor,
        }));
      } else if (line.includes(`--${colorCliOptions.neutral}`)) {
        const match = line.match(/#\w{6}/);
        if (match) result.neutralColor = match[0] as CssColor;
      } else if (line.includes(`--${colorCliOptions.support}`)) {
        const matches = [...line.matchAll(colorRegex)];
        result.supportColors = matches.map((match) => ({
          name: match[1],
          hex: match[2] as CssColor,
        }));
      }
    }

    if (!result.mainColors.length || !result.neutralColor) {
      console.log('No match');
      setCodeSnippetError(
        'Koden du limte inn er ikke gyldig. Prøv å lim inn på nytt.',
      );
      return;
    }

    /* For now we check that we have accent, brand1, brand2, brand3 */
    const accent = result.mainColors.find(
      (color) => color.name === 'accent',
    )?.hex;
    const brand1 = result.supportColors.find(
      (color) => color.name === 'brand1',
    )?.hex;
    const brand2 = result.supportColors.find(
      (color) => color.name === 'brand2',
    )?.hex;
    const brand3 = result.supportColors.find(
      (color) => color.name === 'brand3',
    )?.hex;

    const neutral = result.neutralColor;

    if (!accent || !brand1 || !brand2 || !brand3) {
      setCodeSnippetError(
        'Koden du limte inn er ikke gyldig. Prøv å lim inn på nytt.',
      );
      return;
    }

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
  };

  return (
    <div className={classes.content}>
      <div className={classes.header}>
        <div className={classes.headerLeft}>
          <Breadcrumbs className={classes.breadcrumbs}>
            <Breadcrumbs.Link
              className={classes.breadcrumbs_link}
              aria-label='Tilbake til alle temaer'
              asChild
            >
              <RouterLink to='/'>Mine temaer</RouterLink>
            </Breadcrumbs.Link>
          </Breadcrumbs>
        </div>
      </div>
      <div className={classes.wrapper}>
        <Paragraph variant='long'>
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
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          name=''
          id='my-textarea'
          rows={8}
          placeholder='Lim inn her...'
          /* error={codeSnippetError} */
          aria-describedby={errorId}
        />
        <div id={errorId} aria-live='polite' aria-relevant='additions removals'>
          {codeSnippetError ? (
            <ValidationMessage>{codeSnippetError}</ValidationMessage>
          ) : null}
        </div>
        <div>
          <Button onClick={() => handleClick()} loading={loading}>
            Oppdater tema
          </Button>
        </div>
      </div>
      <div className={classes.cards}></div>
    </div>
  );
}

export default Theme;
