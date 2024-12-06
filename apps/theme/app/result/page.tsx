'use client';

import { colorCliOptions } from '@digdir/designsystemet/tokens';
import { CodeSnippet, Container } from '@repo/components';
import cl from 'clsx/lite';
import { type ColorTheme, useThemeStore } from '../../store';
import classes from './page.module.css';

export default function Result() {
  const themeName = useThemeStore((state) => state.themeName);
  const colors = useThemeStore((state) => state.colors);

  const setCliColors = (colorTheme: ColorTheme[]) => {
    let str = '';
    for (const color of colorTheme) {
      str += `"${color.name}:${color.colors.light[8].hex}" `;
    }
    return str;
  };

  const cliSnippet = `npx @digdir/designsystemet@next tokens create \\
  --${colorCliOptions.main} ${setCliColors(colors.main)} \\
  --${colorCliOptions.neutral} "${colors.neutral[0]?.colors.light[8].hex}" \\
  --${colorCliOptions.support} ${setCliColors(colors.support)} \\
  --theme "${themeName}" \\
  --write
  `;

  return (
    <div className={classes.page}>
      <div className={classes.header}>{themeName}</div>
      <Container>
        <div className={classes.content}>
          <div className={cl(classes.card, classes.big)}>
            <div className={classes.snippet}>
              <CodeSnippet language='bash'>{cliSnippet}</CodeSnippet>
            </div>
          </div>
          <div className={cl(classes.card, classes.small)}>f</div>
          <div className={cl(classes.card, classes.big)}>f</div>
          <div className={cl(classes.card, classes.small)}>f</div>
        </div>
      </Container>
    </div>
  );
}
