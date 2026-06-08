<script setup>
import { ElCard, ElProgress, ElTag } from 'element-plus'

const props = defineProps({
  title: { type: String, default: '' },
  items: { type: Array, default: () => [] },
  showProgress: { type: Boolean, default: false },
})
</script>

<template>
  <div class="card-list">
    <ElCard
      v-for="(item, idx) in props.items"
      :key="idx"
      shadow="hover"
      :body-style="{ padding: '12px 16px' }"
    >
      <div class="card-row">
        <div class="card-main">
          <div class="card-title">{{ item.title }}</div>
          <div v-if="item.desc" class="card-desc">{{ item.desc }}</div>
        </div>
        <div class="card-extra">
          <div v-if="item.value !== undefined" class="card-value">{{ item.value }}</div>
          <ElTag v-if="item.tag" :type="item.tagType || 'info'" size="small">{{ item.tag }}</ElTag>
        </div>
      </div>
      <ElProgress
        v-if="props.showProgress && item.progress !== undefined"
        :percentage="item.progress"
        :status="item.progressStatus"
        :stroke-width="6"
        style="margin-top: 8px"
      />
    </ElCard>
  </div>
</template>

<style scoped>
.card-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}
.card-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.card-main {
  flex: 1;
  min-width: 0;
}
.card-title {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-h);
  line-height: 1.4;
}
.card-desc {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-top: 2px;
  line-height: 1.4;
}
.card-extra {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}
.card-value {
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--accent);
}
</style>
