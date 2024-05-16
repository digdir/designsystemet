import { render, screen } from '@testing-library/react';

import { Tabs } from '..';

import { TabContent } from '.';

describe('TabContent', () => {
  test('renders ReactNodes as children when TabContents value is selected', () => {
    render(
      <Tabs defaultValue='value1'>
        <TabContent value='value1'>
          <div>content 1</div>
        </TabContent>
      </Tabs>,
    );

    const content = screen.queryByText('content 1');
    expect(content).toBeInTheDocument();
  });
});
