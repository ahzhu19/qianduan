<template>
  <div class="custom-card">
    <div class="custom-card-header">
      <h4 class="title">中国销售分布</h4>
      <span class="subtitle">China Sales Distribution</span>
    </div>
    <div class="chart-wrapper">
      <div ref="chartRef" class="chart-container"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'
import { useElementSize } from '@vueuse/core'

const chartRef = ref<HTMLElement>()
let chart: echarts.ECharts | null = null

// 模拟数据 - 使用省份名称
const mockData = [
  { name: '北京', value: 100 },
  { name: '上海', value: 95 },
  { name: '广东', value: 90 },
  { name: '江苏', value: 85 },
  { name: '浙江', value: 80 },
  { name: '四川', value: 75 },
  { name: '湖北', value: 70 },
  { name: '山东', value: 65 },
  { name: '河南', value: 60 },
  { name: '福建', value: 55 }
]

const initChart = () => {
  if (!chartRef.value) return
  
  chart = echarts.init(chartRef.value)
  
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}<br/>销售额: {c}'
    },
    visualMap: {
      min: 0,
      max: 100,
      text: ['高', '低'],
      realtime: false,
      calculable: true,
      inRange: {
        color: ['#e0f2fe', '#38bdf8', '#0369a1']
      }
    },
    series: [
      {
        name: '销售数据',
        type: 'map',
        map: 'china',
        roam: true,
        emphasis: {
          label: {
            show: true
          },
          itemStyle: {
            areaColor: '#79bbff'
          }
        },
        data: mockData,
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 1
        },
        label: {
          show: true
        }
      }
    ]
  }

  chart.setOption(option)
}

// 监听容器大小变化
const { width, height } = useElementSize(chartRef)
watch([width, height], () => {
  chart?.resize()
})

// 组件挂载时初始化图表
onMounted(async () => {
  try {
    // 从 CDN 获取地图数据
    const response = await fetch('https://cdn.jsdelivr.net/npm/echarts@latest/map/json/china.json')
    const chinaMap = await response.json()
    
    // 注册中国地图数据
    echarts.registerMap('china', chinaMap)
    initChart()
  } catch (error) {
    console.error('加载地图数据失败:', error)
  }
})

// 组件卸载时销毁图表
onUnmounted(() => {
  chart?.dispose()
  chart = null
})
</script>

<style lang="scss" scoped>
.chart-wrapper {
  padding: 0 20px 20px;
  .chart-container {
    width: 100%;
    height: 600px;
  }
}
</style> 