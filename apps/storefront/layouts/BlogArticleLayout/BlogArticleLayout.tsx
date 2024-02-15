import type * as React from 'react';
import { Heading, Ingress, Paragraph } from '@digdir/design-system-react';

import { Container, MdxContent } from '../../components';

import classes from './BlogArticleLayout.module.css';

type BlogArticleLayoutProps = {
  content: React.ReactNode;
  heading?: string;
  ingress?: string;
  date?: string;
  author?: string;
};

const BlogArticleLayout = ({
  content,
  heading,
  ingress,
  date,
  author,
}: BlogArticleLayoutProps) => {
  return (
    <div>
      <Container className={classes.page}>
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
          <MdxContent classname={classes.content}>{content}</MdxContent>
        </main>
      </Container>
    </div>
  );
};

export { BlogArticleLayout };
