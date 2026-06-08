<script setup>
defineProps({
  data: { type: Object, default: () => ({}) },
})
</script>

<template>
  <div class="popup-card">
    <div class="popup-header">{{ data.name || '地块信息' }}</div>
    <div class="popup-body">
      <div class="popup-row"><span>编码</span><span>{{ data.adcode }}</span></div>
      <div class="popup-row"><span>负责人</span><span>{{ data.userName }}</span></div>
      <div class="popup-row"><span>类型</span><span>{{ data.typeName }}</span></div>
      <div class="popup-row"><span>面积</span><span>{{ data.area }}</span></div>
      <div class="popup-row"><span>编号</span><span>{{ data.num }}</span></div>
    </div>
  </div>
</template>
