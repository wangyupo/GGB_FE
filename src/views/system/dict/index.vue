<template>
  <!-- 字典管理 -->
  <div>
    <RhSearch :searchInfo="searchInfo" @search="handleSearch" />
    <div class="flex justify-end mb-3">
      <el-button type="primary" icon="Plus" @click="showDialog">添加字典</el-button>
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
        <el-button type="primary" link icon="Coin" @click="handleList(scope.row)">数据</el-button>
        <el-button type="primary" link icon="Delete" @click="handleDel(scope.row)">删除</el-button>
      </template>
    </RhTable>

    <!-- 弹窗-添加/编辑字典 -->
    <DialogOperate
      v-model="dialogVisible"
      :title="(detail.id ? '编辑' : '添加') + '字典'"
      width="700px"
      :data="detail"
      @close="fn_getList"
    />
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { initSearchData } from "@/utils/index.js";
import { dictCategoryList, deleteDictCategoryList } from "@/api/system/dictCategory.js";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import DialogOperate from "./components/dialogOperate.vue";

const router = useRouter();
/** 弹窗 START **/
const dialogVisible = ref(false); // 弹窗显示/隐藏
const detail = ref({});

// 显示弹窗
const showDialog = row => {
  if (row) detail.value = row;
  dialogVisible.value = true;
};
/** 弹窗 END **/

// 条件配置
const searchForm = ref({});
const searchInfo = ref([
  {
    type: "input",
    label: "字典名称",
    placeholder: "请输入字典名称",
    key: "label",
    defaultValue: "",
    colSpan: 8,
  },
  {
    type: "input",
    label: "字典编码",
    placeholder: "请输入字典编码",
    key: "labelCode",
    defaultValue: "",
    colSpan: 8,
  },
]);
// 表格配置
const tableData = reactive({
  showOverflowTooltip: true,
  columns: [
    { label: "序号", type: "index" },
    { label: "字典名称", prop: "label", width: "120px" },
    { label: "字典编码", prop: "labelCode", width: "120px" },
    { label: "字典描述", prop: "description", minWidth: "120px" },
    { label: "操作", prop: "operate", fixed: "right", width: "260px" },
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
  dictCategoryList(params)
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

// 删除字典
const handleDel = row => {
  ElMessageBox.confirm(`确认删除字典 ${row.label}?`, "系统提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      deleteDictCategoryList(row.id)
        .then(res => {
          if (res.code == 0) {
            ElMessage({ type: "success", message: `字典 ${row.label} 删除成功！` });
            fn_getList();
          }
        })
        .catch(() => {})
        .finally(() => {});
    })
    .catch(() => {});
};

// 字典列表
const handleList = row => {
  router.push({
    path: "/system/dict/data",
    query: { id: row.id },
  });
};
</script>

<style lang="scss" scoped></style>
