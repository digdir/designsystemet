import React from 'react';
import { useRouter } from 'next/router';

import { Container, SidebarMenu, MdxContent } from '../../components';
import type { NavigationCardProps } from '../../components/NavigationCard/NavigationCard';

import classes from './NavigationPageLayout.module.css';

type PageItem = NavigationCardProps;

type PageSection = {
  title: string;
  description: string;
  items: PageItem[];
};

interface PageLandingLayoutProps {
  content: React.ReactNode;
}

const NavigationPageLayout = ({ content }: PageLandingLayoutProps) => {
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
          <div className={classes.content}>
            <MdxContent>{content}</MdxContent>
          </div>
        </main>
      </Container>
    </div>
  );
};

export { NavigationPageLayout };
