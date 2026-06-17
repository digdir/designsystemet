import type { ChangelogFunctions } from '@changesets/types';
import { getInfo, getInfoFromPullRequest } from '@changesets/get-github-info';

const changelogFunctions: ChangelogFunctions = {
	getDependencyReleaseLine: async (changesets, dependenciesUpdated, options) => {
		if (dependenciesUpdated.length === 0) return '';

		const changesetLink = `- Updated dependencies [${(
			await Promise.all(
				changesets.map(async (cs) => {
					if (cs.commit) {
						const { links } = await getInfo({
							repo: options.repo,
							commit: cs.commit
						});
						return links.commit;
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
			.replace(/^\s*(?:author|user):\s*@?([^\s]+)/gim, '')
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
				let { links } = await getInfoFromPullRequest({
					repo,
					pull: prFromSummary
				});
				if (commitFromSummary) {
					links = {
						...links,
						commit: `[\`${commitFromSummary.slice(
							0,
							7
						)}\`](https://github.com/${repo}/commit/${commitFromSummary})`
					};
				}
				return links;
			}
			const commitToFetchFrom = commitFromSummary || changeset.commit;
			if (commitToFetchFrom) {
				const { links } = await getInfo({
					repo,
					commit: commitToFetchFrom
				});
				return links;
			}
			return {
				commit: null,
				pull: null,
				user: null
			};
		})();

		// only link PR or merge commit not both
		const suffix = links.pull ? ` (${links.pull})` : links.commit ? ` (${links.commit})` : '';

		return `\n- ${firstLine}${suffix}\n${futureLines.map((l) => `  ${l}`).join('\n')}`;
	}
};

export default changelogFunctions;
