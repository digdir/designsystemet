import React from 'react';
import { Col, Row, Container } from 'react-bootstrap';

import classes from './ImageSection.module.css';

interface ImageSectionProps {
  title: string;
  description: string;
  src: string;
  content?: React.ReactNode;
  id?: string;
}

const ImageSection = ({
  title,
  description,
  src,
  content,
  id,
}: ImageSectionProps) => {
  return (
    <div
      className={classes.section}
      id={id}
    >
      <Container>
        <Row className='justify-content-center align-items-center'>
          <Col md={4}>
            <img
              className={classes.img}
              src={src}
              alt='Image'
            />
          </Col>
          <Col md={1}></Col>
          <Col md={7}>
            <h2 className={classes.title}>{title}</h2>
            <p className={classes.desc}>{description}</p>
            {content && content}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export { ImageSection };
