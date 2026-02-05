import { Paragraph, Tag, type TagProps } from '@digdir/designsystemet-react';
import { RobotIcon } from '@navikt/aksel-icons';

export const Preview = () => {
  return <Tag>New</Tag>;
};

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
  ] as TagProps['data-color'][];
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

export const Icons = () => {
  return (
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
  );
};

export const IconsEn = () => {
  return (
    <Tag
      data-color='neutral'
      data-size='md'
      style={{
        paddingInlineStart: 'var(--ds-size-1)',
      }}
    >
      <RobotIcon aria-hidden style={{ marginInlineEnd: 'var(--ds-size-1)' }} />
      This text is AI-generated
    </Tag>
  );
};

export const Variants = () => {
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
  ] as TagProps['data-color'][];
  return (
    <>
      <div
        style={{
          display: 'flex',
          gap: 'var(--ds-size-2)',
          flexWrap: 'wrap',
        }}
      >
        <Paragraph>Default:</Paragraph>
        {colors.map((color) => (
          <Tag
            key={color}
            data-color={color as TagProps['data-color']}
            variant='default'
          >
            {color}
          </Tag>
        ))}
      </div>
      <br />
      <div
        style={{
          display: 'flex',
          gap: 'var(--ds-size-2)',
          flexWrap: 'wrap',
        }}
      >
        <Paragraph>Outline:</Paragraph>
        {colors.map((color) => (
          <Tag
            key={color}
            data-color={color as TagProps['data-color']}
            variant='outline'
          >
            {color}
          </Tag>
        ))}
      </div>
    </>
  );
};
