export function isProduction() {
  return process.env.DESIGNSYSTEMET_ENV === 'production';
}

export function designsystemetEnv() {
  return process.env.DESIGNSYSTEMET_ENV;
}
