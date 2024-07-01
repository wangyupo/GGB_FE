<template>
  <!-- 角色管理 -->
  <div>
    <RhSearch :searchInfo="searchInfo" @search="handleSearch" />
    <div class="flex justify-end mb-3">
      <el-button type="primary" icon="Plus" @click="showDialog">添加角色</el-button>
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
        <el-switch
          v-model="scope.row.status"
          active-text="启用"
          inactive-text="禁用"
          :active-value="1"
          :inactive-value="0"
          @change="data => handleChangeStatus(data, scope.row)"
        />
      </template>
      <template #operate="{ scope }">
        <el-button type="primary" link icon="Edit" @click="showDialog(scope.row)">编辑角色</el-button>
        <el-button type="primary" link icon="Menu" @click="showAssignMenuDialog(scope.row)">分配菜单</el-button>
        <el-button type="primary" link icon="User" @click="handleSetUser(scope.row)">分配用户</el-button>
        <el-button type="primary" link icon="Edit" @click="handleDel(scope.row)">删除角色</el-button>
      </template>
    </RhTable>

    <!-- 弹窗-添加/编辑角色 -->
    <DialogOperateRole
      v-model="dialogVisible"
      :title="`${detail.id ? '编辑' : '添加'}角色`"
      width="700px"
      :data="detail"
      @close="fn_getList"
    />
    <!-- 弹窗-分配菜单 -->
    <DialogAssignMenu v-model="dialogAssignMenuVisible" title="分配菜单" width="700px" :data="detail" />
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { initSearchData } from "@/utils/index.js";
import { roleList, deleteRole, changeStatus } from "@/api/systemManage/role.js";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
import DialogOperateRole from "./components/dialogOperateRole.vue";
import DialogAssignMenu from "./components/dialogAssignMenu.vue";

const router = useRouter();
/** 弹窗 START **/
const dialogVisible = ref(false); // 弹窗显示/隐藏
const dialogAssignMenuVisible = ref(false); // 弹窗显示/隐藏
const detail = ref({});

// 显示弹窗
const showDialog = (row = {}) => {
  detail.value = row;
  dialogVisible.value = true;
};
const showAssignMenuDialog = (row = {}) => {
  detail.value = row;
  dialogAssignMenuVisible.value = true;
};
/** 弹窗 END **/

// 条件配置
const searchForm = ref({});
const searchInfo = ref([
  {
    type: "input",
    label: "角色名称",
    placeholder: "请输入角色名称",
    key: "roleName",
    defaultValue: "",
    colSpan: 8,
  },
]);
// 表格配置
const tableData = reactive({
  showOverflowTooltip: true,
  columns: [
    { label: "序号", type: "index" },
    { label: "角色名", prop: "roleName", width: "120px" },
    { label: "角色标识码", prop: "roleCode", width: "120px" },
    { label: "角色描述", prop: "description", minWidth: "120px" },
    { label: "角色状态", prop: "status", width: "160px" },
    { label: "操作", prop: "operate", width: "400px" },
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
  roleList(params)
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

// 启用/禁用
const handleChangeStatus = (status, row) => {
  const params = {
    status: status,
  };
  changeStatus(row.id, params)
    .then(res => {
      if (res.code == 0) {
        ElMessage({ type: "success", message: `角色 ${row.roleName} ${status == 1 ? "启用" : "禁用"}成功！` });
      }
    })
    .catch(() => {})
    .finally(() => {
      fn_getList();
    });
};

// 分配用户
const handleSetUser = row => {
  router.push({
    path: "/systemManage/role/user",
    query: { roleId: row.id },
  });
};

// 删除角色
const handleDel = row => {
  ElMessageBox.confirm(`确认删除角色 ${row.roleName}?`, "系统提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      const params = row.id;
      deleteRole(params)
        .then(res => {
          if (res.code == 0) {
            ElMessage({ type: "success", message: `角色 ${row.roleName} 删除成功！` });
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
