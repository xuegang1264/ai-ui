import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useQueryStore = defineStore('query', () => {
  const params = ref({})

  function setParams(key, value) {
    params.value[key] = { ...value, _timestamp: Date.now() }
  }

  function getParams(key) {
    return params.value[key]
  }

  return { params, setParams, getParams }
})
