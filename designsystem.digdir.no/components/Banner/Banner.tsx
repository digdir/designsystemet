import { Container, Row, Col } from 'react-bootstrap';
import cn from 'classnames';

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
            lg={6}
          >
            <div>
              <h1 className={classes.title}>{title}</h1>
              <p className={classes.desc}>{desc}</p>
            </div>
          </Col>
          <Col lg={1}></Col>
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
