import {
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
  ArchiveIcon,
  DocPencilIcon,
  EnvelopeClosedIcon,
  PaperplaneIcon,
} from '@navikt/aksel-icons';
import { useState } from 'react';
import preview from '../../../../../apps/storybook/.storybook/preview';
import { Button, Divider, Paragraph, Tooltip } from '../';
import { ToggleGroup } from './';

const meta = preview.meta({
  title: 'Komponenter/ToggleGroup',
  component: ToggleGroup,
  decorators: [
    (Story) => (
      /* 80vw since storybook has padding, and does not stop elements from overflowing the x-axis */
      <div style={{ maxWidth: '80vw' }}>
        <Story />
      </div>
    ),
  ],
});

export const Preview = meta.story({
  render: (args) => (
    <ToggleGroup {...args}>
      <ToggleGroup.Item value='innboks'>Innboks</ToggleGroup.Item>
      <ToggleGroup.Item value='utkast'>Utkast</ToggleGroup.Item>
      <ToggleGroup.Item value='arkiv'>Arkiv</ToggleGroup.Item>
      <ToggleGroup.Item value='sendt'>Sendt</ToggleGroup.Item>
    </ToggleGroup>
  ),
  args: {
    'aria-label': 'Filtrering', // Set aria-label attribute for accessibility
    defaultValue: 'innboks',
    name: 'toggle-group-nuts',
  },
});

export const OnlyIcons = meta.story({
  render: (args) => (
    <ToggleGroup {...args}>
      <Tooltip content='Venstrestilt'>
        <ToggleGroup.Item value='option-1'>
          <AlignLeftIcon aria-hidden />
        </ToggleGroup.Item>
      </Tooltip>
      <Tooltip content='Midtstilt'>
        <ToggleGroup.Item value='option-2'>
          <AlignCenterIcon aria-hidden />
        </ToggleGroup.Item>
      </Tooltip>
      <Tooltip content='Høyrestilt'>
        <ToggleGroup.Item value='option-3'>
          <AlignRightIcon aria-hidden />
        </ToggleGroup.Item>
      </Tooltip>
    </ToggleGroup>
  ),
  args: {
    'aria-label': 'Tekstjustering', // Set aria-label attribute for accessibility
    defaultValue: 'option-1',
  },
});

export const Kontrollert = meta.story(() => {
  const [value, setValue] = useState<string>('utkast');
  return (
    <>
      <ToggleGroup aria-label='Filtrering' value={value} onChange={setValue}>
        <ToggleGroup.Item value='innboks'>
          <EnvelopeClosedIcon aria-hidden />
          Innboks
        </ToggleGroup.Item>
        <ToggleGroup.Item value='utkast'>
          <DocPencilIcon aria-hidden />
          Utkast
        </ToggleGroup.Item>
        <ToggleGroup.Item value='arkiv'>
          <ArchiveIcon aria-hidden />
          Arkiv
        </ToggleGroup.Item>
        <ToggleGroup.Item value='sendt'>
          <PaperplaneIcon aria-hidden />
          Sendt
        </ToggleGroup.Item>
      </ToggleGroup>
      <Divider />
      <Paragraph>Du har valgt: {value}</Paragraph>
      <Button data-size='sm' onClick={() => setValue('arkiv')}>
        Velg Arkiv
      </Button>
    </>
  );
});

export const Secondary = Preview.extend({
  args: {
    'aria-label': 'Filtrering', // Set aria-label attribute for accessibility
    defaultValue: 'innboks',
    variant: 'secondary',
  },
});

export const SecondaryOnlyIcons = OnlyIcons.extend({
  args: {
    'aria-label': 'Filtrering', // Set aria-label attribute for accessibility
    variant: 'secondary',
  },
});

export const Disabled = meta.story(() => {
  return (
    <ToggleGroup aria-label='Filtrering' defaultValue='innboks'>
      <ToggleGroup.Item value='innboks'>Innboks</ToggleGroup.Item>
      <ToggleGroup.Item disabled value='utkast'>
        Utkast
      </ToggleGroup.Item>
      <ToggleGroup.Item disabled value='arkiv'>
        Arkiv
      </ToggleGroup.Item>
      <ToggleGroup.Item value='Søppelpost'>Søppelpost</ToggleGroup.Item>
      <ToggleGroup.Item value='sendt'>Sendt</ToggleGroup.Item>
    </ToggleGroup>
  );
});

export const AriaDisabled = meta.story(() => {
  return (
    <ToggleGroup aria-label='Filtrering'>
      <ToggleGroup.Item value='innboks'>Innboks</ToggleGroup.Item>
      <ToggleGroup.Item aria-disabled='true' value='utkast'>
        Utkast
      </ToggleGroup.Item>
      <ToggleGroup.Item aria-disabled='true' value='arkiv'>
        Arkiv
      </ToggleGroup.Item>
      <ToggleGroup.Item value='Søppelpost'>Søppelpost</ToggleGroup.Item>
      <ToggleGroup.Item value='sendt'>Sendt</ToggleGroup.Item>
    </ToggleGroup>
  );
});

export const ManualActivation = meta.story(() => {
  return (
    <ToggleGroup
      aria-label='Filter'
      onChange={console.log}
      defaultValue='inboks'
      variant='secondary'
    >
      <ToggleGroup.Item value='inboks' asChild>
        <Button>Innboks</Button>
      </ToggleGroup.Item>
      <ToggleGroup.Item value='utkast' asChild>
        <Button>Utkast</Button>
      </ToggleGroup.Item>
      <ToggleGroup.Item value='arkiv' asChild>
        <Button>Arkiv</Button>
      </ToggleGroup.Item>
      <ToggleGroup.Item value='sendt' asChild>
        <Button>Sendt</Button>
      </ToggleGroup.Item>
    </ToggleGroup>
  );
});
