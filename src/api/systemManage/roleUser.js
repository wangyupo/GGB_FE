import request from "@/utils/request";
const baseURl = import.meta.env.VITE_SYSTEM_BASE_URL;

export const getRoleUser = params => {
  return request({
    url: `${baseURl}/system/role/user`,
    method: "get",
    params,
  });
};

export const postRoleUser = data => {
  return request({
    url: `${baseURl}/system/role/user`,
    method: "post",
    data,
  });
};

export const deleteRoleUser = id => {
  return request({
    url: `${baseURl}/system/role/user/${id}`,
    method: "delete",
  });
};
