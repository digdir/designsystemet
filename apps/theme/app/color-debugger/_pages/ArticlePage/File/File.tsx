import type { ThemeInfo } from '@digdir/designsystemet/color';
import { ComponentFillIcon } from '@navikt/aksel-icons';
import { useDebugStore } from '../../../debugStore';
import { ColorIndexes } from '../../../utils';
import classes from './File.module.css';

type FileProps = {
  scale: ThemeInfo;
};

export const File = ({ scale }: FileProps) => {
  const themeSettings = useDebugStore((state) => state.themeSettings);

  return (
    <div
      className={classes.file}
      style={{
        backgroundColor:
          scale[themeSettings.general.colorScheme][ColorIndexes.surfaceTinted]
            .hex,
      }}
    >
      <div
        className={classes.left}
        style={{
          backgroundColor:
            scale[themeSettings.general.colorScheme][ColorIndexes.surfaceHover]
              .hex,
        }}
      >
        <div
          className={classes.circle}
          style={{
            backgroundColor:
              scale[themeSettings.general.colorScheme][
                ColorIndexes.surfaceActive
              ].hex,
          }}
        >
          <ComponentFillIcon
            title='a11y-title'
            fontSize='2rem'
            color={
              scale[themeSettings.general.colorScheme][ColorIndexes.textSubtle]
                .hex
            }
          />
        </div>
      </div>
      <div className={classes.content}>
        <div
          className={classes.title}
          style={{
            color:
              scale[themeSettings.general.colorScheme][ColorIndexes.textDefault]
                .hex,
          }}
        >
          Wanted without escape
        </div>
        <div
          className={classes.desc}
          style={{
            color:
              scale[themeSettings.general.colorScheme][ColorIndexes.textSubtle]
                .hex,
          }}
        >
          Of picture internet of was of willingly by years
        </div>
      </div>
    </div>
  );
};
