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
      index('routes/home.tsx'),
      ...prefix('/monstre', [
        layout('./layouts/monstre/layout.tsx', [
          route('', 'routes/monstre.tsx'),
        ]),
        layout('./layouts/monstre/page.tsx', [
          route('/:file', 'routes/monstre-page.tsx'),
        ]),
      ]),
      ...prefix('/bloggen', [
        layout('./layouts/bloggen/layout.tsx', [
          route('/', 'routes/bloggen.tsx'),
        ]),
        layout('./layouts/bloggen/page.tsx', [
          route('/:file', 'routes/bloggen-page/bloggen-page.tsx'),
        ]),
      ]),
    ]),
  ]),
] satisfies RouteConfig;
