import {} from 'node:fs';
import { join } from 'node:path';
import { Heading, Paragraph } from '@digdir/designsystemet-react';
import { Image } from '~/_components/image/image';
import { RRLink } from '~/_components/link';
import { MDXComponents } from '~/_components/mdx-components/mdx-components';
import { formatDateNorwegian } from '~/_utils/date';
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
    join('bloggen', params.lang, `${params.file}.mdx`),
  );

  // Generate the MDX content
  const result = await generateFromMdx(fileContent);

  return {
    name: params.file,
    code: result.code,
    frontmatter: result.frontmatter,
    currentLang: params.lang,
  };
};

export const meta = ({ data }: Route.MetaArgs) => {
  return generateMetadata({
    title: data.frontmatter.title,
    description: data.frontmatter.description,
    image: data.frontmatter.imageSrc,
  });
};

export default function Bloggen({
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
  },
}: Route.ComponentProps) {
  return (
    <div className={classes.main}>
      <div className={classes.intro}>
        <Heading level={1} data-size='xl'>
          {title}
        </Heading>
        <Paragraph variant='long'>{description}</Paragraph>
        <Paragraph data-size='sm' className={classes.meta}>
          <span>{formatDateNorwegian(date)}</span>
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
            Ønsker du å skrive for bloggen?
          </Heading>
          <Paragraph data-size='sm'>
            Vi vil gjerne ha historier om hvordan Designsystemet har blitt
            brukt! Ta kontakt med oss i{' '}
            <RRLink to='https://designsystemet.no/slack' target='_blank'>
              Slack (åpnes i ny fane)
            </RRLink>{' '}
            eller{' '}
            <RRLink to='mailto:designsystem@digdir.no' target='_blank'>
              send oss en epost (åpnes i ny fane).
            </RRLink>{' '}
          </Paragraph>
        </div>
      </div>
    </div>
  );
}
