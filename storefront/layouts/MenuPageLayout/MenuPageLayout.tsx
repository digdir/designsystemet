import React from 'react';
import { useRouter } from 'next/router';

import { Container, SidebarMenu, MdxContent } from '../../components';

import classes from './MenuPageLayout.module.css';

interface PageLayoutProps {
  content: React.ReactNode;
  data: PageLayoutData;
}

type PageLayoutData = {
  title: string;
  date: string;
  showMenu: boolean;
};

const MenuPageLayout = ({ content, data }: PageLayoutProps) => {
  const router = useRouter();

  return (
    <div>
      <Container className={classes.page}>
        <div className={classes.left}>
          <SidebarMenu routerPath={router.pathname} />
        </div>
        <div className={classes.right}>
          <div className={classes.header}>
            <h1 className={classes.title}>{data.title}</h1>
            {data.date && <div className={classes.date}>{data.date}</div>}
          </div>

          <div className={classes.content}>
            <MdxContent>{content}</MdxContent>
          </div>
        </div>
      </Container>
    </div>
  );
};

export { MenuPageLayout };
