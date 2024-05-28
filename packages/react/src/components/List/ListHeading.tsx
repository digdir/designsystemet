import { forwardRef, useEffect, useMemo, useContext, useId } from 'react';

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
  ({ level = 2, id, ...rest }, ref) => {
    const { size, headingId, setHeadingId } = useContext(ListContext);
    const randomId = useId();
    const headingId_ = id ?? randomId;

    const headingSize = useMemo(() => HEADING_SIZE_MAP[size], [size]);

    useEffect(() => {
      if (headingId !== headingId_) {
        setHeadingId(headingId_);
      }
    }, [headingId, id, setHeadingId, headingId_]);

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
  },
);

ListHeading.displayName = 'ListHeading';
