import { Details as DetailsParent } from './Details';
import { DetailsContent } from './DetailsContent';
import { DetailsItem } from './DetailsItem';
import { DetailsSummary } from './DetailsSummary';

type DetailsComponent = typeof DetailsParent & {
  Item: typeof DetailsItem;
  Summary: typeof DetailsSummary;
  Content: typeof DetailsContent;
};

/**
 * Detailss are used to toggle the visibility of content.
 * @example
 * <Details>
 *  <Details.Item>
 *   <Details.Summary>Heading 1</Details.Summary>
 *   <Details.Content>Content 1</Details.Content>
 *  </Details.Item>
 * <Details>
 */
const Details = DetailsParent as DetailsComponent;

Details.Summary = DetailsSummary;
Details.Content = DetailsContent;
Details.Item = DetailsItem;

Details.Summary.displayName = 'Details.Summary';
Details.Content.displayName = 'Details.Content';
Details.Item.displayName = 'Details.Item';

export type { DetailsContentProps } from './DetailsContent';
export type { DetailsSummaryProps } from './DetailsSummary';
export type { DetailsItemProps } from './DetailsItem';
export type { DetailsProps } from './Details';
export { Details, DetailsItem, DetailsContent, DetailsSummary };
