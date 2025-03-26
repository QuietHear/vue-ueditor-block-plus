/*
 * @Author: aFei
 * @Date: 2025-03-26 10:30:00
*/
/*
 * @LastEditors: aFei
 * @LastEditTime: 2025-03-26 10:57:24
*/
import App from "./App.vue";
import router from "@/router";
import ElementPlus from "element-plus";
import "element-plus/theme-chalk/src/index.scss";
import "element-plus/theme-chalk/dark/css-vars.css";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import "asset/index.scss";

const app = createApp(App);
app.use(router);
app.use(ElementPlus);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.mount('#app');