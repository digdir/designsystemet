import type { HTMLAttributes } from 'react';
import React, { useId, useMemo } from 'react';
import cl from 'clsx';

import { Paragraph } from '../Typography';

import classes from './List.module.css';
import { ListHeading } from './ListHeading';

export type ListProps = {
  /**
   * The type of list to render.
   * @default ul
   */
  as?: 'ul' | 'ol';
  /** Changes text sizing
   * @default medium
   */
  size?: 'small' | 'medium' | 'large';
} & HTMLAttributes<HTMLDivElement>;

export const List = React.forwardRef<HTMLDivElement, ListProps>(
  ({ children, as = 'ul', size = 'medium', ...rest }, ref) => {
    const hId = useId();
    const [headingId, setHeadingId] = React.useState(hId);

    // get heading from children, and remove it from the list
    const { heading, restItems } = useMemo(() => {
      const [firstChild, ...restChildren] = React.Children.toArray(children);

      let heading = null;
      let restItems = [...restChildren];

      if (React.isValidElement(firstChild) && firstChild.type === ListHeading) {
        heading = firstChild;
      } else {
        restItems = [firstChild, ...restChildren];
      }

      return { heading, restItems };
    }, [children]);

    return (
      <ListContext.Provider value={{ size, headingId, setHeadingId }}>
        <div
          {...rest}
          ref={ref}
        >
          {heading}
          <Paragraph
            as={as}
            size={size}
            className={cl(classes.list)}
            role='list'
            {...(heading ? { 'aria-labelledby': headingId } : {})}
          >
            {restItems}
          </Paragraph>
        </div>
      </ListContext.Provider>
    );
  },
);

type ListContextType = {
  size: NonNullable<ListProps['size']>;
  headingId: string;
  setHeadingId: (id: string) => void;
};

export const ListContext = React.createContext<ListContextType>({
  size: 'medium',
  headingId: 'heading',
  setHeadingId: () => {},
});
