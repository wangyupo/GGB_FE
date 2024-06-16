import request from "@/utils/request";
const baseURl = import.meta.env.VITE_SYSTEM_BASE_URL;

export const dictDataList = params => {
  return request({
    url: `${baseURl}/system/dictData`,
    method: "get",
    params,
  });
};

export const addDictData = data => {
  return request({
    url: `${baseURl}/system/dictData`,
    method: "post",
    data,
  });
};

export const updateDictData = (id, data) => {
  return request({
    url: `${baseURl}/system/dictData/${id}`,
    method: "put",
    data,
  });
};

export const deleteDictData = id => {
  return request({
    url: `${baseURl}/system/dictData/${id}`,
    method: "delete",
  });
};
