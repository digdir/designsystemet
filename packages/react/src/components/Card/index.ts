import { Card as CardParent } from './Card';
import { CardPart } from './CardPart';

const Card = Object.assign(CardParent, {
  Part: CardPart,
});

Card.Part.displayName = 'Card.Part';

export type { CardProps } from './Card';
export type { CardPartProps } from './CardPart';
export { Card, CardPart };
