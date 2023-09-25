import React from 'react';

import styles from './FlexContainer.module.css';

/**
 *  FlexContainer is a component that makes it easy to create a flexbox container.
 *  @optional
 *  @prop gap - The gap between the children. Defaults to var(--fds-spacing-4).
 *  @prop direction - The direction of the flexbox. Defaults to row.
 *  @prop wrap - The wrap of the flexbox. Defaults to wrap.
 */
export function FlexContainer({
  children,
  gap = 'var(--fds-spacing-4)',
  direction = 'row',
  wrap = 'wrap',
}: FlexContainerProps) {
  return (
    <div
      className={styles.flex}
      style={{
        gap,
        flexDirection: direction,
        flexWrap: wrap,
      }}
    >
      {children}
    </div>
  );
}

interface FlexContainerProps {
  children: React.ReactNode;
  gap?: string;
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  wrap?: 'wrap' | 'nowrap' | 'wrap-reverse';
}
