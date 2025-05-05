import { ComponentFillIcon } from '@navikt/aksel-icons';
import { useTranslation } from 'react-i18next';
import {
  Banner,
  BannerHeading,
  BannerIcon,
  BannerIngress,
} from '~/_components/banner/banner';
import { ComponentCard } from '~/_components/component-card/component-card';
import { ContentContainer } from '~/_components/content-container/content-container';
import { generateMetadata } from '~/_utils/metadata';
import { data } from '~/content/components';
import i18n from '~/i18next.server';
import type { Route } from './+types/components';
import classes from './components.module.css';

const sortedData = data.sort((a, b) => a.title.localeCompare(b.title));

const IS_NEXT_BRANCH = false;

/* If we are in the next branch, send us to the next storybook */
if (IS_NEXT_BRANCH) {
  for (const component of sortedData) {
    component.url = component.url.replace(
      'storybook.designsystemet.no',
      'next.storybook.designsystemet.no',
    );
  }
}

export const loader = async ({ params: { lang } }: Route.LoaderArgs) => {
  if (!lang) {
    throw new Response('Not Found', {
      status: 404,
      statusText: 'Not Found',
    });
  }

  const t = await i18n.getFixedT(lang);

  return {
    lang,
    metadata: generateMetadata({
      title: t('components.title'),
      description: t('components.description'),
    }),
  };
};

export const meta = ({ data: { metadata } }: Route.MetaArgs) => {
  return metadata;
};

export default function Components() {
  const { t } = useTranslation();

  return (
    <>
      <Banner color='blue'>
        <BannerIcon>
          <ComponentFillIcon />
        </BannerIcon>
        <BannerHeading level={1}>{t('components.title')}</BannerHeading>
        <BannerIngress>{t('components.description')}</BannerIngress>
      </Banner>
      <ContentContainer className={classes.grid}>
        {sortedData.map((component) => (
          <ComponentCard key={component.title} {...component} />
        ))}
      </ContentContainer>
    </>
  );
}
