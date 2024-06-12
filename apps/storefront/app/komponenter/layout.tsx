import { ComponentFillIcon } from '@navikt/aksel-icons';
import type { Metadata } from 'next';

import { Container } from '@components';
import {
  Banner,
  BannerIcon,
  BannerHeading,
  BannerIngress,
} from 'components/SubPages/Banner/Banner';

import classes from './layout.module.css';

export const metadata: Metadata = {
  title: 'Komponenter - Designsystemet',
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main
      id='main'
      className={classes.page}
    >
      <Banner color='blue'>
        <BannerIcon>
          <ComponentFillIcon fontSize={'2.5rem'} />
        </BannerIcon>
        <BannerHeading>Komponenter</BannerHeading>
        <BannerIngress>
          Designsystemet inneholder grunnleggende komponenter som kan settes
          sammen på mange ulike måter og i forskjellige mønstre.
        </BannerIngress>
      </Banner>
      <Container className={classes.grid}>{children}</Container>
    </main>
  );
};

export default Layout;
