import {
  Avatar,
  Checkbox,
  EXPERIMENTAL_AvatarStack,
  Label,
  Tooltip,
} from '@digdir/designsystemet-react';
import { BriefcaseIcon } from '@navikt/aksel-icons';
import { useState } from 'react';

export const Preview = () => (
  <EXPERIMENTAL_AvatarStack>
    <Avatar aria-label='cat'>
      <img src='/img/component-docs/cats/cat1.webp' alt='' />
    </Avatar>
    <Avatar aria-label='briefcase'>
      <BriefcaseIcon />
    </Avatar>
    <Avatar aria-label='Søren Magnussen'>sm</Avatar>
    <Avatar aria-label='Mark Downright'>md</Avatar>
    <Avatar aria-label='Ola Nordman'>on</Avatar>
  </EXPERIMENTAL_AvatarStack>
);

export const Playground = () => {
  const [expandable, setExpandable] = useState<undefined | true>(undefined);
  const [square, setSquare] = useState(false);
  const [size, setSize] = useState(64);
  const [overlap, setOverlap] = useState(50);
  const [gap, setGap] = useState(2);
  const labelStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--ds-size-2)',
    accentColor: 'var(--ds-color-base-default)',
  } as const;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--ds-size-8)',
        minHeight: '370px',
      }}
    >
      <fieldset
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
          gap: 'var(--ds-size-4)',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: 'var(--ds-size-3)',
            alignItems: 'center',
          }}
        >
          <Checkbox
            label='Expandable'
            checked={expandable !== undefined}
            onChange={() => setExpandable((prev) => (prev ? undefined : true))}
          />
          <Checkbox
            label='square'
            checked={square}
            onChange={() => setSquare((prev) => !prev)}
          />
        </div>
        <Label style={labelStyle}>
          avatarSize {`${size}px`}
          <input
            min='24'
            max='150'
            step='0.1'
            type='range'
            value={size}
            onChange={(e) =>
              setSize(Number((e.target as HTMLInputElement).value))
            }
          />
        </Label>
        <Label style={labelStyle}>
          Overlap {`${overlap}`}
          <input
            min='-10'
            max='100'
            step='1'
            type='range'
            value={overlap}
            onChange={(e) =>
              setOverlap(Number((e.target as HTMLInputElement).value))
            }
          />
        </Label>
        <Label style={labelStyle}>
          Gap {`${gap}px`}
          <input
            min='0'
            max='15'
            step='1'
            type='range'
            value={gap}
            onChange={(e) =>
              setGap(Number((e.target as HTMLInputElement).value))
            }
          />
        </Label>
      </fieldset>

      <EXPERIMENTAL_AvatarStack
        overlap={overlap}
        data-suffix={`+10`}
        gap={`${gap}px`}
        avatarSize={`${size}px`}
        expandable={expandable}
      >
        <Avatar aria-label='' variant={square ? 'square' : 'circle'}>
          <img src='/img/component-docs/cats/cat1.webp' alt='' />
        </Avatar>
        <Avatar aria-label='' variant={square ? 'square' : 'circle'}>
          <img src='/img/component-docs/cats/cat6.webp' alt='' />
        </Avatar>
        <Avatar aria-label='' variant={square ? 'square' : 'circle'}>
          md
        </Avatar>
        <Avatar aria-label='' variant={square ? 'square' : 'circle'}>
          <img src='/img/component-docs/cats/cat1.webp' alt='' />
        </Avatar>
        <Avatar aria-label='' variant={square ? 'square' : 'circle'}>
          <img src='/img/component-docs/cats/cat6.webp' alt='' />
        </Avatar>
      </EXPERIMENTAL_AvatarStack>
    </div>
  );
};

export const Expandable = () => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'row',
      gap: 'var(--ds-size-4)',
      flexWrap: 'wrap',
    }}
  >
    <fieldset>
      <legend>expandable</legend>
      <EXPERIMENTAL_AvatarStack expandable>
        <Avatar aria-label=''>
          <img src='/img/component-docs/cats/cat1.webp' alt='' />
        </Avatar>
        <Avatar aria-label=''>
          <img src='/img/component-docs/cats/cat6.webp' alt='' />
        </Avatar>
        <Avatar aria-label=''>
          <img src='/img/component-docs/cats/cat1.webp' alt='' />
        </Avatar>
        <Avatar aria-label=''>
          <img src='/img/component-docs/cats/cat6.webp' alt='' />
        </Avatar>
      </EXPERIMENTAL_AvatarStack>
    </fieldset>
    <fieldset>
      <legend>expandable="fixed"</legend>
      <EXPERIMENTAL_AvatarStack expandable='fixed'>
        <Avatar aria-label=''>
          <img src='/img/component-docs/cats/cat1.webp' alt='' />
        </Avatar>
        <Avatar aria-label=''>
          <img src='/img/component-docs/cats/cat6.webp' alt='' />
        </Avatar>
        <Avatar aria-label=''>
          <img src='/img/component-docs/cats/cat1.webp' alt='' />
        </Avatar>
        <Avatar aria-label=''>
          <img src='/img/component-docs/cats/cat6.webp' alt='' />
        </Avatar>
      </EXPERIMENTAL_AvatarStack>
    </fieldset>
  </div>
);

