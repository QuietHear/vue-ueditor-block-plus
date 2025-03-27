/*
 * @LastEditors: aFei
 * @LastEditTime: 2025-03-26 14:47:11
*/
// 一个简单的事件订阅发布的实现
export class LoadEvent {
  constructor() {
    this.listeners = {};
  }
  on(eventName, callback) {
    if (this.listeners[eventName] === undefined) {
      this.listeners[eventName] = {
        triggered: false,
        requested: false,
        cbs: [],
      };
    }
    // 如果已经触发过，后续添加监听的 callback 会被直接执行
    if (this.listeners[eventName].triggered) {
      callback();
    }
    this.listeners[eventName].cbs.push(callback);
  }
  emit(eventName) {
    if (this.listeners[eventName]) {
      this.listeners[eventName].triggered = true;
      this.listeners[eventName].cbs.forEach((callback) => callback());
    }
  }
};