<template>
  <div class="rank">
    <TabsSwitch
      v-model="tab"
      :tabs="
        TOOL_countryCode == 'EG' || TOOL_countryCode == 'TW'
          ? [4, 5, 6]
          : [4, 5]
      "
      @update:model-value="onTabChange"
    />
    <RankFrame>
      <!-- 榜单内容 -->
      <div class="rank-content">
        <router-view></router-view>
      </div>
    </RankFrame>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { fnGetInjectInfo } from "@components/developTool_TS";
import TabsSwitch from "../../components/Tabs/TabsSwitch.vue";

const { TOOL_TEXT, TOOL_countryCode } = fnGetInjectInfo();
const route = useRoute();
const router = useRouter();

// Tab 索引对应路由名
const tabRouteMap = ["rankSend", "rankReceive", "rankGuild"];

// 当前 tab
const tab = ref(0);

// 根据当前路由初始化 tab
watch(
  () => route.name,
  (name) => {
    const index = tabRouteMap.indexOf(name as string);
    if (index !== -1) {
      tab.value = index;
    }
  },
  { immediate: true }
);

// Tab 切换时跳转路由
const onTabChange = (index: number) => {
  const routeName = tabRouteMap[index];
  if (routeName && route.name !== routeName) {
    router.replace({ name: routeName });
  }
};
</script>

<style lang="scss" scoped>
@use "../../static/mixin.scss" as *;

.rank {
  width: 100%;
  margin-bottom: 1.1rem;
}

.rank-content {
  margin-top: 0.2rem;
}
</style>
