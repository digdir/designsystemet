export function isProduction() {
  console.log(`DESIGNSYSTEMET_ENV:`, process.env.DESIGNSYSTEMET_ENV);
  return process.env.DESIGNSYSTEMET_ENV === 'production';
}
