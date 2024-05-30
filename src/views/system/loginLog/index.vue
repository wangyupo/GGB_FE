<template>
  <!-- 登录日志 -->
  <div>
    <RhSearch :searchInfo="searchInfo" :searchForm="searchForm" @search="handleSearch" />
    <RhTable
      border
      stripe
      :loading="loading"
      :table-data="tableData"
      @pageChange="fn_getList"
      @pageSizeChange="pageSizeChange"
    >
      <template #type="{ scope }">
        {{ scope.row.type == "1" ? "登录" : "登出" }}
      </template>
    </RhTable>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { getLoginLog } from "@/api/login.js";
import { getUser } from "@/api/user.js";

// 条件配置
const searchForm = ref({
  userId: "",
});
const searchInfo = ref([
  {
    type: "select",
    placeholder: "请选择用户",
    key: "userId",
    props: {
      label: "userName",
      value: "id",
    },
    options: [],
    colSpan: 4,
  },
]);
// 表格配置
const tableData = reactive({
  showOverflowTooltip: true,
  columns: [
    { label: "序号", type: "index" },
    { label: "用户名", prop: "userName", width: "120px" },
    { label: "IP地址", prop: "ip", width: "120px" },
    { label: "设备", prop: "device", width: "120px" },
    { label: "浏览器", prop: "browser", width: "120px" },
    { label: "动作", prop: "type", width: "120px" },
    { label: "操作时间", prop: "createdAt", minWidth: "120px" },
  ],
  data: [{ date: "2016-05-03", name: "index 示例数据" }],
  pages: { total: 0, pageNumber: 1, pageSize: 10 },
});
const loading = ref(false);

onMounted(() => {
  fn_getList();
  fn_getUser();
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
  getLoginLog(params)
    .then(res => {
      if (res.code == 200) {
        tableData.data = res.data;
        tableData.pages.total = res.total;
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

// 获取用户
const fn_getUser = () => {
  const params = {
    all: true,
  };
  getUser(params)
    .then(res => {
      if (res.code == 200) {
        searchInfo.value[0].options = res.data;
      }
    })
    .catch(() => {})
    .finally(() => {});
};
</script>

<style lang="scss" scoped></style>
