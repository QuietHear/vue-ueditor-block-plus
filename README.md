# uEditor（vue3版）
***vue3版本*** | [**vue2版本**](https://github.com/QuietHear/vue-editor-block '右键新窗口浏览')


## 预览
	clone项目后npm run preview即可


## 安装
	npm i vue-ueditor-block-plus


## 使用
	import vueUeditorBlockPlus from "vue-ueditor-block-plus";
	import "vue-ueditor-block-plus/index.css";
	
	app.use(vueUeditorBlockPlus);


## 下载静态资源到本地
在本node包中下载static中的资源，前端的为UEditor文件夹，后端根据类型自己选择需要版本的.zip文件


## 0. 可改动样式变量
* ` --editor-content-height`：500px;-->编辑非全屏模式高度

* `--full-screen-zindex`：10;-->全屏模式时的z-index

* `--editor-content-lineHeight`：1.5;-->内容区域默认行距

* `--editor-content-fontSize`：14px;-->内容区域默认字号


## 1. 参数
* `cname`：自定义class-->String;非必传;默认''

* `v-model`：当前富文本编辑器内容，双向绑定-->String;非必传;默认''

* `extra-config`：ueditor的额外配置项，如与预设相同，则会覆盖之前的-->Object;非必传;默认'{}'

* `static-url`：静态资源文件地址host，指向index.html-->String;非必传;默认'/UEditor/'

* `upload-url`：图片上传的接口，后端可以看[文档](https://fex-team.github.io/ueditor/#server-deploy '后端文档')-->String;非必传;默认''

* `http-params`：请求附带参数-->Object;非必传;默认'{}'

* `editor-id`：富文本编辑器ID-->String;非必传;默认''

* `name`：类似input框的name属性，[常用于表单中](https://fex-team.github.io/ueditor/#start-submit '文档')-->String;非必传;默认''

* `mode`：监听内容变化的方式，校验变量只能是'observer'/'listener	'-->String;非必传;默认*'observer'*
>
	observer借助MutationObserver API
	listener借助UEditor的contentChange
>

* `observer-options`：[MutationObserver的参数](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserverInit '文档')-->Object;非必传
>
	// 当前默认配置
	{
        attributes: true, // 是否监听DOM元素的属性变化
        attributeFilter: ['src', 'style', 'type', 'name'], // 只有在该数组中的属性值的变化才会监听
        characterData: true, // 是否监听文本节点
        childList: true, // 是否监听子节点
        subtree: true // 是否监听后代元素
	}
>

* `observer-debounce-time`：MutationObserver的回调函数防抖间隔，校验变量只能大于等于20-->Number;非必传;默认*50*

* `forceInit`：跳过环境检测，直接初始化-->Boolean;非必传;默认*false*
>
	 SSR项目，服务端实例化组件时组件内部不会对UEditor进行初始化，仅在客户端初始化UEditor，这个参数设置为true可以跳过环境检测，直接初始化
>

* `destroy`：是否在组建销毁时销毁Editor实例-->Boolean;非必传;默认*true*

* `editor-dependencies`：指定使用UEditor所需要加载的JS和CSS文件路径-->Array;非必传
>
	// 资源加载的host默认为入参中的static-url，除非这里传入的是完整的URL
	// 
	// 空值时的默认配置
	// 此为初始化必要字段，如无特殊需求，不要随意改动
	['UEditor/ueditor.config.js', 'UEditor/ueditor.all.min.js']
>

* `editor-dependencies-checker`：检测依赖的静态资源是否加载完成的方法-->Function;非必传
>
	// 空值时的默认配置（与默认js&css加载为配套的方法）
	// 此为初始化必要字段，如无特殊需求，不要随意改动
	() => {
      return (
        window.UE && window.UE.getEditor && window.UEDITOR_CONFIG && Object.keys(window.UEDITOR_CONFIG).length !== 0
      );
    }
>

* `only-show`：只展示内容-->Boolean;非必传;默认false

* `@ready`：UEditor ready时触发-->返回当前UEditor的实例，可以使用其API
>
	// 里面key字段为当前编辑器的ID
	// window.UE为全局UEditor构造方法
>

* `@change`：内容改变监听-->返回当前内容
>
	必须绑定v-model才会触发
>


## 2. 组件预设ueditor配置
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
      ["source"], // 调试时候使用
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


## 3. 方法
* `getExample`：获取当前ueditor的实例，可以使用其API


## 4. 官方文档
[https://fex-team.github.io/ueditor/#start-start](https://fex-team.github.io/ueditor/#start-start '文档')


## 更多vue3组件
[**自定义右键菜单**](https://github.com/QuietHear/vue-diy-rightmenu-plus '右键新窗口浏览') | [**拖拽卡片布局组件**](https://github.com/QuietHear/vue-drag-component-plus '右键新窗口浏览') | [**可拖拽菜单**](https://github.com/QuietHear/vue-drag-menu-plus '右键新窗口浏览') | [**echarts组件**](https://github.com/QuietHear/vue-echarts-block-plus '右键新窗口浏览') | [**基于el-menu的菜单组件**](https://github.com/QuietHear/vue-ele-nav-plus '右键新窗口浏览') | [**面包屑组件**](https://github.com/QuietHear/vue-permission-breads-plus '右键新窗口浏览') | [**滑动拼图**](https://github.com/QuietHear/vue-puzzle-slider-plus '右键新窗口浏览') | [**工作日历**](https://github.com/QuietHear/vue-shop-calendar-plus '右键新窗口浏览') | [**多页签组件**](https://github.com/QuietHear/vue-tabs-plus '右键新窗口浏览') | ***uEditor*** | [**wangEditor**](https://github.com/QuietHear/vue-wangEditor-block-plus '右键新窗口浏览') | [**年密度组件**](https://github.com/QuietHear/vue-year-density-plus '右键新窗口浏览')