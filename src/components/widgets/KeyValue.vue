<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: { type: String, default: '' },
  value: { type: [String, Number], default: '' },
  unit: { type: String, default: '' },
  icon: { type: String, default: '' },
  items: { type: Array, default: () => [] },
  direction: { type: String, default: 'column' },
  textDirection: { type: String, default: 'column' },
})
const displayItems = computed(() => {
  if (props.items && props.items.length > 0) {
    return props.items
  }
  return [{
    label: props.label,
    value: props.value,
    unit: props.unit,
    icon: props.icon,
  }]
})

function getLabelStyle(item) {
  const width = item.labelWidth
  if (width === undefined || width === null || width === '') return undefined
  return { width: typeof width === 'number' ? `${width}px` : width }
}

const isRow = computed(() => props.direction === 'row')
</script>

<template>
  <div
    class="kv-layout"
    :class="{ 'kv-layout--row': isRow }"
  >
    <div
      v-for="(item, idx) in displayItems"
      :key="idx"
      class="kv-item"
      :style="item.width ? { width: item.width, flex: '0 0 auto' } : undefined"
    >
      <div v-if="item.icon" class="kv-icon">
        <div v-if="item.icon.startsWith('<')" v-html="item.icon" class="kv-icon__svg"></div>
        <img v-else :src="item.icon" class="kv-icon__img" alt="" />
      </div>
      <div
        class="kv-body"
        :class="{ 'kv-body--row': (item.textDirection || props.textDirection) === 'row' }"
      >
        <div class="kv-label" :style="getLabelStyle(item)">{{ item.label }}</div>
        <div class="kv-value-wrap">
          <span class="kv-value">{{ item.value ?? '-' }}</span>
          <span v-if="item.unit" class="kv-unit">{{ item.unit }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.kv-layout {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  border-radius: 8px;
  background: var(--bg);
  box-sizing: border-box;
  border: 1px solid var(--border);
}

.kv-layout:not(.kv-layout--row) {
  gap: var(--space-1);
}

.kv-layout--row {
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
}

.kv-layout--row .kv-item {
  flex: 1 1 auto;
}

.kv-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
}

.kv-icon {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: var(--accent-bg, oklch(96% 0.02 80));
}

.kv-icon__svg {
  width: 20px;
  height: 20px;
  color: var(--accent);
}

.kv-icon__img {
  width: 20px;
  height: 20px;
  object-fit: contain;
}

.kv-body {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.kv-label {
  font-size: 0.85rem;
  color: var(--text-muted);
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.kv-value-wrap {
  display: flex;
  align-items: baseline;
  gap: 4px;
  line-height: 1.4;
}

.kv-value {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-h);
  font-family: var(--font-display);
}

.kv-body--row {
  flex-direction: row;
  align-items: center;
  gap: var(--space-2);
}

.kv-body--row .kv-label {
  flex-shrink: 0;
}

.kv-body--row .kv-value-wrap {
  min-width: 0;
}

.kv-unit {
  font-size: 0.85rem;
  color: var(--text-muted);
  font-weight: 400;
}
</style>
