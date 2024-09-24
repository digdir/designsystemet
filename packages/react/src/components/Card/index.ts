import { Card as CardParent } from './Card';
import { CardSection } from './CardSection';

const Card = Object.assign(CardParent, {
  Section: CardSection,
});

Card.Section.displayName = 'Card.Section';

export type { CardProps } from './Card';
export type { CardSectionProps } from './CardSection';
export { Card, CardSection };
