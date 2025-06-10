import { ContentContainer } from '@internal/components';
import { PencilIcon } from '@navikt/aksel-icons';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router';
import { Banner, BannerHeading, BannerIcon } from '~/_components/banner/banner';
import classes from './layout.module.css';
export { ErrorBoundary } from '~/root';

export default function Layout() {
  const { t } = useTranslation();

  return (
    <div data-is-main={true}>
      <Banner color='red'>
        <BannerIcon>
          <PencilIcon />
        </BannerIcon>
        <BannerHeading level={1}>{t('blog.title')}</BannerHeading>
      </Banner>
      <ContentContainer className={classes.main}>
        <Outlet />
      </ContentContainer>
    </div>
  );
}
