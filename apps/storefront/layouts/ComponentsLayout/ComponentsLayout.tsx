import type * as React from 'react';

import { Container, Meta } from '@components';

import { Banner } from '../../components/SubPages/Banner/Banner';

import classes from './ComponentsLayout.module.css';

type ComponentsLayoutProps = {
  content: React.ReactNode;
  banner: {
    title: string;
    ingress?: string;
    icon: React.ReactNode;
  };
};

const ComponentsLayout = ({ content, banner }: ComponentsLayoutProps) => {
  return (
    <>
      <Meta
        title={banner.title}
        description={banner.ingress || ''}
      />

      <main
        id='main'
        className={classes.page}
      >
        <Banner color='blue'>
          <Banner.Icon>{banner.icon}</Banner.Icon>
          <Banner.Heading>{banner.title}</Banner.Heading>
          {banner.ingress && <Banner.Ingress>{banner.ingress}</Banner.Ingress>}
        </Banner>
        <Container className={classes.grid}>{content}</Container>
      </main>
    </>
  );
};

export { ComponentsLayout };
