# Design tokens

Exported design tokens from the Digdir common designsystem.

You should use Figma to edit the tokens. You'll need the [Tokens Studio for Figma](https://docs.tokens.studio/) plugin installed in Figma, and configured to sync with this GitHub repo.

1. [Install](<https://www.figma.com/community/plugin/843461159747178978/Tokens-Studio-for-Figma-(Figma-Tokens)>) the Figma Tokens plugin
1. Generate a new Personal Access Token (PAT) in [GitHub Developer Settings](https://github.com/settings/tokens) with scope `repo`
1. Copy the PAT (you can only see it once)
1. In the Figma Tokens plugin, under `Sync > GitHub`, add new credentials:
   - Name: `Digdir Figma Tokens`
   - Personal Access Token: _your PAT_
   - Repository: `digdir/designsystem`
   - Default Branch: `main`
   - File Path: `design-tokens`

You can now "pull from GitHub" (button on top right) to fetch the tokens. When done editing tokens, you should "push to GitHub" (second button on top right).
