import { useEffect, useRef, useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { useFocusWithin } from './useFocusWithin';

const user = userEvent.setup();

const outsideButtonTestId = 'outside-button';
const insideButtonTestId = 'inside-button';
const focusWithinChangeFn = vi.fn();

const TestComponent = () => {
  const ref = useRef<HTMLSpanElement>(null);
  const [element, setElement] = useState(ref.current);
  useEffect(() => {
    setElement(ref.current);
  }, [ref, setElement]);

  const hasFocus = useFocusWithin<HTMLSpanElement>(element);

  useEffect(() => {
    focusWithinChangeFn(hasFocus);
  }, [hasFocus]);
  return (
    <>
      <button data-testid={outsideButtonTestId}>Outside</button>
      <span ref={ref}>
        <button data-testid={insideButtonTestId}>Inside</button>
      </span>
    </>
  );
};

test('useFocusWithin', async () => {
  render(<TestComponent />);
  expect(focusWithinChangeFn).toHaveBeenLastCalledWith(false);
  await user.click(screen.getByTestId(insideButtonTestId));
  expect(focusWithinChangeFn).toHaveBeenLastCalledWith(true);
  await user.click(screen.getByTestId(outsideButtonTestId));
  expect(focusWithinChangeFn).toHaveBeenLastCalledWith(false);
});
