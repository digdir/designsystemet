import type { ReactNode } from 'react';

export type LegacySelectProps =
  | LegacySingleSelectProps
  | LegacyMultiSelectProps;

export type LegacySingleSelectProps = SelectPropsBase & {
  multiple?: false;
  onBlur?: LegacySingleSelectEvent;
  onChange?: LegacySingleSelectEvent;
  onFocus?: LegacySingleSelectEvent;
  options: LegacySingleSelectOption[];
  value?: string;
};

export type LegacyMultiSelectProps = SelectPropsBase & {
  deleteButtonLabel?: string;
  multiple: true;
  onBlur?: LegacyMultiSelectEvent;
  onChange?: LegacyMultiSelectEvent;
  onFocus?: LegacyMultiSelectEvent;
  options: LegacyMultiSelectOption[];
  value?: string[];
};

interface SelectPropsBase {
  disabled?: boolean;
  error?: boolean;
  hideLabel?: boolean;
  inputId?: string;
  inputName?: string;
  label?: string;
  searchLabel?: string;
  portal?: boolean;
}

export type LegacySingleSelectOption = {
  keywords?: string[];
  label: string;
  value: string;
  formattedLabel?: ReactNode;
};

export type LegacyMultiSelectOption = LegacySingleSelectOption & {
  deleteButtonLabel?: string;
};

export type LegacySingleSelectEvent = (value: string) => void;
export type LegacyMultiSelectEvent = (value: string[]) => void;
