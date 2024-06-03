<template>
  <!-- 字典数据 -->
  <div>
    <RhSearch :searchInfo="searchInfo" :searchForm="searchForm" @search="handleSearch">
      <template #right-slot>
        <el-button type="primary" @click="showDialog">添加数据</el-button>
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
      </template>
    </RhTable>

    <AddDialog v-model="dialogVisible" title="自定义标题" width="700px" :data="dictData" @close="fn_getList" />
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { dictDataList } from "@/api/system/dictData.js";
import AddDialog from "./components/addDialog.vue";
import { useRoute } from "vue-router";

const route = useRoute();
const dictData = ref({});

/** 弹窗 START **/
const dialogVisible = ref(false); // 弹窗显示/隐藏

// 显示弹窗
const showDialog = row => {
  if (row) dictData.value = row;
  dialogVisible.value = true;
};
/** 弹窗 END **/

// 条件配置
const searchForm = ref({
  key: "",
});
const searchInfo = ref([
  {
    type: "input",
    placeholder: "请输入字典键",
    key: "key",
    value: "",
    colSpan: 4,
  },
]);
// 表格配置
const tableData = reactive({
  showOverflowTooltip: true,
  columns: [
    { label: "序号", type: "index" },
    { label: "字典键", prop: "key", width: "120px" },
    { label: "字典值", prop: "value", width: "120px" },
    { label: "字典项描述", prop: "description", minWidth: "120px" },
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
      categoryId: route.query.id,
      pageNumber: pageNumber ? pageNumber : tableData.pages.pageNumber,
      pageSize: tableData.pages.pageSize,
    },
    searchForm.value
  );
  dictDataList(params)
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
</script>

<style lang="scss" scoped></style>
