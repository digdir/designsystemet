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

export const WithCheckbox = () => {
  return (
    <Fieldset>
      <Fieldset.Legend>Godtar du vilkårene?</Fieldset.Legend>
      <Checkbox label='Ja, jeg godtar' value='agree' />
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
