import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Picture } from '@navikt/ds-icons';

import type { NavigationCardProps } from '../../components/NavigationCard/NavigationCard';
import { NavigationCard } from '../../components/NavigationCard/NavigationCard';
import Header from '../../components/Header/Header';
import { SidebarMenu } from '../../components/SidebarMenu/SidebarMenu';

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

type MenuData = {
  title: string;
  children: MenuItem[];
};

type MenuItem = {
  name: string;
  children: MenuItem[];
  path: string;
};

interface PageLandingLayoutProps {
  Content: React.ReactNode;
  data: PageLandingLayoutData;
  menu: MenuData;
}

const NavigationPageLayout = ({
  Content,
  data,
  menu,
}: PageLandingLayoutProps) => {
  return (
    <div>
      <Header />
      <div className={classes.page}>
        <Container>
          <Row>
            <Col md={2}>
              <SidebarMenu
                title={menu.title}
                menu={menu}
              />
            </Col>
            <Col
              md={10}
              className={classes.test}
            >
              <div className={classes.content}>{Content}</div>
              <div className={classes.sections}>
                {data.sections.map((item, index: number) => (
                  <div
                    className={classes.section}
                    key={index}
                  >
                    <h2>{item.title}</h2>
                    <p className={classes['section-desc']}>
                      {item.description}
                    </p>
                    <Row
                      className='gy-4'
                      key={index}
                    >
                      {item.items.map((item, index: number) => (
                        <Col
                          key={index}
                          md={4}
                        >
                          <NavigationCard
                            backgroundColor='grey'
                            title={item.title}
                            color={item.color}
                            description='dd'
                            icon={<Picture fontSize={28} />}
                            url={item.url}
                          />
                        </Col>
                      ))}
                    </Row>
                  </div>
                ))}
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export { NavigationPageLayout };
export type { PageLandingLayoutData };
