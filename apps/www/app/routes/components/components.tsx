import { join } from 'node:path';
import { Heading } from '@digdir/designsystemet-react';
import { ComponentFillIcon } from '@navikt/aksel-icons';
import { useTranslation } from 'react-i18next';
import {
  Banner,
  BannerHeading,
  BannerIngress,
} from '~/_components/banner/banner';
import { ComponentCard } from '~/_components/component-card/component-card';
import {
  getFileFromContentDir,
  getFoldersInContentDir,
} from '~/_utils/files.server';
import { generateMetadata } from '~/_utils/metadata';
import i18nConf from '~/i18n';
import i18n from '~/i18next.server';
import type { Route } from './+types/components';
import classes from './components.module.css';

export const loader = async ({ params: { lang } }: Route.LoaderArgs) => {
  if (!lang) {
    throw new Response('Not Found', {
      status: 404,
      statusText: 'Not Found',
    });
  }

  if (!i18nConf.supportedLngs.includes(lang)) {
    throw new Response('Not Found', {
      status: 404,
      statusText: 'Not Found',
    });
  }

  const t = await i18n.getFixedT(lang);

  const folders = getFoldersInContentDir('/components');
  const components: {
    [category: string]: {
      title: string;
      image: string;
      url: string;
    }[];
  } = {};

  folders.map(async (folder) => {
    const metadataJson = getFileFromContentDir(
      join('components', folder, 'metadata.json'),
    );

    if (!metadataJson) {
      return {
        category: 'components',
        title: folder,
        url: `/${lang}/components/docs/${folder}`,
      };
    }

    const parsedMetadata = JSON.parse(metadataJson);

    if (!components[parsedMetadata.category || 'components']) {
      components[parsedMetadata.category || 'components'] = [];
    }

    components[parsedMetadata.category || 'components'].push({
      image: parsedMetadata.image || '',
      title: parsedMetadata[lang].title || folder,
      url: `/${lang}/components/docs/${folder}/overview`,
    });
  });

  return {
    lang,
    metadata: generateMetadata({
      title: t('components.title'),
      description: t('components.description'),
    }),
    components,
  };
};

export const meta = ({ data }: Route.MetaArgs) => {
  if (!data)
    return [
      {
        title: 'Designsystemet',
      },
    ];
  return data.metadata;
};

export default function Components({
  loaderData: { components },
}: Route.ComponentProps) {
  const { t } = useTranslation();

  return (
    <>
      <Banner data-color='brand3' icon={<ComponentFillIcon />}>
        <BannerHeading level={1}>{t('components.title')}</BannerHeading>
        <BannerIngress>{t('components.description')}</BannerIngress>
      </Banner>
      {Object.keys(components).map((category) => {
        return (
          <>
            {category !== 'components' ? (
              <Heading data-size='lg'>
                {/* @ts-ignore -- this key will exist */}
                {t(`sidebar.categories.${category}`)}
              </Heading>
            ) : null}
            <div className={classes.grid} data-is-main={true} key={category}>
              {components[category].map((component) => (
                <ComponentCard
                  key={component.url}
                  title={component.title}
                  image={component.image}
                  url={component.url}
                />
              ))}
            </div>
          </>
        );
      })}
    </>
  );
}
