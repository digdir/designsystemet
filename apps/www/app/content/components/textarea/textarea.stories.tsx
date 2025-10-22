import { Label, Textarea } from '@digdir/designsystemet-react';

export const Preview = () => {
  return (
    <>
      <Label htmlFor='my-textarea'>Label</Label>
      <Textarea id='my-textarea' />
    </>
  );
};

export const WithRows = () => {
  return (
    <>
      <Label htmlFor='my-textarea-rows'>Beskrivelse</Label>
      <Textarea id='my-textarea-rows' rows={6} />
    </>
  );
};

export const Disabled = () => {
  return (
    <>
      <Label htmlFor='my-textarea-disabled'>Label</Label>
      <Textarea id='my-textarea-disabled' disabled value='Disabled textarea' />
    </>
  );
};

export const ReadOnly = () => {
  return (
    <>
      <Label htmlFor='my-textarea-readonly'>Label</Label>
      <Textarea id='my-textarea-readonly' readOnly value='ReadOnly textarea' />
    </>
  );
};
