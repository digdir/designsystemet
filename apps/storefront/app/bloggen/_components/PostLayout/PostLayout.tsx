import { Heading, Link, Paragraph } from '@digdir/designsystemet-react';
import { Container } from '@repo/components';
import type * as React from 'react';

import { Image, MdxContent } from '../../../../components';
import { Figures } from '../Figures';

import classes from './PostLayout.module.css';

type BlogArticleLayoutProps = {
  content: React.ReactNode;
  heading: string;
  ingress: string;
  date?: string;
  author?: string;
  figureCount?: number;
  imageSrc: string;
  imageAlt: string;
  imageCaption: string;
};

const FIGURE_COUNT = 4;

function PostLayout({
  content,
  heading,
  ingress,
  date,
  author,
  imageSrc,
  imageAlt,
  imageCaption,
  figureCount = FIGURE_COUNT,
}: BlogArticleLayoutProps) {
  return (
    <div className={classes.wrapper} id='post-layout'>
      <Container className={classes.page}>
        {Array.from({ length: figureCount }).map((_, index) => (
          <Figures
            key={index}
            className={classes.figure}
            style={{
              /* @ts-expect-error #2353 */
              '--number': index + 1,
              '--figure-y-offset': index === 0 ? '250px' : '600px',
            }}
          />
        ))}
        <main id='main' className={classes.main}>
          <div className={classes.intro}>
            <Heading level={1} data-size='xl'>
              {heading}
            </Heading>
            <Paragraph className={classes.ingress} variant='long'>
              {ingress}
            </Paragraph>
            <Paragraph data-size='sm' className={classes.meta}>
              <span>{date}</span>
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
          <MdxContent className={classes.content}>
            {content}
            <div className={classes.wantToWrite} data-color='brand3'>
              <Heading level={3} data-size='xs'>
                Ønsker du å skrive for bloggen?
              </Heading>
              <Paragraph data-size='sm'>
                Vi vil gjerne ha historier om hvordan Designsystemet har blitt
                brukt! Ta kontakt med oss i{' '}
                <Link href='https://designsystemet.no/slack' target='_blank'>
                  Slack (åpnes i ny fane)
                </Link>{' '}
                eller{' '}
                <Link href='mailto:designsystem@digdir.no' target='_blank'>
                  send oss en epost (åpnes i ny fane).
                </Link>{' '}
              </Paragraph>
            </div>
          </MdxContent>
        </main>
      </Container>
    </div>
  );
}

export { PostLayout };
