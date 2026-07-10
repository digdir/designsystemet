# Designsystemet Figma plugin

**⚠️ Experimental ⚠️**



## Known issues and TODO

1. Unknown variables are deleted.

## How to test in Figma

```json
{
  "$schema": "node_modules/@digdir/designsystemet/dist/config.schema.json",
  "outDir": "./design-tokens",
  "themes": {
    "theme": {
      "colors": {
        "accent": "#ba4000",
        "test1": "#180d7a",
        "test2": "#56a03f",
        "neutral": "#24272B"
      },
      "borderRadius": 4,
      "typography": {
        "fontFamily": "IBM Plex Sans"
      }
    },
    "theme2": {
      "colors": {
        "accent": "#0062BA",
        "test1": "#0D7A5F",
        "test2": "#5B3FA0", 
        "neutral": "#24272B"
      },
      "borderRadius": 0,
      "typography": {
        "fontFamily": "Times New Roman"
      }
    }
  }
}
```

### Check variables and modes

1. Make sure all collections are present
2. Make sure there are no broken variable references

### Check scopes

1. Draw a rectangle
2. Set background color, verify that semantic color variables are available in dropdown.
3. Set border radius, verify that semantic color variables are available in dropdown.

### Check Typography

1. Check all typography styles are imported/modified
2. Check that a specific typography style has the correct typography variables assigned to each of its values (font-family, font-size, font-weight etc)

### Code syntax

1. "edit variable" in semantic collection and check if code syntax for web is defined correct.


