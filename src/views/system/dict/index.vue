<template>
  <!-- 数据字典 -->
  <div>
    <RhSearch :searchInfo="searchInfo" :searchForm="searchForm" @search="handleSearch">
      <template #right-slot>
        <el-button type="primary" @click="showDialog">添加字典</el-button>
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
        <el-button type="primary" link @click="showDialog(scope.row)">编辑</el-button>
        <el-button type="primary" link @click="handleList(scope.row)">列表</el-button>
        <el-button type="primary" link @click="handleDel(scope.row)">删除</el-button>
      </template>
    </RhTable>

    <AddDialog v-model="dialogVisible" title="添加字典" width="700px" :data="dict" @close="fn_getList" />
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { getDict, deleteDict } from "@/api/dict.js";
import AddDialog from "./components/addDialog.vue";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";

const router = useRouter();
const dict = ref({});

/** 弹窗 START **/
const dialogVisible = ref(false); // 弹窗显示/隐藏

// 显示弹窗
const showDialog = row => {
  if (row) dict.value = row;
  dialogVisible.value = true;
};
/** 弹窗 END **/

// 条件配置
const searchForm = ref({
  name: "",
});
const searchInfo = ref([
  {
    type: "input",
    placeholder: "请输入字典名称",
    key: "name",
    value: "",
    colSpan: 4,
  },
]);
// 表格配置
const tableData = reactive({
  showOverflowTooltip: true,
  columns: [
    { label: "序号", type: "index" },
    { label: "字典名称", prop: "name", width: "120px" },
    { label: "字典描述", prop: "description", minWidth: "120px" },
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
const fn_getList = pageNum => {
  loading.value = true;
  const params = Object.assign(
    {
      pageNum: pageNum ? pageNum : tableData.pages.pageNum,
      pageSize: tableData.pages.pageSize,
    },
    searchForm.value
  );
  getDict(params)
    .then(res => {
      if (res.code == 200) {
        tableData.data = res.data;
        tableData.pages.total = res.total;
        tableData.pages.pageNum = params.pageNum;
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

// 字典列表
const handleList = row => {
  router.push({
    path: "/system/dict/data",
    query: {
      id: row.id,
    },
  });
};

// 删除字典
const handleDel = row => {
  ElMessageBox.confirm(`确认删除${row.name}?`, "系统提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      deleteDict(row.id)
        .then(res => {
          if (res.code == 200) {
            ElMessage({ type: "success", message: `${row.name}删除成功！` });
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
