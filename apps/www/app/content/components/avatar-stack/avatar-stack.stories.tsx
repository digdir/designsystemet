import {
  Avatar,
  Checkbox,
  EXPERIMENTAL_AvatarStack,
  Field,
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
  const [expandable, setExpandable] = useState(false);
  const [overlap, setOverlap] = useState(32);
  const [radius, setRadius] = useState(32);
  const [size, setSize] = useState(64);
  const [gap, setGap] = useState(2);

  return (
    <>
      <fieldset
        style={{
          display: 'flex',
          alignItems: 'center',
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
            checked={expandable}
            onChange={() => setExpandable(!expandable)}
          />
        </div>
        <Field>
          <Label>Size {`${size}px`}</Label>
          <input
            min='24'
            max='150'
            step='0.1'
            type='range'
            value={size}
            onChange={(e) => setSize(e.target.valueAsNumber)}
          />
        </Field>
        <Field>
          <Label>Overlap {`${overlap}px`}</Label>
          <input
            min='0'
            max='100'
            step='1'
            type='range'
            value={overlap}
            onChange={(e) => setOverlap(e.target.valueAsNumber)}
          />
        </Field>
        <Field>
          <Label>Gap {`${gap}px`}</Label>
          <input
            min='0'
            max='15'
            step='1'
            type='range'
            value={gap}
            onChange={(e) => setGap(e.target.valueAsNumber)}
          />
        </Field>
        <Field>
          <Label>Radius {`${radius}px`}</Label>
          <input
            min='0'
            max='75'
            step='1'
            type='range'
            value={radius}
            onChange={(e) => setRadius(e.target.valueAsNumber)}
          />
        </Field>
      </fieldset>
      <br />
      <EXPERIMENTAL_AvatarStack
        data-suffix='+10'
        expandable={expandable || undefined}
        style={
          {
            '--dsc-avatar-stack-size': `${size}px`,
            '--dsc-avatar-stack-gap': `${gap}px`,
            '--dsc-avatar-stack-overlap': `${overlap}px`,
            '--dsc-avatar-stack-radius': `${radius}px`,
          } as React.CSSProperties
        }
      >
        <Avatar aria-label=''>
          <img src='/img/component-docs/cats/cat1.webp' alt='' />
        </Avatar>
        <Avatar aria-label=''>
          <img src='/img/component-docs/cats/cat6.webp' alt='' />
        </Avatar>
        <Avatar aria-label=''>md</Avatar>
        <Avatar aria-label=''>
          <img src='/img/component-docs/cats/cat1.webp' alt='' />
        </Avatar>
        <Avatar aria-label=''>
          <img src='/img/component-docs/cats/cat6.webp' alt='' />
        </Avatar>
      </EXPERIMENTAL_AvatarStack>
    </>
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
  <EXPERIMENTAL_AvatarStack aria-label='example of square avatars' expandable>
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
  <EXPERIMENTAL_AvatarStack
    style={
      {
        '--dsc-avatar-stack-size': 'clamp(5rem, 1.5rem + 2vw, 10rem)',
      } as React.CSSProperties
    }
  >
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
  <EXPERIMENTAL_AvatarStack
    style={
      {
        '--dsc-avatar-stack-gap': '6px',
      } as React.CSSProperties
    }
  >
    <Avatar aria-label='' initials='AA' />
    <Avatar aria-label='' initials='BB' />
    <Avatar aria-label='' initials='CC' />
    <Avatar aria-label='' initials='DD' />
  </EXPERIMENTAL_AvatarStack>
);

export const AdditionalAvatars = () => (
  <>
    <EXPERIMENTAL_AvatarStack>
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
    <EXPERIMENTAL_AvatarStack suffix='+14'>
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
      <EXPERIMENTAL_AvatarStack aria-label='contributors'>
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
      <EXPERIMENTAL_AvatarStack expandable='fixed' aria-label='contributors'>
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
