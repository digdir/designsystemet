import React from 'react';
import Image from 'next/image';

import { Container } from '../Container/Container';
import { Link } from '../Link/Link';

import classes from './Footer.module.css';
import { EnvelopeClosedIcon, BranchingIcon } from '@navikt/aksel-icons';

const Footer = () => {
  return (
    <footer className={classes.footer}>
      <div className={classes.top}>
        <Container className={classes.container}>
          <div>
            <h2 className={classes.title}>
              Lages på tvers av offentlig stater:
            </h2>
            <div className={classes.logos}>
              <Image
                alt='Digdir logo'
                height={100}
                width={600}
                src='/img/logos/digdir-negative.svg'
              ></Image>
              <Image
                alt='Brønnøysund logo'
                height={100}
                width={600}
                src='/img/logos/bronnoysund.svg'
              ></Image>
            </div>
          </div>
          <div>
            <h2 className={classes.title}>Om nettstedet</h2>
            <ul className={classes.links}>
              <li>
                <Link href='#'>Om designsystemet</Link>
              </li>
              <li>
                <Link href='#'>Personvernerklæring</Link>
              </li>
              <li>
                <Link href='#'>Tilgjengelighetserklæring</Link>
              </li>
            </ul>
          </div>
          <div>
            <h2 className={classes.title}>Kom i kontakt med oss</h2>
            <ul className={classes.links}>
              <li>
                <Link
                  prefix={<EnvelopeClosedIcon title='a11y-title' />}
                  href='#'
                >
                  designsystem@digdir.no
                </Link>
              </li>
              <li>
                <Link
                  prefix={
                    <Image
                      height={20}
                      width={20}
                      alt='f'
                      src='/img/logos/slack-negative.png'
                    />
                  }
                  href='#'
                >
                  Bli invitert til Slack
                </Link>
              </li>
              <li>
                <Link
                  prefix={
                    <Image
                      height={20}
                      width={20}
                      alt='f'
                      src='/img/logos/github-negative.png'
                    />
                  }
                  href='#'
                >
                  Github
                </Link>
              </li>
              <li>
                <Link
                  prefix={
                    <Image
                      height={20}
                      width={20}
                      alt='f'
                      src='/img/logos/figma-negative.png'
                    />
                  }
                  href='#'
                >
                  Figma
                </Link>
              </li>
            </ul>
          </div>
        </Container>
      </div>
      <div className={classes.bottom}>
        <Container>© 2023 Designsystemet</Container>
      </div>
    </footer>
  );
};

export { Footer };
