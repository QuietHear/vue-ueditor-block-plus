/*
 * @Author: aFei
 * @Date: 2022-11-10 14:56:59
*/
/*
 * @LastEditors: aFei
 * @LastEditTime: 2025-03-27 14:20:26
*/
import vueUeditorBlockPlus from "./index.vue";
const arr = [vueUeditorBlockPlus];
const comment = {
  install(Vue) {
    arr.forEach(item => {
      Vue.component('vueUeditorBlockPlus', item);
    })
  },
};
// 注入script方式vue中
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(comment);
}
// 导出为全量
export default comment;