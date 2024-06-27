<template>
  <!-- 业务说明 -->
  <div>
    <RhSearch :searchInfo="searchInfo" @search="handleSearch" />
    <div class="mb-3 flex justify-end">
      <el-upload action="/api/common/upload" :show-file-list="false" :on-success="handleSuccess">
        <el-button type="primary" icon="Plus" @click="handleAction">上传文件</el-button>
      </el-upload>
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
        <el-button type="danger" link :icon="Delete" @click="handleDel(scope.row)">删除</el-button>
      </template>
    </RhTable>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { initSearchData } from "@/utils/index.js";
import { uploadList, deleteUpload } from "@/api/common/file.js";
import { ElMessage, ElMessageBox } from "element-plus";

// 条件配置
const searchForm = ref({});
const searchInfo = ref([
  {
    type: "input",
    label: "文件名称",
    placeholder: "请输入文件名称",
    key: "fileName",
    defaultValue: "",
    colSpan: 8,
  },
]);
// 表格配置
const tableData = reactive({
  showOverflowTooltip: true,
  columns: [
    { label: "序号", type: "index" },
    { label: "文件名称", prop: "fileName", minWidth: "120px" },
    { label: "上传时间", prop: "createdAt", dataType: "ISODate", width: "180px" },
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
  uploadList(params)
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

// 删除文件
const handleDel = row => {
  ElMessageBox.confirm(`确认删除该文件?`, "系统提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      deleteUpload(row.id)
        .then(res => {
          if (res.code == 0) {
            ElMessage({ type: "success", message: `文件删除成功！` });
            fn_getList();
          }
        })
        .catch(() => {})
        .finally(() => {});
    })
    .catch(() => {});
};

// 上传文件成功
const handleSuccess = () => {
  fn_getList(1);
};
</script>

<style lang="scss" scoped></style>
