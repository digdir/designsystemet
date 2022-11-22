import React from 'react';
import cn from 'classnames';

import classes from './Heading.module.css';

export interface HeadingProps {
  level?: HeadingLevel;
  size?: HeadingSize;
  color?: string;
  children: React.ReactNode;
  margin?: boolean;
}

export enum HeadingSize {
  XLarge = 'xlarge',
  Large = 'large',
  Medium = 'medium',
  Small = 'small',
  XSmall = 'xsmall',
}

export enum HeadingLevel {
  H1 = 1,
  H2 = 2,
  H3 = 3,
  H4 = 4,
  H5 = 5,
  H6 = 6,
}

const Heading = ({
  level = HeadingLevel.H1,
  size = HeadingSize.XLarge,
  color = 'black',
  children,
  margin = false,
}: HeadingProps) => {
  const Heading = ({ ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
    return React.createElement('h' + level, props, children);
  };
  const HeadingStyle = {
    color,
  };
  return (
    <Heading
      style={HeadingStyle}
      className={cn(
        [classes['heading']],
        { [classes['heading--margin']]: margin },
        classes['heading--' + size],
      )}
    >
      {children}
    </Heading>
  );
};

export default Heading;
