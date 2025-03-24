import type { ThemeInfo } from '@digdir/designsystemet/color';
import { useState } from 'react';
import type { IColor } from 'react-color-palette';
import { ColorInput } from '../../../ColorInput/ColorInput';
import { useDebugStore } from '../../../debugStore';
import { Alert } from '../Alert/Alert';
import classes from './StatusPage.module.css';

type ItemProps = {
  scale: ThemeInfo;
  type: 'success' | 'warning' | 'info' | 'error';
  color: IColor;
  setColor: (color: IColor) => void;
};

const Item = ({ scale, type, color, setColor }: ItemProps) => {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <div className={classes.item}>
      <div className={classes.input}>
        <ColorInput
          color={color}
          setColor={setColor}
          showPicker={showPicker}
          onColorClicked={() => {
            setShowPicker(!showPicker);
          }}
        />
      </div>
      <div>
        <Alert type={type} />
      </div>
    </div>
  );
};

export const StatusPage = () => {
  const themeSettings = useDebugStore((state) => state.themeSettings);
  const colorScales = useDebugStore((state) => state.colorScales);
  const statusColors = useDebugStore((state) => state.statusColors);
  const setStatusColors = useDebugStore((state) => state.setStatusColors);

  return (
    <div className={classes.status}>
      <div className={classes.heading}>Status colors</div>
      <div className={classes.items}>
        <Item
          scale={colorScales[12][0]}
          color={statusColors.success}
          setColor={(color: IColor) =>
            setStatusColors({ ...statusColors, success: color })
          }
          type='success'
        />
        <Item
          scale={colorScales[12][1]}
          color={statusColors.error}
          setColor={(color: IColor) =>
            setStatusColors({ ...statusColors, error: color })
          }
          type='error'
        />
        <Item
          scale={colorScales[12][2]}
          color={statusColors.warning}
          setColor={(color: IColor) =>
            setStatusColors({ ...statusColors, warning: color })
          }
          type='warning'
        />
        <Item
          scale={colorScales[12][3]}
          color={statusColors.info}
          setColor={(color: IColor) =>
            setStatusColors({ ...statusColors, info: color })
          }
          type='info'
        />
      </div>
    </div>
  );
};
