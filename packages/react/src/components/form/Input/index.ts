import { InputAffix, InputAffixWrapper } from '../Field/InputAffix';
import { Input as InputComp } from './Input';

const Input = Object.assign(InputComp, {
  Affix: InputAffix,
  AffixWrapper: InputAffixWrapper,
});

Input.Affix.displayName = 'Input.Affix';
Input.AffixWrapper.displayName = 'Input.AffixWrapper';

export type { InputProps } from './Input';
export type {
  InputAffixProps,
  InputAffixWrapperProps,
} from '../Field/InputAffix';
export { Input, InputAffix, InputAffixWrapper };
