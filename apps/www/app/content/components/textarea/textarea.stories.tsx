import {
  Field,
  FieldDescription,
  Label,
  Textarea,
} from '@digdir/designsystemet-react';

export const Preview = () => {
  return (
    <>
      <Label htmlFor='my-textarea'>Label</Label>
      <Textarea id='my-textarea' />
    </>
  );
};

export const WithRowsEn = () => {
  return (
    <>
      <Label htmlFor='my-textarea-rows'>Description</Label>
      <Textarea id='my-textarea-rows' rows={6} />
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
    <Field>
      <Label htmlFor='my-textarea-readonly'>Beskrivelse av saken</Label>
      <FieldDescription>
        Teksten er lagt inn automatisk basert på det du allerede har sendt inn,
        og kan ikke redigeres.
      </FieldDescription>
      <Textarea
        id='my-textarea-readonly'
        readOnly
        value='Jeg søker om støtte fordi jeg trenger midler til å gjennomføre prosjektet slik det er planlagt.'
      />
    </Field>
  );
};

export const ReadOnlyEn = () => {
  return (
    <Field>
      <Label htmlFor='my-textarea-readonly-en'>Case description</Label>
      <FieldDescription>
        This text has been added automatically based on information you have
        already submitted, and cannot be edited.
      </FieldDescription>
      <Textarea
        id='my-textarea-readonly-en'
        readOnly
        value='I am applying for support because I need funding to carry out the project as planned.'
      />
    </Field>
  );
};
