import type * as React from 'react';
import { Heading, Ingress, Paragraph } from '@digdir/design-system-react';

import { Container, MdxContent, Image, Meta } from '../../components';
import { Link } from '../../components/Link/Link';

import classes from './BlogArticleLayout.module.css';
import { Figures } from './components/Figures';

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

const BlogArticleLayout = ({
  content,
  heading,
  ingress,
  date,
  author,
  imageSrc,
  imageAlt,
  imageCaption,
  figureCount = FIGURE_COUNT,
}: BlogArticleLayoutProps) => {
  return (
    <div className={classes.wrapper}>
      <Meta
        title={heading}
        description={ingress}
        image={imageSrc}
      />
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
        <main
          id='main'
          className={classes.main}
        >
          <div className={classes.intro}>
            <Heading level={1}>{heading}</Heading>
            <Ingress className={classes.ingress}>{ingress}</Ingress>
            <Paragraph
              size='small'
              className={classes.meta}
            >
              <span>{date}</span>
              <span
                aria-hidden
                className={classes.metaSquare}
              />
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
              <Heading
                level={3}
                size='xsmall'
              >
                Ønsker du å skrive for bloggen?
              </Heading>
              <Paragraph size='small'>
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
};

export { BlogArticleLayout };
