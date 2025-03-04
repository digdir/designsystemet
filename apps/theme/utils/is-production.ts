export function isProduction() {
  const env = process.env.DESIGNSYSTEMET_ENV;
  console.log(`DESIGNSYSTEMET_ENV:`, env);
  return env === 'production';
}
