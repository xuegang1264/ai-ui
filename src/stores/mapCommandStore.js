import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMapCommandStore = defineStore('mapCommand', () => {
  const pending = ref(null)

  function dispatch(cmd) {
    pending.value = cmd
  }

  function consume() {
    const cmd = pending.value
    pending.value = null
    return cmd
  }

  return { pending, dispatch, consume }
})
