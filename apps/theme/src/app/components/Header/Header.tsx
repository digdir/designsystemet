import { Container } from 'react-bootstrap';
import Link from 'next/link';
import classes from './Header.module.css';
import { usePathname } from 'next/navigation';

import classes from "./Header.module.css";

export const Header = () => {
  const currentPath = usePathname();
  return (
    <header className={classes.header}>
      <Container className={classes.container}>
        <div className={classes.logoContainer}>
          <Link href='/'>
            <img
              src='img/logo.svg'
              alt=''
            />
          </Link>
          <div className={classes.tag}>Beta</div>
        </div>
        <div className={classes.links}>
          <Link
            className={currentPath === '/' ? classes.active : ''}
            href='/'
          >
            Fargevelger
          </Link>
          <Link
            className={currentPath === '/scale-list' ? classes.active : ''}
            href='/scale-list'
          >
            Liste over fargeskalaer
          </Link>
          <Link
            className={currentPath === '/om-verktoyet' ? classes.active : ''}
            href='/om-verktoyet'
          >
            Om verktøyet
          </Link>
        </div>
      </Container>
    </header>
  );
};
