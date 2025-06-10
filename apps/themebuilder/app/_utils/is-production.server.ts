export function isProduction() {
  return process.env.NEXT_PUBLIC_DESIGNSYSTEMET_ENV === 'production';
}
