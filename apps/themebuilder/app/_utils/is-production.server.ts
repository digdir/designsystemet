export function isProduction() {
  return process.env.ENV === 'production';
}
