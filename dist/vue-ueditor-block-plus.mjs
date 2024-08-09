import { openBlock as s, createElementBlock as r } from "vue";
const _ = (e, o) => {
  const n = e.__vccOpts || e;
  for (const [t, c] of o)
    n[t] = c;
  return n;
}, u = {}, d = { class: "vue-ueditor-block-plus" };
function i(e, o) {
  return s(), r("div", d, " 123 ");
}
const l = /* @__PURE__ */ _(u, [["render", i]]), a = [l], f = {
  install(e) {
    a.forEach((o) => {
      e.component(o.name, o);
    });
  }
};
typeof window < "u" && window.Vue && window.Vue.use(f);
export {
  f as default
};
