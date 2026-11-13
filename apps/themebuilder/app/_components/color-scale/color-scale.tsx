import {
  type SemanticColorNames,
  semanticColorSpec,
  type ThemeInfo,
} from '@digdir/designsystemet/internal';
import { ColorGroup } from '../color-group/color-group';
import { capitalizeFirstLetter } from '../color-modal/util';

import classes from './color-scale.module.css';

type Group = {
  header: string;
  colorNames: SemanticColorNames[];
  names: string[];
};

/** The color steps grouped by their `group` in the spec, in spec order */
const groups = Object.values(semanticColorSpec).reduce<Group[]>(
  (acc, { name, group, displayName }) => {
    const header = capitalizeFirstLetter(group);
    let current = acc.find((g) => g.header === header);
    if (!current) {
      current = { header, colorNames: [], names: [] };
      acc.push(current);
    }
    current.colorNames.push(name);
    current.names.push(displayName.replace(`${header} `, ''));
    return acc;
  },
  [],
);

type ScaleProps = {
  colorScale: ThemeInfo;
  showHeader?: boolean;
  namespace: string;
};

export const Scale = ({ colorScale, showHeader, namespace }: ScaleProps) => {
  return (
    <div className={classes.themes}>
      <div className={classes.test} focusgroup='menu inline'>
        {groups.map(({ header, colorNames, names }) => (
          <ColorGroup
            key={header}
            header={showHeader ? header : ''}
            colorNames={colorNames}
            colorScale={colorScale}
            names={names}
            namespace={namespace}
          />
        ))}
      </div>
    </div>
  );
};
