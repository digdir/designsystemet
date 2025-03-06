import { Button, Heading, Link, Paragraph } from '@digdir/designsystemet-react';
import cl from 'clsx/lite';
import NextLink from 'next/link';
import { type ReactNode, forwardRef } from 'react';
import { Container } from '../';

import { Bronnoysund } from '../logos/Bronnoysund';
import { Digdir } from '../logos/Digdir';
import { KsDigital } from '../logos/KsDigital';
import { Mattilsynet } from '../logos/Mattilsynet';
import { Udir } from '../logos/Udir';
import classes from './Footer.module.css';

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
          <Link data-color='neutral' className={classes.link} asChild>
            <NextLink href={item.url}>
              {item.prefix}
              {item.text}
            </NextLink>
          </Link>
        </li>
      ))}
    </ul>
  );
};
type FooterProps = {
  centerLinks: LinkListItemProps[];
  rightLinks: LinkListItemProps[];
} & React.HTMLAttributes<HTMLElement>;

export const Footer = forwardRef<HTMLElement, FooterProps>(function Footer(
  { centerLinks, rightLinks, className, ...rest },
  ref,
) {
  return (
    <footer
      ref={ref}
      className={cl(classes.footer, className)}
      data-color-scheme='dark'
      {...rest}
    >
      <div className={classes.top}>
        <Container className={classes.container}>
          <div>
            <Heading data-size='xs' level={2} className={classes.title}>
              Lages på tvers av offentlige etater:
            </Heading>
            <div className={classes.logos}>
              <Digdir />
              <Bronnoysund />
              <Mattilsynet />
              <Udir className={classes.udir} />
              <KsDigital />
            </div>
            <Button
              asChild
              variant='secondary'
              data-color='neutral'
              data-size='sm'
            >
              <NextLink
                href='mailto:designsystem@digdir.no'
                className={classes.button}
              >
                Din etat? Ta kontakt!
              </NextLink>
            </Button>
          </div>
          <div>
            <Heading data-size='xs' level={2} className={classes.title}>
              Om nettstedet
            </Heading>
            {LinkList(centerLinks)}
          </div>
          <div>
            <Heading data-size='xs' level={2} className={classes.title}>
              Kom i kontakt med oss
            </Heading>
            {LinkList(rightLinks)}
          </div>
        </Container>
      </div>
      <div className={classes.bottom}>
        <Container>
          <Paragraph data-size='sm'>
            © {getCurrentYear()} Designsystemet
          </Paragraph>
        </Container>
      </div>
    </footer>
  );
});
