// src/utils/debounce.ts

export const debounce = (func: Function, delay: number) => {
    let timeout: NodeJS.Timeout | null;
  
    const debounced = (...args: any[]) => {
      const context = this; // Maintain context for 'this'
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(() => {
        func.apply(context, args);
        timeout = null; // Clear timeout after execution
      }, delay);
    };
  
    // Add a cancel method to clear any pending debounced calls
    debounced.cancel = () => {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
    };
  
    return debounced;
  };