// Types shared by config-import and config-export.

// A Figma variable's value in one mode: a raw value, or an alias to another variable by
// collection and name.
export type ValueSpec =
  | {
      kind: 'raw';
      value: VariableValue;
    }
  | {
      kind: 'alias';
      collection: string;
      name: string;
    };
