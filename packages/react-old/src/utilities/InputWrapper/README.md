InputWrapper is an internal component only, that is not exposed outside this package.
Its purpose is to be a wrapper around several input components (f.ex. TextField, TextArea), because they share look and feel.
Parts of this component (f.ex. enums and types) can still be exposed though, because those are used in the wrapped components, and consumers may also need those enums.
