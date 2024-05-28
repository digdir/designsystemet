import { ErrorSummaryRoot } from './ErrorSummaryRoot';
import { ErrorSummaryHeading } from './ErrorSummaryHeading';
import { ErrorSummaryItem } from './ErrorSummaryItem';
import ErrorSummaryList from './ErrorSummaryList';

type ErrorSummaryComponent = {
  Root: typeof ErrorSummaryRoot;
  Item: typeof ErrorSummaryItem;
  Heading: typeof ErrorSummaryHeading;
  List: typeof ErrorSummaryList;
};

const ErrorSummary = {} as ErrorSummaryComponent;

ErrorSummary.Root = ErrorSummaryRoot;
ErrorSummary.Item = ErrorSummaryItem;
ErrorSummary.Heading = ErrorSummaryHeading;
ErrorSummary.List = ErrorSummaryList;

ErrorSummary.Root.displayName = 'ErrorSummary.Root';
ErrorSummary.Item.displayName = 'ErrorSummary.Item';
ErrorSummary.Heading.displayName = 'ErrorSummary.Heading';
ErrorSummary.List.displayName = 'ErrorSummary.List';

export type { ErrorSummaryProps } from './ErrorSummaryRoot';
export type { ErrorSummaryItemProps } from './ErrorSummaryItem';
export type { ErrorSummaryHeadingProps } from './ErrorSummaryHeading';
export type { ErrorSummaryListProps } from './ErrorSummaryList';

export {
  ErrorSummary,
  ErrorSummaryRoot,
  ErrorSummaryItem,
  ErrorSummaryHeading,
  ErrorSummaryList,
};
