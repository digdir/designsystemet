import { Card as CardParent } from './Card';
import { CardBlock } from './CardBlock';

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
const Card = Object.assign(CardParent, {
  Block: CardBlock,
});

Card.Block.displayName = 'Card.Block';

export type { CardProps } from './Card';
export type { CardBlockProps } from './CardBlock';
export { Card, CardBlock };
