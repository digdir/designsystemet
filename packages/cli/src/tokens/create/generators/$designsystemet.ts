import pkg from '../../../../package.json' with { type: 'json' };

export function generate$Designsystemet() {
  return {
    name: pkg.name,
    version: pkg.version,
  };
}
