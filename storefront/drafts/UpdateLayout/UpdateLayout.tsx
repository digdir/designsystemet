import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

import Header from '../../components/Header/Header';

import classes from './UpdateLayout.module.css';

interface PageLayoutProps {
  Content: React.ReactNode;
}

const UpdateLayout = ({ Content }: PageLayoutProps) => {
  return (
    <div>
      <Header />
      <main className={classes.content}>
        <Container>
          <Row>
            <Col
              md={8}
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

export default UpdateLayout;
