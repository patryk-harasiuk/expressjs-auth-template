export const hasDefinedProperty = <T, K extends keyof T>(
  object: T,
  property: K,
): object is T & Required<Pick<T, K>> => {
  return !!object[property];
};
