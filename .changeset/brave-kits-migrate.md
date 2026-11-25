---
"figma-plugin": minor
---

**Update UI kit:** new migrations update the components in your own copy of the UI kit when a release changes which variables they use. Choose the migrations to run, check what will change in each component, and apply them. The first migration moves the components from the neutral color to the new muted colors. Import a config with muted colors first. Only the UI kit's own components are changed, including layers you added inside them. Your own components and layers keep the variables they use, and instances keep the colors you changed yourself. Pages you renamed are found by their components.
