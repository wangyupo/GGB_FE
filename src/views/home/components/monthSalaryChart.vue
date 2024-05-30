<template>
  <!-- 月工资走势 -->
  <RhWrapper title="工资月收入（税后）" class="flex-1 bg-white">
    <template #title-right>
      <el-date-picker
        v-model="monthRange"
        type="monthrange"
        value-format="YYYY-MM-10"
        range-separator="至"
        start-placeholder="开始月份"
        end-placeholder="结束月份"
      />
    </template>
    <div class="h-[300px]" ref="chartRef"></div>
  </RhWrapper>
</template>

<script setup>
import { onMounted, onUnmounted, ref, watch } from "vue";
import { getSalary } from "@/api/salary.js";
import { getLastMonths, generateYears } from "@/utils/index.js";
import * as echarts from "echarts";
import { useHomeStore } from "@/stores/home.js";

const homeStore = useHomeStore();
const chartRef = ref();
let chartInstance = null;
const monthRange = ref();

watch(monthRange, val => {
  if (val.length == 0) {
    initData();
    return;
  }
  fn_getSalary();
});

onMounted(() => {
  initLineChart();
  initData();
});

onUnmounted(() => {
  homeStore.$patch(state => {
    state.salaryStructMonth = "";
  });
});

// 初始化数据、图表
const initData = () => {
  let monthRangeDefault = generateYears("2021").map(i => i + "-01-10");
  monthRange.value = [monthRangeDefault[0], monthRangeDefault[monthRangeDefault.length - 1]];
  fn_getSalary();
};

// 获取工资数据
const fn_getSalary = () => {
  const params = {
    beginTime: monthRange.value[0],
    endTime: monthRange.value[1],
    all: true,
  };
  getSalary(params)
    .then(res => {
      if (res.code == 200) {
        const data = res.data.reverse();
        chartInstance.setOption({
          xAxis: {
            data: data.map(i => i.payday),
          },
          series: [
            {
              data: data.map(i =>
                (parseFloat(i.salary_actual) + parseFloat(i.other_income) + parseFloat(i.year_end_bonus)).toFixed(2)
              ),
            },
          ],
        });
        homeStore.$patch(state => {
          state.salaryStructMonth = data[data.length - 1].payday;
        });
      }
    })
    .catch(() => {})
    .finally(() => {});
};

// 初始化图表
const initLineChart = () => {
  const chartDom = chartRef.value;
  chartInstance = echarts.init(chartDom);
  chartInstance.on("click", function (params) {
    homeStore.$patch(state => {
      state.salaryStructMonth = params.name;
    });
  });

  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
        label: {
          backgroundColor: "#6a7985",
        },
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: { type: "category" },
    yAxis: [{ type: "value", splitNumber: 3 }],
    series: [
      {
        name: "工资",
        type: "line",
        smooth: true,
        areaStyle: {
          opacity: 0.8,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(55, 162, 255, 1)" },
            { offset: 1, color: "rgba(116, 21, 219, 0)" },
          ]),
        },
        emphasis: {
          focus: "series",
        },
      },
    ],
  };

  option && chartInstance.setOption(option);
};
</script>

<style lang="scss" scoped></style>
