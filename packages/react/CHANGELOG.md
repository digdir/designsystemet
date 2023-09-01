# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [0.24.0](https://github.com/digdir/designsystem/compare/@digdir/design-system-react@0.23.3...@digdir/design-system-react@0.24.0) (2023-08-31)

### Features

- **Switch:** :sparkles: New `Switch` component ([#727](https://github.com/digdir/designsystem/issues/727)) ([8fa362b](https://github.com/digdir/designsystem/commit/8fa362bde7ac7d7c6d242e625bf2e4f42f90aa8d))

## [0.23.3](https://github.com/digdir/designsystem/compare/@digdir/design-system-react@0.23.2...@digdir/design-system-react@0.23.3) (2023-08-25)

### Bug Fixes

- **Chip:** Proper styling on tall chips ([#756](https://github.com/digdir/designsystem/issues/756)) ([b47eb37](https://github.com/digdir/designsystem/commit/b47eb37a40019eb4cfeb755551a688541ab60dd7))

## [0.23.2](https://github.com/digdir/designsystem/compare/@digdir/design-system-react@0.23.1...@digdir/design-system-react@0.23.2) (2023-08-23)

### Bug Fixes

- **Accordion:** :bug: Correct header color opacity ([f68ad25](https://github.com/digdir/designsystem/commit/f68ad25d4693505bfa78679d1cb14454bbf99644))

## [0.23.1](https://github.com/digdir/designsystem/compare/@digdir/design-system-react@0.23.0...@digdir/design-system-react@0.23.1) (2023-08-23)

### Bug Fixes

- **Accordion:** Apply height animation on opening and closing only ([#730](https://github.com/digdir/designsystem/issues/730)) ([78852e1](https://github.com/digdir/designsystem/commit/78852e195efea10b9eb93085b5ad20b843f39aa5))
- **Checkbox, Radio, Fieldset:** :bug: Make sure spacings are only applied when needed ([#746](https://github.com/digdir/designsystem/issues/746)) ([f03df61](https://github.com/digdir/designsystem/commit/f03df61dd5b5ca3e93e62a30bd480c9541a71ccf))
- **InputWrapper:** isValid works now independent of charLimit validation ([#734](https://github.com/digdir/designsystem/issues/734)) ([bf4ecd8](https://github.com/digdir/designsystem/commit/bf4ecd83f71f66351d6de0cae4343fcded53ed0a))
- **Link:** :lipstick: Tweaked style for better visibility between states ([#744](https://github.com/digdir/designsystem/issues/744)) ([cfc37e2](https://github.com/digdir/designsystem/commit/cfc37e2687db883a25dc16042c1e3c602455850b))
- **Pagination:** :bug: Fix compact spacings and ellipsis alignment ([#748](https://github.com/digdir/designsystem/issues/748)) ([c54eb1e](https://github.com/digdir/designsystem/commit/c54eb1ec90b6088774202effa630d3c1d4a0425f))
- **Radio, Checkbox:** :bug: Fallback to `checked` or `defaultChecked` if `Group` `value` is not set ([#733](https://github.com/digdir/designsystem/issues/733)) ([4777dac](https://github.com/digdir/designsystem/commit/4777dac6bef610cbf5010ff37eff5d6c42820df9))

# [0.23.0](https://github.com/digdir/designsystem/compare/@digdir/design-system-react@0.22.0...@digdir/design-system-react@0.23.0) (2023-08-16)

### Bug Fixes

- **Pagination:** :wheelchair: Fix 'a11y' error for Pagination next/prev buttons ([#726](https://github.com/digdir/designsystem/issues/726)) ([e0e6fa4](https://github.com/digdir/designsystem/commit/e0e6fa424c9d1af54546eb344e58105271c8ea63))

### Features

- **Checkbox, CheckboxGroup, FieldSet, RadioButton, RadioGroup:** :wastebasket: Change to Legacy ([#716](https://github.com/digdir/designsystem/issues/716)) ([b22d836](https://github.com/digdir/designsystem/commit/b22d836c51ffcb024331eb07109547b288151888))
- **Checkbox, Radio, Fieldset:** :sparkles: Release new components ([#720](https://github.com/digdir/designsystem/issues/720)) ([7facb4d](https://github.com/digdir/designsystem/commit/7facb4d1c77deffedb350fc7ed3e4bceecd4ff75))
- **Link:** Create the component ([#711](https://github.com/digdir/designsystem/issues/711)) ([ac0adcc](https://github.com/digdir/designsystem/commit/ac0adcc2992499fd850e7974a54a7e4b19dfdd06))

### BREAKING CHANGE

- **enums:** 🔥 Remove `enums` ([#721](https://github.com/digdir/designsystem/issues/721))
- **LegacyAccordion:** 🔥 Remove `LegacyAccordion` ([#707](https://github.com/digdir/designsystem/issues/707))

# [0.22.0](https://github.com/digdir/designsystem/compare/@digdir/design-system-react@0.21.0...@digdir/design-system-react@0.22.0) (2023-08-09)

### Bug Fixes

- **Accordion:** Support dynamic height ([#689](https://github.com/digdir/designsystem/issues/689)) ([6624ba1](https://github.com/digdir/designsystem/commit/6624ba1eb75007cf07227f74a633f78d0b718ce3))
- **Alert:** :bug: Left border should now be positioned correctly inside the box ([#702](https://github.com/digdir/designsystem/issues/702)) ([5fa2aeb](https://github.com/digdir/designsystem/commit/5fa2aeb4a17e77f5fbb98fd8ac039bb4bed0a473))
- **Chip.Removable:** :bug: Use correct button type to avoid default submit ([#694](https://github.com/digdir/designsystem/issues/694)) ([357cfe8](https://github.com/digdir/designsystem/commit/357cfe827460031cc5e03f0e98f61947210bf40c))

### Features

- **Button:** :recycle: Change default `size` to medium (instead of small`) ([#698](https://github.com/digdir/designsystem/issues/698)) ([ab238df](https://github.com/digdir/designsystem/commit/ab238df8edb86f0432fe59b0d653986c6d3f09b5))
- **Checkbox:** ✨ New `Checkbox` component (unreleased) ([#681](https://github.com/digdir/designsystem/issues/681)) ([6b49301](https://github.com/digdir/designsystem/commit/6b4930169802a860bad518173e18186407a36f02))
- **Chip.Toggle:** ♻️ Enabled `checkmark` as default when `selected` ([#693](https://github.com/digdir/designsystem/issues/693)) ([049460c](https://github.com/digdir/designsystem/commit/049460c1b027f1846e5bf675b4e6768d6320458a))
- **Label:** :sparkles: Added new prop `weight` for setting font weight ([#699](https://github.com/digdir/designsystem/issues/699)) ([1641752](https://github.com/digdir/designsystem/commit/16417526f584339544129ba990891f3dabf66267))

# [0.21.0](https://github.com/digdir/designsystem/compare/@digdir/design-system-react@0.20.0...@digdir/design-system-react@0.21.0) (2023-08-02)

### Bug Fixes

- **Button:** :bug: Fix icon being clipped in Firefox browser ([#679](https://github.com/digdir/designsystem/issues/679)) ([75b8bd7](https://github.com/digdir/designsystem/commit/75b8bd79df45345be7ea4f07a4c88c303ec5c946))

### Features

- **Pagination:** New `Pagination` component ([#677](https://github.com/digdir/designsystem/issues/677)) ([6085019](https://github.com/digdir/designsystem/commit/6085019e7756d2a06cd087914d7ab839ca184765))
- **Radio, Fieldset:** :sparkles: New `Radio` & `Fieldset` component (unreleased) ([#666](https://github.com/digdir/designsystem/issues/666)) ([e2d6f89](https://github.com/digdir/designsystem/commit/e2d6f89523576520058024e3a02fad367148ac7e))

# [0.20.0](https://github.com/digdir/designsystem/compare/@digdir/design-system-react@0.19.0...@digdir/design-system-react@0.20.0) (2023-07-24)

### Bug Fixes

- **Button:** :wheelchair: Added 44px clickbound for `small` size ([#676](https://github.com/digdir/designsystem/issues/676)) ([921b9c7](https://github.com/digdir/designsystem/commit/921b9c73315232e83fb25cd7365133e5e0dff3f1))
- **Button:** Correct sizes when only icon is used ([#674](https://github.com/digdir/designsystem/issues/674)) ([0598060](https://github.com/digdir/designsystem/commit/05980600bdb122ebf0965540ea1d0fbf65e26c7f))

### Features

- **Chip:** implemented Chip.Toggle ([#669](https://github.com/digdir/designsystem/issues/669)) ([bc50da4](https://github.com/digdir/designsystem/commit/bc50da48bd834b80f256a835c3bb7fd7c5b17afc))

# [0.19.0](https://github.com/digdir/designsystem/compare/@digdir/design-system-react@0.18.0...@digdir/design-system-react@0.19.0) (2023-07-05)

### Features

- **Accordion:** use the new semantic colors for focus style ([#611](https://github.com/digdir/designsystem/issues/611)) ([20bffae](https://github.com/digdir/designsystem/commit/20bffaea35ef913fd7a4e580f30e649647310a7a))
- **ToggleButton:** use the correct focus styling ([#612](https://github.com/digdir/designsystem/issues/612)) ([507f566](https://github.com/digdir/designsystem/commit/507f566777119506b3747acd493e33266aa3657d))

# [0.18.0](https://github.com/digdir/designsystem/compare/@digdir/design-system-react@0.17.0...@digdir/design-system-react@0.18.0) (2023-06-28)

### Bug Fixes

- **Chip:** visual improvements ([#610](https://github.com/digdir/designsystem/issues/610)) ([58a4627](https://github.com/digdir/designsystem/commit/58a46278a00faf10f0e86cdbf7813b57dceb40cc))

### Features

- **Chip.Group, Chip.Removable, Chip:** created chips ([#575](https://github.com/digdir/designsystem/issues/575)) ([26eae91](https://github.com/digdir/designsystem/commit/26eae91cabbbbf5528b1a339ce99458dcc75c08a))
- **TextField:** Type attribute ([#579](https://github.com/digdir/designsystem/issues/579)) ([0ec6e5d](https://github.com/digdir/designsystem/commit/0ec6e5db7f59f192eba9173a428a69b9ff75c754))

# [0.17.0](https://github.com/digdir/designsystem/compare/@digdir/design-system-react@0.16.0...@digdir/design-system-react@0.17.0) (2023-06-21)

### Bug Fixes

- **Alert:** avoid the border-left to disappear when elevated is true ([#554](https://github.com/digdir/designsystem/issues/554)) ([cf26ba2](https://github.com/digdir/designsystem/commit/cf26ba22686e15dc424be93bbe2fb0aa302f6e97))
- **Select:** ResizeObserver loop error ([#565](https://github.com/digdir/designsystem/issues/565)) ([48051db](https://github.com/digdir/designsystem/commit/48051db43bf886e9bea1584e8245c14ba83bfa3f))
- **Typography:** fixed spacing ([#569](https://github.com/digdir/designsystem/issues/569)) ([6a0311e](https://github.com/digdir/designsystem/commit/6a0311e3fe0d41bbc6ae996136016c320d4e9447))

### Features

- **ErrorMessage:** added xsmall options ([#552](https://github.com/digdir/designsystem/issues/552)) ([e776dfb](https://github.com/digdir/designsystem/commit/e776dfb8d17216ebf9ce870f11d7071bc48f41e8))
- **RadioButton:** implemented forwardRef ([#562](https://github.com/digdir/designsystem/issues/562)) ([66302de](https://github.com/digdir/designsystem/commit/66302dea55cd082357b633f15744381cc0bc9318))

# [0.16.0](https://github.com/digdir/designsystem/compare/@digdir/design-system-react@0.15.0...@digdir/design-system-react@0.16.0) (2023-06-14)

### Features

- **Tag:** created the tag component ([#542](https://github.com/digdir/designsystem/issues/542)) ([7fd2330](https://github.com/digdir/designsystem/commit/7fd23304220bcf69291b51b5f33b93556484a142))

# [0.15.0](https://github.com/digdir/designsystem/compare/@digdir/design-system-react@0.14.0...@digdir/design-system-react@0.15.0) (2023-06-09)

### Bug Fixes

- **Checkbox:** should avoid different box-size when checked/unchecked ([#533](https://github.com/digdir/designsystem/issues/533)) ([52d368f](https://github.com/digdir/designsystem/commit/52d368f02a7f59ef25aadea0323e22faa3c4d0f9))
- **FieldSet:** :wheelchair: Fix wrong role on `ErrorMessage` ([#520](https://github.com/digdir/designsystem/issues/520)) ([b0f8894](https://github.com/digdir/designsystem/commit/b0f88948a56192787cb4d14a41937f3e82081fe1))

### Features

- **Alert:** :sparkles: New React component `Alert` ([#510](https://github.com/digdir/designsystem/issues/510)) ([8f36198](https://github.com/digdir/designsystem/commit/8f361987963ba0dbbfc66b51c2241cd8da383c42))
- **NativeSelect:** :sparkles: New React component `NativeSelect` ([#488](https://github.com/digdir/designsystem/issues/488)) ([36eb3eb](https://github.com/digdir/designsystem/commit/36eb3ebbe8e8d741d396f962fe55095b1e8def52))

# [0.14.0](https://github.com/digdir/designsystem/compare/@digdir/design-system-react@0.13.0...@digdir/design-system-react@0.14.0) (2023-06-07)

### Bug Fixes

- **InputWrapper:** should only show invalid variant when field is invalid ([#502](https://github.com/digdir/designsystem/issues/502)) ([556515c](https://github.com/digdir/designsystem/commit/556515c1f3a244c1b5ce7bac9fcfbc878ba77ae3))
- **Select:** :bug: Add zindex to dropdown ([#513](https://github.com/digdir/designsystem/issues/513)) ([cf62384](https://github.com/digdir/designsystem/commit/cf62384282d43ed417d5bd77a119b604d262bd84))
- **Table:** Remove padding in header cells ([#485](https://github.com/digdir/designsystem/issues/485)) ([17971e2](https://github.com/digdir/designsystem/commit/17971e20015d07187ee316e7974a6a79c7712d80))

### Features

- **Typography:** :sparkles: Define font color ([#511](https://github.com/digdir/designsystem/issues/511)) ([5446557](https://github.com/digdir/designsystem/commit/54465579e63caefc21f43635272a80b2a4805dda))

# [0.13.0](https://github.com/digdir/designsystem/compare/@digdir/design-system-react@0.12.1...@digdir/design-system-react@0.13.0) (2023-05-31)

### Bug Fixes

- **Accordion:** :bug: Fix `displayName` for Accordion sub-components ([#424](https://github.com/digdir/designsystem/issues/424)) ([c755c4a](https://github.com/digdir/designsystem/commit/c755c4a8c19ac6d03a7dd51b32e4e3d92e33af3b))
- **Accordion:** :bug: Use correct icon in header ([#473](https://github.com/digdir/designsystem/issues/473)) ([7517690](https://github.com/digdir/designsystem/commit/7517690873caf74d7eac6bc47f8f179df4a999a8))
- **Accordion:** 🐛 Fix hover state on Accordion.Header when used on touch devies ([#435](https://github.com/digdir/designsystem/issues/435)) ([8164dcc](https://github.com/digdir/designsystem/commit/8164dcca1ebd81ada20a9347e943983f9eed6224))
- **CheckboxRadioTemplate:** ensure to remove spacing/gap when label is hidden ([#427](https://github.com/digdir/designsystem/issues/427)) ([f5a20e6](https://github.com/digdir/designsystem/commit/f5a20e66b50254611373ee3efa1d827be5124520))
- **InputWrapper, Select, Tabs, ToggleButtonGroup:** :recycle: Removed component defined font-family ([#476](https://github.com/digdir/designsystem/issues/476)) ([2e65214](https://github.com/digdir/designsystem/commit/2e6521401e0aabd9975ecc8ce6bcf7a4352ee662))
- **Select:** Make options list independent of container size restrictions ([#449](https://github.com/digdir/designsystem/issues/449)) ([6f8ce62](https://github.com/digdir/designsystem/commit/6f8ce623af3ff09c817674289c94d802a04af912))
- **TextField, TextArea:** append ids to aria-described-by ([#456](https://github.com/digdir/designsystem/issues/456)) ([449988c](https://github.com/digdir/designsystem/commit/449988c5d6ea69b9c52a61be481e61d6236b8f9c))
- **Typography:** :bug: Fix Typography components to inherit font-family ([#470](https://github.com/digdir/designsystem/issues/470)) ([06f6677](https://github.com/digdir/designsystem/commit/06f66770df7bdc6f3a55f4d3567a0e2e249e8bf8))

## [0.12.1](https://github.com/digdir/designsystem/compare/@digdir/design-system-react@0.12.0...@digdir/design-system-react@0.12.1) (2023-05-22)

### Bug Fixes

- Export `Accordion` component publicly ([#423](https://github.com/digdir/designsystem/issues/423)) ([82adba2](https://github.com/digdir/designsystem/commit/82adba2a4d894d4a8440f51e61694702cc6c3213))

# [0.12.0](https://github.com/digdir/designsystem/compare/@digdir/design-system-react@0.11.1...@digdir/design-system-react@0.12.0) (2023-05-16)

### Bug Fixes

- **FieldSet:** Fixing typo in font size ([#372](https://github.com/digdir/designsystem/issues/372)) ([287c8a4](https://github.com/digdir/designsystem/commit/287c8a4cea2d0d310f4913873598a1bf5144dd33))
- **Select:** Adjust list size to available space ([#383](https://github.com/digdir/designsystem/issues/383)) ([2d11090](https://github.com/digdir/designsystem/commit/2d1109013c5f50aadee39b4270483c45e973e137))
- **TextField, TextArea, Checkbox, RadioButton, Button and HelpText:** New focus style ([#354](https://github.com/digdir/designsystem/issues/354)) ([1786918](https://github.com/digdir/designsystem/commit/1786918a90037cce2c6e300f271a62ea34d166c3))

### Features

- **Accordion:** New Accordion component ([#313](https://github.com/digdir/designsystem/issues/313)) ([62cc44b](https://github.com/digdir/designsystem/commit/62cc44b05f35d5de30b6844859585967785be87c))
- **TextArea, TextField:** Countdown remaining letters ([#365](https://github.com/digdir/designsystem/issues/365)) ([6f08478](https://github.com/digdir/designsystem/commit/6f08478e929c2740d0830edca453a2c68549fa61))
- **Heading, Paragraph, Ingress, Label, ErrorMessage:** New Typography components ([#374](https://github.com/digdir/designsystem/issues/374)) ([2bb07d6](https://github.com/digdir/designsystem/commit/2bb07d6dbbcf277c24eeb06176e365cd366c5a20))

## [0.11.3](https://github.com/digdir/designsystem/compare/@digdir/design-system-react@0.11.1...@digdir/design-system-react@0.11.3) (2023-05-04)

### Bug Fixes

- **Select:** Collapse when arrow button is clicked ([#336](https://github.com/digdir/designsystem/issues/336)) ([254628a](https://github.com/digdir/designsystem/commit/254628a7918dc037643b7157b40ad3e7031daeae))
- **Select:** Set "button" type on buttons ([#338](https://github.com/digdir/designsystem/issues/338)) ([f3035f0](https://github.com/digdir/designsystem/commit/f3035f0b1a37fa406f4f85af084571335f3ace0a))

## [0.11.2](https://github.com/digdir/designsystem/compare/@digdir/design-system-react@0.11.1...@digdir/design-system-react@0.11.2) (2023-04-24)

### Bug Fixes

- **InputWrapper:** Make input borders clickable ([#282](https://github.com/digdir/designsystem/issues/282)) ([d35df3f](https://github.com/digdir/designsystem/commit/d35df3f852359a0e21e9d05f8259158036db1206))
- **Select:** fix aria-activedecendant attribute ([#291](https://github.com/digdir/designsystem/issues/291)) ([0ed8958](https://github.com/digdir/designsystem/commit/0ed89584083a66d20d4f37570825f023fc40c24a))
- **Select:** Make event listeners local ([#299](https://github.com/digdir/designsystem/issues/299)) ([1439820](https://github.com/digdir/designsystem/commit/14398207f95816f13ff9133913c0ee40080c25f9))
- **Table/RadioGroup/CheckboxGroup/FieldSet:** Multiple minor accessibility improvements ([#301](https://github.com/digdir/designsystem/issues/301)) ([c299106](https://github.com/digdir/designsystem/commit/c299106502175c220f1c051ec215b6fe25ef0bf7))
- **Table:** Omitting `aria-sort` when no sort order is in effect ([#306](https://github.com/digdir/designsystem/issues/306)) ([ecb1570](https://github.com/digdir/designsystem/commit/ecb1570fdad1c9182fa3ee51154721a674324e0c))
- **Table:** Sort-arrows fix ([#297](https://github.com/digdir/designsystem/issues/297)) ([fbc8e50](https://github.com/digdir/designsystem/commit/fbc8e5083802667f3fbc664637c36a7881cde040))
- **TextArea:** Set border ([#310](https://github.com/digdir/designsystem/issues/310)) ([255f632](https://github.com/digdir/designsystem/commit/255f632c128a0c7a41fd466d63d285495401eac1))

### BREAKING CHANGE

- **Accordion** was renamed to LegacyAccordion to make room for new “Accordion” component in accordance with new design & features ([#296](https://github.com/digdir/designsystem/issues/296))([83d7e6c](https://github.com/digdir/designsystem/commit/83d7e6cabf3df97a252d56196d6583d847b6f663))

## [0.11.1](https://github.com/digdir/designsystem/compare/@digdir/design-system-react@0.11.0...@digdir/design-system-react@0.11.1) (2023-04-11)

### Bug Fixes

- **Select:** Make onBlur work when there is no active element ([#281](https://github.com/digdir/designsystem/issues/281)) ([cd1f43c](https://github.com/digdir/designsystem/commit/cd1f43ccc78b77baf11a4f01221572ffd13470fe))
- **Select:** Update selected on option change ([#286](https://github.com/digdir/designsystem/issues/286)) ([623d306](https://github.com/digdir/designsystem/commit/623d3067025f2da9359479d77f0dfcc29d4ac9d6))

# [0.11.0](https://github.com/digdir/designsystem/compare/@digdir/design-system-react@0.10.2...@digdir/design-system-react@0.11.0) (2023-03-30)

### Features

- **Select:** Add onFocus and onBlur events ([#278](https://github.com/digdir/designsystem/issues/278)) ([7fc362c](https://github.com/digdir/designsystem/commit/7fc362c735f8f31f0b49ba65c8a98d90133db3cc))

## [0.10.2](https://github.com/digdir/designsystem/compare/@digdir/design-system-react@0.10.1...@digdir/design-system-react@0.10.2) (2023-03-30)

### Bug Fixes

- **Textfield:** upgrading `react-number-format`, removing workaround ([e2dc0e6](https://github.com/digdir/designsystem/commit/e2dc0e62093af9a7feb83bf2f6ee55ab7b1082e0))

## [0.10.1](https://github.com/digdir/designsystem/compare/@digdir/design-system-react@0.10.0...@digdir/design-system-react@0.10.1) (2023-03-29)

### Bug Fixes

- **Accordion:** Fix continous texts word break ([#264](https://github.com/digdir/designsystem/issues/264)) ([13b3bd6](https://github.com/digdir/designsystem/commit/13b3bd6fb6a336ae1db86ea79555dde257162fa0))
- **Button:** adjust padding to make icon round ([#265](https://github.com/digdir/designsystem/issues/265)) ([922014d](https://github.com/digdir/designsystem/commit/922014d14f8316421c17b5ffb435acb2ba2c51ae))
- **RadioButton:** RadioButton looks wrong when zoming in browser ([#266](https://github.com/digdir/designsystem/issues/266)) ([5f40bc3](https://github.com/digdir/designsystem/commit/5f40bc35e0ed6f1c1e2535b0d45a38d18b1768c0))
- **Select:** Display initial value on single select ([#268](https://github.com/digdir/designsystem/issues/268)) ([7ad5f0f](https://github.com/digdir/designsystem/commit/7ad5f0fa6345577993dca28c0bb6066c9595634d))
- **ToggleButtonGroup:** Set correct button type ([#261](https://github.com/digdir/designsystem/issues/261)) ([a706f07](https://github.com/digdir/designsystem/commit/a706f0773acbf5bf4766d915af95696cdfaa67af))

# [0.10.0](https://github.com/digdir/designsystem/compare/@digdir/design-system-react@0.9.0...@digdir/design-system-react@0.10.0) (2023-03-24)

### Bug Fixes

- **Select:** NVDA screen reader issues ([#246](https://github.com/digdir/designsystem/issues/246)) ([3a57e6c](https://github.com/digdir/designsystem/commit/3a57e6c0cba74989758c4900d0130705f9b160e3))
- **Select:** Support dynamically changing options ([#253](https://github.com/digdir/designsystem/issues/253)) ([5b13f7c](https://github.com/digdir/designsystem/commit/5b13f7c13590f71547caa0e90c7f0d85e610c4af))

### Features

- Add toggle button component ([#258](https://github.com/digdir/designsystem/issues/258)) ([2ecbe69](https://github.com/digdir/designsystem/commit/2ecbe69fa8fe1d35f1ca91f8e7eef1f0f762f209))

# [0.9.0](https://github.com/digdir/designsystem/compare/@digdir/design-system-react@0.8.1...@digdir/design-system-react@0.9.0) (2023-03-17)

### Bug Fixes

- **Button:** Remove width in css for buttons with only icons ([#232](https://github.com/digdir/designsystem/issues/232)) ([4962e49](https://github.com/digdir/designsystem/commit/4962e49de0b69d33f6c7b884021819c6a9b5c86c))
- **CheckboxGroup:** Improved item update handling ([#241](https://github.com/digdir/designsystem/issues/241)) ([9a157df](https://github.com/digdir/designsystem/commit/9a157dfb6805b3e54930f2d555a18c7117fab577))
- use ReactNode in helptexts to allow rich content ([#245](https://github.com/digdir/designsystem/issues/245)) ([4469c7d](https://github.com/digdir/designsystem/commit/4469c7d653cb612e94e35b82fc97bdf622c5b5a3))

### Features

- **Button:** Added support for aria-disabled to button and loading button example in storybook ([#240](https://github.com/digdir/designsystem/issues/240)) ([51992e8](https://github.com/digdir/designsystem/commit/51992e8bf329e6b3cb38c0a88c36ef0ac20c9a84))

## [0.8.1](https://github.com/digdir/designsystem/compare/@digdir/design-system-react@0.8.0...@digdir/design-system-react@0.8.1) (2023-03-09)

**Note:** Version bump only for package @digdir/design-system-react

# [0.8.0](https://github.com/digdir/designsystem/compare/@digdir/design-system-react@0.7.0...@digdir/design-system-react@0.8.0) (2023-03-09)

### Bug Fixes

- **CheckboxGroup:** fix state handling problem ([#205](https://github.com/digdir/designsystem/issues/205)) ([50aab5a](https://github.com/digdir/designsystem/commit/50aab5ad8152083c9c4efaa8b7fac48ed77284ce))
- **HelpText:** helptext´s content not reachable with NVDA screenreader ([#206](https://github.com/digdir/designsystem/issues/206)) ([e4c115f](https://github.com/digdir/designsystem/commit/e4c115f11d95442372fbcee3c690ed617de0860a))
- Set correct font size in all text input fields ([#201](https://github.com/digdir/designsystem/issues/201)) ([2f1a903](https://github.com/digdir/designsystem/commit/2f1a9030b94c6938d8b8719cf6ed7f92d4eaa4b6))

### Features

- Add table component ([#207](https://github.com/digdir/designsystem/issues/207)) ([c07a288](https://github.com/digdir/designsystem/commit/c07a288daac0cc39e8bc8e78b5e214cb3c45a2f8))

# [0.7.0](https://github.com/digdir/designsystem/compare/@digdir/design-system-react@0.6.0...@digdir/design-system-react@0.7.0) (2023-02-24)

### Bug Fixes

- **HelpText:** hide helptext button in pdfs ([#156](https://github.com/digdir/designsystem/issues/156)) ([7b9c217](https://github.com/digdir/designsystem/commit/7b9c2174b8095f7fe56c205d4a462168b734e950))

### Features

- **HelpText:** take reactnode instead of string ([#181](https://github.com/digdir/designsystem/issues/181)) ([2c1a8df](https://github.com/digdir/designsystem/commit/2c1a8df08ea91a81f95252db8c12d5a6229f9188))
- **Spinner:** Add spinner component ([#162](https://github.com/digdir/designsystem/issues/162)) ([deb6fec](https://github.com/digdir/designsystem/commit/deb6fec8524bae70a001d330ac3ca15330879ff2))

# [0.6.0](https://github.com/digdir/designsystem/compare/@digdir/design-system-react@0.5.1...@digdir/design-system-react@0.6.0) (2023-02-16)

### Bug Fixes

- **HelpText:** fix help-text width ([#149](https://github.com/digdir/designsystem/issues/149)) ([e0ddf38](https://github.com/digdir/designsystem/commit/e0ddf3895994f1b276e851f74de495a33e4d964a))
- **Popover:** fix display-issue-with-popover-arrow ([#152](https://github.com/digdir/designsystem/issues/152)) ([2b3e311](https://github.com/digdir/designsystem/commit/2b3e3112407fdc86dcc092b1d93c34c9f76dbf69))

### Features

- **List:** Add list component ([#153](https://github.com/digdir/designsystem/issues/153)) ([f3befb9](https://github.com/digdir/designsystem/commit/f3befb9643f9c5be440426d8f57f3542ea44cf61))
- **Select:** Search and formatting ([#151](https://github.com/digdir/designsystem/issues/151)) ([d26ea78](https://github.com/digdir/designsystem/commit/d26ea78a8cb2ce6d12f60c4faa2ec0202ff37054))

## [0.5.1](https://github.com/digdir/designsystem/compare/@digdir/design-system-react@0.5.0...@digdir/design-system-react@0.5.1) (2023-02-13)

### Bug Fixes

- **Accordion:** Fix subtitle placement issues ([#144](https://github.com/digdir/designsystem/issues/144)) ([316e450](https://github.com/digdir/designsystem/commit/316e4502d3b34a90ca577a45bbb367f547f6fb96))
- **Button:** Enforce icon button to have same width and height ([#139](https://github.com/digdir/designsystem/issues/139)) ([9b3bb93](https://github.com/digdir/designsystem/commit/9b3bb93fc0e73b10a7522c07f54ca250b3d686b8))
- **HelpText:** export help text size prop ([#147](https://github.com/digdir/designsystem/issues/147)) ([7a716bb](https://github.com/digdir/designsystem/commit/7a716bbed965ec8fb5f01799c7aea32be4fdd8e3))
- **InputWrapper:** Change outline style to solid from auto to make outline-offset work ([#140](https://github.com/digdir/designsystem/issues/140)) ([ef2a9f4](https://github.com/digdir/designsystem/commit/ef2a9f4e003d6c7ca3ac72a1e4b3e915d4a174a7))

# [0.5.0](https://github.com/digdir/designsystem/compare/@digdir/design-system-react@0.4.3...@digdir/design-system-react@0.5.0) (2023-02-08)

### Bug Fixes

- added displayName to all exported components ([#135](https://github.com/digdir/designsystem/issues/135)) ([7f0dd1b](https://github.com/digdir/designsystem/commit/7f0dd1b01930e0a3dfd5117f6a5277d08dc1ebd7))
- **Button:** Replace non existent Figma token ([#128](https://github.com/digdir/designsystem/issues/128)) ([b27e3d4](https://github.com/digdir/designsystem/commit/b27e3d4cb67da0f9ae70d3f4d4b6f71a777b7bae))
- **Select:** Accept empty list of options ([#133](https://github.com/digdir/designsystem/issues/133)) ([515e84f](https://github.com/digdir/designsystem/commit/515e84f40edbec392041769e93aaf90f474aaa78))

### Features

- **Accordion:** Add accordion component ([#130](https://github.com/digdir/designsystem/issues/130)) ([5cf8bf2](https://github.com/digdir/designsystem/commit/5cf8bf20f5c59f1d9bca45af4c9cbceb017f22cf))

## [0.4.3](https://github.com/digdir/designsystem/compare/@digdir/design-system-react@0.4.2...@digdir/design-system-react@0.4.3) (2023-02-02)

### Bug Fixes

- **Button:** Only icon padding ([#109](https://github.com/digdir/designsystem/issues/109)) ([7a4c286](https://github.com/digdir/designsystem/commit/7a4c28622a3e558d36fa4c526b0d0e3c9a875bc8))
- **help text:** add title to helptext tests ([#126](https://github.com/digdir/designsystem/issues/126)) ([9b3fc86](https://github.com/digdir/designsystem/commit/9b3fc8686bf56eca2f69f80b4f02e3ee4e281b58))
- **Select:** Set higher z-index on option list ([#114](https://github.com/digdir/designsystem/issues/114)) ([f6077a6](https://github.com/digdir/designsystem/commit/f6077a645509001edc482e075a3a5df5ffa87076))
- Set font and min height on input fields ([#112](https://github.com/digdir/designsystem/issues/112)) ([e7671fa](https://github.com/digdir/designsystem/commit/e7671fabed4b9ab9d3094a44651e5f8797012bb9))
- Update Figma tokens ([#111](https://github.com/digdir/designsystem/issues/111)) ([8e0edd8](https://github.com/digdir/designsystem/commit/8e0edd819c6483ea9a372bb44f13ad8f3af38cc9))
- update figma-token for CheckboxRadioTemplate ([df69b2a](https://github.com/digdir/designsystem/commit/df69b2a2c366b4c46baa67a8f84c3358357b5324))

## [0.4.2](https://github.com/digdir/designsystem/compare/@digdir/design-system-react@0.4.1...@digdir/design-system-react@0.4.2) (2023-01-30)

### Bug Fixes

- added types file to export ([99a33f9](https://github.com/digdir/designsystem/commit/99a33f9b8c2b61019dbd7a04a911ab9f3b833a89))

## [0.4.1](https://github.com/digdir/designsystem/compare/@digdir/design-system-react@0.4.0...@digdir/design-system-react@0.4.1) (2023-01-27)

### Bug Fixes

- **popover:** popover screen reader ordering ([c8a0190](https://github.com/digdir/designsystem/commit/c8a0190d887b95b1e0ea0178c1a2e51f93d48c24))

# [0.4.0](https://github.com/digdir/designsystem/compare/@digdir/design-system-react@0.3.1...@digdir/design-system-react@0.4.0) (2023-01-26)

### Bug Fixes

- **popover:** retain focus on trigger when opening popover ([d54c7c8](https://github.com/digdir/designsystem/commit/d54c7c8293372415a560bb334f2c2df1ed342d7c))
- **Tabs:** Spacing issues ([#95](https://github.com/digdir/designsystem/issues/95)) ([2583e4c](https://github.com/digdir/designsystem/commit/2583e4c8f1205bd5d7c9882ebfc55edf7efd0959))

### Features

- **help-text:** add help text component ([8f2bb3b](https://github.com/digdir/designsystem/commit/8f2bb3bc682b9bfec650fe2813d402c94771a6d3))
- **popover:** added popover component ([6e34adf](https://github.com/digdir/designsystem/commit/6e34adfebed9742c7145fcc3e2e99b2075fe8081))

## [0.3.1](https://github.com/digdir/designsystem/compare/@digdir/design-system-react@0.3.0...@digdir/design-system-react@0.3.1) (2023-01-24)

### Bug Fixes

- Export issues ([#72](https://github.com/digdir/designsystem/issues/72)) ([716e9d7](https://github.com/digdir/designsystem/commit/716e9d7892be4ef7f21864338fd299a2f98a6784))

# [0.3.0](https://github.com/digdir/designsystem/compare/@digdir/design-system-react@0.2.1...@digdir/design-system-react@0.3.0) (2023-01-23)

### Bug Fixes

- **select:** Value update in Select component ([#63](https://github.com/digdir/designsystem/issues/63)) ([0a4677c](https://github.com/digdir/designsystem/commit/0a4677cc00cc1b316ca17d5522a10c7385817fed))

### Features

- **textfield:** Add text field component ([#67](https://github.com/digdir/designsystem/issues/67)) ([ba7e8a5](https://github.com/digdir/designsystem/commit/ba7e8a5484f1fc75ec982eb666c1a94e3594cdea))

## [0.2.1](https://github.com/digdir/designsystem/compare/@digdir/design-system-react@0.2.0...@digdir/design-system-react@0.2.1) (2023-01-19)

### Bug Fixes

- Presentation mode issues on checkboxes and radio buttons ([#61](https://github.com/digdir/designsystem/issues/61)) ([2ee07b4](https://github.com/digdir/designsystem/commit/2ee07b46794580bf255091fcc142b793c8a91682))

# [0.2.0](https://github.com/digdir/designsystem/compare/@digdir/design-system-react@0.1.1...@digdir/design-system-react@0.2.0) (2023-01-19)

### Bug Fixes

- **button:** Export button props ([#52](https://github.com/digdir/designsystem/issues/52)) ([604caed](https://github.com/digdir/designsystem/commit/604caed26dbd16b225c1c5dc41d8eb98eba94f10))

### Features

- **textarea:** Add TextArea component ([#59](https://github.com/digdir/designsystem/issues/59)) ([1938b7d](https://github.com/digdir/designsystem/commit/1938b7dd541e4c3508b0942b14c87ac64dc7c7f7))

## [0.1.1](https://github.com/digdir/designsystem/compare/@digdir/design-system-react@0.1.0...@digdir/design-system-react@0.1.1) (2023-01-12)

### Bug Fixes

- testing changelog with new release commands ([4906c28](https://github.com/digdir/designsystem/commit/4906c28e4b6972d7c5d93e4ab630fe5d52d8fdb2))

# 0.1.0 (2023-01-11)

### Features

- testing changelogs for the react package ([f988027](https://github.com/digdir/designsystem/commit/f9880278d774c4892e4792ad2f14d40d662e5206))
