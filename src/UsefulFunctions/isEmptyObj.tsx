export function isEmptyObj(obj: Object) {
  if (obj.constructor === Object && Object.keys(obj).length === 0) {
    return true;
  }

  return false;
}

export const OddNumValid = (num: number) => {
  return num % 2 === 1 ? true : false;
};

export const isEmptyArray = <T,>(array: T[]): boolean => {
  if (array.length == 0) {
    return false;
  } else if (array.length > 0) {
    return true;
  }

  return true
};
