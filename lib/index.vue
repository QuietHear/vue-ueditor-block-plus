/*
* @Author: aFei
* @Date: 2022-11-10 14:56:59
*/
/*
* @LastEditors: aFei
* @LastEditTime: 2025-03-28 10:39:34
*/
<template>
  <div :class="['vue-ueditor-block-plus', seeModel ? 'only-show' : '', cname]">
    <div ref="container" :name="name" v-show="!seeModel"></div>
    <div class="view" :style="{
      '--img-sort': 'url(' + staticUrl + 'themes/default/images/sortable.png)',
      '--img-loading': 'url(' + staticUrl + 'themes/default/images/loading.gif)',
      '--img-loaderror': 'url(' + staticUrl + 'themes/default/images/loaderror.png)',
      '--img-anchor': 'url(' + staticUrl + 'themes/default/images/anchor.gif)'
    }" v-html="modelValue" v-if="seeModel">
    </div>
  </div>
</template>
<script setup>
import { LoadEvent, debounce, asyncSeries, randomString } from './js';
const emit = defineEmits(["update:modelValue", "ready", "change"]);
const props = defineProps({
  // 额外class
  cname: {
    type: String,
    default: "",
  },
  modelValue: {
    type: String,
    default: ''
  },
  // ueditor的额外配置项
  extraConfig: {
    type: Object,
    default: () => {
      return {};
    },
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
    default: () => {
      return {};
    }
  },
  // 常用于表单中https://fex-team.github.io/ueditor/#start-submit
  name: {
    type: String,
    default: ''
  },
  // 监听富文本内容变化的方式
  mode: {
    type: String,
    default: 'observer',
    validator: (value, props) => {
      // 1. observer借助MutationObserver API https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver
      // 2. listener借助UEditor的contentChange事件 https://ueditor.baidu.com/doc/#UE.Editor:contentChange
      return ['observer', 'listener'].indexOf(value) !== -1;
    }
  },
  // MutationObserver的配置https://developer.mozilla.org/en-US/docs/Web/API/MutationObserverInit
  observerOptions: {
    type: Object,
    default: () => {
      return {
        attributes: true, // 是否监听DOM元素的属性变化
        attributeFilter: ['src', 'style', 'type', 'name'], // 只有在该数组中的属性值的变化才会监听
        characterData: true, // 是否监听文本节点
        childList: true, // 是否监听子节点
        subtree: true // 是否监听后代元素
      };
    }
  },
  // MutationObserver的回调函数防抖间隔
  observerDebounceTime: {
    type: Number,
    default: 50,
    validator: (value, props) => {
      return value >= 20;
    }
  },
  // SSR项目，服务端实例化组件时组件内部不会对UEditor进行初始化，仅在客户端初始化UEditor，这个参数设置为true可以跳过环境检测，直接初始化
  forceInit: {
    type: Boolean,
    default: false
  },
  // 是否在组建销毁时销毁UEditor实例
  destroy: {
    type: Boolean,
    default: true
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
    default: false,
  },
  // 延迟加载
  delayInit: {
    type: Number,
    default: 0
  }
});
const STATUS_MAP = {
  UN_READY: 'UN_READY', // 尚未初始化
  PENDING: 'PENDING', // 开始初始化但尚未ready
  READY: 'READY' // 初始化完成并已ready
};
const seeModel = ref(props.onlyShow);
watch(
  () => props.onlyShow,
  () => {
    if (props.onlyShow) {
      status = STATUS_MAP.UN_READY;
      editor && editor.removeListener('contentChange', observerContentChangeHandler);
      observer && observer.disconnect();
      editor.destroy();
      seeModel.value = true;
    } else {
      seeModel.value = false;
      nextTick(() => {
        initEditor();
      });
    }
  }
);
let status = STATUS_MAP.UN_READY;
let editor;
let observer;
let innerValue;
// 手动设置UEditor ID
const editorId = 'editor_' + randomString(8);
const container = ref(null);
// 默认UEditor内置配置
let defaultConfig = {
  // 如果需要上传功能,找后端小伙伴要服务器接口地址
  serverUrl: props.uploadUrl,
  // 你的UEditor资源存放的路径,相对于打包后的index.html
  UEDITOR_HOME_URL: props.staticUrl,
  // 编辑器不自动被内容撑高
  autoHeightEnabled: false,
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
      "insertunorderedlist",
    ],
    ["source"] // 调试时候使用
  ],
  // 初始容器高度
  initialFrameHeight: 240,
  // 初始容器宽度
  initialFrameWidth: "100%",
  // 关闭自动保存
  enableAutoSave: false,
  // 是否启用元素路径
  elementPathEnabled: false,
  // 内容只读
  readonly: false,
  // 开启字数统计
  wordCount: true
};
for (let key in props.extraConfig) {
  if (key !== 'serverUrl' && key !== 'UEDITOR_HOME_URL') {
    defaultConfig[key] = props.extraConfig[key];
  }
}
// 默认要加载的资源
const defaultEditorDependencies = ['ueditor.config.js', 'ueditor.all.min.js'];
// 判断上面的默认资源是否已经加载过的校验函数
const defaultEditorDependenciesChecker = () => {
  // 判断 ueditor.config.js 和 ueditor.all.js 是否均已加载
  // 仅加载完ueditor.config.js时UE对象和UEDITOR_CONFIG对象存在,仅加载完ueditor.all.js时UEDITOR_CONFIG对象存在,但为空对象
  return (
    window.UE && window.UE.getEditor && window.UEDITOR_CONFIG && Object.keys(window.UEDITOR_CONFIG).length !== 0
  );
};
const modelValue = toRef(props, 'modelValue');
// 创建加载资源的事件通信载体
if (!window.$loadEventBus) {
  window.$loadEventBus = new LoadEvent();
}
// 动态创建script标签来加载JS脚本，保证同一个脚本只被加载一次
const loadScript = (link) => {
  return new Promise((resolve, reject) => {
    window.$loadEventBus.on(link, resolve);
    if (window.$loadEventBus.listeners[link].requested === false) {
      window.$loadEventBus.listeners[link].requested = true;
      // 如果这个资源从未被请求过，就手动创建脚本去加载
      const script = document.createElement('script');
      script.src = link;
      script.onload = () => {
        window.$loadEventBus.emit(link);
      };
      script.onerror = reject;
      document.getElementsByTagName('head')[0].appendChild(script);
    }
  });
};
// 动态创建link标签来加载CSS文件
const loadCss = (link) => {
  return new Promise((resolve, reject) => {
    window.$loadEventBus.on(link, resolve);
    if (window.$loadEventBus.listeners[link].requested === false) {
      window.$loadEventBus.listeners[link].requested = true;
      const css = document.createElement('link');
      css.type = 'text/css';
      css.rel = 'stylesheet';
      css.href = link;
      css.onload = () => {
        window.$loadEventBus.emit(link);
      };
      css.onerror = reject;
      document.getElementsByTagName('head')[0].appendChild(css);
    }
  });
};
// 加载UEditor相关的静态资源
const loadEditorDependencies = () => {
  return new Promise((resolve, reject) => {
    if (props.editorDependencies && props.editorDependenciesChecker && props.editorDependenciesChecker()) {
      resolve();
      return;
    }
    if (!props.editorDependencies && defaultEditorDependenciesChecker()) {
      resolve();
      return;
    }
    // 把js和css分组
    const { jsLinks, cssLinks } = (props.editorDependencies || defaultEditorDependencies).reduce(
      (res, link) => {
        // 如果不是完整的URL就在前面补上UEDITOR_HOME_URL, 完整的URL形如：
        // 1. http://www.example.com/xxx.js
        // 2. https://www.example.com/xxx.js
        // 3. //www.example.com/xxx.js
        // 4. www.example.com/xxx.js
        const isFullUrl = /^((https?:)?\/\/)?[-a-zA-Z0-9]+(\.[-a-zA-Z0-9]+)+\//.test(link);
        if (!isFullUrl) {
          link = defaultConfig.UEDITOR_HOME_URL + link;
        }
        if (link.slice(-3) === '.js') {
          res.jsLinks.push(link);
        } else if (link.slice(-4) === '.css') {
          res.cssLinks.push(link);
        }
        return res;
      },
      {
        jsLinks: [],
        cssLinks: [],
      }
    );
    Promise.all([
      Promise.all(cssLinks.map((link) => loadCss(link))),
      // 依次加载依赖的JS文件，JS执行是有顺序要求的，比如ueditor.all.js就要晚于ueditor.config.js执行
      // 动态创建script是先加载完的先执行，所以不可以一次性创建所有资源的引入脚本
      asyncSeries(jsLinks.map((link) => () => loadScript(link))),
    ])
      .then(() => resolve())
      .catch(reject);
  });
};
// 基于UEditor的contentChange事件
const observerContentChangeHandler = () => {
  innerValue = editor.getContent();
  emit('update:modelValue', innerValue);
};
const normalChangeListener = () => {
  editor.addListener('contentChange', observerContentChangeHandler);
};
// 基于MutationObserver API
const changeHandle = () => {
  if (editor.document.getElementById('baidu_pastebin')) {
    return;
  }
  innerValue = editor.getContent();
  emit('update:modelValue', innerValue);
};
const observerChangeListener = () => {
  observer = new MutationObserver(debounce(changeHandle, props.observerDebounceTime));
  observer.observe(editor.body, props.observerOptions);
};
// 实例化编辑器
const initEditor = () => {
  setTimeout(() => {
    if (container.value) {
      container.value.id = editorId;
    }
    editor = window.UE.getEditor(editorId, defaultConfig);
    editor.addListener('ready', () => {
      if (status === STATUS_MAP.READY) {
        // 使用keep-alive组件会出现这种情况
        editor.setContent(props.modelValue);
      } else {
        status = STATUS_MAP.READY;
        emit('ready', editor);
        if (props.modelValue) {
          editor.setContent(props.modelValue);
        }
      }
      if (Object.keys(props.httpParams).length > 0) {
        editor.execCommand("serverparam", props.httpParams);
      }
      if (props.mode === 'observer' && window.MutationObserver) {
        observerChangeListener();
      } else {
        normalChangeListener();
      }
    });
  }, props.delayInit);
};
const getExample = () => {
  return editor;
};
watch(
  modelValue,
  (value) => {
    if (status === STATUS_MAP.UN_READY) {
      status = STATUS_MAP.PENDING;
      (props.forceInit || typeof window !== 'undefined') &&
        loadEditorDependencies()
          .then(() => {
            container.value ? initEditor() : nextTick(() => initEditor());
          })
          .catch(() => {
            throw new Error(
              '[vue-ueditor-block-plus] UEditor 资源加载失败！请检查资源是否存在，UEDITOR_HOME_URL 是否配置正确！'
            );
          });
    } else if (status === STATUS_MAP.READY) {
      value === innerValue || editor.setContent(value || '');
      emit('change', value);
    }
  },
  {
    immediate: true,
  }
);
onDeactivated(() => {
  editor && editor.removeListener('contentChange', observerContentChangeHandler);
  observer && observer.disconnect();
});
onBeforeUnmount(() => {
  if (observer && observer.disconnect) {
    observer.disconnect();
  }
  if (props.destroy && editor && editor.destroy) {
    editor.destroy();
  }
});
defineExpose({ getExample });
</script>
<style lang="scss">
@use "style/index.scss" as *;
</style>