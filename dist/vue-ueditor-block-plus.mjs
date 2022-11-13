import { openBlock as r, createElementBlock as c } from "vue";
const u = (e, t) => {
  const o = e.__vccOpts || e;
  for (const [n, s] of t)
    o[n] = s;
  return o;
}, i = {
  name: "vueUeditorBlockPlus",
  emits: ["change"],
  props: {
    showBtn: {
      type: Boolean,
      default: !0
    },
    space: {
      type: Number,
      default: 10
    },
    getFunction: {
      type: Function,
      required: !0
    },
    setFunction: {
      type: Function,
      required: !0
    }
  },
  setup(e, { attrs: t, slots: o, emit: n, expose: s }) {
    return {};
  }
}, p = { class: "vue-ueditor-block-plus" };
function a(e, t, o, n, s, f) {
  return r(), c("div", p, "1");
}
const d = /* @__PURE__ */ u(i, [["render", a]]), l = [d], _ = {
  install(e) {
    l.forEach((t) => {
      e.component(t.name, t);
    });
  }
};
typeof window < "u" && window.Vue && window.Vue.use(_);
export {
  _ as default
};
