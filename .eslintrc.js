module.exports = {
  extends: ["eslint:recommended"],
  parser: "@typescript-eslint/parser",
  plugins: ["react"],
  root: true,
  ignorePatterns: ["dist/", "build/", "**/*.d.ts"],
  env: {
    browser: true,
    es2021: true,
    commonjs: true,
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    "no-extra-semi": "off",
  },
  overrides: [
    {
      files: ["**/*ts", "**/*.tsx"],
      plugins: ["@typescript-eslint"],
      extends: ["plugin:@typescript-eslint/recommended"],
      rules: {
        "@typescript-eslint/no-inferrable-types": "off",
      },
    },
  ],
};
