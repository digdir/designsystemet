import React from 'react';
import { ImageIcon } from '@navikt/aksel-icons';
import { useRouter } from 'next/router';

import { Container } from '../../components/Container/Container';
import type { NavigationCardProps } from '../../components/NavigationCard/NavigationCard';
import { NavigationCard } from '../../components/NavigationCard/NavigationCard';
import { SidebarMenu } from '../../components/SidebarMenu/SidebarMenu';
import type { PageMenuDataType } from '../../utils/menus/PageMenu';

import classes from './NavigationPageLayout.module.css';

type PageItem = NavigationCardProps;

type PageSection = {
  title: string;
  description: string;
  items: PageItem[];
};

type PageLandingLayoutData = {
  sections: PageSection[];
};

interface PageLandingLayoutProps {
  content: React.ReactNode;
  data: PageLandingLayoutData;
  menu: PageMenuDataType;
}

const NavigationPageLayout = ({
  content,
  data,
  menu,
}: PageLandingLayoutProps) => {
  const router = useRouter();

  return (
    <div>
      <Container className={classes.page}>
        <div className={classes.left}>
          <SidebarMenu routerPath={router.pathname} />
        </div>
        <div className={classes.right}>
          <div className={classes.content}>{content}</div>
          <div className={classes.sections}>
            {data.sections.map((item, index: number) => (
              <div
                className={classes.section}
                key={index}
              >
                <h2>{item.title}</h2>
                <p className={classes['section-desc']}>{item.description}</p>
                <div className={classes['section-cards']}>
                  {item.items.map((item, index: number) => (
                    <NavigationCard
                      backgroundColor='grey'
                      title={item.title}
                      color={item.color}
                      description={item.description}
                      icon={item.icon}
                      url={item.url}
                      key={index}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
};

export { NavigationPageLayout };
export type { PageLandingLayoutData };
