import { render as renderRtl, screen } from '@testing-library/react';

import type { CardProps } from './Card';
import { Card } from './Card';
import { CardSection } from './CardSection';

const renderCard = (props?: Partial<CardProps>) =>
  renderRtl(
    <Card title='card' {...props}>
      <CardSection />
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
        <CardSection>
          <img src={mediaImage} alt='cat' />
        </CardSection>
        <CardSection />
        <CardSection />
        <CardSection />
      </Card>,
    );
    expect(screen.getByRole('img')).toHaveAttribute('src', mediaImage);
  });
});
