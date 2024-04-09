import type * as React from 'react';
import { useRouter } from 'next/router';

import { Container, SidebarMenu, MdxContent } from '../../components';
import { Banner } from '../../components/SubPages/Banner/Banner';

import classes from './NavMenuPageLayout.module.css';

type NavMenuPageLayoutProps = {
  content: React.ReactNode;
  banner?: {
    color: 'blue' | 'red' | 'yellow';
    title: string;
    ingress?: string;
    icon: React.ReactNode;
  };
};

const NavMenuPageLayout = ({ content, banner }: NavMenuPageLayoutProps) => {
  const router = useRouter();

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
