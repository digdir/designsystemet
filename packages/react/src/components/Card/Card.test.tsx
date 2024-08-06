import { render as renderRtl, screen } from '@testing-library/react';

import type { CardProps } from './Card';
import { Card } from './Card';
import { CardContent } from './CardContent';
import { CardFooter } from './CardFooter';
import { CardHeader } from './CardHeader';
import { CardMedia } from './CardMedia';

const renderCard = (props?: Partial<CardProps>) =>
  renderRtl(
    <Card title='card' {...props}>
      <CardHeader />
      <CardContent />
      <CardFooter />
    </Card>,
  );

describe('Card Component', () => {
  it('renders Card component', () => {
    renderCard();
    expect(screen.getByTitle('card')).toBeInTheDocument();
  });

  it('renders media image if provided', () => {
    const mediaImage = 'some/media/image/path';

    renderRtl(
      <Card title='card'>
        <CardMedia>
          <img src={mediaImage} alt='cat' />
        </CardMedia>
        <CardHeader />
        <CardContent />
        <CardFooter />
      </Card>,
    );
    expect(screen.getByRole('img')).toHaveAttribute('src', mediaImage);
  });
});
