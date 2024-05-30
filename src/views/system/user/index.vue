<template>
  <!-- 用户管理 -->
  <div>
    <RhSearch :searchInfo="searchInfo" :searchForm="searchForm" @search="handleSearch">
      <template #right-slot>
        <el-button type="primary" @click="showDialog">添加用户</el-button>
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
      <template #status="{ scope }">
        <el-tag v-if="scope.row.status">启用</el-tag>
        <el-tag type="danger" v-else>已禁用</el-tag>
      </template>
      <template #operate="{ scope }">
        <el-button :type="scope.row.status ? 'danger' : 'primary'" link @click="handleChangeStatus(scope.row)">
          {{ scope.row.status ? "禁用" : "启用" }}
        </el-button>
        <el-button type="primary" link @click="showDialog(scope.row)">编辑</el-button>
        <el-button type="primary" link @click="handleResetPWD(scope.row)">重置密码</el-button>
        <el-button type="danger" link @click="handleDel(scope.row)">删除</el-button>
      </template>
    </RhTable>

    <AddDialog
      v-model="dialogVisible"
      :title="`${user.id ? '编辑' : '添加'}用户`"
      width="700px"
      :data="user"
      @close="fn_getList"
    />
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { getUser, putUser, resetPwd, deleteUser } from "@/api/user.js";
import AddDialog from "./components/addDialog.vue";
import { ElMessage, ElMessageBox } from "element-plus";

const user = ref({});

/** 弹窗 START **/
const dialogVisible = ref(false); // 弹窗显示/隐藏

// 显示弹窗
const showDialog = row => {
  user.value = row;
  dialogVisible.value = true;
};
/** 弹窗 END **/

// 条件配置
const searchForm = ref({
  userName: "",
  email: "",
});
const searchInfo = ref([
  {
    type: "input",
    placeholder: "请输入用户名",
    key: "userName",
    value: "",
    colSpan: 4,
  },
  {
    type: "input",
    placeholder: "请输入邮箱",
    key: "email",
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
    { label: "邮箱", prop: "email", minWidth: "120px" },
    { label: "状态", prop: "status", minWidth: "120px" },
    { label: "添加时间", prop: "createdAt", minWidth: "120px" },
    { label: "操作", prop: "operate", width: "240px" },
  ],
  data: [],
  pages: { total: 0, pageNumber: 1, pageSize: 10 },
});
const loading = ref(false);

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

// 启用/禁用
const handleChangeStatus = row => {
  const params = {
    status: !row.status,
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
};

// 重置密码
const handleResetPWD = row => {
  ElMessageBox.confirm(`确认重置${row.userName}的密码?`, "系统提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      const params = {
        id: row.id,
      };
      resetPwd(params)
        .then(res => {
          if (res.code == 200) {
            ElMessage({ type: "success", message: "密码重置成功！" });
          }
        })
        .catch(() => {})
        .finally(() => {});
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
</script>

<style lang="scss" scoped></style>
