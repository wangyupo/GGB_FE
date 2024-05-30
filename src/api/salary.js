import request from "@/utils/request";
const baseURl = import.meta.env.VITE_SYSTEM_BASE_URL;

export const getSalary = params => {
  return request({
    url: `${baseURl}/salary`,
    method: "get",
    params,
  });
};

export const postSalary = data => {
  return request({
    url: `${baseURl}/salary`,
    method: "post",
    data,
  });
};

export const putSalary = (id, data) => {
  return request({
    url: `${baseURl}/salary/${id}`,
    method: "put",
    data,
  });
};

export const deleteSalary = id => {
  return request({
    url: `${baseURl}/salary/${id}`,
    method: "delete",
  });
};
