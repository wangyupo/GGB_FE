<template>
  <!-- 概览 -->
  <div class="flex w-full">
    <!-- 当年工资总计、当年养老总计、当年住房公积金总计、当年其它收入 -->
    <RhWrapper
      :title="item.name"
      class="flex-1 bg-white ml-3 first:ml-0"
      v-for="(item, index) in overview"
      :key="index"
    >
      <template #title-right>
        <el-dropdown @command="handleCommand">
          <span class="flex items-center">
            <el-tag>
              {{ currentYear }}
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </el-tag>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="2024">2024</el-dropdown-item>
              <el-dropdown-item command="2023">2023</el-dropdown-item>
              <el-dropdown-item command="2022">2022</el-dropdown-item>
              <el-dropdown-item command="2021">2021</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>
      <div class="flex justify-between">
        <div class="text-3xl">{{ numberFormat(item.value) }}元</div>
      </div>
      <div class="flex justify-between mt-6">
        <div>累计月数</div>
        <div>{{ numberFormat(item.month_count) }}个月</div>
      </div>
    </RhWrapper>
  </div>
</template>

<script setup>
import { numberFormat } from "@/utils/index.js";
import { currentYearOverview } from "@/api/home.js";
import { onMounted, ref } from "vue";

const overview = ref([]);
const currentYear = ref(2024);

onMounted(() => {
  fn_homeOverview();
});

// 获取数据
const fn_homeOverview = () => {
  const params = {
    year: currentYear.value,
  };
  currentYearOverview(params)
    .then(res => {
      if (res.code == 200) {
        overview.value = res.data;
      }
    })
    .catch(() => {})
    .finally(() => {});
};

// 用途
const handleCommand = val => {
  currentYear.value = val;
  fn_homeOverview();
};
</script>

<style lang="scss" scoped></style>
