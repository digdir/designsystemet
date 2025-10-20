import { Label, Textarea } from '@digdir/designsystemet-react';

export const Preview = () => (
  <>
    <Label htmlFor='my-textarea'>Label</Label>
    <Textarea id='my-textarea' cols={40} />
  </>
);

export const WithRows = () => (
  <>
    <Label htmlFor='my-textarea-rows'>Beskrivelse</Label>
    <Textarea id='my-textarea-rows' rows={6} />
  </>
);

export const Disabled = () => (
  <>
    <Label htmlFor='my-textarea-disabled'>Label</Label>
    <Textarea id='my-textarea-disabled' disabled value='Disabled textarea' />
  </>
);

export const ReadOnly = () => (
  <>
    <Label htmlFor='my-textarea-readonly'>Label</Label>
    <Textarea id='my-textarea-readonly' readOnly value='ReadOnly textarea' />
  </>
);
