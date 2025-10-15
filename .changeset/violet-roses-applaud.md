---
"@digdir/designsystemet-react": patch
---

**Field.Counter**: Adjustments to how it works internally. 
Now, none of the validation messages underneath are `aria-described` on the input/textarea. This is done by an `aria-live` region only for screenreaders.

A new `hint` prop has been added, to announce how many characters are allowed when entering the input/textarea. Default value is `'Maks %d tegn tillatt.'`.
