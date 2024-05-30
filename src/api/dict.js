import request from "@/utils/request";
const baseURl = import.meta.env.VITE_SYSTEM_BASE_URL;

export const getDict = params => {
  return request({
    url: `${baseURl}/dict`,
    method: "get",
    params,
  });
};

export const postDict = data => {
  return request({
    url: `${baseURl}/dict`,
    method: "post",
    data,
  });
};

export const putDict = (id, data) => {
  return request({
    url: `${baseURl}/dict/${id}`,
    method: "put",
    data,
  });
};

export const deleteDict = id => {
  return request({
    url: `${baseURl}/dict/${id}`,
    method: "delete",
  });
};
