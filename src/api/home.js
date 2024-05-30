import request from "@/utils/request";
const baseURl = import.meta.env.VITE_SYSTEM_BASE_URL;

export const homeOverview = () => {
  return request({
    url: `${baseURl}/home/overview`,
    method: "get",
  });
};

export const salaryStruct = params => {
  return request({
    url: `${baseURl}/home/salaryStruct`,
    method: "get",
    params,
  });
};

export const currentYearOverview = params => {
  return request({
    url: `${baseURl}/home/currentYearOverview`,
    method: "get",
    params,
  });
};
