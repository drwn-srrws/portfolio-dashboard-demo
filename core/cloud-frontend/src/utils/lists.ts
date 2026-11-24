export const byTruthy = (val: unknown) => !!val;

export const reduceWithFunc = <T>(
  fn: (val: T) => number,
  arr: T[],
  initialValue: number
) => arr.reduce((acc, curr) => fn(curr) + acc, initialValue);

export const first = (arr: string | []): string | number => arr[0];

export const insertAtIndex = <T>(arr: T[], index: number, value: T) => [
  ...arr.slice(0, index),
  value,
  ...arr.slice(index),
];
