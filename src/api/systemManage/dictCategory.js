import request from "@/utils/request";
const baseURl = import.meta.env.VITE_SYSTEM_BASE_URL;

export const dictCategoryList = params => {
  return request({
    url: `${baseURl}/system/dictCategory`,
    method: "get",
    params,
  });
};

export const addDictCategoryList = data => {
  return request({
    url: `${baseURl}/system/dictCategory`,
    method: "post",
    data,
  });
};

export const updateDictCategoryList = (id, data) => {
  return request({
    url: `${baseURl}/system/dictCategory/${id}`,
    method: "put",
    data,
  });
};

export const deleteDictCategoryList = id => {
  return request({
    url: `${baseURl}/system/dictCategory/${id}`,
    method: "delete",
  });
};
