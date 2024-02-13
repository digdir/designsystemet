import type * as React from 'react';
import { useRouter } from 'next/router';

import GithubLink from 'components/Link/Github/GithubLink';
import { Banner } from 'components/SubPages/Banner/Banner';

import { Container, SidebarMenu, MdxContent } from '../../components';

import classes from './MenuPageLayout.module.css';

type PageLayoutProps = {
  content: React.ReactNode;
  data?: PageLayoutData;
  banner?: {
    color: 'blue' | 'red' | 'yellow';
    title: string;
    ingress: string;
    icon: React.ReactNode;
  };
};

type PageLayoutData = {
  title: string;
  date: string;
};

const MenuPageLayout = ({ content, data, banner }: PageLayoutProps) => {
  const router = useRouter();

  return (
    <div>
      {banner && (
        <Banner color={banner.color}>
          <Banner.Icon>{banner.icon}</Banner.Icon>
          <Banner.Heading>{banner.title}</Banner.Heading>
          <Banner.Ingress>{banner.ingress}</Banner.Ingress>
        </Banner>
      )}
      <Container className={classes.page}>
        <div className={classes.left}>
          <SidebarMenu routerPath={router.pathname} />
        </div>
        <main
          id='main'
          className={classes.right}
        >
          {data && (
            <div className={classes.header}>
              <h1 className={classes.title}>{data.title}</h1>
              {data.date && <div className={classes.date}>{data.date}</div>}
            </div>
          )}

          <div
            className={classes.content}
            id='content'
          >
            <MdxContent>{content}</MdxContent>
            <GithubLink className={classes.githubLink} />
          </div>
        </main>
      </Container>
    </div>
  );
};

export { MenuPageLayout };
