/*
 * @Author: aFei
 * @Date: 2022-11-10 14:56:59
*/
/*
 * @LastEditors: aFei
 * @LastEditTime: 2023-02-09 15:51:35
*/
<template>
  <div class="vue-ueditor-block-plus">
    123
    <vue-ueditor-wrap v-model="msg" @before-init="aaaa" @ready="ready" :config="editorConfig"
      editor-id="editor-demo-01"></vue-ueditor-wrap>
  </div>
</template>
<script setup>
import VueUeditorWrap from 'vue-ueditor-wrap';
import { ref, onMounted, nextTick } from "vue";
console.log(VueUeditorWrap, 'VueUeditorWrap');
VueUeditorWrap.install()
const emit = defineEmits([]);
const props = defineProps({});
const msg = ref('<h2>Hello World!</h2>');
const editorConfig = ref({
  UEDITOR_HOME_URL: '/UEditor/', // 访问 UEditor 静态资源的根路径，可参考常见问题1
  serverUrl: '//ueditor.zhenghaochuan.com/cos', // 服务端接口（这个地址是我为了方便各位体验文件上传功能搭建的临时接口，请勿在生产环境使用！！！）
});
const aaaa = () => {
  console.log(11111);
}
const ready = (ue) => {
  console.log(ue, 'ue');
};
</script>
<style lang="scss">
@use "style/index.scss" as *;
</style>