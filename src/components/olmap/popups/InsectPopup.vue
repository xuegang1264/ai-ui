<script setup>
import { keyValueMap } from '../utils/mapHelper.js'

defineProps({
  data: { type: Object, default: () => ({}) },
})
</script>

<template>
  <div class="popup-card">
    <div class="popup-header">{{ keyValueMap[data.insectType] || '虫情监测设备' }}</div>
    <div class="popup-body">
      <div class="popup-row"><span>设备编号</span><span>{{ data.sn }}</span></div>
      <div class="popup-row"><span>经纬度</span><span>{{ data.position }}</span></div>
    </div>
  </div>
</template>
