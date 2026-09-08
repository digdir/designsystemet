// Run with: node --test .github/actions/conventional-pr/lint-header.test.mjs
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  lintHeader,
  matchedSubjectCases,
  parseHeader,
} from './lint-header.mjs';

describe('parseHeader', () => {
  it('extracts type, scope and subject', () => {
    assert.deepEqual(parseHeader('fix(css): make icon-size follow data-size'), {
      type: 'fix',
      scope: 'css',
      subject: 'make icon-size follow data-size',
    });
  });

  it('accepts the breaking-change marker', () => {
    assert.equal(parseHeader('feat!: drop node 20').type, 'feat');
  });

  it('returns nulls when the header is not conventional', () => {
    assert.deepEqual(parseHeader('Update readme'), {
      type: null,
      scope: null,
      subject: null,
    });
  });
});

describe('lintHeader', () => {
  const valid = [
    'chore: have all Node.js runtime updates in one PR',
    'chore(deps): update node.js to v24.20.0',
    'fix(css): make sure `icon-size` follows `data-size` by default',
    'docs(button): fix type',
    'feat!: remove deprecated api',
    'refactor(cli): `Eslint` configuration',
  ];
  for (const header of valid) {
    it(`accepts "${header}"`, () => assert.deepEqual(lintHeader(header), []));
  }

  it('rejects an unknown type', () => {
    assert.match(
      lintHeader('feature: add thing').join(),
      /type must be one of/,
    );
  });

  it('rejects an upper-case type', () => {
    assert.match(
      lintHeader('Fix: add thing').join(),
      /type must be lower-case/,
    );
  });

  it('rejects a missing type and subject', () => {
    const errors = lintHeader('Update readme');
    assert.match(errors.join(), /type may not be empty/);
    assert.match(errors.join(), /subject may not be empty/);
  });

  it('rejects a subject ending with a full stop', () => {
    assert.match(lintHeader('fix: add thing.').join(), /full stop/);
  });

  it('rejects a sentence-case subject', () => {
    assert.match(
      lintHeader('fix: Add thing').join(),
      /subject must not be sentence-case/,
    );
  });

  it('rejects a header over 100 characters', () => {
    assert.match(
      lintHeader(`fix: ${'a'.repeat(100)}`).join(),
      /longer than 100/,
    );
  });

  it('rejects surrounding whitespace', () => {
    assert.match(lintHeader(' fix: add thing').join(), /whitespaces/);
  });
});

describe('matchedSubjectCases', () => {
  it('ignores subjects that start with a non-letter', () => {
    assert.deepEqual(matchedSubjectCases('`Eslint` config'), []);
    assert.deepEqual(matchedSubjectCases('123 Things'), []);
  });

  it('ignores quoted proper names', () => {
    assert.deepEqual(matchedSubjectCases('use "Inter" as default font'), []);
  });

  it('reports every case that matches', () => {
    assert.deepEqual(matchedSubjectCases('Add Thing'), [
      'sentence-case',
      'start-case',
    ]);
    assert.deepEqual(matchedSubjectCases('ADD THING'), [
      'sentence-case',
      'start-case',
      'upper-case',
    ]);
    assert.deepEqual(matchedSubjectCases('AddThing'), [
      'sentence-case',
      'pascal-case',
    ]);
  });
});
