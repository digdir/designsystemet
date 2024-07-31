'use client';
import type * as React from 'react';
import { Heading } from '@digdir/designsystemet-react';
import { ComponentIcon } from '@navikt/aksel-icons';
import cn from 'clsx/lite';
import { usePathname } from 'next/navigation';
import { Container } from '@repo/components';

import {
  Banner,
  BannerHeading,
  BannerIcon,
  BannerIngress,
} from '../../components/Banner/Banner';
import { SidebarMenu, MdxContent, GithubLink } from '../../components';

import classes from './MenuPageLayout.module.css';

type PageLayoutProps = {
  content: React.ReactNode;
  data?: PageLayoutData;
  banner?: {
    color: 'blue' | 'red' | 'yellow';
    title: string;
    ingress?: string;
    icon?: React.ReactNode;
  };
};

type PageLayoutData = {
  title: string;
  date: string;
  icon: React.ReactNode;
  color: 'blue' | 'red' | 'yellow' | 'grey';
};

const MenuPageLayout = ({ content, data, banner }: PageLayoutProps) => {
  const pathname = usePathname();

  return (
    <div>
      {banner && (
        <Banner color={banner.color}>
          <BannerIcon>{banner.icon}</BannerIcon>
          <BannerHeading>{banner.title}</BannerHeading>
          {banner.ingress && <BannerIngress>{banner.ingress}</BannerIngress>}
        </Banner>
      )}
      <Container className={classes.page}>
        <div className={classes.left}>
          <SidebarMenu routerPath={pathname} />
        </div>
        <main id='main' className={classes.right}>
          {data && (
            <div className={classes.header}>
              <div className={classes.headerText}>
                <Heading size='lg' className={classes.title}>
                  {data.title}
                </Heading>
                {data.date && <div className={classes.date}>{data.date}</div>}
              </div>
              <div
                className={cn(
                  classes.iconContainer,
                  data.color === 'red' && classes.red,
                  data.color === 'blue' && classes.blue,
                  data.color === 'yellow' && classes.yellow,
                )}
              >
                {data.icon && data.icon}
                {!data.icon && <ComponentIcon fontSize='4rem' />}
              </div>
            </div>
          )}

          <div className={classes.content} id='content'>
            <MdxContent>{content}</MdxContent>
            <GithubLink className={classes.githubLink} />
          </div>
        </main>
      </Container>
    </div>
  );
};

export { MenuPageLayout };
