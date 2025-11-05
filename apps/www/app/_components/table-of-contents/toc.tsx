import { Link, Paragraph } from '@digdir/designsystemet-react';
import cl from 'clsx/lite';
import type { HTMLAttributes } from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { TableOfContentsItem } from '~/_utils/extract-toc';
import classes from './toc.module.css';

export type TableOfContentsProps = {
  items: TableOfContentsItem[];
  title: string;
} & HTMLAttributes<HTMLDivElement>;

export const TableOfContents = ({
  children,
  items,
  title,
  className,
  ...props
}: TableOfContentsProps) => {
  const [activeItem, setActiveItem] = useState<string>('');

  const { t } = useTranslation();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            setActiveItem(id);
          }
        });
      },
      { rootMargin: '0px 0px -60% 0px' },
    );

    const headingElements = items.map((item) =>
      document.getElementById(item.id),
    );

    headingElements.forEach((element) => {
      if (element) observer.observe(element);
    });

    return () => {
      headingElements.forEach((element) => {
        if (element) observer.unobserve(element);
      });
      observer.disconnect();
    };
  }, [items]);

  // If there are less than 2 items, we don't render the TOC
  if (items.length < 2) return null;

  return (
    <aside
      data-size='md'
      className={cl(classes['table-of-contents'], className)}
      {...props}
    >
      <Paragraph data-size='md' asChild>
        <h2>{t('toc.title')}</h2>
      </Paragraph>
      <ol>
        {items.map((item) => (
          <li key={item.id}>
            <Link
              data-size='sm'
              href={`#${item.id}`}
              data-level={item.level}
              aria-current={activeItem === item.id}
            >
              {item.title}
            </Link>
          </li>
        ))}
      </ol>
      {children}
    </aside>
  );
};
