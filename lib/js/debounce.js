/*
 * @LastEditors: aFei
 * @LastEditTime: 2025-03-26 14:54:55
 */
/**
 * 一个简单的防抖函数
 * @param func 需要限制执行频率的函数
 * @param delay 延迟时间，这段时间过后，才可触发第二次
 * @returns void
 */
export function debounce(func, delay) {
  let timer;
  const debouncedFunction = function (...args) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
  debouncedFunction.cancel = function () {
    if (timer !== undefined) {
      clearTimeout(timer);
    }
  };
  return debouncedFunction;
};