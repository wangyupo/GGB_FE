import request from "@/utils/request";
const baseURl = import.meta.env.VITE_SYSTEM_BASE_URL;

// 用户管理-列表
export const userList = params => {
  return request({
    url: `${baseURl}/system/user`,
    method: "get",
    params,
  });
};

// 用户管理-添加
export const addUser = data => {
  return request({
    url: `${baseURl}/system/user`,
    method: "post",
    data,
  });
};

// 用户管理-编辑
export const updateUser = (id, data) => {
  return request({
    url: `${baseURl}/system/user/${id}`,
    method: "put",
    data,
  });
};

// 用户管理-删除
export const deleteUser = id => {
  return request({
    url: `${baseURl}/system/user/${id}`,
    method: "delete",
  });
};

// 用户管理-重置密码
export const resetPassword = id => {
  return request({
    url: `${baseURl}/system/user/${id}/reset-password`,
    method: "patch",
  });
};

// 用户管理-修改密码
export const changePassword = data => {
  return request({
    url: `${baseURl}/system/user/password`,
    method: "patch",
    data,
  });
};

// 用户管理-修改状态
export const changeStatus = (id, data) => {
  return request({
    url: `${baseURl}/system/user/${id}/status`,
    method: "patch",
    data,
  });
};
