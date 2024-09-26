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
  component: ToggleGroup,
} as Meta;

export const Preview: StoryFn<typeof ToggleGroup> = (args) => {
  return (
    <ToggleGroup {...args}>
      <ToggleGroup.Item value='innboks'>Innboks</ToggleGroup.Item>
      <ToggleGroup.Item value='utkast'>Utkast</ToggleGroup.Item>
      <ToggleGroup.Item value='arkiv'>Arkiv</ToggleGroup.Item>
      <ToggleGroup.Item value='sendt'>Sendt</ToggleGroup.Item>
    </ToggleGroup>
  );
};

Preview.args = {
  defaultValue: 'innboks',
  size: 'md',
  name: 'toggle-group-nuts',
};

export const OnlyIcons: StoryFn<typeof ToggleGroup> = () => {
  return (
    <ToggleGroup defaultValue={'option-1'}>
      <Tooltip content='Venstrestilt'>
        <ToggleGroup.Item value='option-1' icon>
          <AlignLeftIcon title='AlignLeftIcon' fontSize='1.5rem' />
        </ToggleGroup.Item>
      </Tooltip>
      <Tooltip content='Midtstilt'>
        <ToggleGroup.Item value='option-2' icon>
          <AlignCenterIcon title='AlignCenterIcon' fontSize='1.5rem' />
        </ToggleGroup.Item>
      </Tooltip>
      <Tooltip content='Høyrestilt'>
        <ToggleGroup.Item value='option-3' icon>
          <AlignRightIcon title='AlignRightIcon' fontSize='1.5rem' />
        </ToggleGroup.Item>
      </Tooltip>
    </ToggleGroup>
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
      <ToggleGroup value={value} size='md' onChange={setValue}>
        <ToggleGroup.Item value='innboks'>
          <EnvelopeClosedIcon fontSize='1.5rem' aria-hidden />
          Innboks
        </ToggleGroup.Item>
        <ToggleGroup.Item value='utkast'>
          <DocPencilIcon fontSize='1.5rem' aria-hidden />
          Utkast
        </ToggleGroup.Item>
        <ToggleGroup.Item value='arkiv'>
          <ArchiveIcon fontSize='1.5rem' aria-hidden />
          Arkiv
        </ToggleGroup.Item>
        <ToggleGroup.Item value='sendt'>
          <PaperplaneIcon fontSize='1.5rem' aria-hidden />
          Sendt
        </ToggleGroup.Item>
      </ToggleGroup>
      <br />
      <Paragraph>Du har valgt: {value}</Paragraph>
    </>
  );
};
