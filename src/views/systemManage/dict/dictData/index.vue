<template>
  <!-- 字典数据 -->
  <div>
    <RhSearch :searchInfo="searchInfo" @search="handleSearch" />
    <div class="flex justify-end mb-3">
      <el-button type="primary" icon="Plus" @click="showDialog">添加数据</el-button>
    </div>
    <RhTable
      border
      stripe
      :loading="loading"
      :table-data="tableData"
      @pageChange="fn_getList"
      @pageSizeChange="pageSizeChange"
    >
      <template #operate="{ scope }">
        <el-button type="primary" link icon="Edit" @click="showDialog(scope.row)">编辑</el-button>
        <el-button type="danger" link icon="Delete" @click="handleDelete(scope.row)">删除</el-button>
      </template>
    </RhTable>

    <!-- 弹窗-用途 -->
    <DialogOperate
      v-model="dialogVisible"
      :title="(detail.id ? '编辑' : '添加') + '数据'"
      width="700px"
      :data="detail"
      @closed="fn_getList"
    />
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { initSearchData } from "@/utils/index.js";
import { dictDataList, deleteDictData } from "@/api/systemManage/dictData.js";
import { useRoute } from "vue-router";
import DialogOperate from "./components/dialogOperate.vue";
import { ElMessage, ElMessageBox } from "element-plus";

/** 弹窗 START **/
const dialogVisible = ref(false); // 弹窗显示/隐藏
const detail = ref({});

// 显示弹窗
const showDialog = (row = {}) => {
  detail.value = row;
  dialogVisible.value = true;
};
/** 弹窗 END **/

const route = useRoute();
// 条件配置
const searchForm = ref({});
const searchInfo = ref([
  {
    type: "input",
    label: "字典键",
    placeholder: "请输入字典键",
    key: "label",
    defaultValue: "",
    colSpan: 8,
  },
]);
// 表格配置
const tableData = reactive({
  showOverflowTooltip: true,
  columns: [
    { label: "序号", type: "index" },
    { label: "字典键", prop: "label", width: "120px" },
    { label: "字典值", prop: "value", width: "120px" },
    { label: "字典项描述", prop: "description", minWidth: "120px" },
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
      categoryId: route.query.id,
      pageNumber: pageNumber ? pageNumber : tableData.pages.pageNumber,
      pageSize: tableData.pages.pageSize,
    },
    searchForm.value
  );
  dictDataList(params)
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

// 删除
const handleDelete = row => {
  ElMessageBox.confirm(`确认删除数据项 ${row.label}?`, "系统提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      const params = row.id;
      deleteDictData(params)
        .then(res => {
          if (res.code == 0) {
            ElMessage({ type: "success", message: `数据项 ${row.label} 删除成功！` });
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
