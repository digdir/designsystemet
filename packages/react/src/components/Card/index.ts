import type { CardHeaderProps } from './CardHeader';
import type { CardContentProps } from './CardContent';
import type { CardFooterProps } from './CardFooter';
import type { CardGroupProps } from './CardGroup';
import type { CardProps } from './Card';
import { CardHeader } from './CardHeader';
import { CardGroup } from './CardGroup';
import { CardContent } from './CardContent';
import { CardFooter } from './CardFooter';
import { Card as CardParent } from './Card';

type CardComponent = typeof CardParent & {
  Header: typeof CardHeader;
  Content: typeof CardContent;
  Footer: typeof CardFooter;
  Group: typeof CardGroup;
};

const Card = CardParent as CardComponent;

Card.Header = CardHeader;
Card.Content = CardContent;
Card.Footer = CardFooter;
Card.Group = CardGroup;

Card.Header.displayName = 'Card.Header';
Card.Content.displayName = 'Card.Content';
Card.Footer.displayName = 'Card.Footer';
Card.Group.displayName = 'Card.Group';

export type {
  CardProps,
  CardHeaderProps,
  CardContentProps,
  CardFooterProps,
  CardGroupProps,
};
export { Card, CardHeader, CardContent, CardFooter, CardGroup };
