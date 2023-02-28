import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Picture, Wrench, System } from '@navikt/ds-icons';

import NavigationCard from '../../components/NavigationCard/NavigationCard';
import Header from '../../components/Header/Header';
import { SidebarMenu } from '../../components/SidebarMenu/SidebarMenu';

import classes from './NavigationPageLayout.module.css';

interface PageLandingLayoutProps {
  Content: React.ReactNode;
  data: any;
  menu: any;
}

interface PageLandingLayoutData {
  title: string;
  description: string;
  items: any[];
}

const NavigationPageLayout = ({
  Content,
  data,
  menu,
}: PageLandingLayoutProps) => {
  return (
    <div>
      <Header />
      {Content}
      <div className={classes.content}>
        <Container>
          <Row>
            <Col md={2}>
              {/*<SidebarMenu*/}
              {/*  title='ff'*/}
              {/*  items={menu}*/}
              {/*/>*/}

              <div>
                {menu.items.map((item, index) => (
                  <div>
                    <div>{item.name}</div>
                    <div>
                      {item.children &&
                        item.children.map((item2, index2) => (
                          <div>
                            <div>--{item2.name}</div>
                            <div>
                              {item2.children &&
                                item2.children.map((item3, index3) => (
                                  <div>
                                    <div>----{item3.name}</div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </Col>
            <Col
              md={10}
              className={classes.test}
            >
              <h1 className={classes.title}>{data.title}</h1>
              <p className={classes.desc}>{data.description}</p>

              <div className={classes.sections}>
                {data.sections.map((item: any, index: number) => (
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
                      {item.items.map((item: any, index: number) => (
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
