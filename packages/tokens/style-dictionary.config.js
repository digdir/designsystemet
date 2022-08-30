const StyleDictionary = require("style-dictionary");
const { minifyDictionary } = StyleDictionary.formatHelpers;

StyleDictionary.registerFileHeader({
  name: "customHeader",
  fileHeader: () => {
    return [`Do not edit directly`];
  },
});

module.exports = {
  format: {
    customCjsMinified({ dictionary, options }) {
      return (
        "/* " +
        options.fileHeader() +
        " */ " +
        "module.exports=" +
        JSON.stringify(minifyDictionary(dictionary.tokens), null) +
        ";"
      );
    },
    customEs6Minified({ dictionary, options }) {
      return (
        "/* " +
        options.fileHeader() +
        " */ " +
        "export default " +
        JSON.stringify(minifyDictionary(dictionary.tokens)) +
        ";"
      );
    },
  },
  source: ["src/**.tokens.json"],
  platforms: {
    js: {
      buildPath: "build/",
      transformGroup: "js",
      files: [
        {
          destination: "tokens.cjs",
          format: "customCjsMinified",
          options: {
            fileHeader: "customHeader",
          },
        },
        {
          destination: "tokens.js",
          format: "customEs6Minified",
          options: {
            fileHeader: "customHeader",
          },
        },
      ],
    },

    ts: {
      buildPath: "build/",
      transformGroup: "js",
      files: [
        {
          destination: "tokens.d.ts",
          format: "typescript/module-declarations",
          options: {
            fileHeader: "customHeader",
          },
        },
      ],
    },
    css: {
      transformGroup: "css",
      buildPath: "build/",
      files: [
        {
          destination: "tokens.css",
          format: "css/variables",
          options: {
            outputReferences: true,
            fileHeader: "customHeader",
          },
        },
      ],
    },
    scss: {
      transformGroup: "scss",
      buildPath: "build/",
      files: [
        {
          destination: "tokens.scss",
          format: "scss/variables",
          options: {
            outputReferences: true,
            fileHeader: "customHeader",
          },
        },
      ],
    },
  },
};
