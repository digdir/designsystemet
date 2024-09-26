import { render as renderRtl, screen } from '@testing-library/react';

import type { CardProps } from './Card';
import { Card } from './Card';
import { CardBlock } from './CardBlock';

const renderCard = (props?: Partial<CardProps>) =>
  renderRtl(
    <Card title='card' {...props}>
      <CardBlock />
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
        <CardBlock>
          <img src={mediaImage} alt='cat' />
        </CardBlock>
        <CardBlock />
        <CardBlock />
        <CardBlock />
      </Card>,
    );
    expect(screen.getByRole('img')).toHaveAttribute('src', mediaImage);
  });
});
