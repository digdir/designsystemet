import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

import Header from '../../components/Header/Header';
import { SidebarMenu } from '../../components/SidebarMenu/SidebarMenu';
import {
  convertQueryToReadable,
  capitalizeString,
} from '../../utils/StringHelpers';

import classes from './PageLayout.module.css';

interface PageLayoutProps {
  Content: React.ReactNode;
  menu: any;
  data: any;
}

const PageLayout = ({ Content, menu, data }: PageLayoutProps) => {
  return (
    <div>
      <Header />
      <main className={classes.page}>
        <Container>
          <Row className='justify-content-center'>
            {menu.showMenu && (
              <Col md={2}>
                <SidebarMenu
                  title={capitalizeString(convertQueryToReadable(menu.title))}
                  items={menu.items}
                />
              </Col>
            )}
            <Col
              md={8}
              className={classes.test}
            >
              <div className={classes.header}>
                <h1 className={classes.title}>{data.title}</h1>
                {data.date && <div className={classes.date}>{data.date}</div>}
              </div>

              <Row>
                <Col md={11}>
                  <div className={classes.content}>{Content}</div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </main>
    </div>
  );
};

export { PageLayout };
