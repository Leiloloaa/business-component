// hideArea: 需要隐藏该项的大区 TOOL_countryCode 列表，留空 [] 表示全大区显示，如 ['TW'] 表示 TW 隐藏
export const ruleConfig = [
  {
    description: '玩法规则(规则页)',
    mixinRuleKey: 'index_1',
    type: 'rule',
    title: 172,
    ruleIndex: '1',
    project: [1, 2],
    hideArea: []
  },
  {
    description: '荣誉殿堂(规则页)',
    mixinRuleKey: 'index_2',
    type: 'rule',
    title: 173,
    ruleIndex: '2',
    project: [1, 2],
    hideArea: []
  },
  {
    description: '家族赛(规则页)',
    mixinRuleKey: 'index_3',
    type: 'rule',
    title: 174,
    ruleIndex: '3',
    project: [1, 2],
    hideArea: ['TW']
  },
  {
    description: '公会赛(规则页)',
    mixinRuleKey: 'index_4',
    type: 'rule',
    title: 175,
    ruleIndex: '4',
    project: [1, 2],
    hideArea: ['TW']
  },
  {
    description: 'CP赛(规则页)',
    mixinRuleKey: 'index_5',
    type: 'rule',
    title: 176,
    ruleIndex: '5',
    project: [1, 2],
    hideArea: []
  },
  {
    description: '巅峰争霸赛(规则页)',
    mixinRuleKey: 'index_6',
    type: 'rule',
    title: 177,
    ruleIndex: '6',
    project: [1, 2],
    hideArea: []
  },
  {
    description: '家族赛(奖励页)',
    mixinRuleKey: 'index_7',
    type: 'reward',
    title: 174,
    ruleIndex: '7',
    tabIndex: 0,
    project: [1, 2],
    hideArea: ['TW'],
    children: [
      {
        description: '家族赛-日榜(奖励页-子tab1)',
        mixinRuleKey: 'index_8',
        type: 'reward',
        title: 180,
        ruleIndex: '8',
        project: [1, 2]
      },
      {
        description: '家族赛-总榜(奖励页-子tab2)',
        mixinRuleKey: 'index_9',
        type: 'reward',
        title: 181,
        ruleIndex: '9',
        project: [1, 2]
      }
    ]
  },
  {
    description: '公会赛(奖励页)',
    mixinRuleKey: 'index_10',
    type: 'reward',
    title: 175,
    ruleIndex: '10',
    tabIndex: 1,
    project: [1, 2],
    hideArea: ['TW'],
    children: [
      {
        description: '公会赛-阶段(奖励页-子tab1)',
        mixinRuleKey: 'index_11',
        type: 'reward',
        title:  178,
        ruleIndex: '11',
        project: [1, 2]
      },
      {
        description: '公会赛-决赛(奖励页-子tab2)',
        mixinRuleKey: 'index_12',
        type: 'reward',
        title: 179,
        ruleIndex: '12',
        project: [1, 2]
      }
    ]
  },
  {
    description: 'CP赛(奖励页)',
    mixinRuleKey: 'index_13',
    type: 'reward',
    title: 176,
    ruleIndex: '13',
    tabIndex: 2,
    project: [1, 2],
    hideArea: []
  },
  {
    description: '主播(奖励页)',
    mixinRuleKey: 'index_14',
    type: 'reward',
    title: 177,
    ruleIndex: '14',
    tabIndex: 3,
    project: [1, 2],
    hideArea: []
  },
  {
    description: 'King&Queen(奖励页)',
    mixinRuleKey: 'index_15',
    type: 'reward',
    title: 9,
    ruleIndex: '15',
    tabIndex: 4,
    project: [1, 2],
    hideArea: []
  }
]

export const getRuleConfig = (type, project) => {
  return ruleConfig.filter((c) => c.type === type && c.project.includes(project))
}

export const getSubTabs = (parentKey, project) => {
  const parent = ruleConfig.find((c) => c.mixinRuleKey === parentKey)
  if (!parent?.children) return []
  return parent.children.filter((c) => c.project.includes(project))
}

export const findByRuleIndex = (ruleIndex, project) => {
  let config = ruleConfig.find((c) => c.ruleIndex === ruleIndex && c.project.includes(project))

  if (!config) {
    for (const item of ruleConfig) {
      if (item.children) {
        config = item.children.find((c) => c.ruleIndex === ruleIndex && c.project.includes(project))
        if (config) break
      }
    }
  }

  if (!config) return null

  const list = getRuleConfig(config.type, project)
  const index = list.findIndex((c) => c.mixinRuleKey === config.mixinRuleKey)

  return index === -1 ? null : { config, index }
}
