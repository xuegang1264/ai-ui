<script setup>
const TYPE_LABEL = {
  1: '区域性综合服务中心（农技）',
  2: '区域性综合服务中心（农事）',
  3: '区域性综合服务中心（综合）',
  4: '无人机场',
}

defineProps({
  data: { type: Object, default: () => ({}) },
})
</script>

<template>
  <div class="popup-card">
    <div class="popup-header">{{ data.name || TYPE_LABEL[data.type] || '服务中心' }}</div>
    <div class="popup-body">
      <div class="popup-row"><span>农场编码</span><span>{{ data.farmCode }}</span></div>
      <div class="popup-row"><span>类型</span><span>{{ TYPE_LABEL[data.type] || data.type }}</span></div>
      <div class="popup-row"><span>地址</span><span>{{ data.address }}</span></div>
      <div class="popup-row"><span>负责人</span><span>{{ data.userName }}</span></div>
      <div class="popup-row"><span>联系电话</span><span>{{ data.userPhone }}</span></div>
      <div class="popup-row"><span>经度</span><span>{{ data.lng }}</span></div>
      <div class="popup-row"><span>纬度</span><span>{{ data.lat }}</span></div>
    </div>
  </div>
</template>
