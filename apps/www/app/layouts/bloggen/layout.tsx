import { PencilIcon } from '@navikt/aksel-icons';
import { Outlet } from 'react-router';
import { Banner, BannerHeading, BannerIcon } from '~/_components/banner/banner';
import { ContentContainer } from '~/_components/content-container/content-container';
import classes from './layout.module.css';

export default function Layout() {
  return (
    <div>
      <Banner color='red'>
        <BannerIcon>
          <PencilIcon />
        </BannerIcon>
        <BannerHeading level={1}>Bloggen</BannerHeading>
      </Banner>
      <ContentContainer className={classes.main}>
        <Outlet />
      </ContentContainer>
    </div>
  );
}
