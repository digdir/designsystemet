import {
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
      <EXPERIMENTAL_FileUpload.Description>
        Slipp fil her
      </EXPERIMENTAL_FileUpload.Description>
      <EXPERIMENTAL_FileUpload.FakeButton>
        Last opp fil
      </EXPERIMENTAL_FileUpload.FakeButton>
      <EXPERIMENTAL_FileUpload.Input />
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
      <EXPERIMENTAL_FileUpload.Description>
        Drop file here
      </EXPERIMENTAL_FileUpload.Description>
      <EXPERIMENTAL_FileUpload.FakeButton>
        Upload file
      </EXPERIMENTAL_FileUpload.FakeButton>
      <EXPERIMENTAL_FileUpload.Input />
    </EXPERIMENTAL_FileUpload>
  </Field>
);

export const FileUploadExample = () => (
  <Field>
    <Label>Last opp profilbilde</Label>
    <Field.Description>beskrivelsestekst</Field.Description>
    <EXPERIMENTAL_FileUpload>
      <EXPERIMENTAL_FileUpload.Description>
        Slipp fil her
      </EXPERIMENTAL_FileUpload.Description>
      <EXPERIMENTAL_FileUpload.Description>
        Filen må være i csv-format og mindre enn 2MB
      </EXPERIMENTAL_FileUpload.Description>
      <EXPERIMENTAL_FileUpload.FakeButton>
        Last opp fil
      </EXPERIMENTAL_FileUpload.FakeButton>
      <EXPERIMENTAL_FileUpload.Input />
    </EXPERIMENTAL_FileUpload>
  </Field>
);

export const FileUploadExampleEn = () => (
  <Field>
    <Label>Upload profile picture</Label>
    <Field.Description>description text</Field.Description>
    <EXPERIMENTAL_FileUpload>
      <EXPERIMENTAL_FileUpload.Description>
        Drop file here
      </EXPERIMENTAL_FileUpload.Description>
      <EXPERIMENTAL_FileUpload.Description>
        File must be in csv format and less than 2MB
      </EXPERIMENTAL_FileUpload.Description>
      <EXPERIMENTAL_FileUpload.FakeButton>
        Upload file
      </EXPERIMENTAL_FileUpload.FakeButton>
      <EXPERIMENTAL_FileUpload.Input />
    </EXPERIMENTAL_FileUpload>
  </Field>
);
