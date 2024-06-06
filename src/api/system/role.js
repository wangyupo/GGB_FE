import request from "@/utils/request";
const baseURl = import.meta.env.VITE_SYSTEM_BASE_URL;

export const roleList = params => {
  return request({
    url: `${baseURl}/system/role`,
    method: "get",
    params,
  });
};

export const addRole = data => {
  return request({
    url: `${baseURl}/system/role`,
    method: "post",
    data,
  });
};

export const updateRole = (id, data) => {
  return request({
    url: `${baseURl}/system/role/${id}`,
    method: "put",
    data,
  });
};

export const deleteRole = id => {
  return request({
    url: `${baseURl}/system/role/${id}`,
    method: "delete",
  });
};

export const changeStatus = data => {
  return request({
    url: `${baseURl}/system/role/changeStatus`,
    method: "post",
    data,
  });
};

export const assignMenu = data => {
  return request({
    url: `${baseURl}/system/role/assignMenu`,
    method: "post",
    data,
  });
};

export const assignUser = data => {
  return request({
    url: `${baseURl}/system/role/assignUser`,
    method: "post",
    data,
  });
};

export const unAssignUser = data => {
  return request({
    url: `${baseURl}/system/role/unAssignUser`,
    method: "post",
    data,
  });
};

export const getUserByRole = params => {
  return request({
    url: `${baseURl}/system/role/user`,
    method: "get",
    params,
  });
};
