import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import localforage from 'localforage'
import { defaultModules as homeDefault } from '../data/defaultModules'
import { defaultModules as miaoqingDefault } from '../data/miaoqing'
import { defaultModules as shangqingDefault } from '../data/shangqing'

const DEFAULT_WORKSPACE_KEY = 'grid-modules'

const WORKSPACE_KEYS = {
  home: 'grid-modules',
  miaoqing: 'miaoqing',
  shangqing: 'shangqing',
}

const DEFAULT_DATA_MAP = {
  home: homeDefault,
  miaoqing: miaoqingDefault,
  shangqing: shangqingDefault,
}

localforage.config({
  name: 'ai-ui',
  storeName: 'grid_store',
  driver: localforage.INDEXEDDB,
})

export const useGridStore = defineStore('grid', () => {
  const modules = ref([]) 

  // 从 IndexedDB 异步恢复已有配置，避免阻塞 store 初始化
  const initialized = ref(false)
  const currentWorkspace = ref('home')

  function getStorageKey(workspace) {
    return WORKSPACE_KEYS[workspace] ?? DEFAULT_WORKSPACE_KEY
  }

  async function switchWorkspace(workspace) {
    const key = getStorageKey(workspace)
    currentWorkspace.value = workspace
    try {
      const saved = await localforage.getItem(key)
      if (saved && Array.isArray(saved) && saved.length > 0) {
        modules.value = saved
      } else {
        const fallback = DEFAULT_DATA_MAP[workspace]
        modules.value = fallback ? JSON.parse(JSON.stringify(fallback)) : []
        if (fallback) {
          await localforage.setItem(key, JSON.parse(JSON.stringify(fallback)))
        }
      }
    } catch (e) {
      console.error(`从 IndexedDB 加载 ${key} 失败:`, e)
      const fallback = DEFAULT_DATA_MAP[workspace]
      modules.value = fallback ? JSON.parse(JSON.stringify(fallback)) : []
    }
  }

  localforage.getItem(DEFAULT_WORKSPACE_KEY).then(async (saved) => {
    if (saved && Array.isArray(saved) && saved.length > 0) {
      modules.value = saved
    } else {
      const fallback = homeDefault
      modules.value = JSON.parse(JSON.stringify(fallback))
      await localforage.setItem(DEFAULT_WORKSPACE_KEY, JSON.parse(JSON.stringify(fallback)))
    }
    initialized.value = true
  }).catch(async (e) => {
    console.error('从 IndexedDB 加载 modules 失败:', e)
    const fallback = homeDefault
    modules.value = JSON.parse(JSON.stringify(fallback))
    await localforage.setItem(DEFAULT_WORKSPACE_KEY, JSON.parse(JSON.stringify(fallback)))
    initialized.value = true
  })

  // layoutItems 必须是 ref（可写），v-model:layout 才能双向绑定
  const layoutItems = computed(() =>
       modules.value.map((m) => ({
      x: m.layout.x,
      y: m.layout.y,
      w: m.layout.w,
      h: m.layout.h,
      i: m.instanceId,
      static: !m.layout.draggable,
    }))
  )

  function getModuleById(instanceId) {
    return modules.value.find((m) => m.instanceId === instanceId)
  }

  function updateLayout(newLayout) {
    if (!initialized.value) return
    newLayout.forEach((item) => {
      const mod = modules.value.find((m) => m.instanceId === item.i)
      if (mod) {
        mod.layout.x = item.x
        mod.layout.y = item.y
        mod.layout.w = item.w
        mod.layout.h = item.h
      }
    })
    // 同步到 IndexedDB（先深拷贝解除 Vue 响应式代理，否则结构化克隆会失败）
    localforage.setItem(getStorageKey(currentWorkspace.value), JSON.parse(JSON.stringify(modules.value))).catch((error) => {
      console.error('保存 modules 到 IndexedDB 失败:', error)
    })
  }

  async function saveCurrentModules() {
    const key = getStorageKey(currentWorkspace.value)
    try {
      await localforage.setItem(key, JSON.parse(JSON.stringify(modules.value)))
    } catch (error) {
      console.error('保存 modules 到 IndexedDB 失败:', error)
    }
  }

  return {
    modules,
    layoutItems,
    getModuleById,
    updateLayout,
    initialized,
    currentWorkspace,
    switchWorkspace,
    saveCurrentModules,
  }
})
