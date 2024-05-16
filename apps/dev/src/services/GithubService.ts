import type { PullRequestType } from '../types/PullRequest';

export const getActivePullRequests = async () => {
  const res: Response = await fetch(
    'https://api.github.com/repos/digdir/designsystem/pulls?sort=updated&direction=desc',
  );
  return (await res.json()) as Promise<PullRequestType[]>;
};
