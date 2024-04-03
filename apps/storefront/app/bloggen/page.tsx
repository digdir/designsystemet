import { PencilIcon } from '@navikt/aksel-icons';
import { draftMode } from 'next/headers';

import HeaderVisualEdit from 'components/Header/HeaderVisualEdit';
import FooterVisualEdit from 'components/Footer/FooterVisualEdit';
import { Container, PageBanner, Posts, PostsPreview } from '@components';

import {
  FOOTER_QUERY,
  MENU_QUERY,
  BLOG_ARCHIVE_QUERY,
  BLOG_POSTS_QUERY,
} from '../../sanity/lib/queries';
import { getDocuments } from '../../sanity/lib/loaders';

import classes from './page.module.css';

export default async function Bloggen() {
  const initialMenu = await getDocuments(MENU_QUERY);
  const initialFooter = await getDocuments(FOOTER_QUERY);
  const initialBlogArchive = await getDocuments(BLOG_ARCHIVE_QUERY);
  const initialBlogPosts = await getDocuments(BLOG_POSTS_QUERY);

  console.log(initialBlogArchive);

  return (
    <div>
      <HeaderVisualEdit initialMenu={initialMenu} />
      <div className={classes.page}>
        <PageBanner
          color='red'
          icon={
            <PencilIcon
              title='a11y-title'
              fontSize='1.5rem'
            />
          }
          title='Bloggen'
        />

        <Container className={classes.container}>
          <main
            id='main'
            className={classes.main}
          >
            {draftMode().isEnabled ? (
              <PostsPreview initial={initialBlogPosts} />
            ) : (
              <Posts posts={initialBlogPosts.data} />
            )}
          </main>
        </Container>
      </div>
      <FooterVisualEdit initial={initialFooter} />
    </div>
  );
}
