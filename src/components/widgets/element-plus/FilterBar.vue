<script setup>
import { reactive, watch } from 'vue'

import { ElSelect, ElOption, ElInput, ElDatePicker } from 'element-plus'

const props = defineProps({
  filters: {
    type: Array,
    default: () => []
  },
  modelValue: {
    type: Object,
    default: () => ({})
  },
  gap: {
    type: Number,
    default: 8
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const state = reactive({ ...props.modelValue })

watch(
  () => props.modelValue,
  (val) => Object.assign(state, val),
  { deep: true }
)

function onChange() {
  emit('update:modelValue', { ...state })
  emit('change', { ...state })
}

function getPlaceholder(filter) {
  if (filter.placeholder) return filter.placeholder
  if (filter.type === 'select') return `请选择${filter.label || ''}`
  if (filter.type === 'date' || filter.type === 'daterange') return `选择日期`
  return `请输入${filter.label || ''}`
}

function getBind(filter) {
  const base = {
    size: 'small',
    placeholder: getPlaceholder(filter),
    style: filter.style,
    class: filter.class
  }
  if (filter.clearable !== false) base.clearable = true
  return base
}
</script>

<template>
  <div class="filter-bar" :style="{ gap: gap + 'px' }">
    <template v-for="f in filters" :key="f.field">
      <span v-if="f.label" class="filter-label">{{ f.label }}</span>

      <el-select
        v-if="f.type === 'select'"
        v-model="state[f.field]"
        v-bind="getBind(f)"
        @change="onChange"
      >
        <el-option
          v-for="opt in f.options"
          :key="opt.value"
          :label="opt.label"
          :value="opt.value"
        />
      </el-select>

      <el-input
        v-else-if="f.type === 'input'"
        v-model="state[f.field]"
        v-bind="getBind(f)"
        @change="onChange"
      />

      <el-date-picker
        v-else-if="f.type === 'date' || f.type === 'daterange'"
        v-model="state[f.field]"
        :type="f.type"
        value-format="YYYY-MM-DD"
        v-bind="getBind(f)"
        @change="onChange"
      />
    </template>
  </div>
</template>

<style scoped>
.filter-bar {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  overflow-x: auto;
}

.filter-bar::-webkit-scrollbar {
  display: none;
}

.filter-label {
  font-size: 12px;
  color: var(--text-secondary, #666);
  white-space: nowrap;
  flex-shrink: 0;
}

.filter-bar :deep(.el-input),
.filter-bar :deep(.el-select),
.filter-bar :deep(.el-date-editor) {
  width: auto;
  flex: 0 1 auto;
  min-width: 80px;
}

.filter-bar :deep(.el-input__wrapper),
.filter-bar :deep(.el-select .el-input__wrapper) {
  padding: 0 6px;
}
</style>
