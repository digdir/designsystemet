import { render, screen } from '@testing-library/react';

import { Accordion } from '..';

describe('AccordionContent Rendering', () => {
  test('should render ReactNode children', () => {
    render(
      <Accordion>
        <Accordion.Item>
          <Accordion.Content>
            The Fantastic AccordionContent Text
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>,
    );

    expect(screen.getByText('The Fantastic AccordionContent Text'));
  });
});
