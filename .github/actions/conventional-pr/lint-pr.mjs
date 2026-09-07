// Entry point of the conventional-pr action. Behaviour follows
// CondeNast/conventional-pull-request-action: with a single commit (and unless
// IGNORE_COMMITS) the commit subject is linted and must equal the PR title, since GitHub
// pre-fills the merge message from it. Otherwise the PR title is linted.
import { readFileSync } from 'node:fs';
import { lintHeader } from './lint-header.mjs';

const isTrue = (value) => String(value ?? '').toLowerCase() === 'true';

const token = process.env.GITHUB_TOKEN;
const commitTitleMatch = isTrue(process.env.COMMIT_TITLE_MATCH ?? 'true');
const ignoreCommits = isTrue(process.env.IGNORE_COMMITS ?? 'false');

const event = JSON.parse(readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8'));
if (!event.pull_request) {
  fail('Pull request not found. Use a pull_request event to trigger this action.');
  process.exit(1);
}

const repository = process.env.GITHUB_REPOSITORY;
const number = event.pull_request.number;

const pullRequest = await api(`/repos/${repository}/pulls/${number}`);
console.log(`Found PR title: ${pullRequest.title}`);

let failed = false;

if (!ignoreCommits && pullRequest.commits <= 1) {
  const [first] = await api(`/repos/${repository}/pulls/${number}/commits?per_page=1`);
  const subject = first.commit.message.split('\n')[0];
  console.log(`Found commit subject: ${subject}`);

  const errors = lintHeader(subject);
  for (const message of errors) error(`Commit message: ${message}`);
  if (errors.length > 0) {
    fail(
      'COMMIT: PRs with a single commit require the commit message to conform to the conventional commit spec',
    );
    failed = true;
  }

  if (commitTitleMatch && pullRequest.title !== subject) {
    fail('COMMIT: PRs with a single commit require the PR title and commit message to match');
    failed = true;
  }
} else {
  const errors = lintHeader(pullRequest.title);
  for (const message of errors) error(`PR title: ${message}`);
  if (errors.length > 0) {
    fail('PULL REQUEST: PR title does not conform to the conventional commit spec');
    failed = true;
  }
}

if (failed) {
  process.exit(1);
}
console.log('Pull request follows the conventional commit spec.');

async function api(path) {
  const response = await fetch(`https://api.github.com${path}`, {
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });
  if (!response.ok) {
    throw new Error(`GitHub API ${path} failed: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

// Workflow commands: annotate the run and mark it failed.
function error(message) {
  console.log(`::error::${message}`);
}
function fail(message) {
  console.log(`::error::${message}`);
}
