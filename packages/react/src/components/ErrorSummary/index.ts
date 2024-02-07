import { ErrorSummary as ErrorSummaryRoot } from './ErrorSummary';
import { ErrorSummaryHeading } from './ErrorSummaryHeading';
import { ErrorSummaryItem } from './ErrorSummaryItem';
import ErrorSummaryList from './ErrorSummaryList';

type ErrorSummaryComponent = typeof ErrorSummaryRoot & {
  Item: typeof ErrorSummaryItem;
  Heading: typeof ErrorSummaryHeading;
  List: typeof ErrorSummaryList;
};

const ErrorSummary = ErrorSummaryRoot as ErrorSummaryComponent;

ErrorSummary.Item = ErrorSummaryItem;
ErrorSummary.Heading = ErrorSummaryHeading;
ErrorSummary.List = ErrorSummaryList;

export type { ErrorSummaryProps } from './ErrorSummary';
export type { ErrorSummaryItemProps } from './ErrorSummaryItem';
export type { ErrorSummaryHeadingProps } from './ErrorSummaryHeading';
export type { ErrorSummaryListProps } from './ErrorSummaryList';

export {
  ErrorSummary,
  ErrorSummaryItem,
  ErrorSummaryHeading,
  ErrorSummaryList,
};
