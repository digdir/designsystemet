'use client';
import type * as React from 'react';
import { useRouter } from 'next/router';

import { Container, SidebarMenu, MdxContent } from '../../components';
import {
  Banner,
  BannerHeading,
  BannerIcon,
  BannerIngress,
} from '../../components/SubPages/Banner/Banner';

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
    <div className={classes.outerPage}>
      {banner && (
        <Banner color={banner.color}>
          <BannerIcon>{banner.icon}</BannerIcon>
          <BannerHeading>{banner.title}</BannerHeading>
          {banner.ingress && <BannerIngress>{banner.ingress}</BannerIngress>}
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
          <div>
            <MdxContent>{content}</MdxContent>
          </div>
        </main>
      </Container>
    </div>
  );
};

export { NavMenuPageLayout };
