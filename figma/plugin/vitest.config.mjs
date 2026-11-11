import { defineProject } from 'vitest/config';

export default defineProject({
  test: {
    name: 'plugin',
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
