export function isProduction() {
  return process.env.APP_ENV === 'production';
}
