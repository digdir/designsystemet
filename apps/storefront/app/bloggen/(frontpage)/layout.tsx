import { PencilIcon } from '@navikt/aksel-icons';

import { Container } from '@components';
import {
  Banner,
  BannerIcon,
  BannerHeading,
} from 'components/SubPages/Banner/Banner';

import classes from './layout.module.css';

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
