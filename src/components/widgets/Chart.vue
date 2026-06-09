<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'
import { warmEditorialTheme } from '../../utils/echartsTheme'

const props = defineProps({
  option: {
    type: Object,
    required: true,
  },
})

const chartRef = ref(null)
let chart = null
let ro = null

function init() {
  if (!chartRef.value) return
  echarts.registerTheme('warm-editorial', warmEditorialTheme)
  chart = echarts.init(chartRef.value, 'warm-editorial')
  chart.setOption(props.option)
}

function update() {
  if (chart) {
    chart.setOption(props.option, true)
  }
}

function resize() {
  chart && chart.resize()
}

onMounted(() => {
  ro = new ResizeObserver(() => {
    const el = chartRef.value
    if (!el || el.clientWidth === 0 || el.clientHeight === 0) return
    if (!chart) {
      init()
    } else {
      resize()
    }
  })
  ro.observe(chartRef.value)
})

onUnmounted(() => {
  ro && ro.disconnect()
  chart && chart.dispose()
  chart = null
})

watch(() => props.option, update, { deep: true })
</script>

<template>
  <div ref="chartRef" class="echarts-container" style="width: 100%; height: 100%; min-width: 0; min-height: 0;" />
</template>
