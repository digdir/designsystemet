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
    <ToggleGroup defaultValue='innboks'>
      <ToggleGroup.Item value='innboks'>Innboks</ToggleGroup.Item>
      <ToggleGroup.Item value='utkast'>Utkast</ToggleGroup.Item>
      <ToggleGroup.Item value='arkiv'>Arkiv</ToggleGroup.Item>
      <ToggleGroup.Item value='sendt'>Sendt</ToggleGroup.Item>
    </ToggleGroup>
  );
};

export const PreviewEn = () => {
  return (
    <ToggleGroup defaultValue='inbox'>
      <ToggleGroup.Item value='inbox'>Inbox</ToggleGroup.Item>
      <ToggleGroup.Item value='drafts'>Drafts</ToggleGroup.Item>
      <ToggleGroup.Item value='archive'>Archive</ToggleGroup.Item>
      <ToggleGroup.Item value='sent'>Sent</ToggleGroup.Item>
    </ToggleGroup>
  );
};

export const OnlyIcons = () => {
  return (
    <ToggleGroup defaultValue='option-1'>
      <Tooltip content='Venstrestilt'>
        <ToggleGroup.Item value='option-1' icon>
          <AlignLeftIcon aria-hidden />
        </ToggleGroup.Item>
      </Tooltip>
      <Tooltip content='Midtstilt'>
        <ToggleGroup.Item value='option-2' icon>
          <AlignCenterIcon aria-hidden />
        </ToggleGroup.Item>
      </Tooltip>
      <Tooltip content='Høyrestilt'>
        <ToggleGroup.Item value='option-3' icon>
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

export const Secondary = () => {
  return (
    <ToggleGroup defaultValue='innboks' variant='secondary'>
      <ToggleGroup.Item value='innboks'>Innboks</ToggleGroup.Item>
      <ToggleGroup.Item value='utkast'>Utkast</ToggleGroup.Item>
      <ToggleGroup.Item value='arkiv'>Arkiv</ToggleGroup.Item>
      <ToggleGroup.Item value='sendt'>Sendt</ToggleGroup.Item>
    </ToggleGroup>
  );
};

export const SecondaryEn = () => {
  return (
    <ToggleGroup defaultValue='inbox' variant='secondary'>
      <ToggleGroup.Item value='inbox'>Inbox</ToggleGroup.Item>
      <ToggleGroup.Item value='drafts'>Drafts</ToggleGroup.Item>
      <ToggleGroup.Item value='archive'>Archive</ToggleGroup.Item>
      <ToggleGroup.Item value='sent'>Sent</ToggleGroup.Item>
    </ToggleGroup>
  );
};
