import { render, screen } from '@testing-library/react';
import { Card } from './card';
import { CardBlock } from './card-block';

describe('Card Component', () => {
  it('renders Card component', () => {
    render(
      <Card title='card'>
        <CardBlock />
      </Card>,
    );
    expect(screen.getByTitle('card')).toBeInTheDocument();
  });

  it('renders media image if provided', () => {
    const mediaImage = 'some/media/image/path';

    render(
      <Card>
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
