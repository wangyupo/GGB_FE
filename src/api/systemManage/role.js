import request from "@/utils/request";
const baseURl = import.meta.env.VITE_SYSTEM_BASE_URL;

// 角色管理-列表
export const roleList = params => {
  return request({
    url: `${baseURl}/system/role`,
    method: "get",
    params,
  });
};

// 角色管理-添加
export const addRole = data => {
  return request({
    url: `${baseURl}/system/role`,
    method: "post",
    data,
  });
};

// 角色管理-更新
export const updateRole = (id, data) => {
  return request({
    url: `${baseURl}/system/role/${id}`,
    method: "put",
    data,
  });
};

// 角色管理-删除
export const deleteRole = id => {
  return request({
    url: `${baseURl}/system/role/${id}`,
    method: "delete",
  });
};

// 角色管理-启用/禁用
export const changeStatus = (id, data) => {
  return request({
    url: `${baseURl}/system/role/${id}/status`,
    method: "patch",
    data,
  });
};

// 角色管理-绑定菜单
export const assignMenu = data => {
  return request({
    url: `${baseURl}/system/role/menu`,
    method: "post",
    data,
  });
};

// 角色管理-绑定用户
export const assignUser = data => {
  return request({
    url: `${baseURl}/system/role/user`,
    method: "post",
    data,
  });
};

// 角色管理-解绑用户
export const unAssignUser = data => {
  return request({
    url: `${baseURl}/system/role/user`,
    method: "delete",
    data,
  });
};

// 角色管理-列表-获取角色绑定的用户
export const getUserByRole = params => {
  return request({
    url: `${baseURl}/system/role/user`,
    method: "get",
    params,
  });
};

// 角色管理-获取角色对应菜单
export const getMenuByRole = id => {
  return request({
    url: `${baseURl}/system/role/${id}/menu`,
    method: "get",
  });
};
