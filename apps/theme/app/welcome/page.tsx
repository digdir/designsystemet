'use client';

import {
  Button,
  Heading,
  Paragraph,
  Textfield,
} from '@digdir/designsystemet-react';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { Header, ToggleChip } from '../../components';
import { useThemeStore } from '../../store';
import classes from './page.module.css';

export default function Welcome() {
  const themeName = useThemeStore((state) => state.themeName);
  const setThemeName = useThemeStore((state) => state.setThemeName);
  const router = useRouter();
  const setActivePage = useThemeStore((state) => state.setActivePage);
  const items = [
    {
      name: 'Navn på tema',
      value: 'intro',
    },
    {
      name: 'Farger',
      value: 'colors',
    },
    {
      name: 'Border radius',
      value: 'radius',
    },
  ];
  return (
    <div className={classes.page}>
      <Header />
      <div className={classes.tabs}>
        <ToggleChip
          items={items}
          defaultValue='intro'
          onChange={(e) => {
            if (e === 'colors') {
              setActivePage('colors');
              router.push('/themebuilder');
            } else if (e === 'radius') {
              setActivePage('radius');
              router.push('/themebuilder');
            }
          }}
        />
      </div>
      <div className={classes.card}>
        <Heading data-size='sm' className={classes.heading} id='themeName'>
          Navn på tema
        </Heading>
        <Paragraph className={classes.paragraph}>
          Navnet bør representere virksomheten eller produktet du skal
          profilere.
        </Paragraph>

        <Textfield
          className={classes.textfield}
          aria-labelledby='themeName'
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
          <NextLink
            href='/themebuilder'
            onClick={() => {
              setActivePage('colors');
            }}
          >
            Gå videre til farger
          </NextLink>
        </Button>
      </div>
    </div>
  );
}
