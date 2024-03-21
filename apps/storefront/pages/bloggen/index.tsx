/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import type { SanityDocument } from 'next-sanity';
import { PencilIcon } from '@navikt/aksel-icons';
import dynamic from 'next/dynamic';

import { Posts } from '../../components/Blog/Posts/Posts';
import {
  BLOG_POSTS_QUERY,
  BLOG_ARCHIVE_QUERY,
  FOOTER_QUERY,
  MENU_QUERY,
} from '../../sanity/lib/queries';
import { getClient } from '../../sanity/lib/client';
import { token } from '../../sanity/lib/token';
import { Banner } from '../../components/SubPages/Banner/Banner';
import { Container, Footer, Header } from '../../components';

import classes from './index.module.css';

type PageProps = {
  blogPosts: SanityDocument[];
  blogArchive: SanityDocument[];
  footer: SanityDocument[];
  menu: SanityDocument[];
  draftMode: boolean;
  token: string;
};

export const getStaticProps = async ({ draftMode = false }) => {
  const client = getClient(draftMode ? token : undefined);
  const blogPosts = await client.fetch<SanityDocument[]>(BLOG_POSTS_QUERY);
  const blogArchive = await client.fetch<SanityDocument[]>(BLOG_ARCHIVE_QUERY);
  const footer = await client.fetch<SanityDocument[]>(FOOTER_QUERY);
  const menu = await client.fetch<SanityDocument[]>(MENU_QUERY);
  return {
    props: {
      blogPosts,
      blogArchive,
      footer,
      menu,
      draftMode,
      token: draftMode ? token : '',
    },
  };
};

const PostsPreview = dynamic(
  () => import('../../components/Blog/Posts/PostsPreview'),
);

const HeaderPreview = dynamic(
  () => import('../../components/Blog/Posts/PostsPreview'),
);

const FooterPreview = dynamic(
  () => import('../../components/Blog/Posts/PostsPreview'),
);

function Bloggen(props: PageProps) {
  return (
    <div>
      <Header menu={props.menu[0].menu} />
      <div className={classes.page}>
        <Banner color={props.blogArchive[0].blogBanner?.color}>
          <Banner.Icon>
            <PencilIcon
              title='a11y-title'
              fontSize='1.5rem'
            />
          </Banner.Icon>
          <Banner.Heading>
            {props.blogArchive[0].blogBanner?.title}
          </Banner.Heading>
        </Banner>
        <Container className={classes.container}>
          <main
            id='main'
            className={classes.main}
          >
            {props.draftMode ? (
              <PostsPreview posts={props.blogPosts} />
            ) : (
              <Posts posts={props.blogPosts} />
            )}
          </main>
        </Container>
      </div>
      <Footer data={props.footer} />
    </div>
  );
}

export default Bloggen;
