import {
  ColorTokensTable,
  SemanticVariablesTable,
  SizeVariablesTable,
} from '@internal/components';

import classes from './token-list.module.css';

export const TokenList = () => {
  return (
    <div className={classes.tokens}>
      <div className={classes.section}>
        <ColorTokensTable />
      </div>
      <div className={classes.section}>
        <SizeVariablesTable />
      </div>
      <div className={classes.section}>
        <SemanticVariablesTable />
      </div>
    </div>
  );
};
