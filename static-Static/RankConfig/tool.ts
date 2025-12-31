// 辅助函数：提取 CSS 字符串中的 width 和 height
// 支持单行和多行格式，只返回 width 和 height
// 用法：cssFormat('width: 1.6rem; height: 1.15rem;')
// 或：cssFormat(`
//   width: 1.6rem;
//   height: 1.15rem;
// `)
// 返回：{ width: '1.6rem', height: '1.15rem' }
export const cssFormat = (cssText: string) => {
  const styles: { width?: string; height?: string } = {};
  const widthMatch = cssText.match(/width:\s*([^;\n]+)/);
  const heightMatch = cssText.match(/height:\s*([^;\n]+)/);
  if (widthMatch) styles.width = widthMatch[1].trim();
  if (heightMatch) styles.height = heightMatch[1].trim();
  return styles;
};
