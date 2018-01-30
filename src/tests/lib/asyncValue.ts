export const getReturn = async (value: any | Promise<any>): Promise<any> => {
  if (value instanceof Promise) {
    return await value;
  } else {
    return value;
  }
};
