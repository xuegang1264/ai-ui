<script setup>
defineProps({
  data: { type: Object, default: () => ({}) },
})
</script>

<template>
  <div class="popup-card">
    <div class="popup-header">{{ data.sensorName || '墒情监测站' }}</div>
    <div class="popup-body">
      <div class="popup-row"><span>站号</span><span>{{ data.sn }}</span></div>
      <div class="popup-row"><span>城市</span><span>{{ data.cityName }}</span></div>
      <div class="popup-row"><span>区县</span><span>{{ data.countyName }}</span></div>
      <div class="popup-row"><span>作物</span><span>{{ data.crop }}</span></div>
      <div class="popup-row"><span>联系人</span><span>{{ data.contact }}</span></div>
      <div class="popup-row"><span>电话</span><span>{{ data.contactPhone }}</span></div>
      <div class="popup-row"><span>农场区域</span><span>{{ data.farmArea }}</span></div>
      <div class="popup-row"><span>田间持水量</span><span>{{ data.fieldCapacity }}%</span></div>
      <div class="popup-row"><span>20cm土壤温度</span><span>{{ data.twentySoilTemp }}℃</span></div>
      <div class="popup-row"><span>20cm相对湿度</span><span>{{ data.relativeTwenty }}%</span></div>
      <div class="popup-row"><span>原始湿度</span><span>{{ data.originalTwenty }}%</span></div>
      <div class="popup-row"><span>土壤容重</span><span>{{ data.soilBulkDensity }}</span></div>
      <div class="popup-row"><span>厂商</span><span>{{ data.manufacturer }}</span></div>
      <div class="popup-row"><span>数据更新时间</span><span>{{ data.dataUpdateTime }}</span></div>
      <div class="popup-row"><span>在线状态</span><span>{{ data.onlineState === 1 ? '在线' : '离线' }}</span></div>
    </div>
  </div>
</template>
