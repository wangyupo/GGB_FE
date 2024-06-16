/**
 * 业务需要的选项、单选、多选在这里维护，方便多页面同时使用、回显。
 * 注意：组件内使用 v3s-imdenums 命令，快速创建引入代码。
 */

// 状态（启用/禁用）
export const StatusOptions = [
  { label: "启用", value: "1" },
  { label: "禁用", value: "2" },
];

// 系统管理-菜单类型
export const SYS_MenuTypeOptions = [
  { label: "菜单", value: 1 },
  { label: "业务页面", value: 2 },
];

// 日志管理-登录类型
export const LOG_LoginTypeOptions = [
  { label: "登入", value: 1 },
  { label: "登出", value: 2 },
];
