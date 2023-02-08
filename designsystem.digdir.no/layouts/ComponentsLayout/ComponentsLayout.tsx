import fs from 'fs';
import path from 'path';

import { GetServerSideProps } from 'next';
import React, { useEffect } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import Link from 'next/link';

import Header from '../../components/Header/Header';
import { SidebarMenu } from '../../components/SidebarMenu/SidebarMenu';

import classes from './ComponentsLayout.module.css';

interface ComponentsLayoutProps {
  Content: React.ReactNode;
  data: any;
}

export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
}

const ComponentsLayout = ({ Content, data }: ComponentsLayoutProps) => {
  return (
    <div>
      <Header />
      <div className={classes.content}>
        <Container>
          <Row>
            <Col md={2}>
              <div className={classes.menus}>
                <SidebarMenu title='Komponenter' />
              </div>
            </Col>
            <Col md={9}>
              <div>
                <h1 className={classes.title}>{data.title}</h1>
                <p className={classes.desc}>{data.description}</p>
                <div className={classes.items}>
                  <Link
                    href='/komponenter/button'
                    className={classes.box}
                  >
                    <div className={classes.container}>
                      <img
                        src={'/img/component-previews/button.png'}
                        alt=''
                      />
                    </div>
                    <div className={classes.name}>Button</div>
                  </Link>
                  <Link
                    href='/komponenter/checkbox'
                    className={classes.box}
                  >
                    <div className={classes.container}>
                      <img
                        src={'/img/component-previews/checkbox.png'}
                        alt=''
                      />
                    </div>
                    <div className={classes.name}>Checkbox</div>
                  </Link>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      {Content}
    </div>
  );
};

export { ComponentsLayout };
