import { Container } from '@internal/components';
import { PencilIcon } from '@navikt/aksel-icons';
import type { Metadata } from 'next';

import { Banner, BannerHeading, BannerIcon } from 'components/Banner/Banner';

import classes from './layout.module.css';

export const metadata: Metadata = {
  title: 'Bloggen',
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div id='bloggen'>
      <Banner color='red'>
        <BannerIcon>
          <PencilIcon fontSize={34} aria-hidden='true' />
        </BannerIcon>
        <BannerHeading level={1}>Bloggen</BannerHeading>
      </Banner>
      <Container className={classes.page}>
        <main id='main' className={classes.main}>
          {children}
        </main>
      </Container>
    </div>
  );
};

export default Layout;
