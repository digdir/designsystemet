import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import Link from 'next/link';
import Image from 'next/image';

import { capitalizeString } from '../../utils/StringHelpers';
import Header from '../../components/Header/Header';
import { SidebarMenu } from '../../components/SidebarMenu/SidebarMenu';

import classes from './ComponentsLayout.module.css';

interface ComponentsLayoutProps {
  Content: React.ReactNode;
  data: any;
  menu: any;
}

const ComponentsLayout = ({ Content, data, menu }: ComponentsLayoutProps) => {
  return (
    <div>
      <Header />
      <div className={classes.content}>
        <Container>
          <Row>
            <Col md={2}>
              <div className={classes.menus}>
                <SidebarMenu
                  title='Komponenter'
                  items={menu}
                />
              </div>
            </Col>
            <Col md={9}>
              <div>
                <h1 className={classes.title}>{data.title}</h1>
                <p className={classes.desc}>{data.description}</p>
                <div className={classes.items}>
                  {menu.map((item: any, index: number) => (
                    <Link
                      href={'/' + item.url}
                      className={classes.box}
                      key={index}
                    >
                      <div className={classes.container}>
                        <Image
                          src={'/img/component-previews/' + item.title + '.png'}
                          alt=''
                        />
                      </div>
                      <div className={classes.name}>
                        {capitalizeString(item.title)}
                      </div>
                    </Link>
                  ))}
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
