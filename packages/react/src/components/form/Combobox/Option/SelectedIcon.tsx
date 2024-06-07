import { CheckmarkIcon } from '@navikt/aksel-icons';
import cl from 'clsx/lite';

type SelectedIconProps = {
  multiple: boolean;
  selected: boolean;
};

export const SelectedIcon = ({ multiple, selected }: SelectedIconProps) => {
  return (
    <div
      className={cl(
        multiple && 'ds-combobox__option__icon-wrapper',
        selected && 'ds-combobox__option__icon-wrapper--selected',
      )}
    >
      {selected && (
        <CheckmarkIcon
          className={'ds-combobox__option__icon-wrapper__icon'}
          aria-hidden
        />
      )}
    </div>
  );
};

SelectedIcon.displayName = 'SelectedIcon';

export default SelectedIcon;
