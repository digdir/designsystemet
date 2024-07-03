import { PencilIcon } from '@navikt/aksel-icons';
import type { Metadata } from 'next';
import { Container } from '@digdir/components';

import { Banner, BannerIcon, BannerHeading } from 'components/Banner/Banner';

import classes from './layout.module.css';

export const metadata: Metadata = {
  title: 'Bloggen',
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Banner color='red'>
        <BannerIcon>
          <PencilIcon fontSize={34} />
        </BannerIcon>
        <BannerHeading>Bloggen</BannerHeading>
      </Banner>
      <Container className={classes.page}>
        <main
          id='main'
          className={classes.main}
        >
          {children}
        </main>
      </Container>
    </div>
  );
};

export default Layout;
