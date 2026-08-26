import process from 'node:process';
import type { ChangelogFunctions } from '@changesets/types';
import { getCommitInfo, getPullRequestInfo } from '@changesets/get-github-info';

const GITHUB_SERVER_URL = process.env.GITHUB_SERVER_URL || 'https://github.com';
const GITHUB_API_URL = process.env.GITHUB_API_URL || 'https://api.github.com';

/**
 * GitHub logins of core maintainers. Their changelog entries, and those of
 * bots (renovate, dependabot, ...), are written without the trailing
 * `by @user` author attribution.
 */
const SKIP_AUTHOR_LOGINS = new Set(
	['barsnes', 'mimarz', 'eirikbacker', 'mrosvik', 'unekinn', 'febakke']
);

const isBot = (login: string) => login.endsWith('[bot]');

const isSkippedAuthor = (login: string) =>
	isBot(login) || SKIP_AUTHOR_LOGINS.has(login.toLowerCase());

const firstContributionCache = new Map<string, Promise<boolean>>();

/**
 * Checks if this is the author's first merged PR in the repo, by counting
 * their merged PRs via the GitHub search API. At changelog-generation time the
 * released PR is already merged, so a count of 1 means it was their first.
 * Fails open to `false` so a missing token or API hiccup never breaks a release.
 */
const isFirstContribution = (repo: string, login: string): Promise<boolean> => {
	let result = firstContributionCache.get(login);
	if (!result) {
		result = (async () => {
			if (isBot(login)) return false;

			const query = encodeURIComponent(`repo:${repo} type:pr is:merged author:${login}`);
			const response = await fetch(`${GITHUB_API_URL}/search/issues?q=${query}&per_page=1`, {
				headers: {
					Accept: 'application/vnd.github+json',
					...(process.env.GITHUB_TOKEN
						? { Authorization: `Token ${process.env.GITHUB_TOKEN}` }
						: {})
				}
			});
			if (!response.ok) return false;

			const data = (await response.json()) as { total_count?: number };
			return (data.total_count ?? 0) <= 1;
		})().catch(() => false);
		firstContributionCache.set(login, result);
	}
	return result;
};

const changelogFunctions: ChangelogFunctions = {
	getDependencyReleaseLine: async (changesets, dependenciesUpdated, options) => {
		if (dependenciesUpdated.length === 0) return '';

		const changesetLink = `- Updated dependencies [${(
			await Promise.all(
				changesets.map(async (cs) => {
					if (cs.commit) {
						const info = await getCommitInfo({
							repo: options.repo,
							commit: cs.commit
						});
						return info?.commit.markdownLink;
					}
				})
			)
		)
			.filter((_) => _)
			.join(', ')}]:`;

		const updatedDependenciesList = dependenciesUpdated.map(
			(dependency) => `  - ${dependency.name}@${dependency.newVersion}`
		);

		return [changesetLink, ...updatedDependenciesList].join('\n');
	},
	getReleaseLine: async (changeset, type, options) => {
		const repo = options!.repo;
		let prFromSummary: number | undefined;
		let commitFromSummary: string | undefined;
		const usersFromSummary: string[] = [];

		const replacedChangelog = changeset.summary
			.replace(/^\s*(?:pr|pull|pull\s+request):\s*#?(\d+)/im, (_, pr) => {
				const num = Number(pr);
				if (!isNaN(num)) prFromSummary = num;
				return '';
			})
			.replace(/^\s*commit:\s*([^\s]+)/im, (_, commit) => {
				commitFromSummary = commit;
				return '';
			})
			.replace(/^\s*(?:author|user):\s*@?([^\s]+)/gim, (_, user) => {
				usersFromSummary.push(user);
				return '';
			})
			.trim();

		// add links to issue hints (fix #123) => (fix [#123](https://....))
		const linkifyIssueHints = (line: string) =>
			line.replace(/(?<=\( ?(?:fix|fixes|see) )(#\d+)(?= ?\))/g, (issueHash) => {
				return `[${issueHash}](https://github.com/${repo}/issues/${issueHash.substring(1)})`;
			});
		const [firstLine, ...futureLines] = replacedChangelog
			.split('\n')
			.map((l) => linkifyIssueHints(l.trimEnd()));

		const links = await (async () => {
			if (prFromSummary !== undefined) {
				const info = await getPullRequestInfo({
					repo,
					pull: prFromSummary
				});
				let commit = info?.commit?.markdownLink;
				if (commitFromSummary) {
					commit = `[\`${commitFromSummary.slice(
						0,
						7
					)}\`](https://github.com/${repo}/commit/${commitFromSummary})`;
				}
				return { pull: info?.pull.markdownLink, commit, author: info?.author };
			}
			const commitToFetchFrom = commitFromSummary || changeset.commit;
			if (commitToFetchFrom) {
				const info = await getCommitInfo({
					repo,
					commit: commitToFetchFrom
				});
				return {
					pull: info?.pull?.markdownLink,
					commit: info?.commit.markdownLink,
					author: info?.author
				};
			}
			return {
				commit: undefined,
				pull: undefined,
				author: undefined
			};
		})();

		// `author:`/`user:` hints in the changeset summary win over the PR/commit author
		const authors = usersFromSummary.length
			? usersFromSummary.map((login) => ({
					login,
					markdownLink: `[@${login}](${GITHUB_SERVER_URL}/${login})`
				}))
			: links.author
				? [links.author]
				: [];

		// only link PR or merge commit not both
		const suffix = links.pull ? ` (${links.pull})` : links.commit ? ` (${links.commit})` : '';
		const creditedAuthors = authors.filter((author) => !isSkippedAuthor(author.login));
		const authorSuffix = creditedAuthors.length
			? ` by ${creditedAuthors.map((author) => author.markdownLink).join(', ')}`
			: '';

		const thanksLines = (
			await Promise.all(
				authors.map(async (author) =>
					(await isFirstContribution(repo, author.login))
						? `\n- 🎉 Thanks ${author.markdownLink} for their first contribution! 🎉`
						: ''
				)
			)
		).join('');

		return `${thanksLines}\n- ${firstLine}${suffix}${authorSuffix}\n${futureLines.map((l) => `  ${l}`).join('\n')}`;
	}
};

export default changelogFunctions;
