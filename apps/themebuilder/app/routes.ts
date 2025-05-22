import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from '@react-router/dev/routes';

export default [
  layout('./layouts/root/layout.tsx', [
    ...prefix('/:lang', [
      index('routes/home/home.tsx'),
      route('/themebuilder', 'routes/themebuilder/themebuilder.tsx'),
    ]),
  ]),
] satisfies RouteConfig;
