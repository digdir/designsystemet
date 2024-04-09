import { omit } from './objectUtils';

describe('omit', () => {
  it('Returns copy of object with omitted property', () => {
    const object1 = { a: 1, b: 2, c: 3 };

    const omittedObject = omit(['c'], object1);

    expect(Object.keys(omittedObject).includes('a')).toBeTruthy();
    expect(Object.keys(omittedObject).includes('b')).toBeTruthy();
    expect(Object.keys(omittedObject).includes('c')).toBeFalsy();
  });
});
