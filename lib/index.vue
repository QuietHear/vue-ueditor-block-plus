/*
 * @Author: aFei
 * @Date: 2022-11-10 14:56:59
*/
/*
 * @LastEditors: aFei
 * @LastEditTime: 2022-11-13 23:57:52
*/
<template>
  <div class="vue-ueditor-block-plus">1</div>
</template>
<script>
import { ref, onMounted, nextTick } from "vue";
export default {
  name: "vueUeditorBlockPlus",
  emits: ["change"],
  props: {
    // 展示按钮控件
    showBtn: {
      type: Boolean,
      default: true,
    },
    // 抠图到图形边沿的距离
    space: {
      type: Number,
      default: 10,
    },
    // 通过接口获取初始化图片相关信息
    getFunction: {
      type: Function,
      required: true,
    },
    // 通过接口提交校验结果
    setFunction: {
      type: Function,
      required: true,
    },
  },
  setup(props, { attrs, slots, emit, expose }) {
    return {};
  },
};
</script>
<style lang="scss">
@use "style/index.scss" as *;
</style>