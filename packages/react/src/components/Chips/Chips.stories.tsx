import React, { useState } from 'react';
import type { Meta, StoryFn, StoryObj } from '@storybook/react';

import Removable from './Removable';
import Toggle from './Toggle';

import { Chips, ChipsProps } from '.';

type Story = StoryObj<typeof Chips>;

export default {
  title: 'Kjernekomponenter/Chips',
  component: Chips,
  subcomponents: {
    Removable,
    Toggle,
  },
  parameters: {
    status: {
      type: 'beta',
      url: 'http://www.url.com/status',
    },
  },
  argTypes: {
    type: {
      control: {
        type: 'radio',
        options: ['toggle', 'removable'],
      },
    },
    size: {
      control: {
        type: 'radio',
        options: ['xsmall', 'small'],
      },
    },
  },
} as Meta;

export const props: Story = {
  args: {
    children: (
      <>
        <Chips.Removable>Test removable</Chips.Removable>
        <Chips.Removable>123</Chips.Removable>
        <Chips.Toggle>Test toggle</Chips.Toggle>
        <Chips.Toggle>Test 123</Chips.Toggle>
      </>
    ),
  },
};

const options = ['Norsk', 'Dansk', 'Svensk', 'Tysk', 'Spansk'];

export const RemovableChip: StoryFn = () => {
  return (
    <div className='colgap'>
      <Chips>
        {options.map((c, y) => (
          <Chips.Removable key={y}>{c}</Chips.Removable>
        ))}
      </Chips>
      <Chips>
        {options.map((c, y) => (
          <Chips.Removable key={y}>{c}</Chips.Removable>
        ))}
      </Chips>
    </div>
  );
};

export const ToggleChip: StoryFn = () => {
  const [selected, setSelected] = useState<number[]>([]);
  return (
    <Chips>
      {options.map((c, y) => (
        <Chips.Toggle
          selected={selected.includes(y)}
          onClick={() =>
            setSelected(
              selected.includes(y)
                ? selected.filter((x) => x !== y)
                : [...selected, y],
            )
          }
          key={y}
        >
          {c}
        </Chips.Toggle>
      ))}
    </Chips>
  );
};

// export const Small = () => {
//   const [selected, setSelected] = useState<number[]>([]);
//   return (
//     <div className='colgap'>
//       <Chips size='small'>
//         {options.map((c, y) => (
//           <Chips.Removable key={y}>{c}</Chips.Removable>
//         ))}
//       </Chips>
//       <Chips size='small'>
//         {options.map((c, y) => (
//           <Chips.Toggle
//             selected={selected.includes(y)}
//             onClick={() =>
//               setSelected(
//                 selected.includes(y)
//                   ? selected.filter((x) => x !== y)
//                   : [...selected, y],
//               )
//             }
//             key={y}
//           >
//             {c}
//           </Chips.Toggle>
//         ))}
//       </Chips>
//     </div>
//   );
// };
