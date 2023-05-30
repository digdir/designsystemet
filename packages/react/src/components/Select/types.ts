import type { ReactNode } from 'react';

export type SelectProps = SingleSelectProps | MultiSelectProps;

export type SingleSelectProps = SelectPropsBase & {
  multiple?: false;
  onBlur?: SingleSelectEvent;
  onChange?: SingleSelectEvent;
  onFocus?: SingleSelectEvent;
  options: SingleSelectOption[];
  value?: string;
};

export type MultiSelectProps = SelectPropsBase & {
  deleteButtonLabel?: string;
  multiple: true;
  onBlur?: MultiSelectEvent;
  onChange?: MultiSelectEvent;
  onFocus?: MultiSelectEvent;
  options: MultiSelectOption[];
  value?: string[];
};

interface SelectPropsBase {
  disabled?: boolean;
  error?: boolean;
  hideLabel?: boolean;
  inputId?: string;
  label?: string;
  searchLabel?: string;
}

export type SingleSelectOption = {
  keywords?: string[];
  label: string;
  value: string;
  formattedLabel?: ReactNode;
};

export type MultiSelectOption = SingleSelectOption & {
  deleteButtonLabel?: string;
};

export type SingleSelectEvent = (value: string) => void;
export type MultiSelectEvent = (value: string[]) => void;
