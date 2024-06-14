import type { ReactNode } from 'react';
import Image from 'next/image';
import { EnvelopeClosedIcon } from '@navikt/aksel-icons';
import NextLink from 'next/link';
import { Heading, Paragraph, Link } from '@digdir/designsystemet-react';
import cl from 'clsx/lite';

import { Container } from '../Container/Container';

import classes from './Footer.module.css';

const centerLinks = [
  {
    text: 'Om designsystemet',
    url: '/grunnleggende/introduksjon/om-designsystemet',
  },
  {
    text: 'Personvernerklæring',
    url: '/grunnleggende/personvernerklaering',
  },
  {
    text: 'Tilgjengelighetserklæring',
    url: 'https://uustatus.no/nb/erklaringer/publisert/faeb324d-9b3f-40b0-b715-92cac356a916',
  },
];

const rightLinks = [
  {
    text: 'designsystem@digdir.no',
    url: 'mailto:designsystem@digdir.no',
    prefix: (
      <EnvelopeClosedIcon
        aria-hidden='true'
        fontSize='1.5em'
      />
    ),
  },
  {
    text: 'Bli invitert til slack',
    url: 'https://join.slack.com/t/designsystemet/shared_invite/zt-2438eotl3-a4266Vd2IeqMWO8TBw5PrQ',
    prefix: (
      <Image
        height={20}
        width={20}
        alt=''
        src='/img/logos/slack-negative.png'
      />
    ),
  },
  {
    text: 'Github',
    url: 'https://github.com/digdir/designsystemet',
    prefix: (
      <Image
        height={20}
        width={20}
        alt=''
        src='/img/logos/github-negative.png'
      />
    ),
  },
  {
    text: 'Figma',
    url: 'https://www.figma.com/@designsystemet',
    prefix: (
      <Image
        height={20}
        width={20}
        alt=''
        src='/img/logos/figma-negative.png'
      />
    ),
  },
];

type LinkListItemProps = {
  text: string;
  url: string;
  prefix?: ReactNode;
};

const getCurrentYear = () => {
  const date = new Date();
  return date.getFullYear();
};

const LinkList = (links: LinkListItemProps[]) => {
  return (
    <ul className={classes.links}>
      {links.map((item, index) => (
        <li key={index}>
          <Link
            href={item.url}
            color='neutral'
          >
            {item.prefix}
            {item.text}
          </Link>
        </li>
      ))}
    </ul>
  );
};

const Footer = () => {
  return (
    <footer
      className={classes.footer}
      data-ds-color-mode='dark'
    >
      <div className={classes.top}>
        <Container className={classes.container}>
          <div>
            <Heading
              size='xs'
              level={2}
              className={classes.title}
            >
              Lages på tvers av offentlige etater:
            </Heading>
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
            <NextLink
              href='mailto:designsystem@digdir.no'
              className={cl(classes.button, 'ds-paragraph-short--sm')}
            >
              Din etat? Ta kontakt!
            </NextLink>
          </div>
          <div>
            <Heading
              size='xs'
              level={2}
              className={classes.title}
            >
              Om nettstedet
            </Heading>
            {LinkList(centerLinks)}
          </div>
          <div>
            <Heading
              size='xs'
              level={2}
              className={classes.title}
            >
              Kom i kontakt med oss
            </Heading>
            {LinkList(rightLinks)}
          </div>
        </Container>
      </div>
      <div className={cl(classes.bottom, 'ds-paragraph--sm')}>
        <Container>
          <Paragraph>© {getCurrentYear()} Designsystemet</Paragraph>
        </Container>
      </div>
    </footer>
  );
};

export { Footer };
