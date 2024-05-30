<template>
  <!-- 弹窗-添加角色 -->
  <el-dialog v-model="dialogVisible" v-bind="$attrs" @opened="opened" @closed="closed">
    <RhTable
      border
      stripe
      :loading="loading"
      :table-data="tableData"
      @pageChange="fn_getUser"
      @pageSizeChange="pageSizeChange"
      @selection-change="handleSelectionChange"
    >
      <template #status="{ scope }">
        <el-tag v-if="scope.row.status">启用</el-tag>
        <el-tag type="danger" v-else>已禁用</el-tag>
      </template>
    </RhTable>
    <template #footer>
      <el-button type="primary" @click="fn_postRoleUser">确认</el-button>
      <el-button @click="closed">取消</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { reactive, ref } from "vue";
import { postRoleUser } from "@/api/roleUser.js";
import { getUser } from "@/api/user.js";
import { ElMessage } from "element-plus";
import { useRoute } from "vue-router";

const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
  menu: {
    type: Array,
    default: () => [],
  },
});

const route = useRoute();

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
    { type: "selection" },
    { label: "序号", type: "index" },
    { label: "姓名", prop: "userName", width: "120px" },
    { label: "邮箱", prop: "email", minWidth: "120px" },
    { label: "状态", prop: "status", width: "80px" },
    { label: "添加时间", prop: "createdAt", minWidth: "120px" },
  ],
  data: [],
  pages: { total: 0, pageNumber: 1, pageSize: 10 },
});
const loading = ref(false);
const multipleSelection = ref([]);

// 条件查询
const handleSearch = params => {
  searchForm.value = params;
  fn_getUser(1);
};

// 列表查询
const fn_getUser = pageNumber => {
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
  fn_getUser(1);
};

// 多选表格行
const handleSelectionChange = val => {
  multipleSelection.value = val;
};

// 添加用户
const fn_postRoleUser = () => {
  const params = {
    role_id: parseInt(route.query.roleId),
    user_ids: multipleSelection.value.map(i => i.id),
  };
  postRoleUser(params)
    .then(res => {
      if (res.code == 200) {
        ElMessage({ type: "success", message: "添加成功！" });
        dialogVisible.value = false;
      }
    })
    .catch(() => {})
    .finally(() => {});
};

/** dialog START **/
const emits = defineEmits(["opened", "closed"]);
const dialogVisible = defineModel();

// 弹窗开启
const opened = () => {
  fn_getUser(1);
  emits("opened");
};

// 弹窗关闭
const closed = () => {
  resetData();
  emits("closed");
  dialogVisible.value = false;
};

// 重置数据
const resetData = () => {
  multipleSelection.value = [];
};
/** dialog END **/
</script>

<style lang="scss" scoped></style>
