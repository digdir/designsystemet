import { join } from 'node:path';
import { Heading, Paragraph } from '@digdir/designsystemet-react';
import { useTranslation } from 'react-i18next';
import { Image } from '~/_components/image/image';
import { RRLink } from '~/_components/link';
import { MDXComponents } from '~/_components/mdx-components/mdx-components';
import { formatDate } from '~/_utils/date';
import { getFileFromContentDir } from '~/_utils/files';
import { generateFromMdx } from '~/_utils/generate-from-mdx';
import { generateMetadata } from '~/_utils/metadata';
import type { Route } from './+types/page';
import classes from './page.module.css';

export const loader = async ({ params }: Route.LoaderArgs) => {
  if (!params.file) {
    throw new Response('Not Found', {
      status: 404,
      statusText: 'Not Found',
    });
  }

  // Read the file content
  const fileContent = getFileFromContentDir(
    join('blog', params.lang, `${params.file}.mdx`),
  );

  if (!fileContent) {
    throw new Response('Not Found', {
      status: 404,
      statusText: 'Not Found',
    });
  }

  // Generate the MDX content
  const result = await generateFromMdx(fileContent);

  return {
    name: params.file,
    code: result.code,
    frontmatter: result.frontmatter,
    lang: params.lang,
  };
};

export const meta = ({ data }: Route.MetaArgs) => {
  return generateMetadata({
    title: data.frontmatter.title,
    description: data.frontmatter.description,
    image: data.frontmatter.imageSrc,
  });
};

export default function Blog({
  loaderData: {
    frontmatter: {
      title,
      author,
      date,
      description,
      imageSrc,
      imageAlt,
      imageCaption,
    },
    code,
    lang,
  },
}: Route.ComponentProps) {
  const { t } = useTranslation();

  return (
    <div className={classes.main}>
      <div className={classes.intro}>
        <Heading level={1} data-size='xl'>
          {title}
        </Heading>
        <Paragraph variant='long'>{description}</Paragraph>
        <Paragraph data-size='sm' className={classes.meta}>
          <span>{formatDate(date, lang)}</span>
          <span aria-hidden className={classes.metaSquare} />
          <span>{author}</span>
        </Paragraph>
      </div>
      <Image
        src={imageSrc}
        alt={imageAlt}
        caption={imageCaption}
        boxShadow={false}
      />
      <div className={classes.content}>
        <MDXComponents code={code} />
        <div className={classes.wantToWrite} data-color='brand3'>
          <Heading level={3} data-size='xs'>
            {t('blog.write.title')}
          </Heading>
          <Paragraph data-size='sm'>
            {t('blog.write.description')}
            <RRLink to='https://designsystemet.no/slack' target='_blank'>
              {t('blog.write.slack')}
            </RRLink>{' '}
            {t('blog.write.or')}{' '}
            <RRLink to='mailto:designsystem@digdir.no' target='_blank'>
              {t('blog.write.email')}
            </RRLink>
          </Paragraph>
        </div>
      </div>
    </div>
  );
}
