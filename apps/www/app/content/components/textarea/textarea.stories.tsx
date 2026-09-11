import { Field, Label, Textarea } from '@digdir/designsystemet-react';

export const Preview = () => {
  return (
    <Field>
      <Label>Label</Label>
      <Textarea />
    </Field>
  );
};

export const WithRowsEn = () => {
  return (
    <Field>
      <Label>Description</Label>
      <Textarea rows={6} />
    </Field>
  );
};

export const WithRows = () => {
  return (
    <Field>
      <Label>Beskrivelse</Label>
      <Textarea rows={6} />
    </Field>
  );
};

export const Disabled = () => {
  return (
    <>
      <Label>Label</Label>
      <Textarea disabled value='Disabled textarea' />
    </>
  );
};

export const ReadOnly = () => {
  return (
    <Field>
      <Label>Beskrivelse av saken</Label>
      <Field.Description>
        Teksten er lagt inn automatisk basert på det du allerede har sendt inn,
        og kan ikke redigeres.
      </Field.Description>
      <Textarea
        readOnly
        value='Jeg søker om støtte fordi jeg trenger midler til å gjennomføre prosjektet slik det er planlagt.'
      />
    </Field>
  );
};

export const ReadOnlyEn = () => {
  return (
    <Field>
      <Label>Case description</Label>
      <Field.Description>
        This text has been added automatically based on information you have
        already submitted, and cannot be edited.
      </Field.Description>
      <Textarea
        readOnly
        value='I am applying for support because I need funding to carry out the project as planned.'
      />
    </Field>
  );
};
