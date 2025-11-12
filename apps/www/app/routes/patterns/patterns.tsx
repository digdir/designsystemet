import { join } from 'node:path';
import { LayersIcon } from '@navikt/aksel-icons';
import cl from 'clsx';
import { useTranslation } from 'react-i18next';
import {
  Banner,
  BannerHeading,
  BannerIngress,
} from '~/_components/banner/banner';
import { MDXComponents } from '~/_components/mdx-components/mdx-components';
import { getFileFromContentDir } from '~/_utils/files.server';
import { generateFromMdx } from '~/_utils/generate-from-mdx';
import { generateMetadata } from '~/_utils/metadata';
import i18n from '~/i18next.server';
import type { Route } from './+types/patterns';

export const loader = async ({
  params: { lang },
}: Route.LoaderArgs): Promise<{
  index: Awaited<ReturnType<typeof generateFromMdx>>;
  lang: string;
  metadata: ReturnType<typeof generateMetadata>;
}> => {
  if (!lang) {
    throw new Response('Not Found', {
      status: 404,
      statusText: 'Not Found',
    });
  }

  /* Map over files with mdx parser to get title */

  const fileContent = getFileFromContentDir(
    join('patterns', `${lang}_index.mdx`),
  );
  const result = await generateFromMdx(fileContent);

  const t = await i18n.getFixedT(lang);

  return {
    index: result,
    lang,
    metadata: generateMetadata({
      title: t('patterns.title'),
      description: t('patterns.description'),
    }),
  };
};

export const meta: Route.MetaFunction = ({ data }: Route.MetaArgs) => {
  if (!data) return [{ title: 'Designsystemet' }];
  return data.metadata;
};

export default function Patterns({
  loaderData: { index },
}: Route.ComponentProps) {
  const { t } = useTranslation();
  return (
    <>
      <Banner
        style={{ marginBottom: 'var(--page-spacing-top)' }}
        data-color='warning'
        icon={<LayersIcon />}
      >
        <BannerHeading level={1}>{t('patterns.title')}</BannerHeading>
        <BannerIngress>{t('patterns.description')}</BannerIngress>
      </Banner>
      <div className={cl('u-rich-text left-adjusted')}>
        <MDXComponents code={index.code} />
      </div>
    </>
  );
}
