<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as monaco from 'monaco-editor'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'

const props = defineProps({
  modelValue: { type: String, default: '' },
  language: { type: String, default: 'json' },
  readOnly: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue'])

const containerRef = ref(null)
let editor = null

self.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === 'json') return new jsonWorker()
    return new editorWorker()
  },
}

onMounted(() => {
  if (!containerRef.value) return

  editor = monaco.editor.create(containerRef.value, {
    value: props.modelValue,
    language: props.language,
    theme: 'vs',
    automaticLayout: true,
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    readOnly: props.readOnly,
    fontSize: 13,
    tabSize: 2,
  })

  editor.onDidChangeModelContent(() => {
    emit('update:modelValue', editor.getValue())
  })
})

onUnmounted(() => {
  editor?.dispose()
})

watch(
  () => props.modelValue,
  (val) => {
    if (editor && editor.getValue() !== val) {
      editor.setValue(val)
    }
  }
)

defineExpose({
  getValue: () => editor?.getValue(),
  setValue: (val) => editor?.setValue(val),
})
</script>

<template>
  <div ref="containerRef" style="width: 100%; height: 100%;" />
</template>
