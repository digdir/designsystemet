# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

### BREAKING CHANGE: Package restructure

## [0.51.3](https://github.com/digdir/designsystemet/compare/@digdir/design-system-react@0.51.3-alpha.0...@digdir/design-system-react@0.51.3) (2024-03-08)

### Bug Fixes

- **Fieldset:** Make hideLegend work again ([#1641](https://github.com/digdir/designsystemet/issues/1641)) ([74ee58f](https://github.com/digdir/designsystemet/commit/74ee58fb84bb843e842813a1cdc05ea88159bfb5))
- **SpinnerI:** Use correct tokens ([#1650](https://github.com/digdir/designsystemet/issues/1650)) ([63cd398](https://github.com/digdir/designsystemet/commit/63cd398ea1537acb5f6ca82a80765176cc7b8db4))

## [0.51.3-alpha.0](https://github.com/digdir/designsystemet/compare/@digdir/design-system-react@0.51.2...@digdir/design-system-react@0.51.3-alpha.0) (2024-03-06)

### Bug Fixes

- Components should now inherit font-family correctly ([#1638](https://github.com/digdir/designsystemet/issues/1638)) ([c186fe6](https://github.com/digdir/designsystemet/commit/c186fe6ba427776fabd873b6560fc886904766bb))

## [0.51.2](https://github.com/digdir/designsystemet/compare/@digdir/design-system-react@0.51.1...@digdir/design-system-react@0.51.2) (2024-03-04)

### Bug Fixes

- **Combobox:** ResizeObserver loop error ([#1594](https://github.com/digdir/designsystemet/issues/1594)) ([688ac31](https://github.com/digdir/designsystemet/commit/688ac3126fb003c412d597e847a9d206ac32d3dd))
- **ErrorSummaryItem:** `href` is optional when `asChild` is `true` ([#1592](https://github.com/digdir/designsystemet/issues/1592)) ([300c9b4](https://github.com/digdir/designsystemet/commit/300c9b46e18481e638a0f3181f6087129374577e))
- **Fieldset:** Simplify CSS ([#1591](https://github.com/digdir/designsystemet/issues/1591)) ([aa5ca25](https://github.com/digdir/designsystemet/commit/aa5ca259a659adc5cd2bb1ac370f5bfb122a1ea7))
- **Popover:** Update aria attributes ([#1578](https://github.com/digdir/designsystemet/issues/1578)) ([9c1e729](https://github.com/digdir/designsystemet/commit/9c1e7299b5045753a9a937c91b081765a4749dc4))

## [0.51.1](https://github.com/digdir/designsystemet/compare/@digdir/design-system-react@0.51.0...@digdir/design-system-react@0.51.1) (2024-02-23)

### Bug Fixes

- **Button:** Remove `display: inline-block` for icons ([#1567](https://github.com/digdir/designsystemet/issues/1567)) ([40183b6](https://github.com/digdir/designsystemet/commit/40183b64ae4e53004623aecc397a99f0c5e865c8))
- **HelpText:** :bug: Focus and hover should now be correct ([#1568](https://github.com/digdir/designsystemet/issues/1568)) ([2505554](https://github.com/digdir/designsystemet/commit/2505554a87a982000f1980974b4683921726b79e))

### Features

- **Combobox:** Add loading state ([#1558](https://github.com/digdir/designsystemet/issues/1558)) ([635d3cc](https://github.com/digdir/designsystemet/commit/635d3cc8fdceffe125ce738c71b3605f95db2b69))

### Reverts

- Revert "Publish" ([b1d5e6c](https://github.com/digdir/designsystemet/commit/b1d5e6c9f0b0be47592fd3048e175a67894eb1e1))

# [0.51.0](https://github.com/digdir/designsystemet/compare/@digdir/design-system-react@0.50.0...@digdir/design-system-react@0.51.0) (2024-02-23)

### Features

- **Combobox:** Add `forwardRef` to input ([#1553](https://github.com/digdir/designsystemet/issues/1553)) ([efc3f2c](https://github.com/digdir/designsystemet/commit/efc3f2c967bc7e17ad236c9ac6512a7661f32ed2))

- **Combobox:** Always display selected values ([#1562](https://github.com/digdir/designsystemet/issues/1562)) ([3b5bbc3](https://github.com/digdir/designsystemet/commit/3b5bbc3b8d471f674e0ab5155fe65e90a51090fc))
- **Modal:** Make sub-components composable ([#1556](https://github.com/digdir/designsystemet/issues/1556)) ([e0159ae](https://github.com/digdir/designsystemet/commit/e0159ae97eeb8e74d5e5ea1ff67b12746cd313b6))
- **Pagination:** Add new component API ([#1524](https://github.com/digdir/designsystemet/issues/1524)) ([b43ee0d](https://github.com/digdir/designsystemet/commit/b43ee0d5ca84eda4f232c77ee623e9fcdd15b2b0))

# [0.50.0](https://github.com/digdir/designsystemet/compare/@digdir/design-system-react@0.49.0...@digdir/design-system-react@0.50.0) (2024-02-19)

### Bug Fixes

- Correct component names in React developer tools ([#1543](https://github.com/digdir/designsystemet/issues/1543)) ([889e91d](https://github.com/digdir/designsystemet/commit/889e91d4acaaa470f10aabfc17657ca5d5477b6a))
- **Paragraph:** Fix CSS specificity ([#1527](https://github.com/digdir/designsystemet/issues/1527)) ([4d76d87](https://github.com/digdir/designsystemet/commit/4d76d875960f9cb544bbb33735a0d8685f8ceee5))
- **Switch:** 🐛 Improvements and adjustments to styling ([#1521](https://github.com/digdir/designsystemet/issues/1521)) ([d9f7a5c](https://github.com/digdir/designsystemet/commit/d9f7a5ce5ee1e70346861a2dcb009b598541958b))

### Features

- **Modal:** Add `Modal.Trigger` ([#1532](https://github.com/digdir/designsystemet/issues/1532)) ([15f7de0](https://github.com/digdir/designsystemet/commit/15f7de0f0d6368c624cb9825d0c35209848f71f9))

# [0.49.0](https://github.com/digdir/designsystemet/compare/@digdir/design-system-react@0.48.0...@digdir/design-system-react@0.49.0) (2024-02-09)

### Bug Fixes

- **List:** :bug: Should correctly set `aria-labelledby` ([#1508](https://github.com/digdir/designsystemet/issues/1508)) ([41ff47c](https://github.com/digdir/designsystemet/commit/41ff47c7f8060b753db739dabe07cf50fb75e73b))

### Features

- **Checkbox:** Add indeterminate state ([#1513](https://github.com/digdir/designsystemet/issues/1513)) ([913857b](https://github.com/digdir/designsystemet/commit/913857b6da4748181990e658a894bfa79001e2a9))
- **Combobox:** Debounce `Option` click ([#1506](https://github.com/digdir/designsystemet/issues/1506)) ([30ccbe7](https://github.com/digdir/designsystemet/commit/30ccbe7f79890892dffe089a4e456ce83ab74518))
- **Heading:** Add two larger sizes ([#1512](https://github.com/digdir/designsystemet/issues/1512)) ([3d34248](https://github.com/digdir/designsystemet/commit/3d342484eaf74b9ad56c93e7b34b2b4d4169ce6c))

# [0.48.0](https://github.com/digdir/designsystemet/compare/@digdir/design-system-react@0.47.0...@digdir/design-system-react@0.48.0) (2024-02-07)

### Bug Fixes

- **Button:** :bug: Passed `className` should now override correctly ([#1442](https://github.com/digdir/designsystemet/issues/1442)) ([5a1d463](https://github.com/digdir/designsystemet/commit/5a1d463131f7c6e81a36b457b94eab33322412f7))
- **Table:** :label: Fix types ([#1500](https://github.com/digdir/designsystemet/issues/1500)) ([c962f22](https://github.com/digdir/designsystemet/commit/c962f22b7b56a3bf980e6ccd747e8e0d30ac4325))

### Features

- **Button:** Add `asChild` support to `Button` ([#1463](https://github.com/digdir/designsystemet/issues/1463)) ([87d43f6](https://github.com/digdir/designsystemet/commit/87d43f6ef612243f92ecf5a381b2063a1c2db913))
- **Button:** Change `icon` to boolean and remove `iconPlacement` ([#1413](https://github.com/digdir/designsystemet/issues/1413)) ([98d0610](https://github.com/digdir/designsystemet/commit/98d06108e4e7954feac410178bf81abed3b5f6c5))
- **Card:** Add support for changing element type with `asChild` ([#1323](https://github.com/digdir/designsystemet/issues/1323)) ([d35f56e](https://github.com/digdir/designsystemet/commit/d35f56ef5b2319859e0383b2d07dd6e4180f6a58))
- **DropdownMenu:** Add `DropdownMenu.Trigger` ([#1416](https://github.com/digdir/designsystemet/issues/1416)) ([428b092](https://github.com/digdir/designsystemet/commit/428b0929d54d4b6d8cd155e0ab9dd27517299191))
- **ErrorMessage:** Add `asChild` support to `ErrorMessage` ([#1467](https://github.com/digdir/designsystemet/issues/1467)) ([25ee917](https://github.com/digdir/designsystemet/commit/25ee917e1acbfbf3c4465141f4ac6f996ecc5bef))
- **ErrorSummary:** ✨ Make the component ([#1392](https://github.com/digdir/designsystemet/issues/1392)) ([a33ff7c](https://github.com/digdir/designsystemet/commit/a33ff7c8077c1c07acc027de1b36fa9ad50ef77f))
- **Heading:** Add `asChild` support to `Heading` ([#1459](https://github.com/digdir/designsystemet/issues/1459)) ([dda21d2](https://github.com/digdir/designsystemet/commit/dda21d2bf050538ca0b38418391cd14cf903aeb6))
- **Ingress:** Add `asChild` support to `Ingress` ([#1460](https://github.com/digdir/designsystemet/issues/1460)) ([4f96d58](https://github.com/digdir/designsystemet/commit/4f96d58531726d2dd296a0772f061e7013726430))
- **Label:** Add `asChild` support to `Label` ([#1461](https://github.com/digdir/designsystemet/issues/1461)) ([fa2e961](https://github.com/digdir/designsystemet/commit/fa2e961185d798039c1c54cc1e584dc75ca2a326))
- **Link:** Add `asChild` support to `Link` ([#1458](https://github.com/digdir/designsystemet/issues/1458)) ([54b1dab](https://github.com/digdir/designsystemet/commit/54b1dab8cbed2c5ce4d1030b7465c761dc2a79b1))
- **List:** Change component API ([#1400](https://github.com/digdir/designsystemet/issues/1400)) ([55d8795](https://github.com/digdir/designsystemet/commit/55d87951a270c8449216260cb70e61940fd71293))
- **Paragraph:** Add `asChild` support to `Paragraph` ([#1462](https://github.com/digdir/designsystemet/issues/1462)) ([c886f65](https://github.com/digdir/designsystemet/commit/c886f652e7062e2bff7148cdc4603c851654a50d))
- **Popover:** Add `Popover.Trigger` ([#1406](https://github.com/digdir/designsystemet/issues/1406)) ([33c693b](https://github.com/digdir/designsystemet/commit/33c693b7190253368d156273a17442e7603f83b2))
- **RovingTabindexItem:** Add `asChild` support to `RovingTabindexItem` ([#1468](https://github.com/digdir/designsystemet/issues/1468)) ([8f21be3](https://github.com/digdir/designsystemet/commit/8f21be38dff97d8c1103547d651a77e80b537402))
- **RovingTabindexRoot:** Add `asChild` support to `RovingTabindexRoot` ([#1469](https://github.com/digdir/designsystemet/issues/1469)) ([c766926](https://github.com/digdir/designsystemet/commit/c7669267312cd583d0e79f196822d4491dcd5bc8))
- **Tabs:** Remove `icon` prop ([#1418](https://github.com/digdir/designsystemet/issues/1418)) ([75777db](https://github.com/digdir/designsystemet/commit/75777dbc963329ae4e2201de59304786bc6ef6ff))

# [0.47.0](https://github.com/digdir/designsystemet/compare/@digdir/design-system-react@0.46.1...@digdir/design-system-react@0.47.0) (2024-01-23)

### Bug Fixes

- **Accordion:** Fix focus style ([#1407](https://github.com/digdir/designsystemet/issues/1407)) ([24e3006](https://github.com/digdir/designsystemet/commit/24e3006de112ea7d667ec07f6c9caccd6e6de9f2))
- **DropdownMenu:** Export correct props type for items ([#1410](https://github.com/digdir/designsystemet/issues/1410)) ([898a13f](https://github.com/digdir/designsystemet/commit/898a13f54cd825619190fb0a65f04c6ed23d77c6))
- **List:** Add `margin-top` to nested lists ([#1402](https://github.com/digdir/designsystemet/issues/1402)) ([524d48c](https://github.com/digdir/designsystemet/commit/524d48c84aa7f6c8c3f2b05f374c1b70e8005053))
- **Pagination:** Add default aria-label to `nav` ([#1401](https://github.com/digdir/designsystemet/issues/1401)) ([b4de3f1](https://github.com/digdir/designsystemet/commit/b4de3f1c166a91abda113cd0fd0d6d8ab36189da))

### Features

- **List:** Add `forwardRef` ([#1393](https://github.com/digdir/designsystemet/issues/1393)) ([b8b6b3a](https://github.com/digdir/designsystemet/commit/b8b6b3a84792897be68d35aee9d9727514641763))
- **List:** Add support for custom heading id ([#1394](https://github.com/digdir/designsystemet/issues/1394)) ([03e1dba](https://github.com/digdir/designsystemet/commit/03e1dba876fdc3534507255bf726f6694c77f73d))

## [0.46.1](https://github.com/digdir/designsystemet/compare/@digdir/design-system-react@0.46.0...@digdir/design-system-react@0.46.1) (2024-01-16)

### Bug Fixes

- **NativeSelect:** Fix `readOnly` not disabling element ([#1391](https://github.com/digdir/designsystemet/issues/1391)) ([f6f693e](https://github.com/digdir/designsystemet/commit/f6f693e9a2a932f6295405d0e95e3ae2b8335150))

# [0.46.0](https://github.com/digdir/designsystemet/compare/@digdir/design-system-react@0.45.0...@digdir/design-system-react@0.46.0) (2024-01-15)

### Features

- **Combobox:** Virtualize options ([#1375](https://github.com/digdir/designsystemet/issues/1375)) ([608c066](https://github.com/digdir/designsystemet/commit/608c066c55402d6fa56068e78587f6ee642befb7))
- **HelpText:** :sparkles: Add portal support ([#1367](https://github.com/digdir/designsystemet/issues/1367)) ([d8b201d](https://github.com/digdir/designsystemet/commit/d8b201d85400912012c5d1326700948b1b56d23b))
- **Table:** ✨ Make the component ([#1364](https://github.com/digdir/designsystemet/issues/1364)) ([8c2ddad](https://github.com/digdir/designsystemet/commit/8c2ddadefdf8c64abff32aa32b332adfaf6fcff9))
- **Table:** 🗑️ Change `Table` to legacy ([#1357](https://github.com/digdir/designsystemet/issues/1357)) ([e3da112](https://github.com/digdir/designsystemet/commit/e3da112d56a25f276f628808dee34bc7c9471ea6))

# [0.45.0](https://github.com/digdir/designsystemet/compare/@digdir/design-system-react@0.44.0...@digdir/design-system-react@0.45.0) (2024-01-10)

### Bug Fixes

- **Combobox:** Pressing `enter` on clear button does not work ([#1354](https://github.com/digdir/designsystemet/issues/1354)) ([884eca7](https://github.com/digdir/designsystemet/commit/884eca74fa41d3e21d2117fbb260fb3a0489d46b))
- **Combobox:** Removing a chip with `enter` selects a value from the list ([#1352](https://github.com/digdir/designsystemet/issues/1352)) ([907a85d](https://github.com/digdir/designsystemet/commit/907a85dba91d23fe9a701637b0b921b70f3bfb3c))

### Features

- **Combobox:** Disable looping when navigating list with keyboard ([#1344](https://github.com/digdir/designsystemet/issues/1344)) ([8bf82d0](https://github.com/digdir/designsystemet/commit/8bf82d05d3e60896fc3a9d1a7685dabf206d513c))
- **Tag:** New Tag design ([#1335](https://github.com/digdir/designsystemet/issues/1335)) ([7640fad](https://github.com/digdir/designsystemet/commit/7640fad5b5c41318b0abd9e2938a89f6068e99ad))

# [0.44.0](https://github.com/digdir/designsystemet/compare/@digdir/design-system-react@0.43.0...@digdir/design-system-react@0.44.0) (2024-01-05)

### Bug Fixes

- **Chips:** :bug: Correct sizings ([#1316](https://github.com/digdir/designsystemet/issues/1316)) ([70044b8](https://github.com/digdir/designsystemet/commit/70044b89e448ae5ca57594b65b1f5757ffdd5b54))
- **Search:** Scale input height based on sizing prop ([#1329](https://github.com/digdir/designsystemet/issues/1329)) ([bc32cec](https://github.com/digdir/designsystemet/commit/bc32ceca7aa77f5ad67f19c3262df18a6010b68b))

### Features

- **Box:** Add support for changing element type with `asChild` ([#1295](https://github.com/digdir/designsystemet/issues/1295)) ([4d9b78d](https://github.com/digdir/designsystemet/commit/4d9b78dd8a48e978bccdcd0764cf9fbf52af6652))
- **Fieldset:** Make legend prop required ([#1330](https://github.com/digdir/designsystemet/issues/1330)) ([0f502c0](https://github.com/digdir/designsystemet/commit/0f502c0cb6d84867cc22ac7655fe913c13babc33))
- **Tooltip:** Add inverted version ([#1325](https://github.com/digdir/designsystemet/issues/1325)) ([accf27c](https://github.com/digdir/designsystemet/commit/accf27c6477aa07fdd939fc4a4d0d5655ad11849))

# [0.43.0](https://github.com/digdir/designsystemet/compare/@digdir/design-system-react@0.42.0...@digdir/design-system-react@0.43.0) (2024-01-02)

### Bug Fixes

- **Chip:** :bug: Use correct font token (short) ([#1290](https://github.com/digdir/designsystemet/issues/1290)) ([ddc1166](https://github.com/digdir/designsystemet/commit/ddc11669be368c35b9d12e17a8048fad902c8eb9))
- Make sure `className` and `style` are applied to outer element ([#1277](https://github.com/digdir/designsystemet/issues/1277)) ([1a57299](https://github.com/digdir/designsystemet/commit/1a57299fac3e0431b22cc9f8b2a6ad649e3146d6))

### Features

- **Box:** Add new border radius tokens ([#1275](https://github.com/digdir/designsystemet/issues/1275)) ([59e5cce](https://github.com/digdir/designsystemet/commit/59e5ccece893e580b7f32cfc6ae2761a3502a5c1))
- **DropdownMenu:** Add portal support ([#1289](https://github.com/digdir/designsystemet/issues/1289)) ([a0ff1bf](https://github.com/digdir/designsystemet/commit/a0ff1bf994492c66e567d4887aae75b6fa4e984e))
- **Popover:** Add portal support ([#1293](https://github.com/digdir/designsystemet/issues/1293)) ([e739c24](https://github.com/digdir/designsystemet/commit/e739c24f147819d7afe283b76b1cda4f54a1ad5f))
- **Tooltip:** Add portal support ([#1294](https://github.com/digdir/designsystemet/issues/1294)) ([3e95c3a](https://github.com/digdir/designsystemet/commit/3e95c3a1efc2d2d0866f272b4491fff336b03890))

### Performance Improvements

- :zap: Replace `classnames` with `clsx` ([#1272](https://github.com/digdir/designsystemet/issues/1272)) ([855f387](https://github.com/digdir/designsystemet/commit/855f38756dbc793e471a6718ca7265bb9fc5ff09))

# [0.42.0](https://github.com/digdir/designsystemet/compare/@digdir/design-system-react@0.41.1...@digdir/design-system-react@0.42.0) (2023-12-21)

### Features

- **Skeleton:** ✨ New component ([#1149](https://github.com/digdir/designsystemet/issues/1149)) ([ab459e6](https://github.com/digdir/designsystemet/commit/ab459e64ca12c64bcd058c445907d5e5b3beb557))

## [0.41.1](https://github.com/digdir/designsystemet/compare/@digdir/design-system-react@0.41.0...@digdir/design-system-react@0.41.1) (2023-12-20)

### Bug Fixes

- **Radio:** :bug: Correct sizes for icon ([#1255](https://github.com/digdir/designsystemet/issues/1255)) ([53d836e](https://github.com/digdir/designsystemet/commit/53d836e86d5321be3d48cd3ceccb3ccd4092100d))
- **Switch:** :bug: Prevent from being clamped in flex container ([#1256](https://github.com/digdir/designsystemet/issues/1256)) ([f5d31eb](https://github.com/digdir/designsystemet/commit/f5d31eb4ff420fe5bc8a160c90f06eb43ce7d06f))

# [0.41.0](https://github.com/digdir/designsystemet/compare/@digdir/design-system-react@0.40.0...@digdir/design-system-react@0.41.0) (2023-12-19)

### Bug Fixes

- **Accordion:** 🐛 Fix wrong border colors for `first`, `second`, `third` colors ([#1246](https://github.com/digdir/designsystemet/issues/1246)) ([e38bf41](https://github.com/digdir/designsystemet/commit/e38bf415a2ca258bee229f69b4a16f4205a6f90f))
- **DropdownMenu:** :bug: Add missing background ([#1252](https://github.com/digdir/designsystemet/issues/1252)) ([2abe4db](https://github.com/digdir/designsystemet/commit/2abe4dbd6065ce4784581c53058019b8fd0c621b))

### Features

- **Combobox:** ✨ New component ([#1126](https://github.com/digdir/designsystemet/issues/1126)) ([2d51cd7](https://github.com/digdir/designsystemet/commit/2d51cd771e7c32c5e5fc92c037a33875331d2f7e))
- **Select:** :wastebasket: Change `Select` to legacy ([#1250](https://github.com/digdir/designsystemet/issues/1250)) ([6f619d7](https://github.com/digdir/designsystemet/commit/6f619d76b60b5e7c28cc82295056d1fc6fcfe3d2))

# [0.40.0](https://github.com/digdir/designsystemet/compare/@digdir/design-system-react@0.39.0...@digdir/design-system-react@0.40.0) (2023-12-18)

### Bug Fixes

- **DropDownMenuItem:** add list style none ([#1190](https://github.com/digdir/designsystemet/issues/1190)) ([11bd19b](https://github.com/digdir/designsystemet/commit/11bd19bfb6ac76b2c697a22e876117c4128be3bd))
- **List:** Wrap in `div` to allow access to `Heading` ([#1217](https://github.com/digdir/designsystemet/issues/1217)) ([afcadb7](https://github.com/digdir/designsystemet/commit/afcadb7c4cb4b368d247af0c41ed8debf53c4b66))
- **Pagination:** Only use needed space for buttons ([#1220](https://github.com/digdir/designsystemet/issues/1220)) ([4bf3d74](https://github.com/digdir/designsystemet/commit/4bf3d745888f500259df5aadf4edee97ec4f95bc))
- **Select:** Select not working properly in Modal ([#1195](https://github.com/digdir/designsystemet/issues/1195)) ([fb8be6a](https://github.com/digdir/designsystemet/commit/fb8be6a647ba0da8b5b23e65813508f34e09c8c1))
- **ToggleGroup:** Only use needed space for buttons ([#1216](https://github.com/digdir/designsystemet/issues/1216)) ([3d4f721](https://github.com/digdir/designsystemet/commit/3d4f7212c2423eae043578dd5c28e35123d863e8))

### Features

- **ToggleGroup:** Support `form` when `name` is provided ([#1218](https://github.com/digdir/designsystemet/issues/1218)) ([75fd99f](https://github.com/digdir/designsystemet/commit/75fd99f2d5f22ca9ceaceb022217a399b5e0a56e))

# [0.39.0](https://github.com/digdir/designsystemet/compare/@digdir/design-system-react@0.38.0...@digdir/design-system-react@0.39.0) (2023-12-14)

### Bug Fixes

- **Accordion:** support for using custom elements inside `Item` and `Header` ([#1198](https://github.com/digdir/designsystemet/issues/1198)) ([a09eea1](https://github.com/digdir/designsystemet/commit/a09eea1b8c08f91ebb67826aa375f149bb5ea35a))
- **Button, Checkbox, NativeSelect, Radio, Search, Switch, Textfield:** 🐛 Sizes and alignment ([#1166](https://github.com/digdir/designsystemet/issues/1166)) ([716395d](https://github.com/digdir/designsystemet/commit/716395dc5f0805f92c485572ae98693d71d5fa6d))
- **Chip:** :bug: Add missing disabled styling and behaviour ([#1201](https://github.com/digdir/designsystemet/issues/1201)) ([d6647bf](https://github.com/digdir/designsystemet/commit/d6647bfd8622c10fe23fa76dfbadfbb0a5367e89))
- **ErrorMessage:** Change default wrapper to `div` ([#1203](https://github.com/digdir/designsystemet/issues/1203)) ([f14e22b](https://github.com/digdir/designsystemet/commit/f14e22b6bbd14a9e1dbd923583e8573109f9cdaa))
- **NativeSelect:** Fix firefox background color ([#1185](https://github.com/digdir/designsystemet/issues/1185)) ([ddf8d89](https://github.com/digdir/designsystemet/commit/ddf8d8976513c87e155d534950955effc8398574))
- **Search:** :bug: Fix missaligned search icon ([#1207](https://github.com/digdir/designsystemet/issues/1207)) ([eac15b2](https://github.com/digdir/designsystemet/commit/eac15b283fea8a2c8994b1b8f26b59101a89bb90))
- **Textfield, Textarea:** :bug: Only apply `aria-describedby` if its defined ([#1184](https://github.com/digdir/designsystemet/issues/1184)) ([f510c0c](https://github.com/digdir/designsystemet/commit/f510c0cc98b33838da452bd7a89869948247c449))
- **ToggleGroup:** :bug: Use correct paddings on `ToggleGroup.Item` ([#1209](https://github.com/digdir/designsystemet/issues/1209)) ([2b6dade](https://github.com/digdir/designsystemet/commit/2b6dade30d65fb5565c3c266130beaf3480a3520))

### Features

- **Heading:** Make `size` optional with default `xlarge` ([#1208](https://github.com/digdir/designsystemet/issues/1208)) ([b2aaf27](https://github.com/digdir/designsystemet/commit/b2aaf275067bbf2148c7825e8a48f1d8721e7c41))

# [0.38.0](https://github.com/digdir/designsystemet/compare/@digdir/design-system-react@0.37.0...@digdir/design-system-react@0.38.0) (2023-12-01)

### Bug Fixes

- :bug: Temporary change order for injected CSS ([#1137](https://github.com/digdir/designsystemet/issues/1137)) ([8f8d978](https://github.com/digdir/designsystemet/commit/8f8d97861d96f46f4b1404f24b642993a87a0169))
- **Checkbox, Radio, Search:** 🐛 Styling interferences ([#1163](https://github.com/digdir/designsystemet/issues/1163)) ([b53f050](https://github.com/digdir/designsystemet/commit/b53f050ada1446f955082ea95739cb7fe00f006f))
- **Chip.Toggle:** Make Chip.Toggle fallback on context size ([#1150](https://github.com/digdir/designsystemet/issues/1150)) ([c555bca](https://github.com/digdir/designsystemet/commit/c555bca248b5c07e87b39c8084802da120c7b334))
- **DropdownMenu:** :bug: Add missing z-index ([#1142](https://github.com/digdir/designsystemet/issues/1142)) ([ae84c10](https://github.com/digdir/designsystemet/commit/ae84c10901f1efb9315394d57496982490cff9bb))
- **Link:** Underline not thicker on hover in safari ([#1151](https://github.com/digdir/designsystemet/issues/1151)) ([22580b3](https://github.com/digdir/designsystemet/commit/22580b3268e485079679b3875072cb14fc4d9b6e))
- **Modal:** Change solution for setting width and fixed clicking on top or bottom closing the Modal ([#1171](https://github.com/digdir/designsystemet/issues/1171)) ([22fbc6b](https://github.com/digdir/designsystemet/commit/22fbc6bad67ef3c6b6a4c1bbef742323a7f65c1d))
- **Popover:** wrong border size on arrow ([#1176](https://github.com/digdir/designsystemet/issues/1176)) ([499c5e2](https://github.com/digdir/designsystemet/commit/499c5e2a7a8816ee67ec95f592467df7bbf96fb1))

### Features

- **Card:** ✨ New component ([#1009](https://github.com/digdir/designsystemet/issues/1009)) ([c158e01](https://github.com/digdir/designsystemet/commit/c158e017b365109a9da34a9ddf49755d53b2b588))
- **Divider:** :lipstick: Adjusted size ([#1165](https://github.com/digdir/designsystemet/issues/1165)) ([71dc2f8](https://github.com/digdir/designsystemet/commit/71dc2f8762d0ce25a9f0541a0c9cb4dac457162b))
- **sizing:** Syncronize sizing between Figma and React components ([#1084](https://github.com/digdir/designsystemet/issues/1084)) ([06c9c44](https://github.com/digdir/designsystemet/commit/06c9c44bc03e32a8911a910c4e424aea963002d2))
- **SkipLink:** ✨ New component ([#1111](https://github.com/digdir/designsystemet/issues/1111)) ([996f436](https://github.com/digdir/designsystemet/commit/996f436e757b0a9f24dc15699539a0781a76c088))

# [0.37.0](https://github.com/digdir/designsystemet/compare/@digdir/design-system-react@0.35.0...@digdir/design-system-react@0.37.0) (2023-11-17)

### Bug Fixes

- **Button:** :bug: Adjust sizing to match `Textfield` and other fixes according to Figma ([#1023](https://github.com/digdir/designsystemet/issues/1023)) ([a3252f9](https://github.com/digdir/designsystemet/commit/a3252f99c135936b50454957914914e8d965cb5d))
- **Divider:** :label: Optional `color` prop ([#1085](https://github.com/digdir/designsystemet/issues/1085)) ([7ae9eca](https://github.com/digdir/designsystemet/commit/7ae9eca79fe6f522d1ee3af1cf0ae3c424b5ede6))
- **Divider:** Add so it can recieve `HTMLHRElement` props ([#1064](https://github.com/digdir/designsystemet/issues/1064)) ([c7c3acd](https://github.com/digdir/designsystemet/commit/c7c3acdb2e2d8520e1fedd9961a4c2789ed847d8))
- **List:** :label: Default type for `children` ([#1032](https://github.com/digdir/designsystemet/issues/1032)) ([4f83fa0](https://github.com/digdir/designsystemet/commit/4f83fa0a3b4a27fbbd9821b6b95ee2c311cdd647))
- **OverridableComponent:** Add `displayName` to type ([#1106](https://github.com/digdir/designsystemet/issues/1106)) ([416810c](https://github.com/digdir/designsystemet/commit/416810cd974974e6ece20ebc703ec8850a1679ff))
- **Switch:** :bug: Should reduce-motion ([#1049](https://github.com/digdir/designsystemet/issues/1049)) ([58926be](https://github.com/digdir/designsystemet/commit/58926be00777eb70d2ccf98332ed0d47d09e0d4f))

### Features

- :sparkles: New `Search` component ([#858](https://github.com/digdir/designsystemet/issues/858)) ([b4888c4](https://github.com/digdir/designsystemet/commit/b4888c43398447a58d17d36920888c4d77ccccbf))
- **Box:** add `forwardRef`, make props default `undefined` ([#1059](https://github.com/digdir/designsystemet/issues/1059)) ([7e0cd1c](https://github.com/digdir/designsystemet/commit/7e0cd1c80c0169b8066d1ab1a40b5317efbf4299))
- **Box:** Make the component ([#1001](https://github.com/digdir/designsystemet/issues/1001)) ([1651d4d](https://github.com/digdir/designsystemet/commit/1651d4d2b03f50d27a9b252556b18ebb30dea217))
- **Combobox:** Create the component ([#774](https://github.com/digdir/designsystemet/issues/774)) ([23d4027](https://github.com/digdir/designsystemet/commit/23d4027ae422531cc279e2b00b25ab679ba524dd))
- **Divider:** ✨ New component ([#1057](https://github.com/digdir/designsystemet/issues/1057)) ([9d5d257](https://github.com/digdir/designsystemet/commit/9d5d257860dc7f2a0886bf8e610799eefe8a62a5))
- **DropdownMenu:** ✨ New component ([#1070](https://github.com/digdir/designsystemet/issues/1070)) ([23bfddf](https://github.com/digdir/designsystemet/commit/23bfddf724c9ead13d284e9ac0d02ddf5ccfd71d))
- **Modal:** ✨ New component ([#1037](https://github.com/digdir/designsystemet/issues/1037)) ([8b720cf](https://github.com/digdir/designsystemet/commit/8b720cf32c77ca1f5b8a080b067bac2789afcfef))
- Remove density tokens ([#1079](https://github.com/digdir/designsystemet/issues/1079)) ([d25c4fd](https://github.com/digdir/designsystemet/commit/d25c4fdf77080776cfd71c69a88da4013edc4caf))
- **ResponsiveTable:** 🗑️ Change to Legacy ([#1108](https://github.com/digdir/designsystemet/issues/1108)) ([348d03b](https://github.com/digdir/designsystemet/commit/348d03b8be6996ac1d4a2093aecdbfa66cb1bf86))
- **Select:** should be able to add name to the select component ([#1046](https://github.com/digdir/designsystemet/issues/1046)) ([4d9fbb2](https://github.com/digdir/designsystemet/commit/4d9fbb28925b9aa052bb8d0026e2c46527c00e0f))

# [0.36.0](https://github.com/digdir/designsystemet/compare/@digdir/design-system-react@0.35.0...@digdir/design-system-react@0.36.0) (2023-11-08)

### Bug Fixes

- **Button:** :bug: Adjust sizing to match `Textfield` and other fixes according to Figma ([#1023](https://github.com/digdir/designsystemet/issues/1023)) ([a3252f9](https://github.com/digdir/designsystemet/commit/a3252f99c135936b50454957914914e8d965cb5d))
- **Divider:** Add so it can recieve `HTMLHRElement` props ([#1064](https://github.com/digdir/designsystemet/issues/1064)) ([c7c3acd](https://github.com/digdir/designsystemet/commit/c7c3acdb2e2d8520e1fedd9961a4c2789ed847d8))
- **List:** :label: Default type for `children` ([#1032](https://github.com/digdir/designsystemet/issues/1032)) ([4f83fa0](https://github.com/digdir/designsystemet/commit/4f83fa0a3b4a27fbbd9821b6b95ee2c311cdd647))
- **Switch:** :bug: Should reduce-motion ([#1049](https://github.com/digdir/designsystemet/issues/1049)) ([58926be](https://github.com/digdir/designsystemet/commit/58926be00777eb70d2ccf98332ed0d47d09e0d4f))

### Features

- **Box:** Add `forwardRef`, make props default `undefined` ([#1059](https://github.com/digdir/designsystemet/issues/1059)) ([7e0cd1c](https://github.com/digdir/designsystemet/commit/7e0cd1c80c0169b8066d1ab1a40b5317efbf4299))
- **Box:** New internal component ([#1001](https://github.com/digdir/designsystemet/issues/1001)) ([1651d4d](https://github.com/digdir/designsystemet/commit/1651d4d2b03f50d27a9b252556b18ebb30dea217))
- **Combobox:** New experimental component ([#774](https://github.com/digdir/designsystemet/issues/774)) ([23d4027](https://github.com/digdir/designsystemet/commit/23d4027ae422531cc279e2b00b25ab679ba524dd))
- **Divider:** ✨ New component ([#1057](https://github.com/digdir/designsystemet/issues/1057)) ([9d5d257](https://github.com/digdir/designsystemet/commit/9d5d257860dc7f2a0886bf8e610799eefe8a62a5))
- **Select:** Should be able to add name to the select component ([#1046](https://github.com/digdir/designsystemet/issues/1046)) ([4d9fbb2](https://github.com/digdir/designsystemet/commit/4d9fbb28925b9aa052bb8d0026e2c46527c00e0f))

# [0.35.0](https://github.com/digdir/designsystemet/compare/@digdir/design-system-react@0.34.0...@digdir/design-system-react@0.35.0) (2023-10-30)

### Bug Fixes

- **HelpText:** Add missing `aria-expanded` ([#992](https://github.com/digdir/designsystemet/issues/992)) ([383ed03](https://github.com/digdir/designsystemet/commit/383ed0366e1fd831c1b354411df78a5670b657d2))
- **LegacyTextField, LegacyTextArea:** :bug: Fix wrong placement of character counter ([#1008](https://github.com/digdir/designsystemet/issues/1008)) ([c75aa3f](https://github.com/digdir/designsystemet/commit/c75aa3fd4e7322d4b6870423dfbc1264b3e7ba11))

### Features

- **Spinner:** Update component and docs ([#970](https://github.com/digdir/designsystemet/issues/970)) ([269f157](https://github.com/digdir/designsystemet/commit/269f1578b7571ab6eb53c52cb8055734abaa14f9))

# [0.34.0](https://github.com/digdir/designsystemet/compare/@digdir/design-system-react@0.33.0...@digdir/design-system-react@0.34.0) (2023-10-25)

### Bug Fixes

- **InputWrapper:** Remove gap ([#989](https://github.com/digdir/designsystemet/issues/989)) ([1fac2f7](https://github.com/digdir/designsystemet/commit/1fac2f784ca5814a66529c51d800307e70def9d1))
- **List:** Add more spacing between items ([#982](https://github.com/digdir/designsystemet/issues/982)) ([6febc88](https://github.com/digdir/designsystemet/commit/6febc887f165802efd5a8ded9d63ec547b2032cf))
- **Switch:** Remove `gap` when there is no children ([#986](https://github.com/digdir/designsystemet/issues/986)) ([1c95186](https://github.com/digdir/designsystemet/commit/1c951865d51b042bf4f00998e3d71d2ec9e6ded2))

### Features

- Add `htmlSize` to `NativeSelect` and `Textfield` ([#972](https://github.com/digdir/designsystemet/issues/972)) ([bf72f3b](https://github.com/digdir/designsystemet/commit/bf72f3b7cf5b97ed7af53c731c757c6acbc90048))
- **List:** More options for `List` component ([#913](https://github.com/digdir/designsystemet/issues/913)) ([8903110](https://github.com/digdir/designsystemet/commit/8903110823ce7d5ce85651724d057efc3d09ffd4))

# [0.33.0](https://github.com/digdir/designsystemet/compare/@digdir/design-system-react@0.32.1...@digdir/design-system-react@0.33.0) (2023-10-19)

### Features

- **HelpText:** Use new Popover ([#960](https://github.com/digdir/designsystemet/issues/960)) ([b12da58](https://github.com/digdir/designsystemet/commit/b12da582879ceb9847d0b63944fe4d3ab643b146))
- **NativeSelect:** Updated to match other form components ([#955](https://github.com/digdir/designsystemet/issues/955)) ([71f048e](https://github.com/digdir/designsystemet/commit/71f048ee01e4c0d638bb2204dd40b289fd422d75))
- **Popover:** :wastebasket: Change to Legacy ([#956](https://github.com/digdir/designsystemet/issues/956)) ([cf9be72](https://github.com/digdir/designsystemet/commit/cf9be72215ff813b80d881852c52ccb083b5ca5a))
- **Popover:** New component and method for attaching to anchor element ([#959](https://github.com/digdir/designsystemet/issues/959)) ([98f9985](https://github.com/digdir/designsystemet/commit/98f99853bfd55c9dde0d307188be2b00528800bc))
- **Tag:** Change `filled` and `outline` to `primary` and `secondary` ([#958](https://github.com/digdir/designsystemet/issues/958)) ([9c230af](https://github.com/digdir/designsystemet/commit/9c230af1fae54db02420241f30261971d3aaa83c))

## [0.32.1](https://github.com/digdir/designsystemet/compare/@digdir/design-system-react@0.32.0...@digdir/design-system-react@0.32.1) (2023-10-17)

### Bug Fixes

- **ToggleGroup:** :bug: Fix missing styling on `ToggleGroup.Item` ([#952](https://github.com/digdir/designsystemet/issues/952)) ([9ebf8c1](https://github.com/digdir/designsystemet/commit/9ebf8c1b676c55aae0f951a30a684c5c325966b1))

# [0.32.0](https://github.com/digdir/designsystemet/compare/@digdir/design-system-react@0.31.0...@digdir/design-system-react@0.32.0) (2023-10-16)

### Bug Fixes

- **Chip:** Move all `Chip` css to one file ([#944](https://github.com/digdir/designsystemet/issues/944)) ([ee4f4d3](https://github.com/digdir/designsystemet/commit/ee4f4d3243d3be08d6c9cdfc28729ee2240e546a))

### Features

- **Button:** :boom: Removed `dashedBorder` ([#941](https://github.com/digdir/designsystemet/issues/941)) ([2297429](https://github.com/digdir/designsystemet/commit/2297429a2cbc00a2287954210aeccb02ca3fc56d))
- **Button:** New `variants` and minor fixes ([#938](https://github.com/digdir/designsystemet/issues/938)) ([bc7a052](https://github.com/digdir/designsystemet/commit/bc7a052e75499afd0e2260ee7e2557191b8b12bd))

## [0.31.1](https://github.com/digdir/designsystemet/compare/@digdir/design-system-react@0.31.0...@digdir/design-system-react@0.31.1) (2023-10-13)

### Bug Fixes

- Revert "fix(Select): Hide list when reference is hidden (#917)" ([#936](https://github.com/digdir/designsystemet/issues/936))

# [0.31.0](https://github.com/digdir/designsystemet/compare/@digdir/design-system-react@0.30.0...@digdir/design-system-react@0.31.0) (2023-10-12)

### Bug Fixes

- Add missing export `ToggleGroup` ([#931](https://github.com/digdir/designsystemet/issues/931)) ([782d77d](https://github.com/digdir/designsystemet/commit/782d77d7cbbdba83744649134c1e30ec8a682b0d))

### Features

- **Button:** :sparkles: Support for overriding html element using `as` ([#926](https://github.com/digdir/designsystemet/issues/926)) ([5689052](https://github.com/digdir/designsystemet/commit/5689052b461c424bf26bc750c2e1212f3034c430))

# [0.30.0](https://github.com/digdir/designsystemet/compare/@digdir/design-system-react@0.29.0...@digdir/design-system-react@0.30.0) (2023-10-11)

### Bug Fixes

- **Select:** Hide list when reference is hidden ([#917](https://github.com/digdir/designsystemet/issues/917)) ([bccea75](https://github.com/digdir/designsystemet/commit/bccea7520cb7f7de13b434dbd4dcef646885aa36))

### Features

- **Tooltip:** Create new tooltip component ([#914](https://github.com/digdir/designsystemet/issues/914)) ([eccc36d](https://github.com/digdir/designsystemet/commit/eccc36d24b4e8cdf77939d88e45a2a9eb9e76998))

# [0.29.0](https://github.com/digdir/designsystemet/compare/@digdir/design-system-react@0.28.1...@digdir/design-system-react@0.29.0) (2023-10-07)

### Features

- **Tabs:** :sparkles: Add missing export for new Tabs ([#915](https://github.com/digdir/designsystemet/issues/915)) ([6cf70ec](https://github.com/digdir/designsystemet/commit/6cf70ec65d8ae713b71f7345cb73b70b62a1997c))

## [0.28.1](https://github.com/digdir/designsystemet/compare/@digdir/design-system-react@0.28.0...@digdir/design-system-react@0.28.1) (2023-10-06)

### Bug Fixes

- **Accordion:** Make border styling overridable ([#900](https://github.com/digdir/designsystemet/issues/900)) ([b4af852](https://github.com/digdir/designsystemet/commit/b4af8521ecf66bb0dbd38bc431cec4db98e6ebc7))
- **Radio:** Adhere to provided name prop ([#903](https://github.com/digdir/designsystemet/issues/903)) ([f0cfa2a](https://github.com/digdir/designsystemet/commit/f0cfa2a1139b5e2291123763cba5a8ac69f390f5))

# [0.28.0](https://github.com/digdir/designsystemet/compare/@digdir/design-system-react@0.27.0...@digdir/design-system-react@0.28.0) (2023-10-05)

### Features

- Add basic SSR support and peerDependecies to `react 18.2.0` ([#864](https://github.com/digdir/designsystemet/issues/864)) ([d512ee2](https://github.com/digdir/designsystemet/commit/d512ee26e6f50e61588538961dd185b92e3e6654))
- Change `color` names `primary`, `secondary`, `tertiary` to `first`, `second`, `third` ([#887](https://github.com/digdir/designsystemet/issues/887)) ([50f4eee](https://github.com/digdir/designsystemet/commit/50f4eee4bf2ce813001ad1e28fa12648149fe677))
- **DosAndDonts:** Add Do and Dont component ([#857](https://github.com/digdir/designsystemet/issues/857)) ([8116d00](https://github.com/digdir/designsystemet/commit/8116d00eb8afbb606bd325a7a1695c31bbc3fcbe))
- **Tabs:** :sparkles: New `Tabs` Component ([#876](https://github.com/digdir/designsystemet/issues/876)) ([6ae19e7](https://github.com/digdir/designsystemet/commit/6ae19e75e7f874dc7d1acbfe9587c8ffbb29e641))
- **Tabs:** :wastebasket: Change to Legacy ([#875](https://github.com/digdir/designsystemet/issues/875)) ([1863383](https://github.com/digdir/designsystemet/commit/186338375861af241c565be4bf86ab9c05d1867b))
- **ToggleGroup:** Add accessible title for items with only icon ([#897](https://github.com/digdir/designsystemet/issues/897)) ([9482315](https://github.com/digdir/designsystemet/commit/94823150b5585ba9612fbbfbb70c32818812fcaa))

# [0.27.0](https://github.com/digdir/designsystemet/compare/@digdir/design-system-react@0.26.0...@digdir/design-system-react@0.27.0) (2023-09-28)

### Features

- **Button, Chip, Accordion:** :recycle: Change components to use the same class for focus behaviour ([#868](https://github.com/digdir/designsystemet/issues/868)) ([b3fa591](https://github.com/digdir/designsystemet/commit/b3fa591d86bbf2b497a618464e3f3af10b852ad6))
- **ToggleButtonGroup:** :wastebasket: Change to Legacy ([#870](https://github.com/digdir/designsystemet/issues/870)) ([3298aba](https://github.com/digdir/designsystemet/commit/3298aba96e343af73bcf8b12cfcb64f9cf0a61a0))
- **ToggleGroup:** ✨ New `ToggleGroup` component ([#813](https://github.com/digdir/designsystemet/issues/813)) ([bc45c2e](https://github.com/digdir/designsystemet/commit/bc45c2e50a941fdd49028607fa3d94c4876e4cc0))

# [0.26.0](https://github.com/digdir/designsystemet/compare/@digdir/design-system-react@0.25.1...@digdir/design-system-react@0.26.0) (2023-09-22)

### Bug Fixes

- **Textfield:** :lipstick: Style adjustments after feedback ([#852](https://github.com/digdir/designsystemet/issues/852)) ([4544f1e](https://github.com/digdir/designsystemet/commit/4544f1e96fb90c00360377b2a18998e9bce36f16))

### Features

- **Textarea:** :sparkles: New `Textarea` component ([#851](https://github.com/digdir/designsystemet/issues/851)) ([9d9c3ab](https://github.com/digdir/designsystemet/commit/9d9c3ab390cea40bd3137845fd2b7fb251c84b7a))
- **TextArea:** :wastebasket: Change to Legacy ([#853](https://github.com/digdir/designsystemet/issues/853)) ([9da973f](https://github.com/digdir/designsystemet/commit/9da973f9db34576ad89f5d31f07ccfc933f84ee7))

## [0.25.1](https://github.com/digdir/designsystemet/compare/@digdir/design-system-react@0.25.0...@digdir/design-system-react@0.25.1) (2023-09-22)

### Bug Fixes

- **Textfield:** Prop typo ([#848](https://github.com/digdir/designsystemet/issues/848)) ([0c59b86](https://github.com/digdir/designsystemet/commit/0c59b86f661222e0021311cd5eba6c7aa429ea8c))

# [0.25.0](https://github.com/digdir/designsystemet/compare/@digdir/design-system-react@0.24.2...@digdir/design-system-react@0.25.0) (2023-09-21)

### Features

- **ErrorMessage:** :sparkles: Add new option to toggle error color ([#836](https://github.com/digdir/designsystemet/issues/836)) ([8b177f3](https://github.com/digdir/designsystemet/commit/8b177f3f25b3c2075d38f8f5e8a438d8727b5c98))
- **ErrorMessage:** ✨ Add `large` size ([#840](https://github.com/digdir/designsystemet/issues/840)) ([9742abf](https://github.com/digdir/designsystemet/commit/9742abf1d002967fdfdb6b3caa8f33bb11a85019))
- **Fieldset, Switch, Radio, Checkbox:** :sparkles: Add `large` size ([#841](https://github.com/digdir/designsystemet/issues/841)) ([4e8052f](https://github.com/digdir/designsystemet/commit/4e8052fc6a886b68676ca5de0a47d80eadb93656))
- **Textfield:** :sparkles: New `Textfield` component ([#816](https://github.com/digdir/designsystemet/issues/816)) ([0c14cfa](https://github.com/digdir/designsystemet/commit/0c14cfa3c6add379ada2f5e11dd2b6a0de05aa56))
- **TextField:** 🗑️ Change to Legacy ([#838](https://github.com/digdir/designsystemet/issues/838)) ([c3d6d2d](https://github.com/digdir/designsystemet/commit/c3d6d2d684ff764fe96a92e1852ddf115cf1ec62))

## [0.24.2](https://github.com/digdir/designsystemet/compare/@digdir/design-system-react@0.24.1...@digdir/design-system-react@0.24.2) (2023-09-19)

### Bug Fixes

- **Switch:** :bug: Adher to passed `checked` & `defaultChecked` props ([#832](https://github.com/digdir/designsystemet/issues/832)) ([13a4577](https://github.com/digdir/designsystemet/commit/13a45774943d01c6ea3cb9e7056b1686dfa9a358))

## [0.24.1](https://github.com/digdir/designsystemet/compare/@digdir/design-system-react@0.24.0...@digdir/design-system-react@0.24.1) (2023-09-18)

### Bug Fixes

- **Accordion:** hide content in Accordions from screen readers when Accordion is closed ([#815](https://github.com/digdir/designsystemet/issues/815)) ([eea59af](https://github.com/digdir/designsystemet/commit/eea59af9d09c59ba8da734a0b5cf60bd704661d1))
- **Radio, Checkbox, Button, Chip.Toggle:** Remove sticky hover on touch devices ([#803](https://github.com/digdir/designsystemet/issues/803)) ([a4be791](https://github.com/digdir/designsystemet/commit/a4be7918b49a607ebfa7042b3aa2d8e2f798a016))
- **Radio, Checkbox, Switch:** :bug: Remove z-index on selection control icon ([#798](https://github.com/digdir/designsystemet/issues/798)) ([6c1db8b](https://github.com/digdir/designsystemet/commit/6c1db8bf213e62eb9b788ac82e3114e90cd9f052))

# [0.24.0](https://github.com/digdir/designsystemet/compare/@digdir/design-system-react@0.23.3...@digdir/design-system-react@0.24.0) (2023-08-31)

### Features

- **Switch:** :sparkles: New `Switch` component ([#727](https://github.com/digdir/designsystemet/issues/727)) ([8fa362b](https://github.com/digdir/designsystemet/commit/8fa362bde7ac7d7c6d242e625bf2e4f42f90aa8d))

## [0.23.3](https://github.com/digdir/designsystemet/compare/@digdir/design-system-react@0.23.2...@digdir/design-system-react@0.23.3) (2023-08-25)

### Bug Fixes

- **Chip:** Proper styling on tall chips ([#756](https://github.com/digdir/designsystemet/issues/756)) ([b47eb37](https://github.com/digdir/designsystemet/commit/b47eb37a40019eb4cfeb755551a688541ab60dd7))

## [0.23.2](https://github.com/digdir/designsystemet/compare/@digdir/design-system-react@0.23.1...@digdir/design-system-react@0.23.2) (2023-08-23)

### Bug Fixes

- **Accordion:** :bug: Correct header color opacity ([f68ad25](https://github.com/digdir/designsystemet/commit/f68ad25d4693505bfa78679d1cb14454bbf99644))

## [0.23.1](https://github.com/digdir/designsystemet/compare/@digdir/design-system-react@0.23.0...@digdir/design-system-react@0.23.1) (2023-08-23)

### Bug Fixes

- **Accordion:** Apply height animation on opening and closing only ([#730](https://github.com/digdir/designsystemet/issues/730)) ([78852e1](https://github.com/digdir/designsystemet/commit/78852e195efea10b9eb93085b5ad20b843f39aa5))
- **Checkbox, Radio, Fieldset:** :bug: Make sure spacings are only applied when needed ([#746](https://github.com/digdir/designsystemet/issues/746)) ([f03df61](https://github.com/digdir/designsystemet/commit/f03df61dd5b5ca3e93e62a30bd480c9541a71ccf))
- **InputWrapper:** isValid works now independent of charLimit validation ([#734](https://github.com/digdir/designsystemet/issues/734)) ([bf4ecd8](https://github.com/digdir/designsystemet/commit/bf4ecd83f71f66351d6de0cae4343fcded53ed0a))
- **Link:** :lipstick: Tweaked style for better visibility between states ([#744](https://github.com/digdir/designsystemet/issues/744)) ([cfc37e2](https://github.com/digdir/designsystemet/commit/cfc37e2687db883a25dc16042c1e3c602455850b))
- **Pagination:** :bug: Fix compact spacings and ellipsis alignment ([#748](https://github.com/digdir/designsystemet/issues/748)) ([c54eb1e](https://github.com/digdir/designsystemet/commit/c54eb1ec90b6088774202effa630d3c1d4a0425f))
- **Radio, Checkbox:** :bug: Fallback to `checked` or `defaultChecked` if `Group` `value` is not set ([#733](https://github.com/digdir/designsystemet/issues/733)) ([4777dac](https://github.com/digdir/designsystemet/commit/4777dac6bef610cbf5010ff37eff5d6c42820df9))

# [0.23.0](https://github.com/digdir/designsystemet/compare/@digdir/design-system-react@0.22.0...@digdir/design-system-react@0.23.0) (2023-08-16)

### Bug Fixes

- **Pagination:** :wheelchair: Fix 'a11y' error for Pagination next/prev buttons ([#726](https://github.com/digdir/designsystemet/issues/726)) ([e0e6fa4](https://github.com/digdir/designsystemet/commit/e0e6fa424c9d1af54546eb344e58105271c8ea63))

### Features

- **Checkbox, CheckboxGroup, FieldSet, RadioButton, RadioGroup:** :wastebasket: Change to Legacy ([#716](https://github.com/digdir/designsystemet/issues/716)) ([b22d836](https://github.com/digdir/designsystemet/commit/b22d836c51ffcb024331eb07109547b288151888))
- **Checkbox, Radio, Fieldset:** :sparkles: Release new components ([#720](https://github.com/digdir/designsystemet/issues/720)) ([7facb4d](https://github.com/digdir/designsystemet/commit/7facb4d1c77deffedb350fc7ed3e4bceecd4ff75))
- **Link:** Create the component ([#711](https://github.com/digdir/designsystemet/issues/711)) ([ac0adcc](https://github.com/digdir/designsystemet/commit/ac0adcc2992499fd850e7974a54a7e4b19dfdd06))

### BREAKING CHANGE

- **enums:** 🔥 Remove `enums` ([#721](https://github.com/digdir/designsystemet/issues/721))
- **LegacyAccordion:** 🔥 Remove `LegacyAccordion` ([#707](https://github.com/digdir/designsystemet/issues/707))

# [0.22.0](https://github.com/digdir/designsystemet/compare/@digdir/design-system-react@0.21.0...@digdir/design-system-react@0.22.0) (2023-08-09)

### Bug Fixes

- **Accordion:** Support dynamic height ([#689](https://github.com/digdir/designsystemet/issues/689)) ([6624ba1](https://github.com/digdir/designsystemet/commit/6624ba1eb75007cf07227f74a633f78d0b718ce3))
- **Alert:** :bug: Left border should now be positioned correctly inside the box ([#702](https://github.com/digdir/designsystemet/issues/702)) ([5fa2aeb](https://github.com/digdir/designsystemet/commit/5fa2aeb4a17e77f5fbb98fd8ac039bb4bed0a473))
- **Chip.Removable:** :bug: Use correct button type to avoid default submit ([#694](https://github.com/digdir/designsystemet/issues/694)) ([357cfe8](https://github.com/digdir/designsystemet/commit/357cfe827460031cc5e03f0e98f61947210bf40c))

### Features

- **Button:** :recycle: Change default `size` to medium (instead of small`) ([#698](https://github.com/digdir/designsystemet/issues/698)) ([ab238df](https://github.com/digdir/designsystemet/commit/ab238df8edb86f0432fe59b0d653986c6d3f09b5))
- **Checkbox:** ✨ New `Checkbox` component (unreleased) ([#681](https://github.com/digdir/designsystemet/issues/681)) ([6b49301](https://github.com/digdir/designsystemet/commit/6b4930169802a860bad518173e18186407a36f02))
- **Chip.Toggle:** ♻️ Enabled `checkmark` as default when `selected` ([#693](https://github.com/digdir/designsystemet/issues/693)) ([049460c](https://github.com/digdir/designsystemet/commit/049460c1b027f1846e5bf675b4e6768d6320458a))
- **Label:** :sparkles: Added new prop `weight` for setting font weight ([#699](https://github.com/digdir/designsystemet/issues/699)) ([1641752](https://github.com/digdir/designsystemet/commit/16417526f584339544129ba990891f3dabf66267))

# [0.21.0](https://github.com/digdir/designsystemet/compare/@digdir/design-system-react@0.20.0...@digdir/design-system-react@0.21.0) (2023-08-02)

### Bug Fixes

- **Button:** :bug: Fix icon being clipped in Firefox browser ([#679](https://github.com/digdir/designsystemet/issues/679)) ([75b8bd7](https://github.com/digdir/designsystemet/commit/75b8bd79df45345be7ea4f07a4c88c303ec5c946))

### Features

- **Pagination:** New `Pagination` component ([#677](https://github.com/digdir/designsystemet/issues/677)) ([6085019](https://github.com/digdir/designsystemet/commit/6085019e7756d2a06cd087914d7ab839ca184765))
- **Radio, Fieldset:** :sparkles: New `Radio` & `Fieldset` component (unreleased) ([#666](https://github.com/digdir/designsystemet/issues/666)) ([e2d6f89](https://github.com/digdir/designsystemet/commit/e2d6f89523576520058024e3a02fad367148ac7e))

# [0.20.0](https://github.com/digdir/designsystemet/compare/@digdir/design-system-react@0.19.0...@digdir/design-system-react@0.20.0) (2023-07-24)

### Bug Fixes

- **Button:** :wheelchair: Added 44px clickbound for `small` size ([#676](https://github.com/digdir/designsystemet/issues/676)) ([921b9c7](https://github.com/digdir/designsystemet/commit/921b9c73315232e83fb25cd7365133e5e0dff3f1))
- **Button:** Correct sizes when only icon is used ([#674](https://github.com/digdir/designsystemet/issues/674)) ([0598060](https://github.com/digdir/designsystemet/commit/05980600bdb122ebf0965540ea1d0fbf65e26c7f))

### Features

- **Chip:** implemented Chip.Toggle ([#669](https://github.com/digdir/designsystemet/issues/669)) ([bc50da4](https://github.com/digdir/designsystemet/commit/bc50da48bd834b80f256a835c3bb7fd7c5b17afc))

# [0.19.0](https://github.com/digdir/designsystemet/compare/@digdir/design-system-react@0.18.0...@digdir/design-system-react@0.19.0) (2023-07-05)

### Features

- **Accordion:** use the new semantic colors for focus style ([#611](https://github.com/digdir/designsystemet/issues/611)) ([20bffae](https://github.com/digdir/designsystemet/commit/20bffaea35ef913fd7a4e580f30e649647310a7a))
- **ToggleButton:** use the correct focus styling ([#612](https://github.com/digdir/designsystemet/issues/612)) ([507f566](https://github.com/digdir/designsystemet/commit/507f566777119506b3747acd493e33266aa3657d))

# [0.18.0](https://github.com/digdir/designsystemet/compare/@digdir/design-system-react@0.17.0...@digdir/design-system-react@0.18.0) (2023-06-28)

### Bug Fixes

- **Chip:** visual improvements ([#610](https://github.com/digdir/designsystemet/issues/610)) ([58a4627](https://github.com/digdir/designsystemet/commit/58a46278a00faf10f0e86cdbf7813b57dceb40cc))

### Features

- **Chip.Group, Chip.Removable, Chip:** created chips ([#575](https://github.com/digdir/designsystemet/issues/575)) ([26eae91](https://github.com/digdir/designsystemet/commit/26eae91cabbbbf5528b1a339ce99458dcc75c08a))
- **TextField:** Type attribute ([#579](https://github.com/digdir/designsystemet/issues/579)) ([0ec6e5d](https://github.com/digdir/designsystemet/commit/0ec6e5db7f59f192eba9173a428a69b9ff75c754))

# [0.17.0](https://github.com/digdir/designsystemet/compare/@digdir/design-system-react@0.16.0...@digdir/design-system-react@0.17.0) (2023-06-21)

### Bug Fixes

- **Alert:** avoid the border-left to disappear when elevated is true ([#554](https://github.com/digdir/designsystemet/issues/554)) ([cf26ba2](https://github.com/digdir/designsystemet/commit/cf26ba22686e15dc424be93bbe2fb0aa302f6e97))
- **Select:** ResizeObserver loop error ([#565](https://github.com/digdir/designsystemet/issues/565)) ([48051db](https://github.com/digdir/designsystemet/commit/48051db43bf886e9bea1584e8245c14ba83bfa3f))
- **Typography:** fixed spacing ([#569](https://github.com/digdir/designsystemet/issues/569)) ([6a0311e](https://github.com/digdir/designsystemet/commit/6a0311e3fe0d41bbc6ae996136016c320d4e9447))

### Features

- **ErrorMessage:** added xsmall options ([#552](https://github.com/digdir/designsystemet/issues/552)) ([e776dfb](https://github.com/digdir/designsystemet/commit/e776dfb8d17216ebf9ce870f11d7071bc48f41e8))
- **RadioButton:** implemented forwardRef ([#562](https://github.com/digdir/designsystemet/issues/562)) ([66302de](https://github.com/digdir/designsystemet/commit/66302dea55cd082357b633f15744381cc0bc9318))

# [0.16.0](https://github.com/digdir/designsystemet/compare/@digdir/design-system-react@0.15.0...@digdir/design-system-react@0.16.0) (2023-06-14)

### Features

- **Tag:** created the tag component ([#542](https://github.com/digdir/designsystemet/issues/542)) ([7fd2330](https://github.com/digdir/designsystemet/commit/7fd23304220bcf69291b51b5f33b93556484a142))

# [0.15.0](https://github.com/digdir/designsystemet/compare/@digdir/design-system-react@0.14.0...@digdir/design-system-react@0.15.0) (2023-06-09)

### Bug Fixes

- **Checkbox:** should avoid different box-size when checked/unchecked ([#533](https://github.com/digdir/designsystemet/issues/533)) ([52d368f](https://github.com/digdir/designsystemet/commit/52d368f02a7f59ef25aadea0323e22faa3c4d0f9))
- **FieldSet:** :wheelchair: Fix wrong role on `ErrorMessage` ([#520](https://github.com/digdir/designsystemet/issues/520)) ([b0f8894](https://github.com/digdir/designsystemet/commit/b0f88948a56192787cb4d14a41937f3e82081fe1))

### Features

- **Alert:** :sparkles: New React component `Alert` ([#510](https://github.com/digdir/designsystemet/issues/510)) ([8f36198](https://github.com/digdir/designsystemet/commit/8f361987963ba0dbbfc66b51c2241cd8da383c42))
- **NativeSelect:** :sparkles: New React component `NativeSelect` ([#488](https://github.com/digdir/designsystemet/issues/488)) ([36eb3eb](https://github.com/digdir/designsystemet/commit/36eb3ebbe8e8d741d396f962fe55095b1e8def52))

# [0.14.0](https://github.com/digdir/designsystemet/compare/@digdir/design-system-react@0.13.0...@digdir/design-system-react@0.14.0) (2023-06-07)

### Bug Fixes

- **InputWrapper:** should only show invalid variant when field is invalid ([#502](https://github.com/digdir/designsystemet/issues/502)) ([556515c](https://github.com/digdir/designsystemet/commit/556515c1f3a244c1b5ce7bac9fcfbc878ba77ae3))
- **Select:** :bug: Add zindex to dropdown ([#513](https://github.com/digdir/designsystemet/issues/513)) ([cf62384](https://github.com/digdir/designsystemet/commit/cf62384282d43ed417d5bd77a119b604d262bd84))
- **Table:** Remove padding in header cells ([#485](https://github.com/digdir/designsystemet/issues/485)) ([17971e2](https://github.com/digdir/designsystemet/commit/17971e20015d07187ee316e7974a6a79c7712d80))

### Features

- **Typography:** :sparkles: Define font color ([#511](https://github.com/digdir/designsystemet/issues/511)) ([5446557](https://github.com/digdir/designsystemet/commit/54465579e63caefc21f43635272a80b2a4805dda))

# [0.13.0](https://github.com/digdir/designsystemet/compare/@digdir/design-system-react@0.12.1...@digdir/design-system-react@0.13.0) (2023-05-31)

### Bug Fixes

- **Accordion:** :bug: Fix `displayName` for Accordion sub-components ([#424](https://github.com/digdir/designsystemet/issues/424)) ([c755c4a](https://github.com/digdir/designsystemet/commit/c755c4a8c19ac6d03a7dd51b32e4e3d92e33af3b))
- **Accordion:** :bug: Use correct icon in header ([#473](https://github.com/digdir/designsystemet/issues/473)) ([7517690](https://github.com/digdir/designsystemet/commit/7517690873caf74d7eac6bc47f8f179df4a999a8))
- **Accordion:** 🐛 Fix hover state on Accordion.Header when used on touch devies ([#435](https://github.com/digdir/designsystemet/issues/435)) ([8164dcc](https://github.com/digdir/designsystemet/commit/8164dcca1ebd81ada20a9347e943983f9eed6224))
- **CheckboxRadioTemplate:** ensure to remove spacing/gap when label is hidden ([#427](https://github.com/digdir/designsystemet/issues/427)) ([f5a20e6](https://github.com/digdir/designsystemet/commit/f5a20e66b50254611373ee3efa1d827be5124520))
- **InputWrapper, Select, Tabs, ToggleButtonGroup:** :recycle: Removed component defined font-family ([#476](https://github.com/digdir/designsystemet/issues/476)) ([2e65214](https://github.com/digdir/designsystemet/commit/2e6521401e0aabd9975ecc8ce6bcf7a4352ee662))
- **Select:** Make options list independent of container size restrictions ([#449](https://github.com/digdir/designsystemet/issues/449)) ([6f8ce62](https://github.com/digdir/designsystemet/commit/6f8ce623af3ff09c817674289c94d802a04af912))
- **TextField, TextArea:** append ids to aria-described-by ([#456](https://github.com/digdir/designsystemet/issues/456)) ([449988c](https://github.com/digdir/designsystemet/commit/449988c5d6ea69b9c52a61be481e61d6236b8f9c))
- **Typography:** :bug: Fix Typography components to inherit font-family ([#470](https://github.com/digdir/designsystemet/issues/470)) ([06f6677](https://github.com/digdir/designsystemet/commit/06f66770df7bdc6f3a55f4d3567a0e2e249e8bf8))

## [0.12.1](https://github.com/digdir/designsystemet/compare/@digdir/design-system-react@0.12.0...@digdir/design-system-react@0.12.1) (2023-05-22)

### Bug Fixes

- Export `Accordion` component publicly ([#423](https://github.com/digdir/designsystemet/issues/423)) ([82adba2](https://github.com/digdir/designsystemet/commit/82adba2a4d894d4a8440f51e61694702cc6c3213))

# [0.12.0](https://github.com/digdir/designsystemet/compare/@digdir/design-system-react@0.11.1...@digdir/design-system-react@0.12.0) (2023-05-16)

### Bug Fixes

- **FieldSet:** Fixing typo in font size ([#372](https://github.com/digdir/designsystemet/issues/372)) ([287c8a4](https://github.com/digdir/designsystemet/commit/287c8a4cea2d0d310f4913873598a1bf5144dd33))
- **Select:** Adjust list size to available space ([#383](https://github.com/digdir/designsystemet/issues/383)) ([2d11090](https://github.com/digdir/designsystemet/commit/2d1109013c5f50aadee39b4270483c45e973e137))
- **TextField, TextArea, Checkbox, RadioButton, Button and HelpText:** New focus style ([#354](https://github.com/digdir/designsystemet/issues/354)) ([1786918](https://github.com/digdir/designsystemet/commit/1786918a90037cce2c6e300f271a62ea34d166c3))

### Features

- **Accordion:** New Accordion component ([#313](https://github.com/digdir/designsystemet/issues/313)) ([62cc44b](https://github.com/digdir/designsystemet/commit/62cc44b05f35d5de30b6844859585967785be87c))
- **TextArea, TextField:** Countdown remaining letters ([#365](https://github.com/digdir/designsystemet/issues/365)) ([6f08478](https://github.com/digdir/designsystemet/commit/6f08478e929c2740d0830edca453a2c68549fa61))
- **Heading, Paragraph, Ingress, Label, ErrorMessage:** New Typography components ([#374](https://github.com/digdir/designsystemet/issues/374)) ([2bb07d6](https://github.com/digdir/designsystemet/commit/2bb07d6dbbcf277c24eeb06176e365cd366c5a20))

## [0.11.3](https://github.com/digdir/designsystemet/compare/@digdir/design-system-react@0.11.1...@digdir/design-system-react@0.11.3) (2023-05-04)

### Bug Fixes

- **Select:** Collapse when arrow button is clicked ([#336](https://github.com/digdir/designsystemet/issues/336)) ([254628a](https://github.com/digdir/designsystemet/commit/254628a7918dc037643b7157b40ad3e7031daeae))
- **Select:** Set "button" type on buttons ([#338](https://github.com/digdir/designsystemet/issues/338)) ([f3035f0](https://github.com/digdir/designsystemet/commit/f3035f0b1a37fa406f4f85af084571335f3ace0a))

## [0.11.2](https://github.com/digdir/designsystemet/compare/@digdir/design-system-react@0.11.1...@digdir/design-system-react@0.11.2) (2023-04-24)

### Bug Fixes

- **InputWrapper:** Make input borders clickable ([#282](https://github.com/digdir/designsystemet/issues/282)) ([d35df3f](https://github.com/digdir/designsystemet/commit/d35df3f852359a0e21e9d05f8259158036db1206))
- **Select:** fix aria-activedecendant attribute ([#291](https://github.com/digdir/designsystemet/issues/291)) ([0ed8958](https://github.com/digdir/designsystemet/commit/0ed89584083a66d20d4f37570825f023fc40c24a))
- **Select:** Make event listeners local ([#299](https://github.com/digdir/designsystemet/issues/299)) ([1439820](https://github.com/digdir/designsystemet/commit/14398207f95816f13ff9133913c0ee40080c25f9))
- **Table/RadioGroup/CheckboxGroup/FieldSet:** Multiple minor accessibility improvements ([#301](https://github.com/digdir/designsystemet/issues/301)) ([c299106](https://github.com/digdir/designsystemet/commit/c299106502175c220f1c051ec215b6fe25ef0bf7))
- **Table:** Omitting `aria-sort` when no sort order is in effect ([#306](https://github.com/digdir/designsystemet/issues/306)) ([ecb1570](https://github.com/digdir/designsystemet/commit/ecb1570fdad1c9182fa3ee51154721a674324e0c))
- **Table:** Sort-arrows fix ([#297](https://github.com/digdir/designsystemet/issues/297)) ([fbc8e50](https://github.com/digdir/designsystemet/commit/fbc8e5083802667f3fbc664637c36a7881cde040))
- **TextArea:** Set border ([#310](https://github.com/digdir/designsystemet/issues/310)) ([255f632](https://github.com/digdir/designsystemet/commit/255f632c128a0c7a41fd466d63d285495401eac1))

### BREAKING CHANGE

- **Accordion** was renamed to LegacyAccordion to make room for new “Accordion” component in accordance with new design & features ([#296](https://github.com/digdir/designsystemet/issues/296))([83d7e6c](https://github.com/digdir/designsystemet/commit/83d7e6cabf3df97a252d56196d6583d847b6f663))

## [0.11.1](https://github.com/digdir/designsystemet/compare/@digdir/design-system-react@0.11.0...@digdir/design-system-react@0.11.1) (2023-04-11)

### Bug Fixes

- **Select:** Make onBlur work when there is no active element ([#281](https://github.com/digdir/designsystemet/issues/281)) ([cd1f43c](https://github.com/digdir/designsystemet/commit/cd1f43ccc78b77baf11a4f01221572ffd13470fe))
- **Select:** Update selected on option change ([#286](https://github.com/digdir/designsystemet/issues/286)) ([623d306](https://github.com/digdir/designsystemet/commit/623d3067025f2da9359479d77f0dfcc29d4ac9d6))

# [0.11.0](https://github.com/digdir/designsystemet/compare/@digdir/design-system-react@0.10.2...@digdir/design-system-react@0.11.0) (2023-03-30)

### Features

- **Select:** Add onFocus and onBlur events ([#278](https://github.com/digdir/designsystemet/issues/278)) ([7fc362c](https://github.com/digdir/designsystemet/commit/7fc362c735f8f31f0b49ba65c8a98d90133db3cc))

## [0.10.2](https://github.com/digdir/designsystemet/compare/@digdir/design-system-react@0.10.1...@digdir/design-system-react@0.10.2) (2023-03-30)

### Bug Fixes

- **Textfield:** upgrading `react-number-format`, removing workaround ([e2dc0e6](https://github.com/digdir/designsystemet/commit/e2dc0e62093af9a7feb83bf2f6ee55ab7b1082e0))

## [0.10.1](https://github.com/digdir/designsystemet/compare/@digdir/design-system-react@0.10.0...@digdir/design-system-react@0.10.1) (2023-03-29)

### Bug Fixes

- **Accordion:** Fix continous texts word break ([#264](https://github.com/digdir/designsystemet/issues/264)) ([13b3bd6](https://github.com/digdir/designsystemet/commit/13b3bd6fb6a336ae1db86ea79555dde257162fa0))
- **Button:** adjust padding to make icon round ([#265](https://github.com/digdir/designsystemet/issues/265)) ([922014d](https://github.com/digdir/designsystemet/commit/922014d14f8316421c17b5ffb435acb2ba2c51ae))
- **RadioButton:** RadioButton looks wrong when zoming in browser ([#266](https://github.com/digdir/designsystemet/issues/266)) ([5f40bc3](https://github.com/digdir/designsystemet/commit/5f40bc35e0ed6f1c1e2535b0d45a38d18b1768c0))
- **Select:** Display initial value on single select ([#268](https://github.com/digdir/designsystemet/issues/268)) ([7ad5f0f](https://github.com/digdir/designsystemet/commit/7ad5f0fa6345577993dca28c0bb6066c9595634d))
- **ToggleButtonGroup:** Set correct button type ([#261](https://github.com/digdir/designsystemet/issues/261)) ([a706f07](https://github.com/digdir/designsystemet/commit/a706f0773acbf5bf4766d915af95696cdfaa67af))

# [0.10.0](https://github.com/digdir/designsystemet/compare/@digdir/design-system-react@0.9.0...@digdir/design-system-react@0.10.0) (2023-03-24)

### Bug Fixes

- **Select:** NVDA screen reader issues ([#246](https://github.com/digdir/designsystemet/issues/246)) ([3a57e6c](https://github.com/digdir/designsystemet/commit/3a57e6c0cba74989758c4900d0130705f9b160e3))
- **Select:** Support dynamically changing options ([#253](https://github.com/digdir/designsystemet/issues/253)) ([5b13f7c](https://github.com/digdir/designsystemet/commit/5b13f7c13590f71547caa0e90c7f0d85e610c4af))

### Features

- Add toggle button component ([#258](https://github.com/digdir/designsystemet/issues/258)) ([2ecbe69](https://github.com/digdir/designsystemet/commit/2ecbe69fa8fe1d35f1ca91f8e7eef1f0f762f209))

# [0.9.0](https://github.com/digdir/designsystemet/compare/@digdir/design-system-react@0.8.1...@digdir/design-system-react@0.9.0) (2023-03-17)

### Bug Fixes

- **Button:** Remove width in css for buttons with only icons ([#232](https://github.com/digdir/designsystemet/issues/232)) ([4962e49](https://github.com/digdir/designsystemet/commit/4962e49de0b69d33f6c7b884021819c6a9b5c86c))
- **CheckboxGroup:** Improved item update handling ([#241](https://github.com/digdir/designsystemet/issues/241)) ([9a157df](https://github.com/digdir/designsystemet/commit/9a157dfb6805b3e54930f2d555a18c7117fab577))
- use ReactNode in helptexts to allow rich content ([#245](https://github.com/digdir/designsystemet/issues/245)) ([4469c7d](https://github.com/digdir/designsystemet/commit/4469c7d653cb612e94e35b82fc97bdf622c5b5a3))

### Features

- **Button:** Added support for aria-disabled to button and loading button example in storybook ([#240](https://github.com/digdir/designsystemet/issues/240)) ([51992e8](https://github.com/digdir/designsystemet/commit/51992e8bf329e6b3cb38c0a88c36ef0ac20c9a84))

## [0.8.1](https://github.com/digdir/designsystemet/compare/@digdir/design-system-react@0.8.0...@digdir/design-system-react@0.8.1) (2023-03-09)

**Note:** Version bump only for package @digdir/design-system-react

# [0.8.0](https://github.com/digdir/designsystemet/compare/@digdir/design-system-react@0.7.0...@digdir/design-system-react@0.8.0) (2023-03-09)

### Bug Fixes

- **CheckboxGroup:** fix state handling problem ([#205](https://github.com/digdir/designsystemet/issues/205)) ([50aab5a](https://github.com/digdir/designsystemet/commit/50aab5ad8152083c9c4efaa8b7fac48ed77284ce))
- **HelpText:** helptext´s content not reachable with NVDA screenreader ([#206](https://github.com/digdir/designsystemet/issues/206)) ([e4c115f](https://github.com/digdir/designsystemet/commit/e4c115f11d95442372fbcee3c690ed617de0860a))
- Set correct font size in all text input fields ([#201](https://github.com/digdir/designsystemet/issues/201)) ([2f1a903](https://github.com/digdir/designsystemet/commit/2f1a9030b94c6938d8b8719cf6ed7f92d4eaa4b6))

### Features

- Add table component ([#207](https://github.com/digdir/designsystemet/issues/207)) ([c07a288](https://github.com/digdir/designsystemet/commit/c07a288daac0cc39e8bc8e78b5e214cb3c45a2f8))

# [0.7.0](https://github.com/digdir/designsystemet/compare/@digdir/design-system-react@0.6.0...@digdir/design-system-react@0.7.0) (2023-02-24)

### Bug Fixes

- **HelpText:** hide helptext button in pdfs ([#156](https://github.com/digdir/designsystemet/issues/156)) ([7b9c217](https://github.com/digdir/designsystemet/commit/7b9c2174b8095f7fe56c205d4a462168b734e950))

### Features

- **HelpText:** take reactnode instead of string ([#181](https://github.com/digdir/designsystemet/issues/181)) ([2c1a8df](https://github.com/digdir/designsystemet/commit/2c1a8df08ea91a81f95252db8c12d5a6229f9188))
- **Spinner:** Add spinner component ([#162](https://github.com/digdir/designsystemet/issues/162)) ([deb6fec](https://github.com/digdir/designsystemet/commit/deb6fec8524bae70a001d330ac3ca15330879ff2))

# [0.6.0](https://github.com/digdir/designsystemet/compare/@digdir/design-system-react@0.5.1...@digdir/design-system-react@0.6.0) (2023-02-16)

### Bug Fixes

- **HelpText:** fix help-text width ([#149](https://github.com/digdir/designsystemet/issues/149)) ([e0ddf38](https://github.com/digdir/designsystemet/commit/e0ddf3895994f1b276e851f74de495a33e4d964a))
- **Popover:** fix display-issue-with-popover-arrow ([#152](https://github.com/digdir/designsystemet/issues/152)) ([2b3e311](https://github.com/digdir/designsystemet/commit/2b3e3112407fdc86dcc092b1d93c34c9f76dbf69))

### Features

- **List:** Add list component ([#153](https://github.com/digdir/designsystemet/issues/153)) ([f3befb9](https://github.com/digdir/designsystemet/commit/f3befb9643f9c5be440426d8f57f3542ea44cf61))
- **Select:** Search and formatting ([#151](https://github.com/digdir/designsystemet/issues/151)) ([d26ea78](https://github.com/digdir/designsystemet/commit/d26ea78a8cb2ce6d12f60c4faa2ec0202ff37054))

## [0.5.1](https://github.com/digdir/designsystemet/compare/@digdir/design-system-react@0.5.0...@digdir/design-system-react@0.5.1) (2023-02-13)

### Bug Fixes

- **Accordion:** Fix subtitle placement issues ([#144](https://github.com/digdir/designsystemet/issues/144)) ([316e450](https://github.com/digdir/designsystemet/commit/316e4502d3b34a90ca577a45bbb367f547f6fb96))
- **Button:** Enforce icon button to have same width and height ([#139](https://github.com/digdir/designsystemet/issues/139)) ([9b3bb93](https://github.com/digdir/designsystemet/commit/9b3bb93fc0e73b10a7522c07f54ca250b3d686b8))
- **HelpText:** export help text size prop ([#147](https://github.com/digdir/designsystemet/issues/147)) ([7a716bb](https://github.com/digdir/designsystemet/commit/7a716bbed965ec8fb5f01799c7aea32be4fdd8e3))
- **InputWrapper:** Change outline style to solid from auto to make outline-offset work ([#140](https://github.com/digdir/designsystemet/issues/140)) ([ef2a9f4](https://github.com/digdir/designsystemet/commit/ef2a9f4e003d6c7ca3ac72a1e4b3e915d4a174a7))

# [0.5.0](https://github.com/digdir/designsystemet/compare/@digdir/design-system-react@0.4.3...@digdir/design-system-react@0.5.0) (2023-02-08)

### Bug Fixes

- added displayName to all exported components ([#135](https://github.com/digdir/designsystemet/issues/135)) ([7f0dd1b](https://github.com/digdir/designsystemet/commit/7f0dd1b01930e0a3dfd5117f6a5277d08dc1ebd7))
- **Button:** Replace non existent Figma token ([#128](https://github.com/digdir/designsystemet/issues/128)) ([b27e3d4](https://github.com/digdir/designsystemet/commit/b27e3d4cb67da0f9ae70d3f4d4b6f71a777b7bae))
- **Select:** Accept empty list of options ([#133](https://github.com/digdir/designsystemet/issues/133)) ([515e84f](https://github.com/digdir/designsystemet/commit/515e84f40edbec392041769e93aaf90f474aaa78))

### Features

- **Accordion:** Add accordion component ([#130](https://github.com/digdir/designsystemet/issues/130)) ([5cf8bf2](https://github.com/digdir/designsystemet/commit/5cf8bf20f5c59f1d9bca45af4c9cbceb017f22cf))

## [0.4.3](https://github.com/digdir/designsystemet/compare/@digdir/design-system-react@0.4.2...@digdir/design-system-react@0.4.3) (2023-02-02)

### Bug Fixes

- **Button:** Only icon padding ([#109](https://github.com/digdir/designsystemet/issues/109)) ([7a4c286](https://github.com/digdir/designsystemet/commit/7a4c28622a3e558d36fa4c526b0d0e3c9a875bc8))
- **help text:** add title to helptext tests ([#126](https://github.com/digdir/designsystemet/issues/126)) ([9b3fc86](https://github.com/digdir/designsystemet/commit/9b3fc8686bf56eca2f69f80b4f02e3ee4e281b58))
- **Select:** Set higher z-index on option list ([#114](https://github.com/digdir/designsystemet/issues/114)) ([f6077a6](https://github.com/digdir/designsystemet/commit/f6077a645509001edc482e075a3a5df5ffa87076))
- Set font and min height on input fields ([#112](https://github.com/digdir/designsystemet/issues/112)) ([e7671fa](https://github.com/digdir/designsystemet/commit/e7671fabed4b9ab9d3094a44651e5f8797012bb9))
- Update Figma tokens ([#111](https://github.com/digdir/designsystemet/issues/111)) ([8e0edd8](https://github.com/digdir/designsystemet/commit/8e0edd819c6483ea9a372bb44f13ad8f3af38cc9))
- update figma-token for CheckboxRadioTemplate ([df69b2a](https://github.com/digdir/designsystemet/commit/df69b2a2c366b4c46baa67a8f84c3358357b5324))

## [0.4.2](https://github.com/digdir/designsystemet/compare/@digdir/design-system-react@0.4.1...@digdir/design-system-react@0.4.2) (2023-01-30)

### Bug Fixes

- added types file to export ([99a33f9](https://github.com/digdir/designsystemet/commit/99a33f9b8c2b61019dbd7a04a911ab9f3b833a89))

## [0.4.1](https://github.com/digdir/designsystemet/compare/@digdir/design-system-react@0.4.0...@digdir/design-system-react@0.4.1) (2023-01-27)

### Bug Fixes

- **popover:** popover screen reader ordering ([c8a0190](https://github.com/digdir/designsystemet/commit/c8a0190d887b95b1e0ea0178c1a2e51f93d48c24))

# [0.4.0](https://github.com/digdir/designsystemet/compare/@digdir/design-system-react@0.3.1...@digdir/design-system-react@0.4.0) (2023-01-26)

### Bug Fixes

- **popover:** retain focus on trigger when opening popover ([d54c7c8](https://github.com/digdir/designsystemet/commit/d54c7c8293372415a560bb334f2c2df1ed342d7c))
- **Tabs:** Spacing issues ([#95](https://github.com/digdir/designsystemet/issues/95)) ([2583e4c](https://github.com/digdir/designsystemet/commit/2583e4c8f1205bd5d7c9882ebfc55edf7efd0959))

### Features

- **help-text:** add help text component ([8f2bb3b](https://github.com/digdir/designsystemet/commit/8f2bb3bc682b9bfec650fe2813d402c94771a6d3))
- **popover:** added popover component ([6e34adf](https://github.com/digdir/designsystemet/commit/6e34adfebed9742c7145fcc3e2e99b2075fe8081))

## [0.3.1](https://github.com/digdir/designsystemet/compare/@digdir/design-system-react@0.3.0...@digdir/design-system-react@0.3.1) (2023-01-24)

### Bug Fixes

- Export issues ([#72](https://github.com/digdir/designsystemet/issues/72)) ([716e9d7](https://github.com/digdir/designsystemet/commit/716e9d7892be4ef7f21864338fd299a2f98a6784))

# [0.3.0](https://github.com/digdir/designsystemet/compare/@digdir/design-system-react@0.2.1...@digdir/design-system-react@0.3.0) (2023-01-23)

### Bug Fixes

- **select:** Value update in Select component ([#63](https://github.com/digdir/designsystemet/issues/63)) ([0a4677c](https://github.com/digdir/designsystemet/commit/0a4677cc00cc1b316ca17d5522a10c7385817fed))

### Features

- **textfield:** Add text field component ([#67](https://github.com/digdir/designsystemet/issues/67)) ([ba7e8a5](https://github.com/digdir/designsystemet/commit/ba7e8a5484f1fc75ec982eb666c1a94e3594cdea))

## [0.2.1](https://github.com/digdir/designsystemet/compare/@digdir/design-system-react@0.2.0...@digdir/design-system-react@0.2.1) (2023-01-19)

### Bug Fixes

- Presentation mode issues on checkboxes and radio buttons ([#61](https://github.com/digdir/designsystemet/issues/61)) ([2ee07b4](https://github.com/digdir/designsystemet/commit/2ee07b46794580bf255091fcc142b793c8a91682))

# [0.2.0](https://github.com/digdir/designsystemet/compare/@digdir/design-system-react@0.1.1...@digdir/design-system-react@0.2.0) (2023-01-19)

### Bug Fixes

- **button:** Export button props ([#52](https://github.com/digdir/designsystemet/issues/52)) ([604caed](https://github.com/digdir/designsystemet/commit/604caed26dbd16b225c1c5dc41d8eb98eba94f10))

### Features

- **textarea:** Add TextArea component ([#59](https://github.com/digdir/designsystemet/issues/59)) ([1938b7d](https://github.com/digdir/designsystemet/commit/1938b7dd541e4c3508b0942b14c87ac64dc7c7f7))

## [0.1.1](https://github.com/digdir/designsystemet/compare/@digdir/design-system-react@0.1.0...@digdir/design-system-react@0.1.1) (2023-01-12)

### Bug Fixes

- testing changelog with new release commands ([4906c28](https://github.com/digdir/designsystemet/commit/4906c28e4b6972d7c5d93e4ab630fe5d52d8fdb2))

# 0.1.0 (2023-01-11)

### Features

- testing changelogs for the react package ([f988027](https://github.com/digdir/designsystemet/commit/f9880278d774c4892e4792ad2f14d40d662e5206))
