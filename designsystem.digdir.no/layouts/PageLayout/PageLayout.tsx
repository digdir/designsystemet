import Header from '../../components/Header/Header';
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { SidebarMenu } from '../../components/SidebarMenu/SidebarMenu';

import classes from './PageLayout.module.css';

interface PageLayoutProps {
  Content: React.ReactNode;
  menu: any;
}

const PageLayout = ({ Content, menu }: PageLayoutProps) => {
  return (
    <div>
      <Header />
      <main className={classes.content}>
        <Container>
          <Row>
            <Col md={2}>
              <SidebarMenu
                title='God praksis'
                items={menu}
              />
            </Col>
            <Col
              md={7}
              className={classes.test}
            >
              {Content}
            </Col>
          </Row>
        </Container>
      </main>
    </div>
  );
};

export default PageLayout;
