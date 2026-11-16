import { Paragraph } from '@digdir/designsystemet-react';
import cl from 'clsx/lite';
import type { ReactNode } from 'react';
import classes from './example-figure.module.css';

type ExampleFigureProps = {
  caption?: string;
  /** Class for the card around the example */
  className?: string;
  children: ReactNode;
};

/** A live example in a neutral card, with the same caption as `Image` */
export const ExampleFigure = ({
  caption,
  className,
  children,
}: ExampleFigureProps) => (
  <figure className={classes.figure}>
    <div className={cl(classes.card, className)}>{children}</div>
    {caption && (
      <Paragraph className={classes.caption} data-size='sm' asChild>
        <figcaption>{caption}</figcaption>
      </Paragraph>
    )}
  </figure>
);
