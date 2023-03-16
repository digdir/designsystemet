import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useRouter } from 'next/router';

import Header from '../../components/Header/Header';
import { SidebarMenu } from '../../components/SidebarMenu/SidebarMenu';
import {
  convertQueryToReadable,
  capitalizeString,
} from '../../utils/StringHelpers';
import type { PageMenuDataType } from '../../utils/menus/PageMenu';

import classes from './PageLayout.module.css';

interface PageLayoutProps {
  content: React.ReactNode;
  menu: PageMenuDataType;
  data: PageLayoutData;
}

type PageLayoutData = {
  title: string;
  date: string;
  showMenu: boolean;
};

const PageLayout = ({ content, menu, data }: PageLayoutProps) => {
  const router = useRouter();

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
                activePath={router.pathname}
              />
            </Col>
            <Col
              md={8}
              className={classes.right}
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
