import request from "@/utils/request";
const baseURl = import.meta.env.VITE_SYSTEM_BASE_URL;

export const getDictData = params => {
  return request({
    url: `${baseURl}/dictData`,
    method: "get",
    params,
  });
};

export const postDictData = data => {
  return request({
    url: `${baseURl}/dictData`,
    method: "post",
    data,
  });
};

export const putDictData = (id, data) => {
  return request({
    url: `${baseURl}/dictData/${id}`,
    method: "put",
    data,
  });
};
