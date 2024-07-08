import request from "@/utils/request";
const baseURl = import.meta.env.VITE_SYSTEM_BASE_URL;

// Excel导入/导出-列表
export const excelList = params => {
  return request({
    url: `${baseURl}/common/excel`,
    method: "get",
    params,
  });
};

// Excel导入/导出-下载模板
export const downloadTemplate = () => {
  return request({
    url: `${baseURl}/common/excel/template`,
    method: "get",
    responseType: "blob"
  });
};

// Excel导入/导出-导入
export const ImportExcel = params => {
  return request({
    url: `${baseURl}/common/excel/import`,
    method: "POST",
    params,
  });
};

// Excel导入/导出-导出
export const exportExcel = params => {
  return request({
    url: `${baseURl}/common/excel/export`,
    method: "get",
    params,
    responseType: "blob"
  });
};
