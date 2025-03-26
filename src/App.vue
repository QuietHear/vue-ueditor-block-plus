/*
 * @Author: aFei
 * @Date: 2025-03-26 10:30:00
*/
/*
 * @LastEditors: aFei
 * @LastEditTime: 2025-03-26 10:57:47
*/
<template>
  <el-config-provider :locale="zh">
    <router-view />
  </el-config-provider>
</template>
<script setup>
import zh from "element-plus/dist/locale/zh-cn.mjs";
</script>