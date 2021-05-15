<template>
  <div>
    <v-chart
      :options="options"
      class="chart"
    />
  </div>
</template>

<script>
import 'echarts';
import VChart, {} from "vue-echarts";


export default {
  name: "Debug",
  components: {
    VChart
  },
  data() {
    return {
      options: {
        title: {
          text: "支出成分"
        },
        xAxis: {
          data: ['Food', 'Play', 'Other']
        },
        yAxis: {},
        tooltip: {},
        legend: {
          data: [
            "Food",
            "Play",
            "Other"
          ]
        },
        series: [
          {
            name: "1月",
            type: "bar",
            data: [750, 350, 250]
          },
          {
            name: "2月",
            type: "bar",
            data: [250, 233, 432]
          },
        ]
      },
    }
  }
}
</script>

<style scoped>

</style>