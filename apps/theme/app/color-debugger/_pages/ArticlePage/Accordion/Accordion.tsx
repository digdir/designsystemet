import type { ThemeInfo } from '@digdir/designsystemet/color';
import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';
import { useState } from 'react';
import { useDebugStore } from '../../../debugStore';
import { ColorIndexes } from '../../../utils';
import classes from './Accordion.module.css';

type AccordionProps = {
  scale: ThemeInfo;
};

export const Accordion = ({ scale }: AccordionProps) => {
  type ItemProps = {
    state?: 'open' | 'closed';
  };

  const Item = ({ state = 'closed' }: ItemProps) => {
    const [headerState, setHeaderState] = useState<'on' | 'off'>('off');
    const themeSettings = useDebugStore((state) => state.themeSettings);

    const onHeaderEnter = () => {
      setHeaderState('on');
    };
    const onHeaderLeave = () => {
      setHeaderState('off');
    };

    return (
      <div className={classes.item}>
        <div
          onMouseEnter={() => onHeaderEnter()}
          onMouseLeave={() => onHeaderLeave()}
          className={classes.header}
          style={{
            backgroundColor:
              scale[themeSettings.general.colorScheme][
                state === 'open'
                  ? headerState === 'on'
                    ? ColorIndexes.surfaceActive
                    : ColorIndexes.surfaceHover
                  : headerState === 'on'
                    ? ColorIndexes.surfaceHover
                    : ColorIndexes.surfaceTinted
              ].hex,
            borderTop:
              '1px solid' +
              scale[themeSettings.general.colorScheme][
                ColorIndexes.borderSubtle
              ].hex,
            color:
              scale[themeSettings.general.colorScheme][ColorIndexes.textDefault]
                .hex,
          }}
        >
          {state === 'closed' && (
            <ChevronDownIcon title='a11y-title' fontSize='1.5rem' />
          )}
          {state === 'open' && (
            <ChevronUpIcon title='a11y-title' fontSize='1.5rem' />
          )}
          Accordion
        </div>
        {state === 'open' && (
          <div
            className={classes.body}
            style={{
              backgroundColor:
                scale[themeSettings.general.colorScheme][
                  ColorIndexes.surfaceTinted
                ].hex,
              color:
                scale[themeSettings.general.colorScheme][
                  ColorIndexes.textDefault
                ].hex,
            }}
          >
            Sleepiness the his soon even bit the immediately my disciplined wish
            some she behind least sported time.
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={classes.accordion}>
      <div className={classes.items}>
        <Item />
        <Item state='open' />

        <Item />
      </div>
    </div>
  );
};
