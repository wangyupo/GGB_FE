<template>
  <!-- Excel导入/导出 -->
  <div>
    <RhSearch :searchInfo="searchInfo" @search="handleSearch" />
    <div class="mb-3 flex justify-end">
      <el-button type="default" icon="Download" @click="handleDownloadTemplate">下载模板</el-button>
      <el-upload action="/api/common/excel" :show-file-list="false">
        <el-button class="mx-3" type="primary" icon="Upload" @click="handleAction">导入</el-button>
      </el-upload>
      <el-button type="primary" icon="Download" @click="handleExport">导出</el-button>
    </div>
    <RhTable
      border
      stripe
      :loading="loading"
      :table-data="tableData"
      @pageChange="fn_getList"
      @pageSizeChange="pageSizeChange"
    >
      <template #operate="{ scope }">
        <el-button type="primary" link>操作</el-button>
      </template>
    </RhTable>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { initSearchData, fileDownload } from "@/utils/index.js";
import { downloadTemplate, excelList, exportExcel } from "@/api/common/excel.js";

// 条件配置
const searchForm = ref({});
const searchInfo = ref([
  {
    type: "input",
    label: "姓名",
    placeholder: "请输入姓名",
    key: "name",
    defaultValue: "",
    colSpan: 8,
  },
]);
// 表格配置
const tableData = reactive({
  showOverflowTooltip: true,
  columns: [
    { label: "序号", type: "index" },
    { label: "姓名", prop: "name" },
    { label: "语文", prop: "language" },
    { label: "数学", prop: "math" },
    { label: "英语", prop: "english" },
    { label: "地理", prop: "geography" },
    { label: "政治", prop: "politics" },
    // { label: "操作", prop: "operate", fixed: "right", width: "200px" },
  ],
  data: [],
  pages: { total: 0, pageNumber: 1, pageSize: 10 },
});
const loading = ref(false); // 加载状态

// 组件挂载完成后执行
onMounted(() => {
  searchForm.value = initSearchData(searchInfo.value);
  fn_getList();
});

// 条件查询
const handleSearch = params => {
  searchForm.value = params;
  fn_getList(1);
};

// 列表查询
const fn_getList = pageNumber => {
  loading.value = true;
  const params = Object.assign(
    {
      pageNumber: pageNumber ? pageNumber : tableData.pages.pageNumber,
      pageSize: tableData.pages.pageSize,
    },
    searchForm.value
  );
  excelList(params)
    .then(res => {
      if (res.code == 0) {
        tableData.data = res.data.list;
        tableData.pages.total = res.data.total;
        tableData.pages.pageNumber = params.pageNumber;
      }
    })
    .finally(() => {
      loading.value = false;
    });
};

// 更变每页条数
const pageSizeChange = pageSize => {
  tableData.pages.pageSize = pageSize;
  fn_getList(1);
};

// 下载模板
const handleDownloadTemplate = () => {
  const params = {};
  downloadTemplate(params)
    .then(res => {
      fileDownload(res, "成绩单模板.xlsx");
    })
    .catch(() => {})
    .finally(() => {});
};

// 导出
const handleExport = () => {
  const params = {};
  exportExcel(params)
    .then(res => {
      fileDownload(res, "Excel导出示例.xlsx");
    })
    .catch(() => {})
    .finally(() => {});
};
</script>

<style lang="scss" scoped></style>
