// 辅助函数：将 CSS 字符串转换为对象格式
// 用法：css`width: 1.6rem; height: 1.15rem; flex-shrink: 0;`
// 支持多行格式，会自动处理空白和换行
export const cssFormat = (strings: TemplateStringsArray, ...values: any[]) => {
  const cssText = strings.reduce((result, str, i) => {
    return result + str + (values[i] || "");
  }, "");

  const styles: Record<string, string> = {};

  // 处理多行 CSS，按分号分割，同时处理换行和空白
  cssText
    .replace(/\n/g, " ") // 将换行符替换为空格
    .split(";") // 按分号分割
    .map((s) => s.trim()) // 去除首尾空白
    .filter((s) => s && s.includes(":")) // 过滤空字符串和无效行
    .forEach((s) => {
      const colonIndex = s.indexOf(":");
      if (colonIndex > 0) {
        const prop = s.substring(0, colonIndex).trim();
        const value = s.substring(colonIndex + 1).trim();
        if (prop && value) {
          styles[prop] = value;
        }
      }
    });

  return styles;
};

