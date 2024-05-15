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
        multiple && 'fds-combobox__option__icon-wrapper',
        selected && 'fds-combobox__option__icon-wrapper--selected',
      )}
    >
      {selected && (
        <CheckmarkIcon
          className={'fds-combobox__option__icon-wrapper__icon'}
          aria-hidden
        />
      )}
    </div>
  );
};

SelectedIcon.displayName = 'SelectedIcon';

export default SelectedIcon;
