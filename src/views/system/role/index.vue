<template>
  <!-- 角色管理 -->
  <div>
    <RhSearch :searchInfo="searchInfo" :searchForm="searchForm" @search="handleSearch">
      <template #right-slot>
        <el-button type="primary" @click="showDialog">添加角色</el-button>
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
        <el-button type="primary" link @click="handleSetUser(scope.row)">分配用户</el-button>
      </template>
    </RhTable>

    <AddDialog
      v-model="dialogVisible"
      :title="`${role.id ? '编辑' : '添加'}角色`"
      width="700px"
      :data="role"
      :menu="menu"
      @close="fn_getList"
    />
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { getRole, putRole, changeRoleStatus } from "@/api/role.js";
import { getMenu } from "@/api/menu.js";
import AddDialog from "./components/addDialog.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";

const router = useRouter();
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
  roleName: "",
  roleCode: "",
});
const searchInfo = ref([
  {
    type: "input",
    placeholder: "请输入角色名",
    key: "roleName",
    value: "",
    colSpan: 4,
  },
  {
    type: "input",
    placeholder: "请输入角色标识码",
    key: "roleCode",
    value: "",
    colSpan: 4,
  },
]);
// 表格配置
const tableData = reactive({
  showOverflowTooltip: true,
  columns: [
    { label: "序号", type: "index" },
    { label: "角色名", prop: "roleName", width: "120px" },
    { label: "角色标识码", prop: "roleCode", width: "120px" },
    { label: "角色状态", prop: "status", minWidth: "120px" },
    { label: "角色描述", prop: "description", minWidth: "120px" },
    { label: "操作", prop: "operate", width: "200px" },
  ],
  data: [],
  pages: { total: 0, pageNumber: 1, pageSize: 10 },
});
const loading = ref(false);

onMounted(() => {
  fn_getList();
  fn_getMenu();
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
  getRole(params)
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
    id: row.id,
    status: !row.status,
  };
  changeRoleStatus(params)
    .then(res => {
      if (res.code == 200) {
        ElMessage({ type: "success", message: `${row.roleName}${row.status ? "禁用" : "启用"}成功！` });
      }
    })
    .catch(() => {})
    .finally(() => {
      fn_getList();
    });
};

// 获取菜单
const fn_getMenu = () => {
  const params = {};
  getMenu(params)
    .then(res => {
      if (res.code == 200) {
        menu.value = res.data;
      }
    })
    .catch(() => {})
    .finally(() => {});
};

// 分配用户
const handleSetUser = row => {
  router.push({
    path: "/system/role/user",
    query: {
      roleId: row.id,
    },
  });
};
</script>

<style lang="scss" scoped></style>
