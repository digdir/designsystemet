import { Chip } from '@digdir/designsystemet-react';

export const Preview = () => (
  <>
    <Chip.Radio name='my-radio' value='nynorsk' defaultChecked>
      Nynorsk
    </Chip.Radio>
    <Chip.Radio name='my-radio' value='bokmål'>
      Bokmål
    </Chip.Radio>
  </>
);

export const CheckboxVariant = () => <Chip.Checkbox>Nynorsk</Chip.Checkbox>;

export const Removable = () => (
  <Chip.Removable aria-label='Slett Norge'>Norge</Chip.Removable>
);

export const Button = () => <Chip.Button>Tøm alle filtre</Chip.Button>;
