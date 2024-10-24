export * from './Checkbox';

// TODO: Kept for later implementation
// export { useCheckbox } from './useCheckbox';
// ({ target }: ChangeEvent<HTMLInputElement>) =>
//   Array.from((target.form ?? document).getElementsByTagName('input'))
//     .filter(({ name, checked }) => name === target.name && checked)
//     .map(({ value }) => value),

// const inputRef = useMergeRefs<HTMLInputElement>([
//   ref,
//   (el) => {
//     if (el) el.indeterminate = rest.indeterminate ?? false;
//   },
// ]);
