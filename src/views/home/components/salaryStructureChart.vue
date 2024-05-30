<template>
  <!-- 最新工资构成 -->
  <RhWrapper title="工资构成（税前）" class="flex-1 bg-white">
    <template #title-right>
      <el-tag>{{ salaryStructMonth }}</el-tag>
    </template>
    <div class="h-[300px]" ref="chartRef" v-show="showChart"></div>
    <RhNoData class="h-[300px]" v-show="!showChart" />
  </RhWrapper>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { salaryStruct } from "@/api/home.js";
import * as echarts from "echarts";
import { useHomeStore } from "@/stores/home.js";
import { storeToRefs } from "pinia";

const homeStore = useHomeStore();
const { salaryStructMonth } = storeToRefs(homeStore);

const chartRef = ref();
let chartInstance = null;
const showChart = ref(true);

watch(salaryStructMonth, val => {
  if (val == "") return;
  fn_getSalary();
});

onMounted(() => {
  initLineChart();
});

// 获取工资数据
const fn_getSalary = () => {
  const params = {
    payday: salaryStructMonth.value,
  };
  salaryStruct(params)
    .then(res => {
      if (res.code == 200) {
        showChart.value = true;
        chartInstance.setOption({
          series: [{ data: res.data }],
        });
      } else {
        showChart.value = false;
      }
    })
    .catch(() => {})
    .finally(() => {});
};

// 初始化图表
const initLineChart = () => {
  const chartDom = chartRef.value;
  chartInstance = echarts.init(chartDom);

  const option = {
    tooltip: {},
    series: [
      {
        name: "工资构成",
        type: "pie",
        radius: ["20%", "80%"],
        center: ["50%", "50%"],
        roseType: "area",
        itemStyle: {
          borderRadius: 8,
        },
        label: {
          formatter: "{name|{b}}\n{time|{c}元}",
          lineHeight: 15,
          rich: {
            time: {
              fontSize: 10,
              color: "#999",
            },
          },
        },
        labelLine: {
          // length: 0,
          length2: 10,
        },
        labelLayout: function (params) {
          const isLeft = params.labelRect.x < chartInstance.getWidth() / 2;
          const points = params.labelLinePoints;
          // Update the end point.
          points[2][0] = isLeft ? params.labelRect.x : params.labelRect.x + params.labelRect.width;
          return {
            labelLinePoints: points,
          };
        },
      },
    ],
  };

  option && chartInstance.setOption(option);
};
</script>

<style lang="scss" scoped></style>
