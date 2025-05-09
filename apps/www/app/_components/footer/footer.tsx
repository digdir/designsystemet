import { Button, Heading, Paragraph } from '@digdir/designsystemet-react';
import cl from 'clsx/lite';
import { type ReactNode, forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ContentContainer } from '../content-container/content-container';
import { RRLink } from '../link';
import { Bronnoysund } from '../logos/bronnoysund';
import { Digdir } from '../logos/digdir';
import { KsDigital } from '../logos/ks-digital';
import { Mattilsynet } from '../logos/mattilsynet';
import { Udir } from '../logos/udir';
import classes from './footer.module.css';

export type FooterLinkListItemProps = {
  text: TemplateStringsArray;
  url: string;
  prefix?: ReactNode;
};

const getCurrentYear = () => {
  const date = new Date();
  return date.getFullYear();
};

const LinkList = (links: FooterLinkListItemProps[]) => {
  const { t } = useTranslation();

  return (
    <ul className={classes.links}>
      {links.map((item, index) => (
        <li key={index}>
          <RRLink data-color='neutral' className={classes.link} to={item.url}>
            {item.prefix}
            {t(item.text)}
          </RRLink>
        </li>
      ))}
    </ul>
  );
};
type FooterProps = {
  centerLinks: FooterLinkListItemProps[];
  rightLinks: FooterLinkListItemProps[];
} & React.HTMLAttributes<HTMLElement>;

export const Footer = forwardRef<HTMLElement, FooterProps>(function Footer(
  { centerLinks, rightLinks, className, ...rest },
  ref,
) {
  const { t } = useTranslation();

  return (
    <footer
      ref={ref}
      className={cl(classes.footer, className)}
      data-color-scheme='dark'
      {...rest}
    >
      <div className={classes.top}>
        <ContentContainer className={classes.container}>
          <div>
            <Heading data-size='xs' level={2} className={classes.title}>
              {t('footer.agencies.title')}
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
                {t('footer.agencies.contact')}
              </a>
            </Button>
          </div>
          <div>
            <Heading data-size='xs' level={2} className={classes.title}>
              {t('footer.about-site')}
            </Heading>
            {LinkList(centerLinks)}
          </div>
          <div>
            <Heading data-size='xs' level={2} className={classes.title}>
              {t('footer.contact-us')}
            </Heading>
            {LinkList(rightLinks)}
          </div>
        </ContentContainer>
      </div>
      <div className={classes.bottom}>
        <ContentContainer>
          <Paragraph data-size='sm'>
            © {getCurrentYear()} {t('footer.copyright')}
          </Paragraph>
        </ContentContainer>
      </div>
    </footer>
  );
});
