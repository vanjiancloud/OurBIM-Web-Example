// rgba字符串转换成数组 并且0-255范围数据转换为0-1范围
export function rgbaToArray(rgbaString) {
  // 处理非字符串或 null/undefined 输入
  if (typeof rgbaString !== 'string' || rgbaString === null) {
    return null;
  }
  // 正则匹配 RGBA/ RGB 格式（支持空格、小数 alpha）
  const regex = /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)/i;
  const matches = rgbaString.match(regex);
  if (!matches) {
    return null;
  }
  // 提取并转换数值（alpha 缺失时默认 1）
  const [, r, g, b, a = 1] = matches;
  // 归一化处理 RGB 值（除以 255）
  return [
    Math.max(0, Math.min(1, Number(r) / 255)),
    Math.max(0, Math.min(1, Number(g) / 255)),
    Math.max(0, Math.min(1, Number(b) / 255)),
    Math.max(0, Math.min(1, Number(a))) // Alpha 已经是 0-1 范围，无需处理
  ];
}

// 255范围字符串数组转换为rgba格式（参数示例：["255.0", "255.0", "255.0", "255.0"] → "rgba(255,255,255,1.00)"）
export function array255ToRgba(arr) {
  // 处理非数组、null、undefined或长度不足的情况
  if (!Array.isArray(arr) || arr.length < 4) {
    return 'rgba(255, 255, 255, 1.00)';
  }

  // 解构数组并设置255范围的默认值
  let [r = 255, g = 255, b = 255, a = 255] = arr;

  // 验证数值有效性（复用现有验证逻辑）
  const isValidNumber = (num) => !isNaN(parseFloat(num)) && isFinite(num);
  if (!isValidNumber(r) || !isValidNumber(g) || !isValidNumber(b) || !isValidNumber(a)) {
    return 'rgba(255, 255, 255, 1.00)';
  }

  // 转换并限制数值范围（0-255）
  const clamp = (num, min, max) => Math.max(min, Math.min(max, num));
  const rNum = clamp(Math.round(parseFloat(r)), 0, 255);
  const gNum = clamp(Math.round(parseFloat(g)), 0, 255);
  const bNum = clamp(Math.round(parseFloat(b)), 0, 255);
  const aNum = clamp(parseFloat(a), 0, 255) / 255; // 转换为0-1范围的alpha

  // 生成格式化的rgba字符串（保留两位小数）
  return `rgba(${rNum}, ${gNum}, ${bNum}, ${aNum.toFixed(2)})`;
}

export function arrayToRgba(arr) {
  // 处理非数组、null、undefined或空数组
  if (!Array.isArray(arr) || arr.length === 0) {
    return 'rgba(255, 255, 255, 1.00)';
  }
  // 解构数组并设置默认值（改为0-1范围的默认值）
  let [r = 1, g = 1, b = 1, a = 1] = arr;
  // 验证每个值是否为有效数字
  const isValidNumber = (num) =>
    !isNaN(parseFloat(num)) && isFinite(num);
  // 如果任何颜色分量无效，则使用默认白色
  if (!isValidNumber(r) || !isValidNumber(g) || !isValidNumber(b) || !isValidNumber(a)) {
    return 'rgba(255, 255, 255, 1.00)';
  }
  // 验证并修正数值范围，同时转换为0-255整数
  const clamp = (num, min, max) => Math.max(min, Math.min(max, num));
  r = clamp(Math.round(parseFloat(r) * 255), 0, 255);
  g = clamp(Math.round(parseFloat(g) * 255), 0, 255);
  b = clamp(Math.round(parseFloat(b) * 255), 0, 255);
  a = clamp(parseFloat(a), 0, 1);
  // 生成格式化的RGBA字符串
  return `rgba(${r}, ${g}, ${b}, ${a.toFixed(2)})`;
}
// 颜色数组变rgba 
// 参数例如["173.68235294117648", "13.054901960784314", "13.054901960784314", "255.0"] => rgba(173.68235294117648,13.054901960784314,13.054901960784314,1)
export function arrToRgb(arr) {
  if (!arr || !arr.length) return null
  return `rgba(${Number(arr[0])},${Number(arr[1])},${Number(arr[2])},${Number(arr[3]) / 255})`
}
// 去掉rgba,去掉空格 参数例如rgba(17, 162, 10, 1) => '17,162,10,1'
export function formatColor(color) {
  return color && color.slice(5, color.length - 1).replace(/\s*/g, '') || ''
}