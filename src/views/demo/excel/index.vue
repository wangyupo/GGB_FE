<template>
  <!-- Excel导入/导出 -->
  <div>
    <RhSearch :searchInfo="searchInfo" @search="handleSearch" />
    <div class="mb-3 flex justify-end">
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
import { initSearchData,fileDownload } from "@/utils/index.js";
import { exportLoginLog } from "@/api/logManage/loginLog.js";

// 条件配置
const searchForm = ref({});
const searchInfo = ref([
  {
    type: "input",
    label: "名称",
    placeholder: "请输入名称",
    key: "name",
    defaultValue: "",
    colSpan: 8,
  },
  {
    type: "select",
    label: "类型",
    placeholder: "请选择类型",
    key: "type",
    defaultValue: "",
    options: [
      { value: "1", label: "选项一" },
      { value: "2", label: "选项二" },
    ],
    colSpan: 8,
  },
]);
// 表格配置
const tableData = reactive({
  showOverflowTooltip: true,
  columns: [
    { label: "序号", type: "index" },
    { label: "日期", prop: "date", minWidth: "120px" },
    { label: "姓名", prop: "name", width: "120px" },
    { label: "操作", prop: "operate", fixed: "right", width: "200px" },
  ],
  data: [],
  pages: { total: 0, pageNumber: 1, pageSize: 10 },
});
const loading = ref(false); // 加载状态

// 组件挂载完成后执行
onMounted(() => {
  // searchForm.value = initSearchData(searchInfo.value);
  // fn_getList();
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
  getList(params)
    .then(res => {
      if (res.code == 200) {
        tableData.data = res.data.rows;
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

// 导出
const handleExport = () => {
  const params = {}
  exportLoginLog(params)
    .then(res => {
      fileDownload(res, "1.xlsx")
    })
    .catch(() => {})
    .finally(() => {});
};
</script>

<style lang="scss" scoped></style>
