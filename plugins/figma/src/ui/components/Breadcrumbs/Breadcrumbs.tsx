import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import cl from 'clsx/lite';

import classes from './Breadcrumbs.module.css';

type BreadcrumbsProps = {
  text: string;
  url: string;
  className?: string;
};

export const Breadcrumbs = ({ text, url, className }: BreadcrumbsProps) => {
  return (
    <div className={cl(classes.breadcrumbs, className)}>
      <Link
        to={url}
        className={classes.back}
      >
        <ChevronLeft size={18} />
      </Link>
      <div className={classes.text}>{text}</div>
    </div>
  );
};
