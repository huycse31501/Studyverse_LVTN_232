import debounceFuncParam from "./debounceType";

const debounce = (
  func: debounceFuncParam,
  delay: number
): ((...args: any[]) => void) => {
  let inDebounce: ReturnType<typeof setTimeout> | null;
  return function (this: any, ...args: any[]) {
    const context = this;
    if (inDebounce !== null) {
      clearTimeout(inDebounce);
    }
    inDebounce = setTimeout(() => func.apply(context, args), delay);
  };
};

export default debounce;
