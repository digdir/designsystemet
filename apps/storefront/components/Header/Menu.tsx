import type { SanityDocument } from 'next-sanity';
import cn from 'clsx';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

import classes from './Menu.module.css';

type MenuProps = {
  data: SanityDocument[];
};

/**
 * Function to check if the menu item should be active
 * @param routerPath - The current router path.
 * @param itemPath - The current menu item path.
 */
const isMenuItemActive = (routerPath: string, itemPath: string) => {
  return routerPath.startsWith(itemPath);
};

const Menu = ({ data }: MenuProps) => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <ul className={cn(classes.menu, { [classes.active]: open })}>
      {data.map((item, index) => (
        <li
          className={classes.item}
          key={index}
        >
          <Link
            href={item.url}
            onClick={() => setOpen(false)}
            prefetch={false}
            className={cn(
              isMenuItemActive(pathname, item.url) ? classes.active : '',
              classes.link,
            )}
          >
            {item.text}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export { Menu };
