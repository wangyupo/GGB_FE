<template>
  <!-- 登录日志 -->
  <div>
    <RhSearch :searchInfo="searchInfo" @search="handleSearch" />
    <RhTable
      border
      stripe
      :loading="loading"
      :table-data="tableData"
      @pageChange="fn_getList"
      @pageSizeChange="pageSizeChange"
    >
      <template #type="{ scope }">
        {{ getLabel(LOG_LoginTypeOptions, scope.row.type) }}
      </template>
      <template #operate="{ scope }">
        <el-button type="primary" link>操作</el-button>
      </template>
    </RhTable>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { initSearchData, getLabel } from "@/utils/index.js";
import { loginLogList } from "@/api/logManage/loginLog.js";
import { userList } from "@/api/systemManage/user.js";
import { LOG_LoginTypeOptions } from "@/enums/index.js";

// 条件配置
const searchForm = ref({});
const searchInfo = ref([
  {
    type: "select",
    label: "用户名",
    placeholder: "请选择用户名",
    key: "userId",
    defaultValue: "",
    options: [],
    props: { label: "userName", value: "id" },
    colSpan: 8,
  },
]);
// 表格配置
const tableData = reactive({
  showOverflowTooltip: true,
  columns: [
    { label: "序号", type: "index" },
    { label: "用户名", prop: "userName", width: "140px" },
    { label: "请求ip", prop: "ip", width: "120px" },
    { label: "用户代理（userAgent）", prop: "userAgent", minWidth: "120px" },
    { label: "操作类型", prop: "type", width: "120px" },
    { label: "记录时间", prop: "createdAt", dataType: "ISODate", width: "180px" },
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
  fn_userList();
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
  loginLogList(params)
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

// 获取所有用户
const fn_userList = () => {
  const params = { pageNumber: 1, pageSize: 999 };
  userList(params)
    .then(res => {
      if (res.code == 0) {
        searchInfo.value[0].options = res.data.list;
      }
    })
    .catch(() => {})
    .finally(() => {});
};
</script>

<style lang="scss" scoped></style>
