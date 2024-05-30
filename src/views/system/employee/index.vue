<template>
  <!-- 员工管理 -->
  <div>
    <RhSearch :searchInfo="searchInfo" :searchForm="searchForm" @search="handleSearch">
      <template #right-slot>
        <el-button type="primary" @click="showDialog">添加员工</el-button>
        <el-button type="danger" :disabled="!multipleSelection.length" @click="handleDelMulti">批量删除</el-button>
      </template>
    </RhSearch>
    <RhTable
      border
      stripe
      :loading="loading"
      :table-data="tableData"
      @pageChange="fn_getList"
      @pageSizeChange="pageSizeChange"
      @selection-change="handleSelectionChange"
    >
      <template #isWorking="{ scope }">
        {{ scope.row.isWorking ? "是" : "否" }}
      </template>
      <template #operate="{ scope }">
        <el-button type="primary" link @click="handleEdit(scope.row)">编辑</el-button>
        <el-button type="danger" link @click="handleDel(scope.row)">删除</el-button>
      </template>
    </RhTable>

    <!-- 弹窗-添加员工 -->
    <AddDialog
      v-model="dialogVisible"
      title="添加员工"
      width="1000px"
      :close-on-click-modal="false"
      :employee
      @close="fn_getList"
    />
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { getEmployee, deleteEmployee, deleteEmployeeMulti } from "@/api/employee.js";
import AddDialog from "./components/addDialog.vue";
import { ElMessage, ElMessageBox } from "element-plus";

const employee = ref({});

/** 弹窗 START **/
const dialogVisible = ref(false); // 弹窗显示/隐藏

// 显示弹窗
const showDialog = () => {
  dialogVisible.value = true;
};
/** 弹窗 END **/

// 条件配置
const searchForm = ref({
  name: "",
  beginTime: "",
  endTime: "",
});
const searchInfo = ref([
  {
    type: "input",
    placeholder: "请输入员工姓名",
    key: "name",
    value: "",
    colSpan: 4,
  },
  {
    type: "daterange",
    startPlaceholder: "开始日期",
    endPlaceholder: "结束日期",
    key: "time",
    startKey: "beginTime",
    endKey: "endTime",
    value: null,
    colSpan: 6,
  },
]);
// 表格配置
const tableData = reactive({
  showOverflowTooltip: true,
  columns: [
    { type: "selection" },
    { label: "序号", type: "index" },
    { label: "员工姓名", prop: "name", width: "160px" },
    { label: "邮箱", prop: "email", copy: true, minWidth: "160px" },
    { label: "电话号码", prop: "telephone", width: "160px" },
    { label: "生日", prop: "birthDate", width: "160px" },
    { label: "是否在职", prop: "isWorking", width: "120px" },
    { label: "操作", prop: "operate", width: "200px" },
  ],
  data: [],
  pages: { total: 0, pageNumber: 1, pageSize: 10 },
});
const loading = ref(false);
const multipleSelection = ref([]);

onMounted(() => {
  fn_getList();
});

// 条件查询
const handleSearch = params => {
  searchForm.value = params;
  fn_getList(1);
};

// 列表查询
const fn_getList = pageNumber => {
  employee.value = {};
  loading.value = true;
  const params = Object.assign(
    {
      pageNumber: pageNumber ? pageNumber : tableData.pages.pageNumber,
      pageSize: tableData.pages.pageSize,
    },
    searchForm.value
  );
  getEmployee(params)
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

// 多选表格行
const handleSelectionChange = val => {
  multipleSelection.value = val;
};

// 编辑员工
const handleEdit = row => {
  employee.value = row;
  dialogVisible.value = true;
};

// 删除员工
const handleDel = row => {
  ElMessageBox.confirm(`确认删除员工${row.name}?`, "系统提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      deleteEmployee(row.id)
        .then(res => {
          if (res.code == 200) {
            ElMessage({ type: "success", message: "删除成功！" });
            fn_getList();
          }
        })
        .catch(() => {})
        .finally(() => {});
    })
    .catch(() => {});
};

// 批量删除
const handleDelMulti = () => {
  ElMessageBox.confirm(`确认批量删除${multipleSelection.value.map(i => i.name).join("、")}的员工信息?`, "系统提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      const params = {
        ids: multipleSelection.value.map(i => i.id).join(","),
      };
      deleteEmployeeMulti(params)
        .then(res => {
          if (res.code == 200) {
            fn_getList();
            ElMessage({ type: "success", message: "删除成功！" });
          }
        })
        .catch(() => {})
        .finally(() => {});
    })
    .catch(() => {});
};
</script>

<style lang="scss" scoped></style>
