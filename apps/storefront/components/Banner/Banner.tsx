import cl from 'clsx';

import { Tag } from '../Tag/Tag';
import { Container } from '../Container/Container';

import classes from './Banner.module.css';

interface BannerProps {
  title: string;
  desc: string;
}

const Banner = ({ title, desc }: BannerProps) => {
  return (
    <Container className={classes.banner}>
      <div className={classes.left}>
        <h1 className={classes.title}>
          {title}{' '}
          <Tag
            type='Beta'
            color='purple'
            size='large'
          />
        </h1>
        <p className={classes.desc}>{desc}</p>
      </div>

      <div className={classes.right}>
        <div className={classes.shapes}>
          <div className={cl(classes.shape, classes.one)}></div>
          <div className={cl(classes.shape, classes.two)}></div>
          <div className={cl(classes.shape, classes.three)}></div>
          <div className={cl(classes.shape, classes.four)}></div>
        </div>
      </div>
    </Container>
  );
};

export { Banner };
