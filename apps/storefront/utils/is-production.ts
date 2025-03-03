export function isProduction() {
  return process.env.VERCEL_GIT_COMMIT_REF === 'main';
}
