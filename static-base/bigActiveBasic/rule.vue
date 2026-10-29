<template>
  <div class="rule">
    <div class="rule-tabs"><TabsRule v-model="ruleTab" /></div>

    <div v-show="ruleTab == 1" class="reward-tabs">
      <TabsReward v-model="rewardTab" :text="rewardTabText" :hideIndex="rewardHideIndex" />
    </div>

    <div v-show="ruleTab == 1 && hasSubTabs" class="reward-sub-tabs">
      <TabsRewardSub v-model="rewardSubTab" :text="rewardSubTabText" />
    </div>

    <!-- 规则页 - 折叠展开列表（需要 RankFrame 包裹） -->
    <RankFrame v-if="ruleTab === 0" type="rank">
      <div class="content">
        <div class="rule-content">
          <template v-for="(item, index) in ruleList" :key="item.mixinRuleKey">
            <div class="rule-wrap" :class="{ open: isOpen(index) }">
              <div class="title" @click="handleToggle(index)">
                <img class="obg" :src="`${ossUrl}/rule-title-bg.png`" alt="" />
                <span> {{ TOOL_TEXT[item.title] }} </span>
                <img class="tri" :src="`${ossUrl}/rule-tri.png`" alt="" />
              </div>

              <div v-show="isOpen(index)" class="content-img">
                <img :src="`${CDN_DOMAIN}/${rule[item.mixinRuleKey]}`" :alt="item.mixinRuleKey" />
              </div>
            </div>
          </template>
        </div>
      </div>
    </RankFrame>

    <!-- 奖励页（不需要 RankFrame 包裹） -->
    <div v-else class="content">
      <div class="rule-content">
        <div class="rule-wrap">
          <div class="content-img">
            <img
              :key="currentReward.mixinRuleKey"
              :src="`${CDN_DOMAIN}/${rule[currentReward.mixinRuleKey]}`"
              :alt="currentReward.mixinRuleKey"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup name="Rule">
import { computed, onMounted, ref, inject, watch } from 'vue'
import { useRoute } from 'vue-router'
import injectTool from '@publicComponents/injectTool'
import { getQueryString } from '@libraryParams/params'

import TabsRewardSub from '../common/Tabs/TabsRewardSub.vue'
import { getRuleConfig, findByRuleIndex } from './ruleConfig.js'

const route = useRoute()
const CDN_DOMAIN = inject('CDN_DOMAIN')
const ossUrl = inject('ossUrl') as string

const { TOOL_BPFunc, TOOL_countryCode, TOOL_TEXT, TOOL_RULE } = injectTool()

TOOL_BPFunc({ desc: 'rule_page', action: 'show' }) //固定不变，勿删
const rule = computed(() => TOOL_RULE())
const PROJECT_STATIC = computed(() => (PROJECT == 1 ? 1 : 2))

const ruleTab = ref<number>(0)
const currentRule = ref<number>(0)
const rewardTab = ref<number>(0)
const rewardSubTab = ref<number>(0)

watch(rewardTab, () => {
  rewardSubTab.value = 0
})

const isOpen = (index: number) => currentRule.value === index

const handleToggle = (index: number) => {
  const opened = currentRule.value !== index
  currentRule.value = opened ? index : -1
  TOOL_BPFunc({
    desc: `Rule_rule${index + 1}_${opened ? 'open' : 'close'}`,
    action: 'click'
  })
}

const type = Number(route.params.type) || Number(route.query.type) || 0

const generateListFromConfig = (configType: 'rule' | 'reward') => {
  return getRuleConfig(configType, PROJECT_STATIC.value).filter(
    (config: any) => !config.parentKey && !config.hideArea?.includes(TOOL_countryCode)
  )
}

const ruleList = computed(() => generateListFromConfig('rule'))

// 奖励页全量 Tab（不做 hideArea 过滤，保证 tabIndex 与渲染下标一一对应），隐藏交给 rewardHideIndex 控制
const rewardList = computed(() =>
  getRuleConfig('reward', PROJECT_STATIC.value).filter((config: any) => !config.parentKey)
)

// 奖励 Tab 文案（按配置 title 顺序）
const rewardTabText = computed(() => rewardList.value.map((item: any) => item.title))

// 需要在当前大区隐藏的奖励 Tab 下标（由 hideArea 配置驱动）
const rewardHideIndex = computed(() =>
  rewardList.value.reduce((acc: number[], item: any, index: number) => {
    if (item.hideArea?.includes(TOOL_countryCode)) acc.push(index)
    return acc
  }, [])
)

const currentRewardParent = computed(() => {
  return (
    rewardList.value.find((item: any) => item.tabIndex === rewardTab.value) || rewardList.value[0]
  )
})

