/* eslint-disable @typescript-eslint/no-unsafe-assignment */
const REPOSITORY_OWNER = 'Thuneer';
const REPOSITORY_NAME = 'design-tokens';
const BRANCH_NAME = 'main';

const MODES = { FILE: '100644', FOLDER: '040000' };
const TYPE = { BLOB: 'blob', TREE: 'tree' };

// See: https://docs.github.com/en/free-pro-team@latest/rest/reference/git#commits
const COMMITS_URL = `https://api.github.com/repos/${REPOSITORY_OWNER}/${REPOSITORY_NAME}/git/commits`;

// See: https://docs.github.com/en/free-pro-team@latest/rest/reference/git#trees
const REPOSITORY_TREE_URL = `https://api.github.com/repos/${REPOSITORY_OWNER}/${REPOSITORY_NAME}/git/trees`;

// See: https://docs.github.com/en/free-pro-team@latest/rest/reference/git#get-a-reference
const REF_URL = `https://api.github.com/repos/${REPOSITORY_OWNER}/${REPOSITORY_NAME}/git/refs/heads/${BRANCH_NAME}`;

declare let process: {
  env: {
    GITHUB_TOKEN: string;
  };
};

const headers = {
  Accept: 'application/vnd.github.v3+json',
  Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
};

export const commitToGithub = async (fileArr: []) => {
  if (!fileArr.length) return;
  // Get the sha of the last commit on BRANCH_NAME
  const response = await fetch(REF_URL, { headers });
  const {
    object: { sha: currentCommitSha },
  } = await response.json();

  // Get the sha of the root tree on the commit retrieved previously
  const commitResponse = await fetch(`${COMMITS_URL}/${currentCommitSha}`, {
    headers,
  });
  const {
    tree: { sha: treeSha },
  } = await commitResponse.json();

  // Create a tree to edit the content of the repository
  const treeResponse = await fetch(REPOSITORY_TREE_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      base_tree: treeSha,
      tree: fileArr.map(
        ({ content, path }) =>
          content
            ? { path, content, mode: MODES.FILE, type: TYPE.BLOB } // Works for text files, utf-8 assumed
            : { path, sha: null, mode: MODES.FILE, type: TYPE.BLOB }, // If sha is null => the file gets deleted
      ),
    }),
  });
  const { sha: newTreeSha } = await treeResponse.json();

  // Create a commit that uses the tree created above
  const commitResponse1 = await fetch(COMMITS_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      message: "Committing with GitHub's API :fire:",
      tree: newTreeSha,
      parents: [currentCommitSha],
    }),
  });
  const { sha: newCommitSha } = await commitResponse1.json();

  // Make BRANCH_NAME point to the created commit
  await fetch(REF_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({ sha: newCommitSha }),
  });
};
