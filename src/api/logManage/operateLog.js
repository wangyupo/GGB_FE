import request from "@/utils/request";
const baseURl = import.meta.env.VITE_SYSTEM_BASE_URL;

// 请求日志-列表
export const operateLogList = params => {
  return request({
    url: `${baseURl}/log/operate`,
    method: "get",
    params,
  });
};
