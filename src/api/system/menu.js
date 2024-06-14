import request from "@/utils/request";
const baseURl = import.meta.env.VITE_SYSTEM_BASE_URL;

export const menuList = params => {
  return request({
    url: `${baseURl}/system/menu`,
    method: "get",
    params,
  });
};

export const addMenu = data => {
  return request({
    url: `${baseURl}/system/menu`,
    method: "post",
    data,
  });
};

export const updateMenu = (id, data) => {
  return request({
    url: `${baseURl}/system/menu/${id}`,
    method: "put",
    data,
  });
};

export const deleteMenu = id => {
  return request({
    url: `${baseURl}/system/menu/${id}`,
    method: "delete",
  });
};

export const moveMenu = data => {
  return request({
    url: `${baseURl}/system/menu/move`,
    method: "post",
    data,
  });
};
