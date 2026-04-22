import {
  Checkbox,
  Field,
  Fieldset,
  Input,
  Label,
  Radio,
  Select,
} from '@digdir/designsystemet-react';

export const Preview = () => {
  return (
    <Fieldset>
      <Fieldset.Legend>Hvilken fjordarm bor du ved?</Fieldset.Legend>
      <Fieldset.Description>
        Valget vil hjelpe oss å forbedre innholdet vi viser deg.
      </Fieldset.Description>
      <Radio label='Barsnesfjorden' name='radio' value='barsnesfjorden' />
      <Radio label='Eidsfjorden' name='radio' value='eidsfjorden' />
      <Radio label='Ingen av de' name='radio' value='ingen-av-de' />
    </Fieldset>
  );
};

export const PreviewEn = () => {
  return (
    <Fieldset>
      <Fieldset.Legend>Which fjord arm do you live by?</Fieldset.Legend>
      <Fieldset.Description>
        The choice will help us improve the content we show you.
      </Fieldset.Description>
      <Radio label='Barsnesfjorden' name='radio' value='barsnesfjorden' />
      <Radio label='Eidsfjorden' name='radio' value='eidsfjorden' />
      <Radio label='None of these' name='radio' value='none-of-these' />
    </Fieldset>
  );
};

export const WithCheckbox = () => {
  return (
    <Fieldset>
      <Fieldset.Legend>Godtar du vilkårene?</Fieldset.Legend>
      <Checkbox label='Ja, jeg godtar' value='agree' />
    </Fieldset>
  );
};

export const WithCheckboxEn = () => {
  return (
    <Fieldset>
      <Fieldset.Legend>Do you accept the terms?</Fieldset.Legend>
      <Checkbox label='Yes, I accept' value='agree' />
    </Fieldset>
  );
};

export const LegendAsHeading = () => {
  return (
    <Fieldset>
      <Fieldset.Legend>
        <h1>Hvor skal du reise?</h1>
      </Fieldset.Legend>
    </Fieldset>
  );
};

export const LegendAsHeadingEn = () => {
  return (
    <Fieldset>
      <Fieldset.Legend>
        <h1>Where are you going to travel?</h1>
      </Fieldset.Legend>
    </Fieldset>
  );
};

export const WithFields = () => {
  return (
    <Fieldset>
      <Fieldset.Legend>Personopplysninger</Fieldset.Legend>
      <Fieldset.Description>
        Fyll inn dine personopplysninger nedenfor.
      </Fieldset.Description>
      <Field>
        <Label>Fornavn</Label>
        <Input />
      </Field>
      <Field>
        <Label>Kjønn</Label>
        <Select>
          <Select.Option value='male'>Mann</Select.Option>
          <Select.Option value='female'>Kvinne</Select.Option>
          <Select.Option value='other'>Annet</Select.Option>
        </Select>
      </Field>
    </Fieldset>
  );
};

export const WithFieldsEn = () => {
  return (
    <Fieldset>
      <Fieldset.Legend>Personal information</Fieldset.Legend>
      <Fieldset.Description>
        Fill in your personal information below.
      </Fieldset.Description>
      <Field>
        <Label>First name</Label>
        <Input />
      </Field>
      <Field>
        <Label>Gender</Label>
        <Select>
          <Select.Option value='male'>Male</Select.Option>
          <Select.Option value='female'>Female</Select.Option>
          <Select.Option value='other'>Other</Select.Option>
        </Select>
      </Field>
    </Fieldset>
  );
};
