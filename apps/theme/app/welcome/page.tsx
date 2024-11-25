'use client';

import {
  Button,
  Heading,
  Paragraph,
  Textfield,
} from '@digdir/designsystemet-react';
import NextLink from 'next/link';
import { useThemeStore } from '../../store';
import classes from './page.module.css';

export default function Welcome() {
  const themeName = useThemeStore((state) => state.themeName);
  const setThemeName = useThemeStore((state) => state.setThemeName);

  return (
    <div className={classes.page}>
      <div className={classes.card}>
        <Heading data-size='md' className={classes.heading}>
          Velkommen til Temabyggeren
        </Heading>
        <Paragraph className={classes.paragraph}>
          Bored ideas one was horses empire these than her. The of ran to with
          run not prepared he clothes stands guard but observed, project copy.
        </Paragraph>
        <Paragraph className={classes.paragraph}>
          If window synthesizers of different the or of convince human the just
          make the this a ancient not its chooses the vices years so in.
        </Paragraph>

        <Textfield
          className={classes.textfield}
          aria-labelledby='theme-name'
          value={themeName}
          data-size='md'
          onChange={(e) => {
            const value = e.currentTarget.value
              .replace(/\s+/g, '-')
              .replace(/[^A-Z0-9-]+/gi, '')
              .toLowerCase();

            setThemeName(value);
          }}
        />

        <Button asChild className={classes.btn}>
          <NextLink href='/themebuilder'>Gå videre til farger</NextLink>
        </Button>
      </div>
    </div>
  );
}
