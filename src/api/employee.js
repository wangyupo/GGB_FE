import request from "@/utils/request";
const baseURl = import.meta.env.VITE_SYSTEM_BASE_URL;

export const getEmployee = params => {
  return request({
    url: `${baseURl}/employee`,
    method: "get",
    params,
  });
};

export const postEmployee = data => {
  return request({
    url: `${baseURl}/employee`,
    method: "post",
    data,
  });
};

export const putEmployee = (id, data) => {
  return request({
    url: `${baseURl}/employee/${id}`,
    method: "put",
    data,
  });
};

export const deleteEmployee = id => {
  return request({
    url: `${baseURl}/employee/${id}`,
    method: "delete",
  });
};

export const deleteEmployeeMulti = params => {
  return request({
    url: `${baseURl}/employee`,
    method: "delete",
    params,
  });
};
