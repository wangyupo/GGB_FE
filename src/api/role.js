import request from "@/utils/request";
const baseURl = import.meta.env.VITE_SYSTEM_BASE_URL;

export const getRole = params => {
  return request({
    url: `${baseURl}/role`,
    method: "get",
    params,
  });
};

export const postRole = data => {
  return request({
    url: `${baseURl}/role`,
    method: "post",
    data,
  });
};

export const putRole = data => {
  return request({
    url: `${baseURl}/role`,
    method: "put",
    data,
  });
};

export const deleteRole = id => {
  return request({
    url: `${baseURl}/role/${id}`,
    method: "delete",
  });
};

export const changeRoleStatus = data => {
  return request({
    url: `${baseURl}/role/status`,
    method: "post",
    data,
  });
};