export const ShapeVariants = () => (
  <EXPERIMENTAL_AvatarStack
    aria-label='example of square avatars'
    overlap={40}
    gap='4px'
    expandable
  >
    <Avatar variant='square' aria-label='variant square' />
    <Avatar variant='square' aria-label='Ola Nordmann'>
      <img src='/img/component-docs/cats/cat1.webp' alt='' />
    </Avatar>
    <Avatar variant='square' aria-label='Ola Nordmann'>
      <img src='/img/component-docs/cats/cat2.webp' alt='' />
    </Avatar>
    <Avatar variant='square' aria-label='Ola Nordmann'>
      <img src='/img/component-docs/cats/cat3.webp' alt='' />
    </Avatar>
    <Avatar variant='square' aria-label='Ola Nordmann'>
      <img src='/img/component-docs/cats/cat4.webp' alt='' />
    </Avatar>
  </EXPERIMENTAL_AvatarStack>
);

export const DataSize = () => (
  <EXPERIMENTAL_AvatarStack avatarSize='clamp(5rem, 1.5rem + 2vw, 10rem)'>
    <Avatar aria-label=''>
      <img src='/img/component-docs/cats/cat6.webp' alt='' />
    </Avatar>
    <Avatar aria-label=''>
      <img src='/img/component-docs/cats/cat1.webp' alt='' />
    </Avatar>
    <Avatar aria-label=''>
      <img src='/img/component-docs/cats/cat6.webp' alt='' />
    </Avatar>
    <Avatar aria-label=''>
      <img src='/img/component-docs/cats/cat1.webp' alt='' />
    </Avatar>
  </EXPERIMENTAL_AvatarStack>
);

export const Gap = () => (
  <EXPERIMENTAL_AvatarStack avatarSize='3rem' gap='6px'>
    <Avatar aria-label='' initials='AA' />
    <Avatar aria-label='' initials='BB' />
    <Avatar aria-label='' initials='CC' />
    <Avatar aria-label='' initials='DD' />
  </EXPERIMENTAL_AvatarStack>
);

export const AdditionalAvatars = () => (
  <>
    <EXPERIMENTAL_AvatarStack overlap={30}>
      <Avatar aria-label=''>
        <img src='/img/component-docs/cats/cat1.webp' alt='' />
      </Avatar>
      <Avatar aria-label=''>
        <BriefcaseIcon />
      </Avatar>
      <Avatar aria-label='' initials='sm' />
      <Avatar
        data-color='neutral'
        aria-label=''
        style={{ '--dsc-avatar-font-size': '1.1rem' } as React.CSSProperties}
      >
        +14
      </Avatar>
    </EXPERIMENTAL_AvatarStack>
    <EXPERIMENTAL_AvatarStack suffix={'+14'}>
      <Avatar aria-label=''>
        <img src='/img/component-docs/cats/cat1.webp' alt='' />
      </Avatar>
      <Avatar aria-label=''>
        <BriefcaseIcon />
      </Avatar>
      <Avatar aria-label='' initials='sm' />
      <Avatar aria-label='' initials='on' />
    </EXPERIMENTAL_AvatarStack>
  </>
);

export const WithTooltipAndLink = () => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--ds-size-4)' }}>
    <fieldset>
      <legend>Link + Tooltip</legend>
      <EXPERIMENTAL_AvatarStack overlap={20} aria-label='contributors'>
        <Tooltip content='Ola Katt'>
          <Avatar aria-label='' asChild>
            <a href='#'>
              <img src='/img/component-docs/cats/cat1.webp' alt='' />
            </a>
          </Avatar>
        </Tooltip>
        <Tooltip content='Kari Katt'>
          <Avatar aria-label='' asChild>
            <a href='#'>
              <img src='/img/component-docs/cats/cat6.webp' alt='' />
            </a>
          </Avatar>
        </Tooltip>
        <Tooltip content='Katt 2'>
          <Avatar aria-label='' asChild>
            <a href='#'>
              <img src='/img/component-docs/cats/cat1.webp' alt='' />
            </a>
          </Avatar>
        </Tooltip>
        <Tooltip content='Børge Katt'>
          <Avatar aria-label='' asChild>
            <a href='#'>BK</a>
          </Avatar>
        </Tooltip>
      </EXPERIMENTAL_AvatarStack>
    </fieldset>
    <fieldset>
      <legend>Link + Tooltip expandable</legend>
      <EXPERIMENTAL_AvatarStack
        overlap={50}
        expandable='fixed'
        aria-label='contributors'
      >
        <Tooltip content='Ola Katt'>
          <Avatar aria-label='' asChild>
            <a href='#'>
              <img src='/img/component-docs/cats/cat6.webp' alt='' />
            </a>
          </Avatar>
        </Tooltip>
        <Tooltip content='Kari Katt'>
          <Avatar aria-label='' asChild>
            <a href='#'>
              <img src='/img/component-docs/cats/cat1.webp' alt='' />
            </a>
          </Avatar>
        </Tooltip>
        <Tooltip content='Katt 2'>
          <Avatar aria-label='' asChild>
            <a href='#'>
              <img src='/img/component-docs/cats/cat6.webp' alt='' />
            </a>
          </Avatar>
        </Tooltip>
        <Tooltip content='Børge Katt'>
          <Avatar aria-label='' asChild>
            <a href='#'>BK</a>
          </Avatar>
        </Tooltip>
      </EXPERIMENTAL_AvatarStack>
    </fieldset>
  </div>
);
