import debounceParamFunc from "../../component/type/GeneralFunction/debounce";

const debounce = (func: debounceParamFunc, delay: number): (...args: any[]) => void => {
    let inDebounce: ReturnType<typeof setTimeout> | null;
    return function(this: any, ...args: any[]) {
      const context = this;
      if (inDebounce !== null) {
        clearTimeout(inDebounce);
      }
      inDebounce = setTimeout(() => func.apply(context, args), delay);
    };
};
  
export default debounce;