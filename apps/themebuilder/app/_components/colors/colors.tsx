import type { Color } from '@digdir/designsystemet/internal';
import { useState } from 'react';
import { useThemeStore } from '~/model/theme-store';
import { ColorModal } from '../color-modal/color-modal';
import { Scale } from '../color-scale/color-scale';
import classes from './colors.module.css';

/** The scale of every color of the theme. A step opens a dialog with details about it. */
export const Colors = () => {
  const { colors } = useThemeStore();
  const [selected, setSelected] = useState<{
    color: Color;
    namespace: string;
  } | null>(null);

  return (
    <div className={classes.rows}>
      {colors.map((color, index) => (
        <div key={color.name} className={classes.row}>
          <div className={classes.scaleLabel}>{color.name}</div>
          <Scale
            colorScale={color.colors}
            showHeader={index === 0}
            namespace={color.name}
            onSelect={(step) =>
              setSelected({ color: step, namespace: color.name })
            }
          />
        </div>
      ))}
      {selected && (
        <ColorModal
          // The dialog keeps the chosen color format in state, which starts over for another color
          key={`${selected.namespace} ${selected.color.name} ${selected.color.hex}`}
          namespace={selected.namespace}
          color={selected.color}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
};
