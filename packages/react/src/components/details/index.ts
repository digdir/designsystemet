import { Details as DetailsParent } from './details';
import { DetailsContent } from './details-content';
import { DetailsSummary } from './details-summary';

type Details = typeof DetailsParent & {
  /**
   * Details summary component, contains a the heading to toggle the content.
   *
   * @example
   * <Details.Summary>Heading</Details.Summary>
   */
  Summary: typeof DetailsSummary;
  /**
   * Details content component, contains the content of the details item.
   *
   * @example
   * <DetailsContent>Content</DetailsContent>
   */
  Content: typeof DetailsContent;
};

/**
 * Details component, contains `Details.Summary` and `Details.Content` components.
 *
 * @example
 * <Details>
 *  <Details.Summary>Header</Details.Summary>
 *  <Details.Content>Content</Details.Content>
 * </Details>
 */
const DetailsComponent: Details = Object.assign(DetailsParent, {
  Summary: DetailsSummary,
  Content: DetailsContent,
});

DetailsComponent.Summary.displayName = 'Details.Summary';
DetailsComponent.Content.displayName = 'Details.Content';

export type { DetailsProps } from './details';
export type { DetailsContentProps } from './details-content';
export type { DetailsSummaryProps } from './details-summary';
export { DetailsComponent as Details, DetailsContent, DetailsSummary };
