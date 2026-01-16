import {
  BorderRadiusVariablesTable,
  ColorTokensTable,
  OpacityVariablesTable,
  ShadowVariablesTable,
  SizeVariablesTable,
} from '@internal/components';

import classes from './token-list.module.css';

export const TokenList = () => {
  return (
    <div className={classes.tokens}>
      <ColorTokensTable />
      <SizeVariablesTable />
      <BorderRadiusVariablesTable />
      <ShadowVariablesTable />
      <OpacityVariablesTable />
    </div>
  );
};
