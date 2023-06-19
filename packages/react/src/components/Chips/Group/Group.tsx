import React from 'react';

type GroupProps = {
  children: React.ReactNode;
};
export const Group = ({ children }: GroupProps): JSX.Element => {
  const childrenArray = React.Children.toArray(children);
  return (
    <ul>
      {childrenArray.map(
        (child, index): JSX.Element => (
          <li key={`${child.toString()}-${index}`}>{child}</li>
        ),
      )}
    </ul>
  );
};
