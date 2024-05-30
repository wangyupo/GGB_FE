<template>
  <!-- 工资 -->
  <div>
    <RhSearch :searchInfo="searchInfo" :searchForm="searchForm" @search="handleSearch">
      <template #right-slot>
        <el-button type="primary" @click="showDialog">添加工资条</el-button>
      </template>
    </RhSearch>
    <RhTable
      border
      stripe
      :loading="loading"
      :table-data="tableData"
      @pageChange="fn_getList"
      @pageSizeChange="pageSizeChange"
    >
      <template #operate="{ scope }">
        <el-button type="primary" link @click="handleEdit(scope.row)">编辑</el-button>
        <el-button type="danger" link @click="handleDel(scope.row)">删除</el-button>
      </template>
    </RhTable>
    <AddDialog
      v-model="dialogVisible"
      title="添加工资条"
      width="1200px"
      top="10vh"
      :close-on-click-modal="false"
      :data="salary"
      :employeesList
      @closed="fn_getList"
    />
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { getSalary, deleteSalary } from "@/api/salary.js";
import { getEmployee } from "@/api/employee.js";
import AddDialog from "./components/addDialog.vue";
import { ElMessage, ElMessageBox } from "element-plus";

const salary = ref({});
const employeesList = ref([]);

/** 弹窗 START **/
const dialogVisible = ref(false); // 弹窗显示/隐藏

// 显示弹窗
const showDialog = () => {
  if (employeesList.value.length == 0) {
    ElMessage({ type: "warning", message: "请先进入“员工管理”添加员工！" });
    return;
  }
  dialogVisible.value = true;
};
/** 弹窗 END **/

// 条件配置
const searchForm = ref({
  beginTime: "",
  endTime: "",
});
const searchInfo = ref([
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
    { label: "序号", type: "index" },
    { label: "发薪日", prop: "payday", width: "120px", fixed: "left" },
    { label: "姓名", prop: "name", width: "120px", fixed: "left" },
    { label: "基本工资", prop: "base_salary", width: "120px" },
    { label: "岗位工资", prop: "job_salary", width: "120px" },
    { label: "绩效奖金", prop: "performance", width: "120px" },
    { label: "项目奖励", prop: "project_reward", width: "120px" },
    { label: "加班工资", prop: "overtime_pay", width: "120px" },
    { label: "餐补", prop: "meal_sup", width: "120px" },
    { label: "交通补", prop: "transport_sup", width: "120px" },
    { label: "应发金额", prop: "salary_payable", width: "120px" },
    { label: "实发金额", prop: "salary_actual", width: "120px" },
    { label: "养老保险", prop: "pension_ins", width: "120px" },
    { label: "失业保险", prop: "unemployment_ins", width: "120px" },
    { label: "医疗保险", prop: "medical_ins", width: "120px" },
    { label: "住房公积金", prop: "housing_fund", width: "120px" },
    { label: "其它收入", prop: "other_income", width: "120px" },
    { label: "年终奖", prop: "year_end_bonus", width: "120px" },
    { label: "个人所得税", prop: "personal_tax", width: "120px", copy: true },
    { label: "说明", prop: "remark", minWidth: "120px" },
    { label: "操作", prop: "operate", width: "200px", fixed: "right" },
  ],
  data: [],
  pages: { total: 0, pageNumber: 1, pageSize: 10 },
});
const loading = ref(false);

onMounted(() => {
  fn_getList();
  fn_getEmployee();
});

// 条件查询
const handleSearch = params => {
  searchForm.value = params;
  fn_getList(1);
};

// 列表查询
const fn_getList = pageNumber => {
  salary.value = {};
  loading.value = true;
  const params = Object.assign(
    {
      pageNumber: pageNumber ? pageNumber : tableData.pages.pageNumber,
      pageSize: tableData.pages.pageSize,
    },
    searchForm.value
  );
  getSalary(params)
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

// 编辑
const handleEdit = row => {
  salary.value = row;
  dialogVisible.value = true;
};

// 删除
const handleDel = row => {
  ElMessageBox.confirm(`确认删除${row.payday}的工资条?`, "系统提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      deleteSalary(row.id)
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

// 获取员工列表
const fn_getEmployee = () => {
  const params = {
    all: true,
  };
  getEmployee(params)
    .then(res => {
      if (res.code == 200) {
        employeesList.value = res.data;
      }
    })
    .catch(() => {})
    .finally(() => {});
};
</script>

<style lang="scss" scoped></style>
