import request from "@/utils/request";
const baseURl = import.meta.env.VITE_SYSTEM_BASE_URL;

// 登录日志-列表
export const loginLogList = params => {
  return request({
    url: `${baseURl}/log/login`,
    method: "get",
    params,
  });
};

export const exportLoginLog = params => {
  return request({
    url: `${baseURl}/log/login/excel`,
    method: "get",
    params,
    responseType: "blob",
  });
};
