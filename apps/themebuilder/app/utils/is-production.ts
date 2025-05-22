export function isProduction() {
  return false;
  return process.env.NEXT_PUBLIC_DESIGNSYSTEMET_ENV === 'production';
}
