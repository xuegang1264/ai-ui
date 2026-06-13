import { defineStore } from 'pinia'
import { ref, computed, nextTick } from 'vue'
import localforage from 'localforage'
import { defaultModules as homeDefault } from '../data/defaultModules'
import { defaultModules as miaoqingDefault } from '../data/miaoqing'
import { defaultModules as shangqingDefault } from '../data/shangqing'
import { defaultModules as chongqingDefault } from '../data/chongqing'
import { defaultModules as zaiqingDefault } from '../data/zaiqing'

const DEFAULT_DATA_MAP = {
  home: homeDefault,
  miaoqing: miaoqingDefault,
  shangqing: shangqingDefault,
  chongqing: chongqingDefault,
  zaiqing: zaiqingDefault,
}

const gridDB = localforage.createInstance({
  name: 'ai-ui',
  storeName: 'grid_store',
  driver: localforage.INDEXEDDB,
})

function getStorageKey(workspace) {
  // 兼容旧数据：首页之前存在 'grid-modules'，其余默认菜单用 id
  if (workspace === 'home') return 'grid-modules'
  if (DEFAULT_DATA_MAP[workspace]) return workspace
  return `layout-${workspace}`
}

export const useGridStore = defineStore('grid', () => {
  const modules = ref([])
  const initialized = ref(false)
  const currentWorkspace = ref('')

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

  async function switchWorkspace(workspace) {
    const key = getStorageKey(workspace)
    console.log(`[gridStore] 切换工作区: ${workspace}, key: ${key}`)
    currentWorkspace.value = workspace
    initialized.value = false
    modules.value = []
    await nextTick()

    try {
      const saved = await gridDB.getItem(key)
      if (currentWorkspace.value !== workspace) {
        console.log(`[gridStore] 工作区已变更，放弃 ${workspace} 的加载结果`)
        return
      }

      console.log(`[gridStore] 从 IndexedDB 加载 ${key}, 数据条数:`, saved?.length ?? 0)

      if (saved && Array.isArray(saved) && saved.length > 0) {
        modules.value = saved
        console.log(`[gridStore] 使用 IndexedDB 数据, 模块数:`, saved.length)
      } else {
        const fallback = DEFAULT_DATA_MAP[workspace]
        modules.value = fallback ? JSON.parse(JSON.stringify(fallback)) : []
        console.log(`[gridStore] 使用 fallback 数据, 模块数:`, modules.value.length)
        if (fallback) {
          await gridDB.setItem(key, JSON.parse(JSON.stringify(fallback)))
          console.log(`[gridStore] fallback 已写入 IndexedDB: ${key}`)
        }
      }
    } catch (e) {
      console.error(`[gridStore] 从 IndexedDB 加载 ${key} 失败:`, e)
      if (currentWorkspace.value !== workspace) return
      const fallback = DEFAULT_DATA_MAP[workspace]
      modules.value = fallback ? JSON.parse(JSON.stringify(fallback)) : []
    }

    initialized.value = true
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
    const key = getStorageKey(currentWorkspace.value)
    console.log(`[gridStore] updateLayout 保存到 IndexedDB: ${key}, 模块数:`, modules.value.length)
    gridDB.setItem(key, JSON.parse(JSON.stringify(modules.value))).catch((error) => {
      console.error('[gridStore] updateLayout 保存失败:', error)
    })
  }

  async function saveCurrentModules() {
    const key = getStorageKey(currentWorkspace.value)
    console.log(`[gridStore] saveCurrentModules 保存到 IndexedDB: ${key}, 模块数:`, modules.value.length)
    try {
      await gridDB.setItem(key, JSON.parse(JSON.stringify(modules.value)))
      console.log(`[gridStore] saveCurrentModules 保存成功: ${key}`)
    } catch (error) {
      console.error('[gridStore] saveCurrentModules 保存失败:', error)
    }
  }

  async function loadRawModules(workspace) {
    const key = getStorageKey(workspace)
    try {
      return await gridDB.getItem(key)
    } catch (e) {
      console.error(`[gridStore] 读取 ${key} 失败:`, e)
      return null
    }
  }

  async function saveRawModules(workspace, data) {
    const key = getStorageKey(workspace)
    try {
      await gridDB.setItem(key, JSON.parse(JSON.stringify(data)))
    } catch (e) {
      console.error(`[gridStore] 写入 ${key} 失败:`, e)
    }
  }

  async function removeWorkspace(workspace) {
    const key = getStorageKey(workspace)
    try {
      await gridDB.removeItem(key)
      console.log(`[gridStore] 已删除 IndexedDB key: ${key}`)
    } catch (e) {
      console.error(`[gridStore] 删除 ${key} 失败:`, e)
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
    getStorageKey,
    loadRawModules,
    saveRawModules,
    removeWorkspace,
  }
})
