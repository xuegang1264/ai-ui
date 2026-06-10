<script setup>
import { computed } from 'vue'
import { ElScrollbar } from 'element-plus'

const props = defineProps({
  content: { type: String, default: '' },
  format: { type: String, default: 'plain' },
  align: { type: String, default: 'left' },
  size: { type: String, default: 'normal' },
})

const isRich = computed(() => props.format === 'rich')

const plainHtml = computed(() => {
  if (!props.content) return ''
  const escaped = props.content
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  return escaped
    .split(/\n{2,}/)
    .map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`)
    .join('')
})

const sizeClass = computed(() => {
  const map = { small: 'text-view--small', normal: 'text-view--normal', large: 'text-view--large' }
  return map[props.size] || map.normal
})

const alignStyle = computed(() => ({
  textAlign: ['left', 'center', 'right'].includes(props.align) ? props.align : 'left',
}))
</script>

<template>
  <div class="text-view" :class="sizeClass" :style="alignStyle">
    <ElScrollbar>
      <div v-if="isRich" class="text-view__body" v-html="content" />
      <div v-else class="text-view__body" v-html="plainHtml" />
    </ElScrollbar>
  </div>
</template>

<style scoped>
.text-view {
  width: 100%;
  height: 100%;
  color: var(--text);
  line-height: 1.75;
}

.text-view__body {
  padding: var(--space-3) var(--space-4);
}

.text-view__body :deep(p) {
  margin: 0 0 0.75em;
}

.text-view__body :deep(p:last-child) {
  margin-bottom: 0;
}

.text-view__body :deep(a) {
  color: var(--accent);
  text-decoration: none;
}

.text-view__body :deep(a:hover) {
  text-decoration: underline;
}

.text-view--small {
  font-size: 0.85rem;
}

.text-view--normal {
  font-size: 1rem;
}

.text-view--large {
  font-size: 1.15rem;
}
</style>
