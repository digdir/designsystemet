import {
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
  ArchiveIcon,
  DocPencilIcon,
  EnvelopeClosedIcon,
  PaperplaneIcon,
} from '@navikt/aksel-icons';
import type { Meta, StoryFn } from '@storybook/react';
import { useState } from 'react';

import { Button } from '../Button';
import { Paragraph } from '../Typography';

import { ToggleGroup } from '.';
import { Tooltip } from '../Tooltip';

export default {
  title: 'Komponenter/ToggleGroup',
  component: ToggleGroup.Root,
} as Meta;

export const Preview: StoryFn<typeof ToggleGroup.Root> = (args) => {
  return (
    <ToggleGroup.Root {...args}>
      <ToggleGroup.Item value='innboks'>Innboks</ToggleGroup.Item>
      <ToggleGroup.Item value='utkast'>Utkast</ToggleGroup.Item>
      <ToggleGroup.Item value='arkiv'>Arkiv</ToggleGroup.Item>
      <ToggleGroup.Item value='sendt'>Sendt</ToggleGroup.Item>
    </ToggleGroup.Root>
  );
};

Preview.args = {
  defaultValue: 'innboks',
  size: 'md',
  name: 'toggle-group-nuts',
};

export const OnlyIcons: StoryFn<typeof ToggleGroup> = () => {
  return (
    <ToggleGroup.Root defaultValue={'option-1'}>
      <Tooltip content='Venstrestilt'>
        <ToggleGroup.Item value='option-1'>
          <AlignLeftIcon title='AlignLeftIcon' fontSize='1.5rem' />
        </ToggleGroup.Item>
      </Tooltip>
      <Tooltip content='Midtstilt'>
        <ToggleGroup.Item value='option-2'>
          <AlignCenterIcon title='AlignCenterIcon' fontSize='1.5rem' />
        </ToggleGroup.Item>
      </Tooltip>
      <Tooltip content='Høyrestilt'>
        <ToggleGroup.Item value='option-3'>
          <AlignRightIcon title='AlignRightIcon' fontSize='1.5rem' />
        </ToggleGroup.Item>
      </Tooltip>
    </ToggleGroup.Root>
  );
};

export const Kontrollert: StoryFn<typeof ToggleGroup> = () => {
  const [value, setValue] = useState<string>('utkast');
  return (
    <>
      <div style={{ display: 'flex', gap: '4px' }}>
        <Button size='sm' onClick={() => setValue('arkiv')}>
          Velg Arkiv
        </Button>
      </div>
      <br />
      <ToggleGroup.Root value={value} size='md' onChange={setValue}>
        <ToggleGroup.Item value='innboks'>
          <EnvelopeClosedIcon fontSize='1.5rem' />
          Innboks
        </ToggleGroup.Item>
        <ToggleGroup.Item value='utkast'>
          <DocPencilIcon fontSize='1.5rem' />
          Utkast
        </ToggleGroup.Item>
        <ToggleGroup.Item value='arkiv'>
          <ArchiveIcon fontSize='1.5rem' />
          Arkiv
        </ToggleGroup.Item>
        <ToggleGroup.Item value='sendt'>
          <PaperplaneIcon fontSize='1.5rem' />
          Sendt
        </ToggleGroup.Item>
      </ToggleGroup.Root>
      <br />
      <Paragraph>Du har valgt: {value}</Paragraph>
    </>
  );
};
