type valueType = 'phone' | 'email' | 'empty';

export const valid = (value: string, type: valueType = 'empty'): boolean => {
  let valid = true;
  switch (type) {
    case 'phone':
      if (!/^1[3456789]\d{9}$/.test(value)) {
        valid = false;
      }
      break;
    case 'email':
      if (!/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value)) {
        valid = false;
      }
      break;
    case 'empty':
      if (value.length !== 0) {
        valid = false;
      }
      break;
    default:
      valid = true;
  }
  return valid;
};
