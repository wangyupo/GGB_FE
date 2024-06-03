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

export const updateRole = data => {
  return request({
    url: `${baseURl}/system/role`,
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

export const changeRoleStatus = data => {
  return request({
    url: `${baseURl}/system/role/status`,
    method: "post",
    data,
  });
};