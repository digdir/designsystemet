import {
  type RouteConfig,
  index,
  layout,
  prefix,
} from '@react-router/dev/routes';

export default [
  layout('./layouts/root/layout.tsx', [
    ...prefix('/:lang', [index('routes/home.tsx')]),
  ]),
] satisfies RouteConfig;
