/*
* @Author: aFei
* @Date: 2025-03-26 10:30:00
*/
/*
 * @LastEditors: aFei
 * @LastEditTime: 2025-03-27 13:38:48
*/
<template>
  <div class="demo">
    <el-scrollbar>
      <div class="con-box">
        <div class="btn-group">
          <el-button @click="getEditor" type="primary">获取实例</el-button>
          <el-button @click="seeModel = !seeModel" type="primary" plain>切换预览</el-button>
        </div>
        <div class="see-content">
          <vueUeditorBlockPlus v-model="str" ref="ueditorRef" @ready="ready" @change="change" :onlyShow="seeModel" />
          <vueUeditorBlockPlus v-model="str" onlyShow />
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>
<script setup>
import vueUeditorBlockPlus from "~/lib/index.vue";
const ueditorRef = ref(null);
const str = ref("<h2><img src='http://img.baidu.com/hi/jx2/j_0003.gif'/>Vue + wangEditor + v-model双向绑定</h2>");
const seeModel = ref(false);
const ready = (editor) => {
  console.log(editor, 'ready editor');
};
const getEditor = () => {
  console.log(ueditorRef.value.getExample(), 'get editor');
};
const change = (val) => {
  console.log(val, 'change');
};
</script>