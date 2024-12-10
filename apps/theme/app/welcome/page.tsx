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
          Todo: General intro the the theme builder and set expectations
        </Paragraph>
        <Paragraph className={classes.paragraph}>
          Todo: Say what the name does and how it effects the user
        </Paragraph>

        <Textfield
          className={classes.textfield}
          label='Navn på tema'
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
