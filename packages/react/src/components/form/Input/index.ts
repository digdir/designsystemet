import { Input as InputComp } from './Input';
import { InputAffix, InputAffixWrapper } from './InputAffix';

const Input = Object.assign(InputComp, {
  Affix: InputAffix,
  AffixWrapper: InputAffixWrapper,
});

Input.Affix.displayName = 'Input.Affix';
Input.AffixWrapper.displayName = 'Input.AffixWrapper';

export type { InputProps } from './Input';
export type { InputAffixProps, InputAffixWrapperProps } from './InputAffix';
export { Input, InputAffix, InputAffixWrapper };
