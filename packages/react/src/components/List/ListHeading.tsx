import React, { forwardRef, useEffect, useMemo } from 'react';

import { Heading, type HeadingProps } from '../Typography';

import type { ListProps } from './List';
import { ListContext } from './List';

const HEADING_SIZE_MAP: {
  [key in NonNullable<ListProps['size']>]: HeadingProps['size'];
} = {
  small: 'xxsmall',
  medium: 'xsmall',
  large: 'small',
} as const;

export const ListHeading = forwardRef<
  HTMLHeadingElement,
  Omit<HeadingProps, 'size' | 'spacing'> & { id?: string }
>(({ level = 2, id, ...rest }, ref) => {
  const { size, headingId, setHeadingId } = React.useContext(ListContext);

  const headingSize = useMemo(() => HEADING_SIZE_MAP[size], [size]);

  useEffect(() => {
    if (id) {
      setHeadingId(id);
    }
  }, [id, setHeadingId]);

  return (
    <Heading
      ref={ref}
      size={headingSize}
      id={headingId}
      level={level}
      spacing={true}
      {...rest}
    />
  );
});
