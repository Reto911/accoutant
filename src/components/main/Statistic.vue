<template>
  <div style="transform: translateY(20px);">
    <div class="md-layout md-alignment-top-center">
      <div class="md-layout-item md-size-50">
        <v-chart
          :option="obtOption"
          class="chart"
        />
      </div>
    </div>
    <div class="md-layout md-alignment-top-center md-gutter">
      <div class="md-layout-item md-size-50">
        <v-chart
          :option="bbdOption"
          class="chart"
        />
      </div>
      <div class="md-layout-item md-size-50">
        <v-chart
          :option="ibdOption"
          class="chart"
        />
      </div>
      <div class="md-layout-item md-size-50">
        <v-chart
          :option="obdOption"
          class="chart"
        />
      </div>
      <div class="md-layout-item md-size-50">
        <v-chart
          :option="obtdOption"
          class="chart"
        />
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from "vuex";
import VChart from "vue-echarts";
import {use} from 'echarts/core';
import {CanvasRenderer} from 'echarts/renderers';
import {LineChart, PieChart} from 'echarts/charts';
import {
  DatasetComponent,
  DataZoomInsideComponent,
  DataZoomSliderComponent,
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
  VisualMapComponent,
} from 'echarts/components';

use([
  CanvasRenderer,
  LineChart,
  TitleComponent,
  GridComponent,
  LegendComponent,
  DatasetComponent,
  VisualMapComponent,
  DataZoomSliderComponent,
  DataZoomInsideComponent,
  TooltipComponent,
  PieChart
]);

export default {
  name: "Statistic",
  components: {
    VChart
  },
  computed: {
    bbdOption() {
      return {
        title: {
          text:"每日收支",
          left: 'center'
        },
        // legend: {},
        tooltip: {
          trigger: 'axis'
        },
        dataset: {
          source: this.balanceByDate,
          sourceHeader: false
        },
        dataZoom: [
          {
            type: 'slider',
            show: true,
            xAxisIndex: [0]
          },
          {
            type: 'slider',
            show: true,
            yAxisIndex: [0]
          },
          {
            type: 'inside',
            show: true,
            xAxisIndex: [0]
          },
          {
            type: 'inside',
            show: true,
            yAxisIndex: [0]
          }
        ],
        xAxis: {
          name: '日期',
          type: 'time'
        },
        yAxis: {
          name: '收支/￥'
        },
        visualMap: {
          // orient: 'horizontal',
          // left: 'center',
          top: 'center',
          min: -400,
          max: 400,
          inRange: {
            color: ['#FD665F', '#FFCE34', '#65B581']
          }
        },
        series: [
          {
            type: 'line',
            seriesLayoutBy: 'row',
            tooltip: {},
          }
        ]
      }
    },
    ibdOption() {
      return {
        title: {
          text:"每日收入",
          left: 'center'
        },
        // legend: {},
        tooltip: {
          trigger: 'axis'
        },
        dataset: {
          source: this.incomeByDate,
          sourceHeader: false
        },
        dataZoom: [
          {
            type: 'slider',
            show: true,
            xAxisIndex: [0]
          },
          {
            type: 'slider',
            show: true,
            yAxisIndex: [0]
          },
          {
            type: 'inside',
            show: true,
            xAxisIndex: [0]
          },
          {
            type: 'inside',
            show: true,
            yAxisIndex: [0]
          }
        ],
        xAxis: {
          name: '日期',
          type: 'time'
        },
        yAxis: {
          name: '收入/￥'
        },
        visualMap: {
          // orient: 'horizontal',
          // left: 'center',
          top: 'center',
          min: 0,
          max: 400,
          inRange: {
            color: ['#FD665F', '#FFCE34', '#65B581']
          }
        },
        series: [
          {
            type: 'line',
            seriesLayoutBy: 'row',
            tooltip: {},
          }
        ]
      }
    },
    obdOption() {
      return {
        title: {
          text:"每日支出",
          left: 'center'
        },
        // legend: {},
        tooltip: {
          trigger: 'axis'
        },
        dataset: {
          source: this.outcomeByDate,
          sourceHeader: false
        },
        dataZoom: [
          {
            type: 'slider',
            show: true,
            xAxisIndex: [0]
          },
          {
            type: 'slider',
            show: true,
            yAxisIndex: [0]
          },
          {
            type: 'inside',
            show: true,
            xAxisIndex: [0]
          },
          {
            type: 'inside',
            show: true,
            yAxisIndex: [0]
          }
        ],
        xAxis: {
          name: '日期',
          type: 'time'
        },
        yAxis: {
          name: '支出/￥'
        },
        visualMap: {
          // orient: 'horizontal',
          // left: 'center',
          top: 'center',
          min: 0,
          max: 400,
          inRange: {
            color: ['#56B581', '#FFCE34', '#FD665F']
          }
        },
        series: [
          {
            type: 'line',
            seriesLayoutBy: 'row',
            tooltip: {},
          }
        ]
      }
    },
    obtOption() {
      return {
        title: {
          text:"各类支出",
          // left: 'center'
        },
        legend: {},
        tooltip: {
          trigger: 'item'
        },
        dataset: {
          source: this.outcomeByType,
          sourceHeader: false
        },
        visualMap: {
          // orient: 'horizontal',
          // left: 'center',
          top: 'center',
          // splitNumber: 5,
          min: 0,
          max: Math.max(...this.outcomeByType[1]),
          inRange: {
            color: ['#56B581', '#FFCE34', '#FD665F']
          }
        },
        series: [
          {
            type: 'pie',
            seriesLayoutBy: 'row',
            tooltip: {},
            label: {
              formatter: '{b}: {d}%'
            }
          }
        ]
      }
    },
    obtdOption() {
      return {
        title: {
          text:"每日支出（按类目）",
          // left: 'center'
        },
        legend: {},
        dataZoom: [
          {
            type: 'slider',
            show: true,
            xAxisIndex: [0]
          },
          {
            type: 'slider',
            show: true,
            yAxisIndex: [0]
          },
          {
            type: 'inside',
            show: true,
            xAxisIndex: [0]
          },
          {
            type: 'inside',
            show: true,
            yAxisIndex: [0]
          }
        ],
        xAxis: {
          name: '日期',
          type: 'time'
        },
        yAxis: {
          name: '收支/￥'
        },
        tooltip: {
          trigger: 'axis'
        },
        dataset: {
          source: this.outcomeByTypeByDay,
        },
        series: [
          {
            type: 'line',
            name: '餐饮',
            tooltip: {},
            encode: {
              x: 0,
              y: 1
            }
          },
          {
            type: 'line',
            name: '生活',
            tooltip: {},
            encode: {
              x: 0,
              y: 2
            }
          },
          {
            type: 'line',
            name: '学习',
            tooltip: {},
            encode: {
              x: 0,
              y: 3
            }
          },
          {
            type: 'line',
            name: '娱乐',
            tooltip: {},
            encode: {
              x: 0,
              y: 4
            }
          },
          {
            type: 'line',
            name: '医疗',
            tooltip: {},
            encode: {
              x: 0,
              y: 5
            }
          },
          {
            type: 'line',
            name: '其他',
            tooltip: {},
            encode: {
              x: 0,
              y: 6
            }
          }
        ]
      }
    },
    ...mapState([
        "balanceByDate",
        "outcomeByDate",
        "incomeByDate",
        "outcomeByType",
        "outcomeByTypeByDay"
    ])
  },
  mounted () {
    // this.$emit('refresh');
  }
}
</script>

<style scoped>
.chart {
  height: 400px;
}
</style>