<script setup>
import ShangqingPopup from './ShangqingPopup.vue'
import InsectPopup from './InsectPopup.vue'
import ServiceCenterPopup from './ServiceCenterPopup.vue'
import PlotPopup from './PlotPopup.vue'

defineProps({
  type: { type: String, default: '' },
  data: { type: Object, default: () => ({}) },
})

const emit = defineEmits(['close'])
</script>

<template>
  <div class="map-popup-wrapper">
    <div class="popup-close-btn" @click="emit('close')">&times;</div>
    <ShangqingPopup v-if="type === 'shangqing'" :data="data" />
    <InsectPopup v-if="type === 'insect'" :data="data" />
    <ServiceCenterPopup v-if="type === 'serviceCenter'" :data="data" />
    <PlotPopup v-if="type === 'plot'" :data="data" />
  </div>
</template>

<style>
.popup-card {
  min-width: 280px;
  max-width: 320px;
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(8px);
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  font-size: 13px;
  color: #1a1a1a;
}
.map-popup-wrapper {
  position: relative;
}
.popup-header {
  padding: 10px 14px;
  padding-right: 100px;
  font-weight: 600;
  font-size: 14px;
  background: rgba(72, 160, 220, 0.12);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.popup-body {
  padding: 8px 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  overflow-y: auto;
}
.popup-row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  line-height: 1.4;
}
.popup-row span:first-child {
  color: #666;
  flex-shrink: 0;
}
.popup-row span:last-child {
  text-align: right;
  word-break: break-all;
}

.popup-close-btn {
  position: absolute;
  top: 10px;
  right: 8px;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 600;
  color: #666;
  cursor: pointer;
  border-radius: 4px;
  line-height: 1;
  z-index: 10;
  user-select: none;
  transition: background 0.2s, color 0.2s;
}
.popup-close-btn:hover {
  background: rgba(0, 0, 0, 0.08);
  color: #1a1a1a;
}
</style>
