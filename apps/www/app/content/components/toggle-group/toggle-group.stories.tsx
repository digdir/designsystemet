import {
  Button,
  Divider,
  Paragraph,
  ToggleGroup,
  Tooltip,
} from '@digdir/designsystemet-react';
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

export const Preview = () => {
  return (
    <ToggleGroup data-toggle-group='Filter' defaultValue='innboks'>
      <ToggleGroup.Item value='innboks'>Innboks</ToggleGroup.Item>
      <ToggleGroup.Item value='utkast'>Utkast</ToggleGroup.Item>
      <ToggleGroup.Item value='arkiv'>Arkiv</ToggleGroup.Item>
      <ToggleGroup.Item value='sendt'>Sendt</ToggleGroup.Item>
    </ToggleGroup>
  );
};

export const PreviewEn = () => {
  return (
    <ToggleGroup data-toggle-group='Filter' defaultValue='inbox'>
      <ToggleGroup.Item value='inbox'>Inbox</ToggleGroup.Item>
      <ToggleGroup.Item value='drafts'>Drafts</ToggleGroup.Item>
      <ToggleGroup.Item value='archive'>Archive</ToggleGroup.Item>
      <ToggleGroup.Item value='sent'>Sent</ToggleGroup.Item>
    </ToggleGroup>
  );
};

export const OnlyIcons = () => {
  return (
    <ToggleGroup data-toggle-group='Tekstjustering' defaultValue='option-1'>
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
  );
};

export const OnlyIconsEn = () => {
  return (
    <ToggleGroup data-toggle-group='Textalignment' defaultValue='option-1'>
      <Tooltip content='Left aligned'>
        <ToggleGroup.Item value='option-1'>
          <AlignLeftIcon aria-hidden />
        </ToggleGroup.Item>
      </Tooltip>
      <Tooltip content='Center aligned'>
        <ToggleGroup.Item value='option-2'>
          <AlignCenterIcon aria-hidden />
        </ToggleGroup.Item>
      </Tooltip>
      <Tooltip content='Right aligned'>
        <ToggleGroup.Item value='option-3'>
          <AlignRightIcon aria-hidden />
        </ToggleGroup.Item>
      </Tooltip>
    </ToggleGroup>
  );
};

export const Controlled = () => {
  const [value, setValue] = useState<string>('utkast');
  return (
    <>
      <ToggleGroup data-toggle-group='Filter' value={value} onChange={setValue}>
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

export const ControlledEn = () => {
  const [value, setValue] = useState<string>('drafts');
  return (
    <>
      <ToggleGroup data-toggle-group='Filter' value={value} onChange={setValue}>
        <ToggleGroup.Item value='inbox'>
          <EnvelopeClosedIcon aria-hidden />
          Inbox
        </ToggleGroup.Item>
        <ToggleGroup.Item value='drafts'>
          <DocPencilIcon aria-hidden />
          Drafts
        </ToggleGroup.Item>
        <ToggleGroup.Item value='archive'>
          <ArchiveIcon aria-hidden />
          Archive
        </ToggleGroup.Item>
        <ToggleGroup.Item value='sent'>
          <PaperplaneIcon aria-hidden />
          Sent
        </ToggleGroup.Item>
      </ToggleGroup>
      <Divider />
      <Paragraph>You have selected: {value}</Paragraph>
      <Button data-size='sm' onClick={() => setValue('archive')}>
        Select Archive
      </Button>
    </>
  );
};

export const Secondary = () => {
  return (
    <ToggleGroup
      data-toggle-group='Filter'
      defaultValue='innboks'
      variant='secondary'
    >
      <ToggleGroup.Item value='innboks'>Innboks</ToggleGroup.Item>
      <ToggleGroup.Item value='utkast'>Utkast</ToggleGroup.Item>
      <ToggleGroup.Item value='arkiv'>Arkiv</ToggleGroup.Item>
      <ToggleGroup.Item value='sendt'>Sendt</ToggleGroup.Item>
    </ToggleGroup>
  );
};

export const SecondaryEn = () => {
  return (
    <ToggleGroup
      data-toggle-group='Filter'
      defaultValue='inbox'
      variant='secondary'
    >
      <ToggleGroup.Item value='inbox'>Inbox</ToggleGroup.Item>
      <ToggleGroup.Item value='drafts'>Drafts</ToggleGroup.Item>
      <ToggleGroup.Item value='archive'>Archive</ToggleGroup.Item>
      <ToggleGroup.Item value='sent'>Sent</ToggleGroup.Item>
    </ToggleGroup>
  );
};
