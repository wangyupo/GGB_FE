import request from "@/utils/request";
const baseURl = import.meta.env.VITE_SYSTEM_BASE_URL;

export const userList = params => {
  return request({
    url: `${baseURl}/system/user`,
    method: "get",
    params,
  });
};

export const addUser = data => {
  return request({
    url: `${baseURl}/system/user`,
    method: "post",
    data,
  });
};

export const updateUser = (id, data) => {
  return request({
    url: `${baseURl}/system/user/${id}`,
    method: "put",
    data,
  });
};

export const deleteUser = id => {
  return request({
    url: `${baseURl}/system/user/${id}`,
    method: "delete",
  });
};

export const resetPassword = id => {
  return request({
    url: `${baseURl}/system/user/resetPassword/${id}`,
    method: "put",
  });
};

export const changePassword = data => {
  return request({
    url: `${baseURl}/system/user/changePassword`,
    method: "post",
    data,
  });
};

export const changeStatus = data => {
  return request({
    url: `${baseURl}/system/user/changeStatus`,
    method: "post",
    data,
  });
};
