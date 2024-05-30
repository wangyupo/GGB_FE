import request from "@/utils/request";
const baseURl = import.meta.env.VITE_SYSTEM_BASE_URL;

export const getUser = params => {
  return request({
    url: `${baseURl}/user`,
    method: "get",
    params,
  });
};

export const postUser = data => {
  return request({
    url: `${baseURl}/user`,
    method: "post",
    data,
  });
};

export const putUser = (id, data) => {
  return request({
    url: `${baseURl}/user/${id}`,
    method: "put",
    data,
  });
};

export const deleteUser = id => {
  return request({
    url: `${baseURl}/user/${id}`,
    method: "delete",
  });
};

export const resetPwd = params => {
  return request({
    url: `${baseURl}/user/resetPwd`,
    method: "get",
    params,
  });
};

export const changePwd = data => {
  return request({
    url: `${baseURl}/user/changePwd`,
    method: "post",
    data,
  });
};
