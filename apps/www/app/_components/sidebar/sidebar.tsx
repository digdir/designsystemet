import { Button, Link, Paragraph } from '@digdir/designsystemet-react';
import { ChevronRightLastIcon, XMarkIcon } from '@navikt/aksel-icons';
import cl from 'clsx/lite';
import { type HTMLAttributes, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router';
import classes from './sidebar.module.css';

export type SidebarProps = {
  cats: {
    [key: string]: {
      title: string;
      url: string;
    }[];
  };
  title: string;
  hideCatTitle?: boolean;
  /**
   * mapped list of suffixes to it's category key
   */
  suffix?: {
    [categoryKey: string]: string;
  };
} & HTMLAttributes<HTMLDivElement>;

export const Sidebar = ({
  cats,
  title,
  hideCatTitle = false,
  suffix = {},
  className,
  ...props
}: SidebarProps) => {
  const { t } = useTranslation();
  const closeMenuRef = useRef<HTMLButtonElement>(null);

  return (
    <div
      className={cl(className, 'l-sidebar-left', classes.sidebar)}
      {...props}
    >
      <Button
        className={classes.toggleBtn}
        data-size='md'
        data-color='neutral'
        variant='secondary'
        popoverTarget='sidebar-nav'
        popoverTargetAction='show'
      >
        {t('sidebar.show')} {t(`sidebar.sidebar`)}
        <ChevronRightLastIcon aria-hidden fontSize={26} />
      </Button>

      <nav popover='auto' id='sidebar-nav' className={cl(classes.menu)}>
        <Button
          data-color='neutral'
          ref={closeMenuRef}
          icon={true}
          popoverTarget='sidebar-nav'
          popoverTargetAction='hide'
          variant='secondary'
          aria-label={t('header.close-menu')}
          className={classes.closeButton}
        >
          <XMarkIcon aria-hidden fontSize={26} />
          {/* {t('sidebar.hide')} {t(`sidebar.sidebar`)} */}
        </Button>
        {hideCatTitle ? null : (
          <Paragraph data-size='md' className={classes.title}>
            {t(`sidebar.${title}`, title)}
          </Paragraph>
        )}
        <ul className={classes.list}>
          {Object.entries(cats).map(([key, value]) => {
            if (!value.length) {
              return null;
            }
            return (
              <li key={key} className={classes.listGroup}>
                <Paragraph asChild>
                  <div className={classes.innerTitle}>
                    {t(`sidebar.categories.${key}`, key)}
                  </div>
                </Paragraph>
                <ul className={classes.innerList}>
                  {value.map((item) => {
                    const url = `${item.url}`;

                    return (
                      <li key={item.url} className={classes.listItem}>
                        <Paragraph asChild data-size='sm'>
                          <Link asChild>
                            <NavLink
                              to={url + (suffix[key] || '')}
                              className={cl(classes.link)}
                              onClick={() => closeMenuRef.current?.click()}
                            >
                              {t(`sidebar.items.${item.title}`, item.title)}
                            </NavLink>
                          </Link>
                        </Paragraph>
                      </li>
                    );
                  })}
                </ul>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};
