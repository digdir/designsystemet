import { Chip } from '@digdir/designsystemet-react';

export const Preview = () => {
  return (
    <>
      <Chip.Radio name='my-radio' value='nynorsk' defaultChecked>
        Nynorsk
      </Chip.Radio>
      <Chip.Radio name='my-radio' value='bokmål'>
        Bokmål
      </Chip.Radio>
    </>
  );
};

export const CheckboxVariant = () => {
  return <Chip.Checkbox>Nynorsk</Chip.Checkbox>;
};

export const Removable = () => {
  return <Chip.Removable aria-label='Slett Norge'>Norge</Chip.Removable>;
};

export const AsButton = () => {
  return <Chip.Button>Tøm alle filtre</Chip.Button>;
};
