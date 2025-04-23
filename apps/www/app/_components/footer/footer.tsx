import { Button, Heading, Paragraph } from '@digdir/designsystemet-react';
import cl from 'clsx/lite';
import { type ReactNode, forwardRef } from 'react';
import { RRLink } from '../link';
import { Bronnoysund } from '../logos/bronnoysund';
import { Digdir } from '../logos/digdir';
import { KsDigital } from '../logos/ks-digital';
import { Mattilsynet } from '../logos/mattilsynet';
import { Udir } from '../logos/udir';
import classes from './footer.module.css';

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
          <RRLink data-color='neutral' className={classes.link} to={item.url}>
            {item.prefix}
            {item.text}
          </RRLink>
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
        <div className={classes.container}>
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
              <a
                href='mailto:designsystem@digdir.no'
                className={classes.button}
              >
                Din etat? Ta kontakt!
              </a>
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
        </div>
      </div>
      <div className={classes.bottom}>
        <div>
          <Paragraph data-size='sm'>
            © {getCurrentYear()} Designsystemet
          </Paragraph>
        </div>
      </div>
    </footer>
  );
});
