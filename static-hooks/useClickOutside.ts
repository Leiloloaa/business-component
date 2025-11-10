import { onMounted, onUnmounted, Ref } from 'vue'

/**
 * 监听全局点击，若点击目标不在 `.que` 元素内，则关闭传入的 queToast 状态。
 * @param queToast - 受控的显示状态 ref<boolean>
 * @param rootSelector - 根元素选择器，默认使用 `.que`
 */
export default function useClickOutsideQueToast(
  queToast: Ref<boolean>,
  rootSelector: string = '.que'
) {
  const handleClickOutside = (event: Event) => {
    const target = event.target as HTMLElement
    const queElement = document.querySelector(rootSelector)
    if (queElement && !queElement.contains(target)) {
      queToast.value = false
    }
  }

  onMounted(() => {
    document.addEventListener('click', handleClickOutside)
  })

  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })
}
