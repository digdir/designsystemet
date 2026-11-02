---
"@digdir/designsystemet-react": patch
---

**Dialog:** Deprecates `TriggerContext` and `Trigger`, which will be removed in the next major version. Use native [Invokers Commands API](https://developer.mozilla.org/en-US/docs/Web/API/Invoker_Commands_API) on `Button` with `command="show-modal"` (or `command="--show-non-modal"`) and `commandfor` set to the dialog's `id`.
