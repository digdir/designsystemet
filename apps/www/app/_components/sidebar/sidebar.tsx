import { Button, Paragraph } from '@digdir/designsystemet-react';
import cl from 'clsx/lite';
import { type HTMLAttributes, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import { RRLink } from '../link';
import classes from './sidebar.module.css';

export type SidebarProps = {
  cats: {
    [key: string]: {
      title: string;
      url: string;
    }[];
  };
  title: string;
} & HTMLAttributes<HTMLDivElement>;

export const Sidebar = ({ cats, title, ...props }: SidebarProps) => {
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div {...props}>
      <Button
        className={classes.toggleBtn}
        data-size='md'
        data-color='neutral'
        variant='secondary'
        onClick={() => setShowMenu(!showMenu)}
        aria-expanded={showMenu}
      >
        {showMenu ? t('sidebar.hide') : t('sidebar.show')}{' '}
        {t(`sidebar.sidebar`)}
      </Button>

      <div className={cl(classes.menu, showMenu && classes.activeMenu)}>
        <Paragraph data-size='md' asChild>
          <h2 className={classes.title}>{t(`sidebar.${title}`, title)}</h2>
        </Paragraph>
        <ul className={classes.list}>
          {Object.entries(cats).map(([key, value]) => {
            if (!value.length) {
              return null;
            }
            return (
              <li key={key} className={classes.listGroup}>
                <Paragraph asChild data-size='md'>
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
                          <RRLink
                            to={url}
                            className={cl(
                              classes.link,
                              url === pathname && classes.linkActive,
                            )}
                            onClick={() => setShowMenu(false)}
                          >
                            {t(`sidebar.items.${item.title}`, item.title)}
                          </RRLink>
                        </Paragraph>
                      </li>
                    );
                  })}
                </ul>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
