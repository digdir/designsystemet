import type * as React from 'react';

import { Container } from '../../components';
import { Banner } from '../../components/PageBanner/PageBanner';

import classes from './BlogPageLayout.module.css';

type BlogPageLayoutProps = {
  content: React.ReactNode;
  banner?: {
    color: 'blue' | 'red' | 'yellow';
    title: string;
    ingress?: string;
    icon: React.ReactNode;
  };
};

const BlogPageLayout = ({ content, banner }: BlogPageLayoutProps) => {
  return (
    <div>
      {banner && (
        <Banner color={banner.color}>
          <Banner.Icon>{banner.icon}</Banner.Icon>
          <Banner.Heading>{banner.title}</Banner.Heading>
          {banner.ingress && <Banner.Ingress>{banner.ingress}</Banner.Ingress>}
        </Banner>
      )}
      <Container className={classes.page}>
        <main
          id='main'
          className={classes.main}
        >
          {content}
        </main>
      </Container>
    </div>
  );
};

export { BlogPageLayout };
