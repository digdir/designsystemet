import cl from 'clsx/lite';
import classes from './blockquote.module.css';

type BlockquoteProps = React.HTMLAttributes<HTMLQuoteElement>;

export const Blockquote = ({ className, ...rest }: BlockquoteProps) => {
  return <blockquote className={cl(classes.blockquote, className)} {...rest} />;
};
