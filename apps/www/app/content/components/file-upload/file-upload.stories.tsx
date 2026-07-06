import {
  Button,
  EXPERIMENTAL_FileUpload,
  Field,
  Label,
} from '@digdir/designsystemet-react';

export const Preview = () => (
  <Field>
    <Label>Last opp profilbilde</Label>
    <Field.Description>
      Filen må være i csv-format og mindre enn 2MB
    </Field.Description>
    <EXPERIMENTAL_FileUpload>
      <Field.Description>Slipp fil her</Field.Description>
      <Button asChild data-variant='secondary'>
        <span>Last opp fil</span>
      </Button>
      <input type='file' />
    </EXPERIMENTAL_FileUpload>
  </Field>
);

export const PreviewEn = () => (
  <Field>
    <Label>Upload profile picture</Label>
    <Field.Description>
      File must be in csv format and less than 2MB
    </Field.Description>
    <EXPERIMENTAL_FileUpload>
      <Field.Description>Drop file here</Field.Description>
      <Button asChild data-variant='secondary'>
        <span>Upload file</span>
      </Button>
      <input type='file' />
    </EXPERIMENTAL_FileUpload>
  </Field>
);

export const FileUploadExample = () => (
  <Field>
    <Label>Last opp profilbilde</Label>
    <Field.Description>beskrivelsestekst</Field.Description>
    <EXPERIMENTAL_FileUpload>
      <Field.Description>Slipp fil her</Field.Description>
      <Field.Description>
        Filen må være i csv-format og mindre enn 2MB
      </Field.Description>
      <Button asChild data-variant='secondary'>
        <span>Last opp fil</span>
      </Button>
      <input type='file' />
    </EXPERIMENTAL_FileUpload>
  </Field>
);

export const FileUploadExampleEn = () => (
  <Field>
    <Label>Upload profile picture</Label>
    <Field.Description>description text</Field.Description>
    <EXPERIMENTAL_FileUpload>
      <Field.Description>Drop file here</Field.Description>
      <Field.Description>
        File must be in csv format and less than 2MB
      </Field.Description>
      <Button asChild data-variant='secondary'>
        <span>Upload file</span>
      </Button>
      <input type='file' />
    </EXPERIMENTAL_FileUpload>
  </Field>
);
