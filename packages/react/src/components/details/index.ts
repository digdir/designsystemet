import { Details as DetailsParent } from './details';
import { DetailsContent } from './details-content';
import { DetailsSummary } from './details-summary';

/**
 * Details component, contains `Details.Summary` and `Details.Content` components.
 *
 * @example
 * <Details>
 *  <Details.Summary>Header</Details.Summary>
 *  <Details.Content>Content</Details.Content>
 * </Details>
 */
const Details = Object.assign(DetailsParent, {
  Summary: DetailsSummary,
  Content: DetailsContent,
});

Details.Summary.displayName = 'Details.Summary';
Details.Content.displayName = 'Details.Content';

export type { DetailsProps } from './details';
export type { DetailsContentProps } from './details-content';
export type { DetailsSummaryProps } from './details-summary';
export { Details, DetailsContent, DetailsSummary };
