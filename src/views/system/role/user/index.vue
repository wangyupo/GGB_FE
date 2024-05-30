<template>
  <!-- 角色管理-分配用户 -->
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
        <el-button type="danger" link @click="handleDel(scope.row)">删除</el-button>
      </template>
    </RhTable>

    <AddDialog
      v-model="dialogVisible"
      :title="`${role.id ? '编辑' : '添加'}用户`"
      width="700px"
      :data="role"
      :menu="menu"
      @close="fn_getList"
    />
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { getRoleUser, deleteRoleUser } from "@/api/roleUser.js";
import AddDialog from "./components/addDialog.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRoute } from "vue-router";

const route = useRoute();
const role = ref({});
const menu = ref([]);

/** 弹窗 START **/
const dialogVisible = ref(false); // 弹窗显示/隐藏

// 显示弹窗
const showDialog = row => {
  role.value = row;
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
    placeholder: "请输入用户邮箱",
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
    { label: "用户名称", prop: "userName", width: "120px" },
    { label: "用户邮箱", prop: "email", minWidth: "120px" },
    { label: "操作", prop: "operate", width: "200px" },
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
      role_id: route.query.roleId,
      pageNumber: pageNumber ? pageNumber : tableData.pages.pageNumber,
      pageSize: tableData.pages.pageSize,
    },
    searchForm.value
  );
  getRoleUser(params)
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

// 删除用户
const handleDel = row => {
  ElMessageBox.confirm(`确认移除用户${row.userName}?`, "系统提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      deleteRoleUser(row.id)
        .then(res => {
          if (res.code == 200) {
            ElMessage({ type: "success", message: `用户${row.userName}移除成功！` });
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
