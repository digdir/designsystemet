/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Heading, Ingress, Paragraph } from '@digdir/design-system-react';
import type { SanityDocument } from 'next-sanity';

import { Container } from '../../../components';
import { Link } from '../../../components/Link/Link';
import { getUrl } from '../../../sanity/lib/imageBuilder';
import { Contributors } from '../Contributors/Contributors';

import { Figures } from './components/Figures';
import classes from './Post.module.css';

const Post = ({ post }: { post: SanityDocument }) => {
  return (
    <div className={classes.wrapper}>
      <Container className={classes.page}>
        {Array.from({ length: post.figureCount }).map((_, index) => (
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
            <Heading level={1}>{post.title}</Heading>
            <Ingress className={classes.ingress}>{post.ingress}</Ingress>
            <Paragraph
              size='small'
              className={classes.meta}
            >
              <span>{post.date}</span>
              <span
                aria-hidden
                className={classes.metaSquare}
              />
              <span>{post.author}</span>
            </Paragraph>
          </div>
          <div className={classes.content}>
            <img
              src={getUrl(post.image)}
              alt={post.title}
            />
            {post.content.map((block, index) => (
              <div
                key={index}
                className={classes.content}
              >
                {block._type === 'heading' && <h2>{block.Text}</h2>}
                {block._type === 'paragraph' && <p>{block.Text}</p>}
              </div>
            ))}
            <Contributors
              authors={[
                'Marianne Røsvik',
                'Roy Halvor Frimanslund',
                'Michael Marszalek',
                'Alise Kjelling',
                'Dorte Drange',
                'Lasse Straum',
                'Hanne Finnøy',
                'Lis Lonning',
                'Hanne Fredheim',
              ]}
            />
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
          </div>
        </main>
      </Container>
    </div>
  );
};

export { Post };
