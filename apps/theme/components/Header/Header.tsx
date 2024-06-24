import Link from 'next/link';
import { usePathname } from 'next/navigation';
import cl from 'clsx/lite';

import { Container } from '../Container/Container';

import classes from './Header.module.css';

export const Header = () => {
  const currentPath = usePathname();
  return (
    <header className={classes.header}>
      <Container className={classes.container}>
        <div className={classes.logoContainer}>
          <Link
            href='/'
            className='ds-focus'
            aria-label='Gå til forsiden'
          >
            <img
              src='img/logo.svg'
              alt=''
            />
          </Link>
          <div className={classes.tag}>Beta</div>
        </div>
        <ul className={classes.links}>
          <li className={classes.item}>
            <Link
              className={cl(
                currentPath === '/' ? classes.active : '',
                classes.link,
                'ds-focus',
              )}
              href='/'
            >
              Fargevelger
            </Link>
          </li>
          <li className={classes.item}>
            <Link
              className={cl(
                currentPath === '/testside' ? classes.active : '',
                classes.link,
                'ds-focus',
              )}
              href='/testside'
            >
              Testside
            </Link>
          </li>
          <li className={classes.item}>
            <Link
              className={cl(
                currentPath === '/om-verktoyet' ? classes.active : '',
                classes.link,
                'ds-focus',
              )}
              href='/om-verktoyet'
            >
              Om verktøyet
            </Link>
          </li>
        </ul>
      </Container>
    </header>
  );
};
