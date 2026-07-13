// 将常用的组件注册为全局组件（异步加载）
import { defineAsyncComponent } from "vue";

// === 异步组件配置
const asyncComponents = {
  // Basic 基础组件
  OptA: () => import("./OptA.vue"),
  RankLoad: () => import("./RankLoad.vue"),
  SwiperFrame: () => import("./SwiperFrame.vue"),
};

export default (Vue: any) => {
  // 注册异步组件
  for (const [name, loader] of Object.entries(asyncComponents)) {
    Vue.component(name, defineAsyncComponent(loader));
  }
};
