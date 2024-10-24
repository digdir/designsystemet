import { createContext } from 'react';

import type { FormFieldProps } from '../useFormField';

export type FieldsetContextType = Pick<
  FormFieldProps,
  'error' | 'errorId' | 'disabled' | 'size'
>;

export const FieldsetContext = createContext<FieldsetContextType | null>(null);
