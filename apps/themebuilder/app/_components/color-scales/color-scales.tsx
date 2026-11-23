import type { Color } from '@digdir/designsystemet/internal';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useThemeStore } from '~/model/theme-store';
import { Scale } from '../color-scale/color-scale';
import { ColorStepDialog } from '../color-step-dialog/color-step-dialog';
import classes from './color-scales.module.css';

/** The scale of every color of the theme. A step opens a dialog with details about it. */
export const ColorScales = () => {
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
      {selected &&
        /* Temp fix. The scales are shown in the previewed appearance. The dialog is part of the page, not of the preview,
         * so it is rendered outside of it and keeps the appearance of the page. */
        createPortal(
          <ColorStepDialog
            // The dialog keeps the chosen color format in state, which starts over for another color
            key={`${selected.namespace} ${selected.color.name} ${selected.color.hex}`}
            namespace={selected.namespace}
            color={selected.color}
            onClose={() => setSelected(null)}
          />,
          document.body,
        )}
    </div>
  );
};
