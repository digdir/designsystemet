import { Card as CardParent } from './card';
import { CardBlock } from './card-block';

type Card = typeof CardParent & {
  /**
   * Use `Card.Block` to segment content with divider lines or to add full-bleed pictures/video
   *
   * Place as a descendant of `Card`
   *
   * @example
   * <Card>
   *   <Card.Block>Header</Card.Block>
   *   <Card.Block>Content</Card.Block>
   *   <Card.Block>Footer</Card.Block>
   * </Card>
   */
  Block: typeof CardBlock;
};
/**
 * Card component to present content in a structured way.
 *
 * @example
 * <Card>
 *  <Card.Block>Header</Card.Block>
 *  <Card.Block>Content</Card.Block>
 *  <Card.Block>Footer</Card.Block>
 * </Card>
 */
const CardComponent: Card = Object.assign(CardParent, {
  Block: CardBlock,
});

CardComponent.Block.displayName = 'Card.Block';

export type { CardProps } from './card';
export type { CardBlockProps } from './card-block';
export { CardComponent as Card, CardBlock };
