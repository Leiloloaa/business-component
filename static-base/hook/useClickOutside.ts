/**
 * 使用示例：
 *
 * import useClickOutsideQueToast from '@/static-hooks/useClickOutside'
 *
 * // 在组件中使用
 * const queToast = ref(false)
 *
 * // 使用默认选择器 '.que'
 * useClickOutsideQueToast(queToast)
 *
 * // 或使用自定义选择器
 * useClickOutsideQueToast(queToast, '.custom-selector')
 *
 * 说明：
 * - 该 hook 用于监听全局点击事件
 * - 当点击目标不在指定元素内时，自动关闭状态
 * - 默认监听 `.que` 元素，可通过第二个参数自定义
 * - 组件卸载时自动清理事件监听器
 *
 * 参数：
 * - queToast: Ref<boolean> - 受控的显示状态，点击外部时会设置为 false
 * - rootSelector: string - 根元素选择器，默认为 '.que'
 */
import { onMounted, onUnmounted, Ref } from "vue";

/**
 * 监听全局点击，若点击目标不在 `.que` 元素内，则关闭传入的 queToast 状态。
 * @param queToast - 受控的显示状态 ref<boolean>
 * @param rootSelector - 根元素选择器，默认使用 `.que`
 */
export default function useClickOutsideQueToast(
  queToast: Ref<boolean>,
  rootSelector: string = ".que"
) {
  const handleClickOutside = (event: Event) => {
    const target = event.target as HTMLElement;
    const queElement = document.querySelector(rootSelector);
    if (queElement && !queElement.contains(target)) {
      queToast.value = false;
    }
  };

  onMounted(() => {
    document.addEventListener("click", handleClickOutside);
  });

  onUnmounted(() => {
    document.removeEventListener("click", handleClickOutside);
  });
}
