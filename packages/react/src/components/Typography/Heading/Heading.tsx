import React from 'react';
import cn from 'classnames';

import classes from './Heading.module.css';

export interface HeadingProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  size?: 'xlarge' | 'large' | 'medium' | 'small' | 'xsmall';
  color?: string;
  children: React.ReactNode;
  margin?: boolean;
}

const Heading = ({
  level = 1,
  size = 'xlarge',
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
