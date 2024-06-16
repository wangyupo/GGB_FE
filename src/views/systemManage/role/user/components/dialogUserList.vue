<template>
  <!-- 弹窗-用户列表 -->
  <el-dialog v-model="dialogVisible" v-bind="$attrs" @opened="opened" @closed="closed">
    <div>
      <RhSearch :searchInfo="searchInfo" @search="handleSearch" />
      <RhTable
        ref="tableRef"
        border
        stripe
        row-key="id"
        :loading="loading"
        :table-data="tableData"
        @pageChange="fn_getList"
        @pageSizeChange="pageSizeChange"
        @selection-change="handleSelectionChange"
      >
        <template #status="{ scope }">
          {{ getLabel(StatusOptions, scope.row.status) }}
        </template>
      </RhTable>
    </div>
    <template #footer>
      <el-button type="primary" @click="handleConfirm">确认</el-button>
      <el-button @click="dialogVisible = false">取消</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { reactive, ref } from "vue";
import { userList } from "@/api/systemManage/user.js";
import { assignUser } from "@/api/systemManage/role.js";
import { initSearchData, getLabel } from "@/utils/index.js";
import { StatusOptions } from "@/enums/index.js";
import { ElMessage } from "element-plus";
import { useRoute } from "vue-router";

/** 添加用户 START */
const route = useRoute();
// 条件配置
const searchForm = ref({});
const searchInfo = ref([
  {
    type: "input",
    placeholder: "请输入用户名",
    key: "userName",
    value: "",
    defaultValue: "",
    colSpan: 8,
  },
]);
// 表格配置
const tableData = reactive({
  showOverflowTooltip: true,
  columns: [
    { type: "selection" },
    // { label: "序号", type: "index" },
    { label: "姓名", prop: "userName", width: "120px" },
    { label: "昵称", prop: "nickName", width: "120px" },
    { label: "邮箱", prop: "email", minWidth: "120px" },
    { label: "状态", prop: "status", width: "120px" },
    { label: "添加时间", prop: "createdAt", dataType: "ISODate", minWidth: "160px" },
  ],
  data: [],
  pages: { total: 0, pageNumber: 1, pageSize: 10 },
});
const loading = ref(false); // 加载状态
const multipleSelection = ref([]);
const tableRef = ref();

// 条件查询
const handleSearch = params => {
  searchForm.value = params;
  fn_getList(1);
};

// 列表查询
const fn_getList = async pageNumber => {
  loading.value = true;
  const params = Object.assign(
    {
      pageNumber: pageNumber ? pageNumber : tableData.pages.pageNumber,
      pageSize: tableData.pages.pageSize,
    },
    searchForm.value
  );
  await userList(params)
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

// 多选表格行
const handleSelectionChange = val => {
  multipleSelection.value = val;
};

// 添加用户
const handleConfirm = () => {
  const params = {
    roleId: parseInt(route.query.roleId),
    userIds: multipleSelection.value.map(i => i.id),
  };
  assignUser(params)
    .then(res => {
      if (res.code == 0) {
        ElMessage({ type: "success", message: `用户添加成功！` });
        dialogVisible.value = false;
      }
    })
    .catch(() => {})
    .finally(() => {});
};
/** 添加用户 END */

/** dialog START **/
const emits = defineEmits(["opened", "closed"]);
const dialogVisible = defineModel();

// 弹窗开启
const opened = () => {
  searchForm.value = initSearchData(searchInfo.value);
  fn_getList();
  emits("opened");
};

// 弹窗关闭
const closed = () => {
  resetData();
  emits("closed");
  dialogVisible.value = false;
};

// 重置数据
const resetData = () => {};
/** dialog END **/
</script>

<style lang="scss" scoped></style>
