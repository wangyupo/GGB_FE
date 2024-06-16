import request from "@/utils/request";
const baseURl = import.meta.env.VITE_SYSTEM_BASE_URL;

// 菜单管理-列表
export const menuList = params => {
  return request({
    url: `${baseURl}/system/menu`,
    method: "get",
    params,
  });
};

// 菜单管理-添加
export const addMenu = data => {
  return request({
    url: `${baseURl}/system/menu`,
    method: "post",
    data,
  });
};

// 菜单管理-编辑
export const updateMenu = (id, data) => {
  return request({
    url: `${baseURl}/system/menu/${id}`,
    method: "put",
    data,
  });
};

// 菜单管理-删除
export const deleteMenu = id => {
  return request({
    url: `${baseURl}/system/menu/${id}`,
    method: "delete",
  });
};

// 菜单管理-移动
export const moveMenu = data => {
  return request({
    url: `${baseURl}/system/menu/move`,
    method: "put",
    data,
  });
};
