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
import { Paragraph } from '../Paragraph';

import { ToggleGroup } from '.';
import { Divider } from '../Divider';
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
  'data-size': 'md',
  name: 'toggle-group-nuts',
};

export const OnlyIcons: StoryFn<typeof ToggleGroup> = () => {
  return (
    <ToggleGroup defaultValue={'option-1'}>
      <Tooltip content='Venstrestilt'>
        <ToggleGroup.Item value='option-1' icon>
          <AlignLeftIcon title='AlignLeftIcon' />
        </ToggleGroup.Item>
      </Tooltip>
      <Tooltip content='Midtstilt'>
        <ToggleGroup.Item value='option-2' icon>
          <AlignCenterIcon title='AlignCenterIcon' />
        </ToggleGroup.Item>
      </Tooltip>
      <Tooltip content='Høyrestilt'>
        <ToggleGroup.Item value='option-3' icon>
          <AlignRightIcon title='AlignRightIcon' />
        </ToggleGroup.Item>
      </Tooltip>
    </ToggleGroup>
  );
};

export const Kontrollert: StoryFn<typeof ToggleGroup> = () => {
  const [value, setValue] = useState<string>('utkast');
  return (
    <>
      <ToggleGroup value={value} onChange={setValue}>
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
};
