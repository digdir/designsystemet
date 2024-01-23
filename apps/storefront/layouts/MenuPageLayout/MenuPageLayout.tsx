import React from 'react';
import { useRouter } from 'next/router';

import GithubLink from 'components/Link/Github/GithubLink';

import { Container, SidebarMenu, MdxContent } from '../../components';

import classes from './MenuPageLayout.module.css';

type PageLayoutProps = {
  content: React.ReactNode;
  data: PageLayoutData;
};

type PageLayoutData = {
  title: string;
  date: string;
};

const MenuPageLayout = ({ content, data }: PageLayoutProps) => {
  const router = useRouter();

  return (
    <div>
      <Container className={classes.page}>
        <div className={classes.left}>
          <SidebarMenu routerPath={router.pathname} />
        </div>
        <main
          id='main'
          className={classes.right}
        >
          <div className={classes.header}>
            <h1 className={classes.title}>{data.title}</h1>
            {data.date && <div className={classes.date}>{data.date}</div>}
          </div>

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
