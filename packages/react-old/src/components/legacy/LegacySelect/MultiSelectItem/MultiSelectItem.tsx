import utilClasses from '../../../../utilities/utility.module.css';

import classes from './MultiSelectItem.module.css';

export interface MultiSelectItemProps {
  deleteButtonLabel?: string;
  disabled: boolean;
  onDeleteButtonClick: () => void;
  label: string;
}

const MultiSelectItem = ({
  deleteButtonLabel,
  disabled,
  onDeleteButtonClick,
  label,
}: MultiSelectItemProps) => (
  <span className={classes.multiSelectItem}>
    <span>{label}</span>
    <button
      aria-label={deleteButtonLabel}
      className={`${classes.deleteButton} ${utilClasses.focusable}`}
      disabled={disabled}
      onClick={onDeleteButtonClick}
      type='button'
    >
      <span className={classes.deleteButtonCross} />
    </button>
  </span>
);

MultiSelectItem.displayName = 'MultiSelectItem';

export { MultiSelectItem };
