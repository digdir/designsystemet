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
  content: React.ReactNode;
  menu: {
    title: string;
    children: [];
  };
  data: {
    title: string;
    date: string;
    showMenu: boolean;
  };
}

const PageLayout = ({ content, menu, data }: PageLayoutProps) => {
  return (
    <div>
      <Header />
      <main className={classes.page}>
        <Container>
          <Row>
            <Col md={2}>
              <SidebarMenu
                title={capitalizeString(convertQueryToReadable(menu.title))}
                menu={menu}
              />
            </Col>
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
                  <div className={classes.content}>{content}</div>
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
