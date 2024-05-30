<template>
  <!-- 首页 -->
  <div>
    <OverView />

    <el-row :gutter="12" class="mt-3">
      <el-col :span="15">
        <MonthSalaryChart class="bg-white" />
      </el-col>
      <el-col :span="9">
        <SalaryStructureChart class="bg-white" />
      </el-col>
    </el-row>

    <div class="flex mt-3">
      <YearOverview />
    </div>
  </div>
</template>

<script setup>
import OverView from "./components/overView.vue";
import MonthSalaryChart from "./components/monthSalaryChart.vue";
import SalaryStructureChart from "./components/salaryStructureChart.vue";
import YearOverview from "./components/yearOverview.vue";
</script>

<style lang="scss" scoped></style>
