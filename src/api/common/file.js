import request from "@/utils/request";
const baseURl = import.meta.env.VITE_SYSTEM_BASE_URL;

// 上传文件-列表
export const uploadList = params => {
  return request({
    url: `${baseURl}/common/upload`,
    method: "get",
    params,
  });
};

// 上传文件-上传
export const upload = data => {
  return request({
    url: `${baseURl}/common/upload`,
    method: "post",
    data,
  });
};

// 上传文件-删除
export const deleteUpload = id => {
  return request({
    url: `${baseURl}/common/upload/${id}`,
    method: "delete",
  });
};