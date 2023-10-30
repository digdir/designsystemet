import type { CardSectionProps } from './CardSection';
import type { RoleCardProps } from './CardRoleCard';
import type { CardProps } from './Card';
import { CardSection } from './CardSection';
import { CardGroup } from './CardGroup';
import { RoleCard as CardRoleCard } from './CardRoleCard';
import { Card as CardParent } from './Card';

type CardComponent = typeof CardParent & {
  Section: typeof CardSection;
  Group: typeof CardGroup;
  RoleCard: typeof CardRoleCard;
};

const Card = CardParent as CardComponent;

Card.Section = CardSection;
Card.Group = CardGroup;
Card.RoleCard = CardRoleCard;

Card.Section.displayName = 'Card.Section';
Card.Group.displayName = 'Card.Group';
Card.RoleCard.displayName = 'Card.RoleCard';

export type { CardProps, CardSectionProps, RoleCardProps };
export { Card, CardGroup, CardSection, CardRoleCard };
