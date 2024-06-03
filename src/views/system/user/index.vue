<template>
  <!-- 业务说明 -->
  <div>
    <RhSearch :searchInfo="searchInfo" @search="handleSearch" />
    <div class="flex justify-end mb-3">
      <el-button type="primary" icon="Plus" @click="showDialog">添加用户</el-button>
    </div>
    <RhTable
      border
      stripe
      :loading="loading"
      :table-data="tableData"
      @pageChange="fn_getList"
      @pageSizeChange="pageSizeChange"
    >
      <template #status="{ scope }">
        {{ getLabel(StatusOptions, scope.row.status) }}
      </template>
      <template #operate="{ scope }">
        <el-button type="primary" link @click="showDialog(scope.row)">编辑</el-button>
        <el-button type="primary" link @click="handleResetPWD(scope.row)">重置密码</el-button>
        <el-button :type="scope.row.status == 1 ? 'warning' : 'primary'" link @click="handleChangeStatus(scope.row)">
          {{ scope.row.status == 1 ? "禁用" : "启用" }}
        </el-button>
        <el-button type="danger" link @click="handleDel(scope.row)">删除</el-button>
      </template>
    </RhTable>

    <DialogOperate
      v-model="dialogVisible"
      :title="`${detail.id ? '编辑' : '添加'}用户`"
      width="700px"
      :data="detail"
      @close="fn_getList"
    />
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { initSearchData, getLabel } from "@/utils/index.js";
import { getUser, putUser, resetPassword, deleteUser } from "@/api/system/user.js";
import { StatusOptions } from "@/enums/index.js";
import { ElMessage, ElMessageBox } from "element-plus";
import DialogOperate from "./components/dialogOperate.vue";

/** 弹窗 START **/
const dialogVisible = ref(false); // 弹窗显示/隐藏
const detail = ref({});

// 显示弹窗
const showDialog = (row = {}) => {
  detail.value = row;
  dialogVisible.value = true;
};
/** 弹窗 END **/

// 条件配置
const searchForm = ref({});
const searchInfo = ref([
  {
    type: "input",
    placeholder: "请输入用户名",
    key: "userName",
    value: "",
    colSpan: 4,
  },
]);
// 表格配置
const tableData = reactive({
  showOverflowTooltip: true,
  columns: [
    { label: "序号", type: "index" },
    { label: "姓名", prop: "userName", width: "120px" },
    { label: "昵称", prop: "nickName", width: "120px" },
    { label: "邮箱", prop: "email", minWidth: "120px" },
    { label: "状态", prop: "status", minWidth: "120px" },
    { label: "添加时间", prop: "createdAt", dataType: "date", minWidth: "120px" },
    { label: "操作", prop: "operate", width: "240px" },
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
  getUser(params)
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

// 重置密码
const handleResetPWD = row => {
  ElMessageBox.confirm(`确认重置${row.userName}的密码?`, "系统提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      const params = row.id;
      resetPassword(params)
        .then(res => {
          if (res.code == 0) {
            ElMessage({ type: "success", message: "密码重置成功！" });
          }
        })
        .catch(() => {})
        .finally(() => {});
    })
    .catch(() => {});
};

// 启用/禁用
const handleChangeStatus = row => {
  ElMessageBox.confirm(`确认${row.status == 1 ? "禁用" : "启用"}用户 ${row.userName}??`, "系统提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      const params = {
        status: row.status == 1 ? 2 : 1,
      };
      putUser(row.id, params)
        .then(res => {
          if (res.code == 200) {
            ElMessage({ type: "success", message: `${row.userName}${row.status ? "禁用" : "启用"}成功！` });
          }
        })
        .catch(() => {})
        .finally(() => {
          fn_getList();
        });
    })
    .catch(() => {});
};

// 删除用户
const handleDel = row => {
  ElMessageBox.confirm(`确认删除用户${row.userName}?`, "系统提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      const params = {};
      deleteUser(row.id)
        .then(res => {
          if (res.code == 0) {
            ElMessage({ type: "success", message: "删除成功！" });
            fn_getList();
          }
        })
        .catch(() => {})
        .finally(() => {});
    })
    .catch(() => {});
};
</script>

<style lang="scss" scoped></style>
