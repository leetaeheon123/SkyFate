export function isEmptyObj(obj: Object) {
  if (obj.constructor === Object && Object.keys(obj).length === 0) {
    return true;
  }

  return false;
}

export const OddNumValid = (num: number) => {
  return num % 2 === 1 ? true : false;
};
