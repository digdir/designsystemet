import { ComponentFillIcon } from '@navikt/aksel-icons';
import { Container } from '@repo/components';

import {
  Banner,
  BannerHeading,
  BannerIcon,
  BannerIngress,
} from 'components/Banner/Banner';

import classes from './layout.module.css';

export const metadata = {
  title: 'Komponenter',
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main id='main' className={classes.page}>
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
