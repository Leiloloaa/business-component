<template>
  <span class="replace">
    <template v-for="(item, index) in tokens" :key="index">
      <span v-if="item.type === 'text'">{{ item.value }}</span>
      <slot v-else :name="item.value"></slot>
    </template>
  </span>
</template>

<script lang="ts" setup name="Replace">
import { computed, useSlots } from 'vue'

type IToken = {
  type: 'text' | 'slot'
  value: string
}

const props = defineProps<{
  content: string | number
}>()

const slots = useSlots()

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const placeholderMap = computed<Record<string, string>>(() =>
  Object.keys(slots).reduce<Record<string, string>>((map, key) => {
    const upperKey = key.toUpperCase()
    ;[key, upperKey].forEach((placeholderKey) => {
      map[`%${placeholderKey}`] = key
      map[`${placeholderKey}%`] = key
      map[`%${placeholderKey}%`] = key
    })
    return map
  }, {})
)

const tokens = computed<Array<IToken>>(() => {
  const content = String(props.content || '')
  const placeholders = Object.keys(placeholderMap.value)
  if (!content || placeholders.length === 0) return [{ type: 'text', value: content }]

  const regexp = new RegExp(
    placeholders
      .sort((a, b) => b.length - a.length)
      .map(escapeRegExp)
      .join('|'),
    'g'
  )
  const result: Array<IToken> = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = regexp.exec(content))) {
    if (match.index > lastIndex) {
      result.push({ type: 'text', value: content.slice(lastIndex, match.index) })
    }
    result.push({ type: 'slot', value: placeholderMap.value[match[0]] })
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < content.length) {
    result.push({ type: 'text', value: content.slice(lastIndex) })
  }

  return result
})
</script>

<style lang="scss" scoped>
.replace {
  white-space: pre-line;
  word-break: break-word;
}
</style>
