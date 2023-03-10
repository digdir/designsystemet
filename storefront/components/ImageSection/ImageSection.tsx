import React from 'react';
import { Col, Row, Container } from 'react-bootstrap';
import Image from 'next/image';

import classes from './ImageSection.module.css';

interface ImageSectionProps {
  title: string;
  description: string;
  src: string;
  content?: React.ReactNode;
  id?: string;
  width: number;
  height: number;
}

const ImageSection = ({
  title,
  description,
  src,
  content,
  id,
  width,
  height,
}: ImageSectionProps) => {
  return (
    <div
      className={classes.section}
      id={id}
    >
      <Container>
        <Row className='justify-content-center align-items-center'>
          <Col md={4}>
            <Image
              className={classes.img}
              src={src}
              alt='section'
              height={height}
              width={width}
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
