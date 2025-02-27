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

import { getDummyTheme } from '@common/dummyTheme';
import { cliOptions } from '@digdir/designsystemet';
import {
  type CssColor,
  generateColorSchemes,
} from '@digdir/designsystemet/color';
import { type ColorTheme, useThemeStore } from '../../../common/store';
import { themeToFigmaFormat } from '../../../common/utils';
import classes from './Theme.module.css';

const colorCliOptions = cliOptions.theme.colors;

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

    /* For now we check that we have primary, accent, extra1, extra2 */
    const primary = result.mainColors.find(
      (color) => color.name === 'primary',
    )?.hex;
    const accent = result.mainColors.find(
      (color) => color.name === 'accent',
    )?.hex;
    const extra1 = result.supportColors.find(
      (color) => color.name === 'extra1',
    )?.hex;
    const extra2 = result.supportColors.find(
      (color) => color.name === 'extra2',
    )?.hex;

    const neutral = result.neutralColor;

    if (!primary || !accent || !extra1 || !extra2) {
      setCodeSnippetError(
        'I denne versjonen av pluginen må du ha fargene primary, accent, extra1 og extra2',
      );
      return;
    }

    console.log(
      `Primary: ${primary}, Accent: ${accent}, Neutral: ${neutral}, Extra1: ${extra1}, Extra2: ${extra2}`,
    );

    const newArray = Array.from(themes);
    newArray[themeIndex] = {
      ...newArray[themeIndex],
      colors: {
        ...newArray[themeIndex].colors,
        accent: themeToFigmaFormat(generateColorSchemes(accent)),
        primary: themeToFigmaFormat(generateColorSchemes(primary)),
        neutral: themeToFigmaFormat(generateColorSchemes(neutral)),
        extra1: themeToFigmaFormat(generateColorSchemes(extra1)),
        extra2: themeToFigmaFormat(generateColorSchemes(extra2)),
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
