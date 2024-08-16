import {
  Heading,
  Ingress,
  Link,
  Paragraph,
} from '@digdir/designsystemet-react';
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
    <div className={classes.wrapper}>
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
            <Heading level={1}>{heading}</Heading>
            <Ingress className={classes.ingress}>{ingress}</Ingress>
            <Paragraph size='sm' className={classes.meta}>
              <span>{date}</span>
              <span aria-hidden className={classes.metaSquare} />
              <span>{author}</span>
            </Paragraph>
          </div>
          <MdxContent classname={classes.content}>
            <Image
              src={imageSrc}
              alt={imageAlt}
              caption={imageCaption}
              boxShadow={false}
            />
            {content}
            <div className={classes.wantToWrite}>
              <Heading level={3} size='xs'>
                Ønsker du å skrive for bloggen?
              </Heading>
              <Paragraph size='sm'>
                Ta kontakt med oss på{' '}
                <Link
                  href='https://join.slack.com/t/designsystemet/shared_invite/zt-2438eotl3-a4266Vd2IeqMWO8TBw5PrQ'
                  target='_blank'
                >
                  #designsystemet
                </Link>{' '}
                i Slack kanalen vår.
              </Paragraph>
            </div>
          </MdxContent>
        </main>
      </Container>
    </div>
  );
}

export { PostLayout };
