import { forwardRef, useContext, useEffect, useId } from 'react';

import { Heading, type HeadingProps } from '../Typography';

import type { ListContextType } from './ListRoot';
import { ListContext } from './ListRoot';

const HEADING_SIZE_MAP: {
  [key in NonNullable<ListContextType['size']>]: HeadingProps['size'];
} = {
  sm: '2xs',
  md: 'xs',
  lg: 'sm',
} as const;

export type ListHeadingProps = HeadingProps;

export const ListHeading = forwardRef<HTMLHeadingElement, ListHeadingProps>(
  function ListHeading({ level = 2, id, ...rest }, ref) {
    const { size, headingId, setHeadingId } = useContext(ListContext);
    const randomId = useId();
    const headingId_ = id ?? randomId;

    useEffect(() => {
      if (headingId !== headingId_) setHeadingId(headingId_);
    }, [headingId, id, setHeadingId, headingId_]);

    return (
      <Heading
        ref={ref}
        size={HEADING_SIZE_MAP[size]}
        id={headingId}
        level={level}
        spacing={true}
        {...rest}
      />
    );
  },
);
