import type { CardContentProps } from './CardContent';
import type { CardFooterProps } from './CardFooter';
import type { CardProps } from './Card';
import { CardHeader, type CardHeaderProps } from './CardHeader';
import { CardContent } from './CardContent';
import { CardFooter } from './CardFooter';
import { Card as CardParent } from './Card';
import { CardMedia, type CardMediaProps } from './CardMedia';

type CardComponent = typeof CardParent & {
  Header: typeof CardHeader;
  Content: typeof CardContent;
  Footer: typeof CardFooter;
  Media: typeof CardMedia;
};

const Card = CardParent as CardComponent;

Card.Header = CardHeader;
Card.Content = CardContent;
Card.Footer = CardFooter;
Card.Media = CardMedia;

Card.Header.displayName = 'Card.Header';
Card.Content.displayName = 'Card.Content';
Card.Footer.displayName = 'Card.Footer';
Card.Media.displayName = 'Card.Media';

export type { CardProps, CardHeaderProps, CardContentProps, CardFooterProps, CardMediaProps };
export { Card, CardHeader, CardContent, CardFooter, CardMedia };
