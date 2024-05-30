/**
 * 工资格式化（显示值）
 * @param {string} value 工资
 * @returns 三位隔开的数字格式
 */
export function inputSalaryFormatter(value) {
  if (!value) return "";

  // 转化全角小数点为半角小数点
  let formatted = value.replace(/。/g, ".");

  // 如果输入以小数点开始，则在前面添加0
  if (formatted.charAt(0) === ".") {
    formatted = "0" + formatted;
  }

  // 格式化为千分位格式
  const parts = formatted.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  formatted = parts.join(".");

  return formatted;
}

/**
 * 工资格式化（返回值）
 * @param {string} value 工资
 * @returns 纯数字、小数点最多两位的字符串
 */
export function inputSalaryParser(value) {
  // 转化全角小数点为半角小数点
  let formatted = value.replace(/。/g, ".");

  // 匹配非数字和非点
  const invalidChars = /[^0-9.]/g;
  formatted = formatted.replace(invalidChars, "");

  // 限制只能有一个点
  if (formatted.split(".").length > 2) {
    formatted = formatted.slice(0, formatted.lastIndexOf("."));
  }

  // 限制小数点后不超过两位
  if (formatted.indexOf(".") !== -1) {
    const decimal = formatted.split(".").pop();

    if (decimal.length > 2) {
      formatted = `${formatted.slice(0, -1)}`;
    }
  }

  return formatted.replace(/,/g, "");
}

/**
 * 光标离开，金额补足两位小数
 */
export function onSalaryBlur(target, key) {
  if (!target || !key) return "";
  if (!target[key]) target[key] = 0;
  target[key] = parseFloat(target[key]).toFixed(2);
}
