import type * as React from 'react';
import { useRouter } from 'next/router';
import { Heading } from '@digdir/design-system-react';

import GithubLink from 'components/Link/Github/GithubLink';
import { Banner } from 'components/SubPages/Banner/Banner';

import { TokenIcon, TeddyBearIcon, HardHatIcon } from '@navikt/aksel-icons';

import { Container, SidebarMenu, MdxContent } from '../../components';

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
};

const MenuPageLayout = ({ content, data, banner }: PageLayoutProps) => {
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
          {data && (
            <div className={classes.header}>
              <div className={classes.headerText}>
                <Heading
                  size='large'
                  className={classes.title}
                >
                  {data.title}
                </Heading>
                {data.date && <div className={classes.date}>{data.date}</div>}
              </div>
              <div className={classes.headerAnchor}>
                {data.icon && data.icon}
                {!data.icon && (
                  <HardHatIcon
                    title='a11y-title'
                    fontSize='4rem'
                  />
                )}
              </div>
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
