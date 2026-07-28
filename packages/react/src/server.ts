/**
 * Server-safe exports for use in React Server Components.
 *
 * These components do not use client-only React APIs (hooks, event handlers,
 * createContext) and can be rendered directly in server components.
 *
 * Components that internally render client sub-components (e.g. Checkbox
 * renders Field) still work — the client boundary is handled by those
 * sub-components' own `"use client"` directives.
 */

export type { AlertProps } from './components/alert/alert';
export { Alert } from './components/alert/alert';

export type { AvatarProps } from './components/avatar/avatar';
export { Avatar } from './components/avatar/avatar';

export type { AvatarStackProps } from './components/avatar-stack/avatar-stack';
export { EXPERIMENTAL_AvatarStack } from './components/avatar-stack/avatar-stack';

export type { BadgePositionProps, BadgeProps } from './components/badge';
export { Badge, BadgePosition } from './components/badge';

export type {
  BreadcrumbsItemProps,
  BreadcrumbsLinkProps,
  BreadcrumbsListProps,
  BreadcrumbsProps,
} from './components/breadcrumbs';
export {
  Breadcrumbs,
  BreadcrumbsItem,
  BreadcrumbsLink,
  BreadcrumbsList,
} from './components/breadcrumbs';

export type { ButtonProps } from './components/button/button';
export { Button } from './components/button/button';

export type { CheckboxProps } from './components/checkbox/checkbox';
export { Checkbox } from './components/checkbox/checkbox';

export type {
  ChipButtonProps,
  ChipCheckboxProps,
  ChipRadioProps,
  ChipRemovableProps,
} from './components/chip';
export {
  Chip,
  ChipButton,
  ChipCheckbox,
  ChipRadio,
  ChipRemovable,
} from './components/chip';

export type { DividerProps } from './components/divider/divider';
export { Divider } from './components/divider/divider';

export type {
  ErrorSummaryHeadingProps,
  ErrorSummaryItemProps,
  ErrorSummaryLinkProps,
  ErrorSummaryListProps,
  ErrorSummaryProps,
} from './components/error-summary';
export {
  ErrorSummary,
  ErrorSummaryHeading,
  ErrorSummaryItem,
  ErrorSummaryLink,
  ErrorSummaryList,
} from './components/error-summary';

export type {
  FieldAffixesProps,
  FieldAffixProps,
  FieldCounterProps,
  FieldDescriptionProps,
} from './components/field';
export {
  FieldAffix,
  FieldAffixes,
  FieldCounter,
  FieldDescription,
} from './components/field';

export type {
  FieldsetDescriptionProps,
  FieldsetLegendProps,
  FieldsetProps,
} from './components/fieldset';
export { Fieldset, FieldsetDescription, FieldsetLegend } from './components/fieldset';

export type { FileUploadProps } from './components/file-upload';
export { EXPERIMENTAL_FileUpload } from './components/file-upload';

export type { HeadingProps } from './components/heading/heading';
export { Heading } from './components/heading/heading';

export type { LabelProps } from './components/label/label';
export { Label } from './components/label/label';

export type { LinkProps } from './components/link/link';
export { Link } from './components/link/link';

export type {
  ListItemProps,
  ListOrderedProps,
  ListUnorderedProps,
} from './components/list';
export { List, ListItem, ListOrdered, ListUnordered } from './components/list';

export type {
  PaginationButtonProps,
  PaginationItemProps,
  PaginationListProps,
  PaginationProps,
} from './components/pagination';
export {
  Pagination,
  PaginationButton,
  PaginationItem,
  PaginationList,
} from './components/pagination';

export type { ParagraphProps } from './components/paragraph/paragraph';
export { Paragraph } from './components/paragraph/paragraph';

export type { RadioProps } from './components/radio/radio';
export { Radio } from './components/radio/radio';

export type {
  SelectOptgroupProps,
  SelectOptionProps,
  SelectProps,
} from './components/select';
export { Select, SelectOptgroup, SelectOption } from './components/select';

export type { SkipLinkProps } from './components/skip-link/skip-link';
export { SkipLink } from './components/skip-link/skip-link';

export type { SwitchProps } from './components/switch/switch';
export { Switch } from './components/switch/switch';

export type {
  TableBodyProps,
  TableCellProps,
  TableFootProps,
  TableHeaderCellProps,
  TableHeadProps,
  TableProps,
  TableRowProps,
} from './components/table';
export {
  Table,
  TableBody,
  TableCell,
  TableFoot,
  TableHead,
  TableHeaderCell,
  TableRow,
} from './components/table';

export type { TagProps } from './components/tag/tag';
export { Tag } from './components/tag/tag';

export type { TextareaProps } from './components/textarea/textarea';
export { Textarea } from './components/textarea/textarea';

export type { TextfieldProps } from './components/textfield/textfield';
export { Textfield } from './components/textfield/textfield';

export type { TooltipProps } from './components/tooltip/tooltip';
export { Tooltip } from './components/tooltip/tooltip';

export type { ValidationMessageProps } from './components/validation-message/validation-message';
export { ValidationMessage } from './components/validation-message/validation-message';

export type { DefaultProps, LabelRequired, Placement } from './types';
