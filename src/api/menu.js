import request from "@/utils/request";
const baseURl = import.meta.env.VITE_SYSTEM_BASE_URL;

export const getMenu = params => {
  return request({
    url: `${baseURl}/menu`,
    method: "get",
  });
};

export const postMenu = data => {
  return request({
    url: `${baseURl}/menu`,
    method: "post",
    data,
  });
};

export const putMenu = (id, data) => {
  return request({
    url: `${baseURl}/menu/${id}`,
    method: "put",
    data,
  });
};

export const deleteMenu = id => {
  return request({
    url: `${baseURl}/menu/${id}`,
    method: "delete",
  });
};

export const moveMenu = data => {
  return request({
    url: `${baseURl}/menu/move`,
    method: "post",
    data,
  });
};

export const getMenuByRole = params => {
  return request({
    url: `${baseURl}/menu/role`,
    method: "get",
    params,
  });
};
