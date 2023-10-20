export type PullRequestType = {
  title: string;
  number: number;
  html_url: string;
  user: {
    login: string;
    avatar_url: string;
  };
};
