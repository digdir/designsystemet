import pkg from '../../../../package.json' with { type: 'json' };

export function generate$DesignSystemet() {
  return {
    name: pkg.name,
    version: pkg.version,
  };
}
