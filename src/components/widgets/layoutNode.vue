<script setup>
import { computed, inject } from 'vue'

const props = defineProps({
  direction: {
    type: String,
    default: 'row',
  },
  gap: {
    type: String,
    default: '12px',
  },
  wrap: {
    type: Boolean,
    default: false,
  },
  children: {
    type: Array,
    default: () => [],
  },
})

const widgetMap = inject('widgetMap', {})

const containerStyle = computed(() => ({
  display: 'flex',
  flexDirection: props.direction,
  gap: props.gap,
  flexWrap: props.wrap ? 'wrap' : 'nowrap',
  width: '100%',
  height: '100%',
  overflow: 'auto',
  boxSizing: 'border-box',
}))
</script>

<template>
  <div class="layout-node" :style="containerStyle">
    <template v-for="(child, idx) in children" :key="idx">
      <component
        :is="widgetMap[child.stableKey]"
        v-if="widgetMap[child.stableKey]"
        v-bind="{ ...child.props, ...(child.stableKey === 'LayoutNode' && child.children?.length ? { children: child.children } : {}) }"
        :style="child.style"
        class="layout-node-child"
      />
      <div v-else class="layout-node-fallback">
        <div class="fallback-label">{{ child.stableKey }}</div>
        <pre>{{ JSON.stringify(child.props, null, 2) }}</pre>
      </div>
    </template>
  </div>
</template>

<style scoped>
.layout-node-child {
  min-width: 0;
  min-height: 0;
  flex-shrink: 0;
}
.layout-node-fallback {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  font-size: 0.75rem;
  padding: 8px;
  border: 1px dashed var(--border);
  border-radius: 4px;
  flex: 1;
  min-width: 0;
}
.fallback-label {
  font-weight: 600;
  margin-bottom: 4px;
}
pre {
  font-size: 0.65rem;
  max-width: 100%;
  overflow: auto;
  margin: 0;
}
</style>
