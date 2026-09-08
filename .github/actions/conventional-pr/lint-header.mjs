// Lints a commit header (or PR title) against the header rules of
// @commitlint/config-conventional. Dependency-free so the action needs no install step.
//
// Rules replicated (all errors): type-empty, type-enum, type-case, subject-empty,
// subject-full-stop, subject-case (never sentence/start/pascal/upper), header-max-length,
// header-trim. Body and footer rules do not apply to a single header line.

export const TYPES = [
  'build',
  'chore',
  'ci',
  'docs',
  'feat',
  'fix',
  'perf',
  'refactor',
  'revert',
  'style',
  'test',
];

export const HEADER_MAX_LENGTH = 100;

// Same pattern as conventional-changelog-conventionalcommits.
const HEADER_PATTERN = /^(\w*)(?:\((.*)\))?!?: (.*)$/;

export function parseHeader(header) {
  const match = HEADER_PATTERN.exec(header);
  if (!match) {
    return { type: null, scope: null, subject: null };
  }
  const [, type, scope, subject] = match;
  return { type: type || null, scope: scope ?? null, subject: subject || null };
}

/** Returns a list of error messages; empty when the header is valid. */
export function lintHeader(header) {
  const errors = [];
  const { type, subject } = parseHeader(header);

  if (header !== header.trim()) {
    errors.push('header must not have initial and / or trailing whitespaces');
  }
  if (header.length > HEADER_MAX_LENGTH) {
    errors.push(
      `header must not be longer than ${HEADER_MAX_LENGTH} characters, current length is ${header.length}`,
    );
  }

  if (!type) {
    errors.push('type may not be empty');
  } else {
    if (type !== type.toLowerCase()) {
      errors.push('type must be lower-case');
    }
    if (!TYPES.includes(type.toLowerCase())) {
      errors.push(`type must be one of [${TYPES.join(', ')}]`);
    }
  }

  if (!subject) {
    errors.push('subject may not be empty');
  } else {
    if (subject.endsWith('.')) {
      errors.push('subject may not end with full stop');
    }
    const cases = matchedSubjectCases(subject);
    if (cases.length > 0) {
      errors.push(`subject must not be ${cases.join(', ')}`);
    }
  }

  return errors;
}

// Mirrors commitlint's subject-case rule with `never` for the four cases below.
// Like commitlint it only applies when the subject starts with a letter, ignores
// quoted content (proper names), and skips subjects that then start with a digit.
export function matchedSubjectCases(subject) {
  if (!/^[\p{Ll}\p{Lu}\p{Lt}]/u.test(subject)) {
    return [];
  }
  const input = subject.replace(/`.*?`|".*?"|'.*?'/g, '').trim();
  if (input === '' || /^\d/.test(input)) {
    return [];
  }

  const matched = [];
  if (upperFirst(input) === input) matched.push('sentence-case');
  if (startCase(input) === input) matched.push('start-case');
  if (upperFirst(camelCase(input)) === input) matched.push('pascal-case');
  if (input.toUpperCase() === input) matched.push('upper-case');
  return matched;
}

function upperFirst(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// Word splitting close to lodash's, which commitlint uses via es-toolkit/compat.
function words(text) {
  return (
    text.match(/[A-Z]{2,}(?=[A-Z][a-z]+\d*|\b)|[A-Z]?[a-z]+\d*|[A-Z]|\d+/g) ??
    []
  );
}

function startCase(text) {
  return words(text).map(upperFirst).join(' ');
}

function camelCase(text) {
  return words(text)
    .map((word, index) =>
      index === 0 ? word.toLowerCase() : upperFirst(word.toLowerCase()),
    )
    .join('');
}
