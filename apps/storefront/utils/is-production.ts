export function isProduction() {
  return process.env.DESIGNSYSTEMET_ENV === 'production';
}
