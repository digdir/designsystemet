import { Heading, Link, Paragraph } from '@digdir/designsystemet-react';
import cl from 'clsx/lite';
import { forwardRef, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { RRLink } from '../link';
import { DsFullNeutralLogo } from '../logos/designsystemet';
import { DpgBadgeWhite } from '../logos/dpg';
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
    <footer ref={ref} className={cl(classes.footer, className)} {...rest}>
      <div className={classes.container}>
        <div>
          <DsFullNeutralLogo className={classes.logo} />
          <Paragraph
            data-size='sm'
            variant='long'
            className={classes.description}
          >
            {t('footer.description')}
          </Paragraph>
        </div>
        <div>
          <Heading data-size='2xs' level={2} className={classes.title}>
            {t('footer.about-site')}
          </Heading>
          {LinkList(centerLinks)}
        </div>
        <div>
          <Heading data-size='2xs' level={2} className={classes.title}>
            {t('footer.contact-us')}
          </Heading>
          {LinkList(rightLinks)}
        </div>
      </div>
      <div className={classes.bottom}>
        <div className={classes.bottomContainer}>
          <Paragraph data-size='sm' className={classes.copyright}>
            © {getCurrentYear()} {t('footer.copyright')}
          </Paragraph>
          <Link
            href='https://www.digitalpublicgoods.net/r/designsystemet'
            aria-label={t('footer.dpg-aria-label')}
          >
            <DpgBadgeWhite className={classes.dpgBadge} />
          </Link>
        </div>
      </div>
    </footer>
  );
});
