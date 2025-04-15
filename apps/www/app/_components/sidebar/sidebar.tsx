import { Paragraph } from '@digdir/designsystemet-react';
import cl from 'clsx/lite';
import type { HTMLAttributes } from 'react';
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
  const location = useLocation().pathname;

  return (
    <div {...props}>
      <Paragraph data-size='md' asChild>
        <h2 className={classes.title}>{title}</h2>
      </Paragraph>
      <ul className={classes.list}>
        {Object.entries(cats).map(([key, value]) => {
          if (!value.length) {
            return null;
          }
          return (
            <li key={key} className={classes.listGroup}>
              <Paragraph asChild data-size='md'>
                <div className={classes.innerTitle}>{key}</div>
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
                            url === location && classes.linkActive,
                          )}
                        >
                          {item.title}
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
  );
};
