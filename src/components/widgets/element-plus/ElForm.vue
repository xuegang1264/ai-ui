<script setup>
import { reactive, watch, ref } from 'vue'
import {
  ElForm,
  ElFormItem,
  ElInput,
  ElSelect,
  ElOption,
  ElDatePicker,
  ElSwitch,
  ElRadioGroup,
  ElRadio,
  ElCheckboxGroup,
  ElCheckbox,
  ElButton,
  ElRow,
  ElCol,
} from 'element-plus'
import { useQueryStore } from '../../../stores/queryStore.js'

const props = defineProps({
  modelValue: { type: Object, default: () => ({}) },
  items: {
    type: Array,
    default: () => [],
  },
  rules: { type: Object, default: () => ({}) },
  labelWidth: { type: String, default: '100px' },
  labelPosition: { type: String, default: 'right' },
  gutter: { type: Number, default: 24 },
  actions: { type: Array, default: () => [] },
  queryKey: { type: String, required: true },
  size: { type: String, default: 'default' },
})

const emit = defineEmits(['update:modelValue', 'submit', 'reset'])

const formRef = ref()

defineExpose({ validate, resetFields, clearValidate })

const localModel = reactive({ ...props.modelValue })

watch(
  () => props.modelValue,
  (val) => {
    Object.assign(localModel, val)
  },
  { deep: true }
)

watch(
  localModel,
  (val) => {
    emit('update:modelValue', { ...val })
  },
  { deep: true }
)

function validate() {
  return formRef?.value?.validate()
}

function resetFields() {
  formRef?.value?.resetFields()
}

function clearValidate(props) {
  formRef?.value?.clearValidate(props)
}

const queryStore = useQueryStore()

function handleAction(action) {
  if (action.type === 'submit') {
    formRef?.value?.validate((valid) => {
      if (valid) {
        if (props.queryKey) {
          queryStore.setParams(props.queryKey, { ...localModel })
        }
        emit('submit', { ...localModel })
      }
    })
  } else if (action.type === 'reset') {
    formRef?.value?.resetFields()
    if (props.queryKey) {
      queryStore.setParams(props.queryKey, {})
    }
    emit('reset')
  } else {
    action.onClick?.({ ...localModel })
  }
}
</script>

<template>
  <div style="width: 100%; padding: var(--space-4) var(--space-1);  border-radius: var(--border-radius); box-sizing: border-box;">
    <ElForm
    ref="formRef"
    :model="localModel"
    :rules="props.rules"
    :label-width="props.labelWidth"
    :label-position="props.labelPosition"
    :size="props.size"
    class="widget-form"
  >
    <ElRow :gutter="props.gutter">
      <ElCol
        v-for="(item, idx) in props.items"
        :key="idx"
        :span="item.span || 24"
      >
        <ElFormItem
          v-if="item.type !== 'slot'"
          :label="item.label"
          :prop="item.prop"
          :rules="item.rules"
        >
          <ElInput
            v-if="item.type === 'input' || !item.type"
            v-model="localModel[item.prop]"
            :placeholder="item.placeholder || `请输入${item.label}`"
            :disabled="item.disabled"
            :readonly="item.readonly"
            :maxlength="item.maxlength"
            :show-word-limit="!!item.maxlength"
            clearable
          />
          <ElInput
            v-else-if="item.type === 'textarea'"
            v-model="localModel[item.prop]"
            type="textarea"
            :placeholder="item.placeholder || `请输入${item.label}`"
            :disabled="item.disabled"
            :readonly="item.readonly"
            :maxlength="item.maxlength"
            :autosize="item.autosize || { minRows: 3, maxRows: 6 }"
            :show-word-limit="!!item.maxlength"
          />
          <ElSelect
            v-else-if="item.type === 'select'"
            v-model="localModel[item.prop]"
            :placeholder="item.placeholder || `请选择${item.label}`"
            :disabled="item.disabled"
            :multiple="item.multiple"
            :clearable="item.clearable !== false"
            :filterable="item.filterable"
            style="width: 100%"
          >
            <ElOption
              v-for="opt in item.options"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            />
          </ElSelect>
          <ElDatePicker
            v-else-if="item.type === 'date'"
            v-model="localModel[item.prop]"
            type="date"
            :placeholder="item.placeholder || '选择日期'"
            :disabled="item.disabled"
            :value-format="item.valueFormat || 'YYYY-MM-DD'"
            style="width: 100%"
          />
          <ElDatePicker
            v-else-if="item.type === 'datetime'"
            v-model="localModel[item.prop]"
            type="datetime"
            :placeholder="item.placeholder || '选择日期时间'"
            :disabled="item.disabled"
            :value-format="item.valueFormat || 'YYYY-MM-DD HH:mm:ss'"
            style="width: 100%"
          />
          <ElDatePicker
            v-else-if="item.type === 'daterange'"
            v-model="localModel[item.prop]"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :disabled="item.disabled"
            :value-format="item.valueFormat || 'YYYY-MM-DD'"
            style="width: 100%"
          />
          <ElSwitch
            v-else-if="item.type === 'switch'"
            v-model="localModel[item.prop]"
            :disabled="item.disabled"
            :active-value="item.activeValue ?? true"
            :inactive-value="item.inactiveValue ?? false"
          />
          <ElRadioGroup
            v-else-if="item.type === 'radio'"
            v-model="localModel[item.prop]"
            :disabled="item.disabled"
          >
            <ElRadio
              v-for="opt in item.options"
              :key="opt.value"
              :label="opt.value"
            >
              {{ opt.label }}
            </ElRadio>
          </ElRadioGroup>
          <ElCheckboxGroup
            v-else-if="item.type === 'checkbox'"
            v-model="localModel[item.prop]"
            :disabled="item.disabled"
          >
            <ElCheckbox
              v-for="opt in item.options"
              :key="opt.value"
              :label="opt.value"
            >
              {{ opt.label }}
            </ElCheckbox>
          </ElCheckboxGroup>
        </ElFormItem>
        <ElFormItem
          v-else-if="item.type === 'slot'"
          :label="item.label"
          :prop="item.prop"
        >
          <slot :name="item.prop" :model="localModel" />
        </ElFormItem>
      </ElCol>
    </ElRow>

    <div v-if="props.actions.length" class="form-actions">
      <ElButton
        v-for="(action, idx) in props.actions"
        :key="idx"
        :type="action.btnType || (action.type === 'submit' ? 'primary' : '')"
        :plain="action.plain"
        :size="action.size || props.size"
        @click="handleAction(action)"
      >
        {{ action.label }}
      </ElButton>
    </div>
  </ElForm>
  </div>
  
</template>

<style scoped>
.widget-form :deep(.el-form-item__label) {
  color: var(--text);
  font-weight: 500;
}
.widget-form :deep(.el-input__inner::placeholder) {
  color: var(--text-muted);
}
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-2);
  margin-top: var(--space-3);
}
</style>
