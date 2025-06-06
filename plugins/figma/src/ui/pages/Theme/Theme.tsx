import {
  Alert,
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
    const lines = command.split('\\\n');
    const colorRegex = /"([^:]+):(#\w{6})"/g;

    let colors: { name: string; hex: CssColor }[] = [];

    for (const line of lines) {
      if (
        line.includes(`--${colorCliOptions.main}`) ||
        line.includes(`--${colorCliOptions.support}`)
      ) {
        const matches = [...line.matchAll(colorRegex)];
        if (matches.length > 0) {
          colors = colors.concat(
            matches.map((match) => ({
              name: match[1],
              hex: match[2] as CssColor,
            })),
          );
        }
      }
      if (line.includes(`--${colorCliOptions.neutral}`)) {
        const match = line.match(/#\w{6}/);
        if (match)
          colors = colors.concat([
            { name: 'neutral', hex: match[0] as CssColor },
          ]);
      }
    }

    if (!colors.length) {
      console.log('No match');
      setCodeSnippetError(
        'Koden du limte inn er ikke gyldig. Prøv å lim inn på nytt.',
      );
      return;
    }

    /* For now we check that we have  accent, brand1, brand2, brand3 */

    const accent = colors.find((color) => color.name === 'accent')?.hex;
    const brand1 = colors.find((color) => color.name === 'brand1')?.hex;
    const brand2 = colors.find((color) => color.name === 'brand2')?.hex;
    const brand3 = colors.find((color) => color.name === 'brand3')?.hex;
    const neutral = colors.find((color) => color.name === 'neutral')?.hex;

    if (!accent || !brand1 || !brand2 || !brand3 || !neutral) {
      const missingColors = [
        !accent && 'accent',
        !brand1 && 'brand1',
        !brand2 && 'brand2',
        !brand3 && 'brand3',
        !neutral && 'neutral',
      ]
        .filter(Boolean)
        .join(', ');
      setCodeSnippetError(
        `I denne versjonen av pluginen må du ha bestemte fargenavn. Det mangler: ${missingColors}, i kodensnutten.`,
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
        accent: themeToFigmaFormat(generateColorSchemes(accent)),
        neutral: themeToFigmaFormat(generateColorSchemes(neutral)),
        brand1: themeToFigmaFormat(generateColorSchemes(brand1)),
        brand2: themeToFigmaFormat(generateColorSchemes(brand2)),
        brand3: themeToFigmaFormat(generateColorSchemes(brand3)),
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
        <Paragraph>
          Dette verktøyet lar deg oppdatere fargene i teamet ditt for enkel
          testing.
        </Paragraph>
        <Paragraph variant='long'>
          Gå til{' '}
          <Link href='https://theme.designsystemet.no/' target='_blank'>
            Temabyggeren
          </Link>{' '}
          for å lage deg et tema, lim inn kodensnutten fra steg 1 i feltet
          under.
        </Paragraph>
        <Alert>
          Fargene må ha navnene; accent, neutral, brand1, brand2 og brand3.
        </Alert>
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
