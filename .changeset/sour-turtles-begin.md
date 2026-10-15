---
"@digdir/designsystemet": minor
---

**CLI:** Each output in the new `output` field cleans its `dir` before generating files. Set `cleanDir` to `false` on an output to keep existing files. Design tokens that are built from (`tokensDir`), and folders of outputs with `cleanDir: false`, are kept when they are inside a cleaned folder. Before deleting anything, the CLI stops with an error if a cleaned folder contains the config file, is one of those folders, is a symlink, or has a symlink on the way to one of them or to another output.
