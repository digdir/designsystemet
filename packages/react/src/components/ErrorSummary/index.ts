import { ErrorSummary as ErrorSummaryRoot } from './ErrorSummary';
import { ErrorSummaryItem } from './ErrorSummaryItem';

type ErrorSummaryComponent = typeof ErrorSummaryRoot & {
  Item: typeof ErrorSummaryItem;
};

const ErrorSummary = ErrorSummaryRoot as ErrorSummaryComponent;

ErrorSummary.Item = ErrorSummaryItem;

ErrorSummary.Item.displayName = 'ErrorSummary.Item';

export { ErrorSummary, ErrorSummaryItem };