const hasSubTabs = computed(() => {
  const reward = currentRewardParent.value
  if (!reward?.children?.length) return false
  const subTabs = reward.children.filter((c: any) => c.project.includes(PROJECT_STATIC.value))
  return subTabs.length > 0
})

const currentReward = computed(() => {
  const reward = currentRewardParent.value
  if (reward?.children?.length) {
    const subTabs = reward.children.filter((c: any) => c.project.includes(PROJECT_STATIC.value))
    if (subTabs.length) {
      return subTabs[rewardSubTab.value] || subTabs[0]
    }
  }
  return reward
})

// 奖励子 Tab 文案（取当前父 Tab 下 children 的 title）
const rewardSubTabText = computed(() => {
  const reward = currentRewardParent.value
  if (!reward?.children?.length) return []
  return reward.children
    .filter((c: any) => c.project.includes(PROJECT_STATIC.value))
    .map((c: any) => c.title)
})

const getTabInfoByRuleIndex = () => {
  const ruleIndex = getQueryString('ruleIndex') || (route.query.ruleIndex as string)
  if (!ruleIndex) return null
  const result = findByRuleIndex(ruleIndex, PROJECT_STATIC.value)
  if (!result) return null
  return { type: result.config.type, index: result.index, mixinRuleKey: result.config.mixinRuleKey }
}

const getFromRuleKey = () => {
  return getQueryString('from') || (route.query.from as string) || ''
}

onMounted(() => {
  const tabInfo = getTabInfoByRuleIndex()
  if (tabInfo) {
    if (tabInfo.type === 'reward') {
      ruleTab.value = 1
      rewardTab.value = tabInfo.index
    } else {
      // 按 mixinRuleKey 在实际渲染的 ruleList 里定位（避免 hideArea 过滤导致下标错位）
      const idx = ruleList.value.findIndex((item: any) => item.mixinRuleKey === tabInfo.mixinRuleKey)
      currentRule.value = idx === -1 ? 0 : idx
    }
  } else if (type > 1) {
    ruleTab.value = 1
    rewardTab.value = type - 2
  } else {
    const ruleKey = getFromRuleKey()
    const match = ruleKey.match(/rule(\d)/)
    currentRule.value = match ? Number(match[1]) - 1 : 0
  }

  // 默认选中的奖励 Tab 若被当前大区隐藏，则顺延到第一个可见 Tab
  if (rewardHideIndex.value.includes(rewardTab.value)) {
    const firstVisible = rewardList.value.findIndex(
      (_: any, index: number) => !rewardHideIndex.value.includes(index)
    )
    rewardTab.value = firstVisible === -1 ? 0 : firstVisible
  }
})
</script>

<style lang="scss" scoped>
.rule {
  width: 100%;
  height: auto;
  padding-bottom: 1rem;

  position: relative;
  z-index: 1;

  .gift-reward-swiper-content {
    width: 7.18rem;
    height: 2.24rem;
    margin: 0 auto;

    position: relative;
  }

  .rule-tabs {
    margin-top: 0.06rem;

    position: relative;
    z-index: 1;
  }

  .reward-tabs {
    position: relative;
    z-index: 1;
  }

  .reward-sub-tabs {
    position: relative;
    z-index: 1;
  }

  .content {
    margin-top: 0.62rem;

    .rule-content {
      width: 6rem;
      height: auto;
      min-height: 15rem;

      margin: 0 auto;
      margin-top: 0.16rem;
      padding-bottom: 1rem;

      position: relative;
      z-index: 3;

      > img {
        width: 100vw;
        margin: 0 auto;
      }
    }

    .rule-wrap {
      margin-bottom: 0.2rem;

      .title {
        width: 6.22rem;
        height: 0.48rem;
        margin: 0 auto;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        position: relative;
        z-index: 1;

        .obg {
          position: absolute;
          width: 100%;
          height: 100%;
          left: 0;
          top: 0;
          z-index: -1;
        }

        span {
          text-align: center;
          font-family: 'SF UI Text';
          font-size: 0.26rem;
          font-style: normal;
          font-weight: 700;
          line-height: 0.34rem; /* 130.769% */
          background: linear-gradient(90deg, #ffc64c 0.19%, #fffde6 49.94%, #ffc64c 99.7%);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .tri {
          width: 0.4rem;
          height: 0.4rem;
          transition: transform 0.3s ease;
          position: absolute;
          right: 0;
          top: 0.12rem;
        }
      }

      .content-img {
        overflow: hidden;
        padding: 0.2rem 0;

        img {
          width: 100%;
        }
      }

      &.open {
        .title .tri {
          transform: rotate(180deg);
        }
      }
    }
  }
}
</style>
