import React from 'react';
import { render as renderRtl, screen } from '@testing-library/react';

import type { CardProps } from './Card';
import { Card } from './Card';
import { CardContent } from './CardContent/CardContent';
import { CardFooter } from './CardFooter/CardFooter';
import { CardHeader } from './CardHeader/CardHeader';

const renderCard = (props?: Partial<CardProps>) =>
  renderRtl(
    <Card
      title='card'
      {...props}
    >
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

  it('applies shadow prop correctly', () => {
    const shadow = 'xsmall';
    renderCard({ shadow });
    expect(screen.getByTitle('card')).toHaveClass(`${shadow}Shadow`);
  });

  it('applies borderRadius prop correctly', () => {
    const borderRadius = 'small';
    renderCard({ borderRadius });
    expect(screen.getByTitle('card')).toHaveClass(
      `${borderRadius}BorderRadius`,
    );
  });

  it('applies variant prop correctly', () => {
    const variant = 'neutral';
    renderCard({ variant });
    expect(screen.getByTitle('card')).toHaveClass(`${variant}Background`);
  });

  it('renders media image if provided', () => {
    const mediaImage = 'some/media/image/path';
    const media = (
      <img
        src={mediaImage}
        alt='cat'
      />
    );
    renderCard({
      MediaImage: media,
    });
    expect(screen.getByRole('img')).toHaveAttribute('src', mediaImage);
  });
});
