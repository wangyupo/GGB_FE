import request from "@/utils/request";
const baseURl = import.meta.env.VITE_SYSTEM_BASE_URL;

export const login = data => {
  return request({
    url: `${baseURl}/login`,
    method: "post",
    data,
  });
};

export const logout = () => {
  return request({
    url: `${baseURl}/logout`,
    method: "get",
  });
};

export const getLoginLog = params => {
  return request({
    url: `${baseURl}/loginLog`,
    method: "get",
    params,
  });
};
