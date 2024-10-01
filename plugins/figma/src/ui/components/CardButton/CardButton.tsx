import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

import classes from './CardButton.module.css';
export const CardButton = ({ url }: { url: string }) => {
  return (
    <Link to={url} className={classes.cardBtn}>
      <Plus />
    </Link>
  );
};
