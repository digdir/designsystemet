import { ToggleGroup } from '@digdir/designsystemet-react';
import type { ColorScheme } from '@digdir/designsystemet/color';
import { useEffect, useState } from 'react';
import { useThemeStore } from '../../store';

type AppearanceToggleProps = {
  showLabel?: boolean;
};

const colorSchemes: {
  name: string;
  value: ColorScheme;
}[] = [
  { name: 'Lys', value: 'light' },
  { name: 'Mørk', value: 'dark' },
];

export const AppearanceToggle = ({
  showLabel = false,
}: AppearanceToggleProps) => {
  const colorScheme = useThemeStore((state) => state.colorScheme);
  const setColorScheme = useThemeStore((state) => state.setColorScheme);

  const [active, setActive] = useState(colorScheme);

  useEffect(() => {
    setActive(colorScheme);
  }, [colorScheme]);

  return (
    <ToggleGroup
      value={colorScheme}
      name='toggle-group-nuts'
      data-size='sm'
      data-color='neutral'
      className='subtle-toggle-group'
      onChange={(value) => {
        setColorScheme(value as 'light' | 'dark');
      }}
    >
      <ToggleGroup.Item value='light'>Lys modus</ToggleGroup.Item>
      <ToggleGroup.Item value='dark'>Mørk modus</ToggleGroup.Item>
    </ToggleGroup>
  );
};
