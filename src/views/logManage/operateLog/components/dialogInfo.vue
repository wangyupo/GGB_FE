<template>
  <!-- 弹窗-日志详情 -->
  <el-dialog v-model="dialogVisible" v-bind="$attrs" @opened="opened" @closed="closed">
    <el-descriptions :column="2">
      <el-descriptions-item label="请求地址">{{ data.path }}</el-descriptions-item>
      <el-descriptions-item label="请求人">{{ data.userName }}</el-descriptions-item>
      <el-descriptions-item label="IP地址">{{ data.ip }}</el-descriptions-item>
      <el-descriptions-item label="请求方式">{{ data.method }}</el-descriptions-item>
      <el-descriptions-item label="请求耗时" :span="2">{{ nsToMs(data.latency) }}毫秒</el-descriptions-item>
      <el-descriptions-item label="请求参数" :span="2">{{ data.body }}</el-descriptions-item>
      <el-descriptions-item label="返回参数" :span="2">{{ data.response }}</el-descriptions-item>
      <el-descriptions-item label="请求时间">{{ formatISODate(data.createdAt) }}</el-descriptions-item>
    </el-descriptions>
    <template #footer>
      <el-button @click="dialogVisible = false">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { formatISODate, nsToMs } from "@/utils/index.js";

/** 日志信息 START **/
const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
});
/** 日志信息 END **/

/** dialog START **/
const emits = defineEmits(["opened", "closed"]);
const dialogVisible = defineModel();

// 弹窗开启
const opened = () => {
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
