import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';

import Header from '../../components/Header/Header';
import { TableOfContents } from '../../components/TableOfContents/TableOfContents';
import { SidebarMenu } from '../../components/SidebarMenu/SidebarMenu';
import { BetaBlock } from '../../components/BetaBlock/BetaBlock';
import { Controls } from '../../components/Controls/Controls';

import classes from './ComponentLayout.module.css';

interface ComponentLayoutProps {
  Content: React.ReactNode;
  data: any;
}

interface ComponentLayoutData {
  title: string;
  description: string;
  navigationCards: {
    title: string;
    items: any[];
  };
  component: any;
}

const ComponentLayout = ({ Content, data }: ComponentLayoutProps) => {
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
            <Col
              md={8}
              className={classes.tomato}
            >
              <div className={classes.markdown}>
                <h1 className={classes.title}>{data.title}</h1>
                <p className={classes.desc}>{data.description}</p>
                <BetaBlock />
                <div className={classes.links}>
                  <a
                    className={classes.link}
                    href='https://digdir.github.io/designsystem/?path=/story/introduksjon--page'
                    target='_blank'
                    rel='noreferrer'
                  >
                    <img
                      src='/img/logos/storybook-logo.png'
                      alt='Storybook'
                    />
                    Storybook
                  </a>
                  <a
                    className={classes.link}
                    href='https://www.figma.com/file/vpM9dqqQPHqU6ogfKp5tlr/DDS---Core-Components?node-id=6615%3A20148&t=LpnsflBdpz7RnIXx-1'
                    target='_blank'
                    rel='noreferrer'
                  >
                    <img
                      src='/img/logos/figma-logo.png'
                      alt='Figma'
                    />
                    Figma
                  </a>
                  <a
                    className={classes.link}
                    href='https://github.com/digdir/designsystem'
                    target='_blank'
                    rel='noreferrer'
                  >
                    <img
                      src='/img/logos/github-logo.svg'
                      alt='Github'
                    />
                    Github
                  </a>
                  <a
                    className={classes.link}
                    href='https://digdir.github.io/designsystem/?path=/docs/endringslogger-kjernekomponenter--page'
                    target='_blank'
                    rel='noreferrer'
                  >
                    <img
                      src='/img/logos/changelog-logo.png'
                      alt='Endringslogg'
                    />
                    Endringslogg
                  </a>
                </div>
                <Controls
                  component={data.component}
                  argTypes={data.argTypes}
                />
                {Content}
              </div>
            </Col>
            <Col md={2}>
              <div>
                <TableOfContents />
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export { ComponentLayout };
export type { ComponentLayoutData };
