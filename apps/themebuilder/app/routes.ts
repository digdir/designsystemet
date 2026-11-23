import {
  index,
  layout,
  prefix,
  type RouteConfig,
  route,
} from '@react-router/dev/routes';

export default [
  layout('./layouts/root/layout.tsx', [
    ...prefix('/:lang', [
      index('routes/themebuilder/themebuilder.tsx'),
      route('/themebuilder', 'routes/redirect-themebuilder.tsx'),
    ]),
  ]),
] satisfies RouteConfig;
