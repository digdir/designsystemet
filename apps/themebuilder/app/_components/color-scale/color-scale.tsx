import {
  type Color,
  type SemanticColorNames,
  semanticColorSpec,
  type ThemeInfo,
} from '@digdir/designsystemet/internal';
import { ColorGroup } from '../color-group/color-group';
import { capitalizeFirstLetter } from '../color-step-dialog/util';

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
  /** Whether the names of the groups and steps are shown above the scale */
  showHeader: boolean;
  /** The name of the color */
  namespace: string;
  onSelect: (step: Color) => void;
};

/** The scale of one color: a button for every step, in the groups of the spec */
export const Scale = ({
  colorScale,
  showHeader,
  namespace,
  onSelect,
}: ScaleProps) => (
  <div className={classes.groups} focusgroup='menu inline'>
    {groups.map(({ header, colorNames, names }) => (
      <ColorGroup
        key={header}
        header={showHeader ? header : undefined}
        colorNames={colorNames}
        colorScale={colorScale}
        names={names}
        namespace={namespace}
        onSelect={onSelect}
      />
    ))}
  </div>
);
