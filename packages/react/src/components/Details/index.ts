import { Details as DetailsParent } from './Details';
import { DetailsContent } from './DetailsContent';
import { DetailsSummary } from './DetailsSummary';

/**
 * Details are used to toggle the visibility of content.
 * @example
 * <Details>
 *  <Details.Summary>Heading 1</Details.Summary>
 *  <Details.Content>Content 1</Details.Content>
 * </Details>
 */
const Details = Object.assign(DetailsParent, {
  Summary: DetailsSummary,
  Content: DetailsContent,
});

Details.Summary.displayName = 'Details.Summary';
Details.Content.displayName = 'Details.Content';

export type { DetailsContentProps } from './DetailsContent';
export type { DetailsSummaryProps } from './DetailsSummary';
export type { DetailsProps } from './Details';
export { Details, DetailsContent, DetailsSummary };
