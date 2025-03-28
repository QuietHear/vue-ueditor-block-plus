import { ref as C, watch as _, nextTick as O, toRef as j, onDeactivated as M, onBeforeUnmount as H, openBlock as R, createElementBlock as B, normalizeClass as Y, unref as E, withDirectives as $, createElementVNode as F, vShow as k, normalizeStyle as q, createCommentVNode as z } from "vue";
class G {
  constructor() {
    this.listeners = {};
  }
  on(n, s) {
    this.listeners[n] === void 0 && (this.listeners[n] = {
      triggered: !1,
      requested: !1,
      cbs: []
    }), this.listeners[n].triggered && s(), this.listeners[n].cbs.push(s);
  }
  emit(n) {
    this.listeners[n] && (this.listeners[n].triggered = !0, this.listeners[n].cbs.forEach((s) => s()));
  }
}
function Z(o, n) {
  let s;
  const a = function(...e) {
    s && clearTimeout(s), s = setTimeout(() => {
      o.apply(this, e);
    }, n);
  };
  return a.cancel = function() {
    s !== void 0 && clearTimeout(s);
  }, a;
}
function W(o) {
  return o.reduce((n, s) => n.then(s), Promise.resolve());
}
function J(o) {
  const n = "abcdefghijklmnopqrstuvwxyz";
  let s = "";
  for (let a = 0; a < o; a++)
    s += n.charAt(Math.floor(Math.random() * n.length));
  return s;
}
const K = ["name"], Q = ["innerHTML"], X = {
  __name: "index",
  props: {
    // 额外class
    cname: {
      type: String,
      default: ""
    },
    modelValue: {
      type: String,
      default: ""
    },
    // ueditor的额外配置项
    extraConfig: {
      type: Object,
      default: () => ({})
    },
    // 静态资源文件地址host
    staticUrl: {
      type: String,
      default: "/UEditor/"
    },
    // 图片上传的接口
    uploadUrl: {
      type: String,
      default: ""
    },
    // 请求附带参数
    httpParams: {
      type: Object,
      default: () => ({})
    },
    // 常用于表单中https://fex-team.github.io/ueditor/#start-submit
    name: {
      type: String,
      default: ""
    },
    // 监听富文本内容变化的方式
    mode: {
      type: String,
      default: "observer",
      validator: (o, n) => ["observer", "listener"].indexOf(o) !== -1
    },
    // MutationObserver的配置https://developer.mozilla.org/en-US/docs/Web/API/MutationObserverInit
    observerOptions: {
      type: Object,
      default: () => ({
        attributes: !0,
        // 是否监听DOM元素的属性变化
        attributeFilter: ["src", "style", "type", "name"],
        // 只有在该数组中的属性值的变化才会监听
        characterData: !0,
        // 是否监听文本节点
        childList: !0,
        // 是否监听子节点
        subtree: !0
        // 是否监听后代元素
      })
    },
    // MutationObserver的回调函数防抖间隔
    observerDebounceTime: {
      type: Number,
      default: 50,
      validator: (o, n) => o >= 20
    },
    // SSR项目，服务端实例化组件时组件内部不会对UEditor进行初始化，仅在客户端初始化UEditor，这个参数设置为true可以跳过环境检测，直接初始化
    forceInit: {
      type: Boolean,
      default: !1
    },
    // 是否在组建销毁时销毁UEditor实例
    destroy: {
      type: Boolean,
      default: !0
    },
    // 指定UEditor依赖的静态资源，js&css文件路径
    editorDependencies: {
      type: Array
    },
    // 检测依赖的静态资源是否加载完成的方法
    editorDependenciesChecker: {
      type: Function
    },
    // 只展示内容，不展示菜单
    onlyShow: {
      type: Boolean,
      default: !1
    },
    // 延迟加载
    delayInit: {
      type: Number,
      default: 0
    }
  },
  emits: ["update:modelValue", "ready", "change"],
  setup(o, { expose: n, emit: s }) {
    const a = s, e = o, l = {
      UN_READY: "UN_READY",
      // 尚未初始化
      PENDING: "PENDING",
      // 开始初始化但尚未ready
      READY: "READY"
      // 初始化完成并已ready
    }, h = C(e.onlyShow);
    _(
      () => e.onlyShow,
      () => {
        e.onlyShow ? (f = l.UN_READY, r && r.removeListener("contentChange", b), d && d.disconnect(), r.destroy(), h.value = !0) : (h.value = !1, O(() => {
          v();
        }));
      }
    );
    let f = l.UN_READY, r, d, p;
    const U = "editor_" + J(8), w = C(null);
    let y = {
      // 如果需要上传功能,找后端小伙伴要服务器接口地址
      serverUrl: e.uploadUrl,
      // 你的UEditor资源存放的路径,相对于打包后的index.html
      UEDITOR_HOME_URL: e.staticUrl,
      // 编辑器不自动被内容撑高
      autoHeightEnabled: !1,
      // 定制菜单
      toolbars: [
        [
          "fullscreen",
          "bold",
          "italic",
          "underline",
          "fontsize",
          "insertimage",
          "insertorderedlist",
          "insertunorderedlist"
        ],
        ["source"]
        // 调试时候使用
      ],
      // 初始容器高度
      initialFrameHeight: 240,
      // 初始容器宽度
      initialFrameWidth: "100%",
      // 关闭自动保存
      enableAutoSave: !1,
      // 是否启用元素路径
      elementPathEnabled: !1,
      // 内容只读
      readonly: !1,
      // 开启字数统计
      wordCount: !0
    };
    for (let t in e.extraConfig)
      t !== "serverUrl" && t !== "UEDITOR_HOME_URL" && (y[t] = e.extraConfig[t]);
    const L = ["ueditor.config.js", "ueditor.all.min.js"], T = () => window.UE && window.UE.getEditor && window.UEDITOR_CONFIG && Object.keys(window.UEDITOR_CONFIG).length !== 0, D = j(e, "modelValue");
    window.$loadEventBus || (window.$loadEventBus = new G());
    const S = (t) => new Promise((m, g) => {
      if (window.$loadEventBus.on(t, m), window.$loadEventBus.listeners[t].requested === !1) {
        window.$loadEventBus.listeners[t].requested = !0;
        const i = document.createElement("script");
        i.src = t, i.onload = () => {
          window.$loadEventBus.emit(t);
        }, i.onerror = g, document.getElementsByTagName("head")[0].appendChild(i);
      }
    }), A = (t) => new Promise((m, g) => {
      if (window.$loadEventBus.on(t, m), window.$loadEventBus.listeners[t].requested === !1) {
        window.$loadEventBus.listeners[t].requested = !0;
        const i = document.createElement("link");
        i.type = "text/css", i.rel = "stylesheet", i.href = t, i.onload = () => {
          window.$loadEventBus.emit(t);
        }, i.onerror = g, document.getElementsByTagName("head")[0].appendChild(i);
      }
    }), I = () => new Promise((t, m) => {
      if (e.editorDependencies && e.editorDependenciesChecker && e.editorDependenciesChecker()) {
        t();
        return;
      }
      if (!e.editorDependencies && T()) {
        t();
        return;
      }
      const { jsLinks: g, cssLinks: i } = (e.editorDependencies || L).reduce(
        (u, c) => (/^((https?:)?\/\/)?[-a-zA-Z0-9]+(\.[-a-zA-Z0-9]+)+\//.test(c) || (c = y.UEDITOR_HOME_URL + c), c.slice(-3) === ".js" ? u.jsLinks.push(c) : c.slice(-4) === ".css" && u.cssLinks.push(c), u),
        {
          jsLinks: [],
          cssLinks: []
        }
      );
      Promise.all([
        Promise.all(i.map((u) => A(u))),
        // 依次加载依赖的JS文件，JS执行是有顺序要求的，比如ueditor.all.js就要晚于ueditor.config.js执行
        // 动态创建script是先加载完的先执行，所以不可以一次性创建所有资源的引入脚本
        W(g.map((u) => () => S(u)))
      ]).then(() => t()).catch(m);
    }), b = () => {
      p = r.getContent(), a("update:modelValue", p);
    }, x = () => {
      r.addListener("contentChange", b);
    }, P = () => {
      r.document.getElementById("baidu_pastebin") || (p = r.getContent(), a("update:modelValue", p));
    }, N = () => {
      d = new MutationObserver(Z(P, e.observerDebounceTime)), d.observe(r.body, e.observerOptions);
    }, v = () => {
      setTimeout(() => {
        w.value && (w.value.id = U), r = window.UE.getEditor(U, y), r.addListener("ready", () => {
          f === l.READY ? r.setContent(e.modelValue) : (f = l.READY, a("ready", r), e.modelValue && r.setContent(e.modelValue)), Object.keys(e.httpParams).length > 0 && r.execCommand("serverparam", e.httpParams), e.mode === "observer" && window.MutationObserver ? N() : x();
        });
      }, e.delayInit);
    }, V = () => r;
    return _(
      D,
      (t) => {
        f === l.UN_READY ? (f = l.PENDING, (e.forceInit || typeof window < "u") && I().then(() => {
          w.value ? v() : O(() => v());
        }).catch(() => {
          throw new Error(
            "[vue-ueditor-block-plus] UEditor 资源加载失败！请检查资源是否存在，UEDITOR_HOME_URL 是否配置正确！"
          );
        })) : f === l.READY && (t === p || r.setContent(t || ""), a("change", t));
      },
      {
        immediate: !0
      }
    ), M(() => {
      r && r.removeListener("contentChange", b), d && d.disconnect();
    }), H(() => {
      d && d.disconnect && d.disconnect(), e.destroy && r && r.destroy && r.destroy();
    }), n({ getExample: V }), (t, m) => (R(), B("div", {
      class: Y(["vue-ueditor-block-plus", E(h) ? "only-show" : "", o.cname])
    }, [
      $(F("div", {
        ref_key: "container",
        ref: w,
        name: o.name
      }, null, 8, K), [
        [k, !E(h)]
      ]),
      E(h) ? (R(), B("div", {
        key: 0,
        class: "view",
        style: q({
          "--img-sort": "url(" + o.staticUrl + "themes/default/images/sortable.png)",
          "--img-loading": "url(" + o.staticUrl + "themes/default/images/loading.gif)",
          "--img-loaderror": "url(" + o.staticUrl + "themes/default/images/loaderror.png)",
          "--img-anchor": "url(" + o.staticUrl + "themes/default/images/anchor.gif)"
        }),
        innerHTML: E(D)
      }, null, 12, Q)) : z("", !0)
    ], 2));
  }
}, ee = [X], te = {
  install(o) {
    ee.forEach((n) => {
      o.component("vueUeditorBlockPlus", n);
    });
  }
};
typeof window < "u" && window.Vue && window.Vue.use(te);
export {
  te as default
};
