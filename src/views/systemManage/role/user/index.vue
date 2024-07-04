<template>
  <!-- 角色绑定用户 -->
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
        <el-button type="danger" link @click="handleCancel(scope.row)">取消绑定</el-button>
      </template>
    </RhTable>

    <!-- 弹窗-添加用户 -->
    <DialogUserList v-model="dialogVisible" title="添加用户" width="800px" @closed="fn_getList(1)" />
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { initSearchData, getLabel } from "@/utils/index.js";
import { StatusOptions } from "@/enums/index.js";
import { getUserByRole, unAssignUser } from "@/api/systemManage/role.js";
import { useRoute } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import DialogUserList from "./components/dialogUserList.vue";

/** 弹窗 START **/
const dialogVisible = ref(false); // 弹窗显示/隐藏

// 显示弹窗
const showDialog = () => {
  dialogVisible.value = true;
};
/** 弹窗 END **/

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
    { label: "序号", type: "index" },
    { label: "姓名", prop: "userName", width: "120px" },
    { label: "昵称", prop: "nickName", width: "120px" },
    { label: "邮箱", prop: "email", minWidth: "120px" },
    { label: "状态", prop: "status", width: "120px" },
    { label: "添加时间", prop: "createdAt", dataType: "ISODate", minWidth: "120px" },
    { label: "操作", prop: "operate", fixed: "right", width: "200px" },
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
  getUserByRole(route.query.sysRoleId, params)
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

// 取消绑定
const handleCancel = row => {
  ElMessageBox.confirm(`确认将 ${row.userName} 取消绑定该角色?`, "系统提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      loading.value = true;
      const params = {
        sysRoleId: parseInt(route.query.sysRoleId),
        sysUserIds: [row.id],
      };
      unAssignUser(params)
        .then(res => {
          if (res.code == 0) {
            ElMessage({ type: "success", message: `${row.userName} 取消绑定成功！` });
            fn_getList();
          }
        })
        .catch(() => {})
        .finally(() => {
          loading.value = false;
        });
    })
    .catch(() => {});
};
</script>

<style lang="scss" scoped></style>
