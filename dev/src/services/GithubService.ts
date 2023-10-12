export const getActivePullRequests = async () => {
  const res = await fetch(
    'https://api.github.com/repos/digdir/designsystem/pulls?sort=updated&direction=desc',
  );
  return await res.json();
};
