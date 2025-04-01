import {
  type RouteConfig,
  index,
  layout,
  route,
} from '@react-router/dev/routes';

export default [
  layout('./layouts/root-layout/root-layout.tsx', [
    index('routes/home.tsx'),
    route('/monstre/:file', 'routes/monstre.tsx'),
  ]),
] satisfies RouteConfig;
