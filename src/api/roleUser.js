import request from "@/utils/request";
const baseURl = import.meta.env.VITE_SYSTEM_BASE_URL;

export const getRoleUser = params => {
  return request({
    url: `${baseURl}/role/user`,
    method: "get",
    params,
  });
};

export const postRoleUser = data => {
  return request({
    url: `${baseURl}/role/user`,
    method: "post",
    data,
  });
};

export const deleteRoleUser = id => {
  return request({
    url: `${baseURl}/role/user/${id}`,
    method: "delete",
  });
};
