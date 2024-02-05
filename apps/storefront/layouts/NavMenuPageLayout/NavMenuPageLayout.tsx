import type * as React from 'react';
import { useRouter } from 'next/router';

import { Container, SidebarMenu, MdxContent } from '../../components';

import classes from './NavMenuPageLayout.module.css';

type NavMenuPageLayoutProps = {
  content: React.ReactNode;
};

const NavMenuPageLayout = ({ content }: NavMenuPageLayoutProps) => {
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

export { NavMenuPageLayout };
