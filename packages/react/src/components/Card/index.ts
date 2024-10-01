import { Card as CardParent } from './Card';
import { CardBlock } from './CardBlock';

const Card = Object.assign(CardParent, {
  Block: CardBlock,
});

Card.Block.displayName = 'Card.Block';

export type { CardProps } from './Card';
export type { CardBlockProps } from './CardBlock';
export { Card, CardBlock };
