import { Tag } from '@digdir/designsystemet-react';
import { RobotIcon } from '@navikt/aksel-icons';

export const Preview = () => <Tag>New</Tag>;

export const Sizes = () => {
  const sizes = ['sm', 'md', 'lg'] as const;
  return (
    <>
      {sizes.map((size) => (
        <Tag key={size} data-size={size}>
          {size}
        </Tag>
      ))}
    </>
  );
};

export const Colors = () => {
  const colors = [
    'accent',
    'brand1',
    'brand2',
    'brand3',
    'neutral',
    'success',
    'warning',
    'danger',
    'info',
  ] as const;
  return (
    <>
      {colors.map((color) => (
        <Tag key={color} data-color={color}>
          {color}
        </Tag>
      ))}
    </>
  );
};

export const Icons = () => (
  <>
    <Tag
      data-color='neutral'
      data-size='md'
      style={{
        paddingInlineStart: 'var(--ds-size-1)',
      }}
    >
      <RobotIcon aria-hidden style={{ marginInlineEnd: 'var(--ds-size-1)' }} />
      Teksten er KI-generert
    </Tag>
  </>
);
