import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import localforage from 'localforage'

const MENUS_STORAGE_KEY = 'app-menus'

export const DEFAULT_MENUS = [
  { id: 'home', name: '首页', isDefault: true },
  { id: 'miaoqing', name: '苗情', isDefault: true },
  { id: 'shangqing', name: '墒情', isDefault: true },
  { id: 'chongqing', name: '虫情', isDefault: true },
  { id: 'zaiqing', name: '灾情', isDefault: true },
]

const menuDB = localforage.createInstance({
  name: 'ai-ui',
  storeName: 'menu_store',
  driver: localforage.INDEXEDDB,
})

export const useMenuStore = defineStore('menu', () => {
  const menus = ref([])
  const currentMenuId = ref('')
  const initialized = ref(false)

  const currentMenu = computed(() =>
    menus.value.find((m) => m.id === currentMenuId.value)
  )

  function mergeWithDefaults(saved) {
    if (!Array.isArray(saved)) saved = []

    const result = saved.map((m) => ({
      ...m,
      isDefault: DEFAULT_MENUS.some((dm) => dm.id === m.id),
    }))

    for (const dm of DEFAULT_MENUS) {
      if (!result.some((m) => m.id === dm.id)) {
        result.push({ ...dm })
      }
    }

    return result
  }

  async function saveMenus() {
    try {
      await menuDB.setItem(
        MENUS_STORAGE_KEY,
        JSON.parse(JSON.stringify(menus.value))
      )
    } catch (e) {
      console.error('[menuStore] 保存菜单失败:', e)
    }
  }

  async function initMenus() {
    let saved = []
    try {
      saved = await menuDB.getItem(MENUS_STORAGE_KEY)
    } catch (e) {
      console.error('[menuStore] 从 IndexedDB 加载菜单失败:', e)
    }

    const merged = mergeWithDefaults(saved)
    menus.value = merged
    initialized.value = true

    if (!merged.some((m) => m.id === currentMenuId.value)) {
      currentMenuId.value = merged[0]?.id ?? ''
    }

    await saveMenus()
  }

  async function switchMenu(id) {
    if (!menus.value.some((m) => m.id === id)) return
    currentMenuId.value = id
  }

  async function addMenu(name) {
    const trimmed = name.trim()
    const id = `custom_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
    const menu = {
      id,
      name: trimmed || '新菜单',
      isDefault: false,
      createdAt: Date.now(),
    }
    menus.value.push(menu)
    await saveMenus()
    currentMenuId.value = id
    return id
  }

  async function deleteMenu(id) {
    const menu = menus.value.find((m) => m.id === id)
    if (!menu || menu.isDefault) return

    menus.value = menus.value.filter((m) => m.id !== id)
    await saveMenus()

    if (currentMenuId.value === id) {
      currentMenuId.value = menus.value[0]?.id ?? ''
    }
  }

  async function renameMenu(id, newName) {
    const menu = menus.value.find((m) => m.id === id)
    if (!menu || menu.isDefault) return
    menu.name = newName.trim() || menu.name
    await saveMenus()
  }

  return {
    menus,
    currentMenuId,
    initialized,
    currentMenu,
    initMenus,
    switchMenu,
    addMenu,
    deleteMenu,
    renameMenu,
  }
})
