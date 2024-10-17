import { Button, Heading, Link, Paragraph } from '@digdir/designsystemet-react';
import { EnvelopeClosedIcon } from '@navikt/aksel-icons';
import { Container, Figma, Github, Slack } from '@repo/components';
import Image from 'next/image';
import NextLink from 'next/link';
import type { ReactNode } from 'react';

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
    prefix: <EnvelopeClosedIcon aria-hidden='true' fontSize='1.5em' />,
  },
  {
    text: 'Bli invitert til slack',
    url: 'https://join.slack.com/t/designsystemet/shared_invite/zt-2438eotl3-a4266Vd2IeqMWO8TBw5PrQ',
    prefix: <Slack />,
  },
  {
    text: 'Github',
    url: 'https://github.com/digdir/designsystemet',
    prefix: <Github />,
  },
  {
    text: 'Figma',
    url: 'https://www.figma.com/@designsystemet',
    prefix: <Figma />,
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
          <Link href={item.url} color='neutral' className={classes.link}>
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
    <footer className={classes.footer} data-ds-color-mode='dark'>
      <div className={classes.top}>
        <Container className={classes.container}>
          <div>
            <Heading size='xs' level={2} className={classes.title}>
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
              <Image
                alt='Mattilsynet logo'
                height={100}
                width={600}
                src='/img/logos/mattilsynet.svg'
              ></Image>
              <Image
                alt='Udir logo'
                height={100}
                width={600}
                src='/img/logos/udir.svg'
                className={classes.udir}
              ></Image>
            </div>
            <Button asChild variant='secondary' color='neutral' size='sm'>
              <NextLink
                href='mailto:designsystem@digdir.no'
                className={classes.button}
              >
                Din etat? Ta kontakt!
              </NextLink>
            </Button>
          </div>
          <div>
            <Heading size='xs' level={2} className={classes.title}>
              Om nettstedet
            </Heading>
            {LinkList(centerLinks)}
          </div>
          <div>
            <Heading size='xs' level={2} className={classes.title}>
              Kom i kontakt med oss
            </Heading>
            {LinkList(rightLinks)}
          </div>
        </Container>
      </div>
      <div className={classes.bottom}>
        <Container>
          <Paragraph size='sm'>© {getCurrentYear()} Designsystemet</Paragraph>
        </Container>
      </div>
    </footer>
  );
};

export { Footer };
