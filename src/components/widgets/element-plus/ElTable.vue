<script setup>
import { computed } from 'vue'
import { ElTable, ElTableColumn } from 'element-plus'
import { useQueryStore } from '../../../stores/queryStore.js'

const props = defineProps({
  data: { type: Array, default: () => [] },
  sourceData: { type: Array, default: () => [] },
  columns: { type: Array, default: () => [] },
  stripe: { type: Boolean, default: true },
  border: { type: Boolean, default: false },
  size: { type: String, default: 'small' },
  height: { type: [String, Number], default: undefined },
  queryKey: { type: String, required: true },
})

const queryStore = useQueryStore()

const displayData = computed(() => {
  if (!props.queryKey) return props.data
  console.log(props.queryKey, queryStore.getParams(props.queryKey))

  const source = props.sourceData.length > 0 ? props.sourceData : props.data
  const queryParams = queryStore.getParams(props.queryKey)
  if (!queryParams || Object.keys(queryParams).length === 0) return source

  return source.filter((row) => {
    return Object.entries(queryParams).every(([key, val]) => {
      if (key.startsWith('_')) return true
      if (val === '' || val === null || val === undefined) return true
      const cell = String(row[key] ?? '').toLowerCase()
      return cell.includes(String(val).toLowerCase())
    })
  })
})
</script>

<template>
  <div style="width: 100%; padding: var(--space-4) var(--space-1);  border-radius: var(--border-radius); box-sizing: border-box;">
    <ElTable
    class="el-table--custom"
    :data="displayData"
    :stripe="props.stripe"
    :border="props.border"
    :size="props.size"
    :height="props.height"
    style="width: 100%; --el-table-header-bg-color: var(--accent-bg); --el-table-header-text-color: var(--text-h);"
  >
    <ElTableColumn
      v-for="col in props.columns"
      :key="col.prop"
      :prop="col.prop"
      :label="col.label"
      :width="col.width"
      :min-width="col.minWidth"
      :formatter="col.formatter"
    >
      <template v-if="col.slot" #default="scope">
        <slot :name="col.slot" :row="scope.row" :index="scope.$index" />
      </template>
    </ElTableColumn>
  </ElTable>
  </div>
</template>

<style scoped>
:deep(.el-table--custom) {
  padding: 0 !important;
}
</style>


