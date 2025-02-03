import type { ThemeInfo } from '@digdir/designsystemet/color';
import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';
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
    return (
      <div className={classes.item}>
        <div
          className={classes.header}
          style={{
            backgroundColor:
              scale.light[
                state === 'open'
                  ? ColorIndexes.surfaceHover
                  : ColorIndexes.surfaceTinted
              ].hex,
            borderTop: '1px solid' + scale.light[ColorIndexes.borderSubtle].hex,
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
              backgroundColor: scale.light[ColorIndexes.surfaceTinted].hex,
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
        <Item />
      </div>
    </div>
  );
};
