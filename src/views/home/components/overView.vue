<template>
  <!-- 概览 -->
  <div class="flex">
    <!-- 总收入=工资累计+年终奖累计+住房公积金累计+额外收入累计 -->
    <RhWrapper title="总收入（税后）" class="flex-1 bg-white">
      <template #title-right>
        <el-tag>元</el-tag>
      </template>
      <div class="flex justify-between">
        <div class="text-3xl">{{ numberFormat(overview.sum_total?.total) }}元</div>
      </div>
      <div class="flex justify-between mt-6">
        <div>累计月数</div>
        <div>{{ numberFormat(overview.sum_total?.month_count) }}个月</div>
      </div>
    </RhWrapper>
    <RhWrapper title="工资累计（税后）" class="flex-1 ml-3 bg-white">
      <template #title-right>
        <el-tag>元</el-tag>
      </template>
      <div class="flex justify-between">
        <div class="text-3xl">{{ numberFormat(overview.salary_total?.total) }}元</div>
      </div>
      <div class="flex justify-between mt-6">
        <div>累计月数</div>
        <div>{{ numberFormat(overview.salary_total?.month_count) }}个月</div>
      </div>
    </RhWrapper>
    <RhWrapper title="年终奖累计" class="flex-1 ml-3 bg-white">
      <template #title-right>
        <el-tag>元</el-tag>
      </template>
      <div class="flex justify-between">
        <div class="text-3xl">{{ numberFormat(overview.year_end_bonus_total?.total) }}元</div>
      </div>
      <div class="flex justify-between mt-6">
        <div>累计年数</div>
        <div>{{ numberFormat(overview.year_end_bonus_total?.year_count) }}年</div>
      </div>
    </RhWrapper>
    <RhWrapper title="住房公积金累计" class="flex-1 ml-3 bg-white">
      <template #title-right>
        <el-tag>元</el-tag>
      </template>
      <div class="flex justify-between">
        <div class="text-3xl">{{ numberFormat(overview.housing_fund_total?.total) }}元</div>
      </div>
      <div class="flex justify-between mt-6">
        <div>累计月数</div>
        <div>{{ numberFormat(overview.housing_fund_total?.month_count) }}个月</div>
      </div>
    </RhWrapper>
  </div>
</template>

<script setup>
import { numberFormat } from "@/utils/index.js";
import { homeOverview } from "@/api/home.js";
import { onMounted, ref } from "vue";

const overview = ref({});

onMounted(() => {
  fn_homeOverview();
});

// 获取数据
const fn_homeOverview = () => {
  const params = {};
  homeOverview(params)
    .then(res => {
      if (res.code == 200) {
        overview.value = res.data;
      }
    })
    .catch(() => {})
    .finally(() => {});
};
</script>

<style lang="scss" scoped></style>
