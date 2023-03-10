import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import cn from 'classnames';
// import { Button, ButtonSize } from '@digdir/design-system-react';

import { Tag } from '../Tag/Tag';

import classes from './Banner.module.css';

interface BannerProps {
  title: string;
  desc: string;
}

const Banner = ({ title, desc }: BannerProps) => {
  return (
    <div className={classes.banner}>
      <Container className={classes.container}>
        <Row className='align-items-center justify-content-center h-100'>
          <Col
            md={12}
            lg={7}
          >
            <div>
              <h1 className={classes.title}>
                {title}{' '}
                <Tag
                  type='Beta'
                  color='purple'
                  size='large'
                />
              </h1>
              <p className={classes.desc}>{desc}</p>
              {/*<Button*/}
              {/*  className={classes.button}*/}
              {/*  size={ButtonSize.Medium}*/}
              {/*  onClick={() => {*/}
              {/*    const loc = document.location.toString().split('#')[0];*/}
              {/*    document.location = loc + '#bidra';*/}
              {/*    return false;*/}
              {/*  }}*/}
              {/*>*/}
              {/*  Bli med på samarbeidet*/}
              {/*</Button>*/}
            </div>
          </Col>
          <Col
            md={12}
            lg={5}
          >
            <div className={classes.imgContainer}>
              {/*<img src="img.png" alt=""/>*/}
              <div className={classes.shapes}>
                <div className={cn(classes.shape, classes.one)}></div>
                <div className={cn(classes.shape, classes.two)}></div>
                <div className={cn(classes.shape, classes.three)}></div>
                <div className={cn(classes.shape, classes.four)}></div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Banner;
