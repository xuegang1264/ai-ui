<script setup>
import { GridLayout, GridItem } from 'grid-layout-plus'
import { useGridStore } from '../stores/gridStore'
import { useMenuStore } from '../stores/menuStore'
import ChatBox from '../components/ai-chat/ChatBox.vue'
import { widgetMap } from '../components/widgets'
import MonacoEditor from '../components/monaco-editor/index.vue'
import { ref, onMounted, onUnmounted, nextTick, provide } from 'vue'
import { useThemeStore } from '../stores/themeStore'

const gridStore = useGridStore()
const menuStore = useMenuStore()
const themeStore = useThemeStore()
provide('widgetMap', widgetMap)

// 新增菜单
const addingMenu = ref(false)
const newMenuName = ref('')
const newMenuInputRef = ref(null)

async function startAddMenu() {
  addingMenu.value = true
  newMenuName.value = ''
  await nextTick()
  newMenuInputRef.value?.focus()
}

function cancelAddMenu() {
  addingMenu.value = false
  newMenuName.value = ''
}

async function confirmAddMenu() {
  const name = newMenuName.value.trim()
  if (!name) {
    newMenuInputRef.value?.focus()
    return
  }
  const newId = await menuStore.addMenu(name)
  await gridStore.switchWorkspace(newId)
  addingMenu.value = false
  newMenuName.value = ''
}

function onNewMenuKeydown(e) {
  if (e.key === 'Enter') {
    confirmAddMenu()
  } else if (e.key === 'Escape') {
    cancelAddMenu()
  }
}

// 重命名菜单
const renamingMenuId = ref('')
const renamingMenuName = ref('')
const renameMenuInputRef = ref(null)

async function startRenameMenu(menuId) {
  renamingMenuId.value = menuId
  renamingMenuName.value = getMenuName(menuId)
  await nextTick()
  renameMenuInputRef.value?.focus()
}

function cancelRenameMenu() {
  renamingMenuId.value = ''
  renamingMenuName.value = ''
}

async function confirmRenameMenu() {
  const name = renamingMenuName.value.trim()
  if (name && renamingMenuId.value) {
    await menuStore.renameMenu(renamingMenuId.value, name)
  }
  renamingMenuId.value = ''
  renamingMenuName.value = ''
}

function onRenameMenuKeydown(e) {
  if (e.key === 'Enter') {
    confirmRenameMenu()
  } else if (e.key === 'Escape') {
    cancelRenameMenu()
  }
}
const rowHeight = ref(30)
const layoutEditable = ref(false)

function toggleLayoutEditable() {
  layoutEditable.value = !layoutEditable.value
  if (!layoutEditable.value) {
    gridStore.saveCurrentModules()
  }
}

async function handleSwitchMenu(menuId) {
  if (chatBoxRef.value?.loading) {
    return
  }
  await menuStore.switchMenu(menuId)
  await gridStore.switchWorkspace(menuId)
}
const drawerOpen = ref(false)
const sidebarWrapperRef = ref(null)
const chatBoxRef = ref(null)

async function toggleDrawer() {
  drawerOpen.value = !drawerOpen.value
  if (drawerOpen.value) {
    await nextTick()
    chatBoxRef.value?.focusInput?.()
  }
}

function closeDrawer() {
  drawerOpen.value = false
}

function onKeydown(e) {
  if (e.key === 'Tab') {
    e.preventDefault()
    toggleDrawer()
  }
}

const MARGIN_Y = 10
const MAX_ROWS = 100

// 右键菜单
const contextmenuVisible = ref(false)
const contextmenuPos = ref({ x: 0, y: 0 })
const contextmenuTargetId = ref(null)

function onContextMenu(e, itemId) {
  if (!layoutEditable.value) return
  e.preventDefault()
  contextmenuPos.value = { x: e.clientX, y: e.clientY }
  contextmenuTargetId.value = itemId
  contextmenuVisible.value = true
}

function closeContextMenu() {
  contextmenuVisible.value = false
  contextmenuTargetId.value = null
}

// 编辑弹框
const editModalVisible = ref(false)
const editTargetId = ref(null)
const editJson = ref('')
const monacoEditorRef = ref(null)

function handleEdit() {
  editTargetId.value = contextmenuTargetId.value
  const mod = gridStore.getModuleById(editTargetId.value)
  if (mod) {
    editJson.value = JSON.stringify(mod, null, 2)
    editModalVisible.value = true
  }
  closeContextMenu()
}

async function handleSaveEdit() {
  try {
    const parsed = JSON.parse(editJson.value)
    const idx = gridStore.modules.findIndex(m => m.instanceId === editTargetId.value)
    if (idx !== -1) {
      // 使用 splice 确保响应式更新
      gridStore.modules.splice(idx, 1, parsed)
      // 手动触发一次保存到 IndexedDB
      if (gridStore.initialized) {
        await gridStore.saveCurrentModules()
      }
    }
    editModalVisible.value = false
    editTargetId.value = null
  } catch (e) {
    alert('JSON 格式错误: ' + e.message)
  }
}

function closeEditModal() {
  editModalVisible.value = false
  editTargetId.value = null
}

function handleDelete() {
  const idx = gridStore.modules.findIndex(m => m.instanceId === contextmenuTargetId.value)
  if (idx !== -1) {
    gridStore.modules.splice(idx, 1)
  }
  closeContextMenu()
}

// 导航菜单右键菜单
const navContextmenuVisible = ref(false)
const navContextmenuPos = ref({ x: 0, y: 0 })
const navContextmenuWorkspace = ref(null)

function getMenuName(menuId) {
  return menuStore.menus.find((m) => m.id === menuId)?.name ?? menuId
}

function isDefaultMenu(menuId) {
  return menuStore.menus.find((m) => m.id === menuId)?.isDefault ?? false
}

function onNavContextMenu(e, workspace) {
  if (!layoutEditable.value) return
  e.preventDefault()
  navContextmenuPos.value = { x: e.clientX, y: e.clientY }
  navContextmenuWorkspace.value = workspace
  navContextmenuVisible.value = true
}

function closeNavContextMenu() {
  navContextmenuVisible.value = false
  navContextmenuWorkspace.value = null
}

// 工作区编辑弹框
const editWorkspaceModalVisible = ref(false)
const editWorkspaceTarget = ref(null)
const editWorkspaceJson = ref('')

async function handleNavEdit() {
  const menuId = navContextmenuWorkspace.value
  editWorkspaceTarget.value = menuId
  let data = []
  if (gridStore.currentWorkspace === menuId) {
    data = gridStore.modules
  } else {
    try {
      const saved = await gridStore.loadRawModules(menuId)
      if (saved && Array.isArray(saved)) {
        data = saved
      }
    } catch (e) {
      console.error(`读取 ${menuId} 布局失败:`, e)
    }
  }
  editWorkspaceJson.value = JSON.stringify(data, null, 2)
  editWorkspaceModalVisible.value = true
  closeNavContextMenu()
}

async function handleSaveWorkspaceEdit() {
  try {
    const parsed = JSON.parse(editWorkspaceJson.value)
    if (!Array.isArray(parsed)) {
      alert('数据必须是数组格式')
      return
    }
    const menuId = editWorkspaceTarget.value
    await gridStore.saveRawModules(menuId, parsed)
    if (gridStore.currentWorkspace === menuId) {
      gridStore.modules = parsed
    }
    editWorkspaceModalVisible.value = false
    editWorkspaceTarget.value = null
  } catch (e) {
    alert('JSON 格式错误: ' + e.message)
  }
}

function closeEditWorkspaceModal() {
  editWorkspaceModalVisible.value = false
  editWorkspaceTarget.value = null
}

async function handleNavDelete() {
  const menuId = navContextmenuWorkspace.value
  if (isDefaultMenu(menuId)) {
    closeNavContextMenu()
    return
  }

  const wasCurrent = gridStore.currentWorkspace === menuId
  await gridStore.removeWorkspace(menuId)
  await menuStore.deleteMenu(menuId)

  if (wasCurrent) {
    const newMenuId = menuStore.currentMenuId
    if (newMenuId) {
      await gridStore.switchWorkspace(newMenuId)
    } else {
      gridStore.modules = []
      gridStore.initialized = false
      gridStore.currentWorkspace = ''
    }
  }

  closeNavContextMenu()
}

async function handleSendTo() {
  const menuId = navContextmenuWorkspace.value
  if (!menuId || isDefaultMenu(menuId)) {
    closeNavContextMenu()
    return
  }

  let data = []
  if (gridStore.currentWorkspace === menuId) {
    data = gridStore.modules
  } else {
    try {
      const saved = await gridStore.loadRawModules(menuId)
      if (saved && Array.isArray(saved)) {
        data = saved
      }
    } catch (e) {
      console.error(`读取 ${menuId} 布局失败:`, e)
    }
  }

  console.log('[发送至] 菜单布局数据:', menuId, data)
  // TODO: 实现发送菜单布局给其他人的逻辑
  closeNavContextMenu()
}

onMounted(async () => {
  document.addEventListener('click', closeContextMenu)
  document.addEventListener('click', closeNavContextMenu)
  document.addEventListener('keydown', onKeydown)

  if (!menuStore.initialized) {
    await menuStore.initMenus()
  }

  const targetMenu = menuStore.currentMenuId || menuStore.menus[0]?.id
  if (targetMenu && !gridStore.initialized) {
    await gridStore.switchWorkspace(targetMenu)
  }
})
onUnmounted(() => {
  document.removeEventListener('click', closeContextMenu)
  document.removeEventListener('click', closeNavContextMenu)
  document.removeEventListener('keydown', onKeydown)
})

function calcRowHeight() {
  const el = document.querySelector('.vgl-layout')
  if (!el) return
  rowHeight.value = Math.max((el.clientHeight) / MAX_ROWS, 0)
}

let ro = null
onMounted(async () => {
  await nextTick()
  calcRowHeight()
  const el = document.querySelector('.vgl-layout')
  if (el) {
    ro = new ResizeObserver(calcRowHeight)
    ro.observe(el)
  }
})
onUnmounted(() => {
  ro?.disconnect()
})
setTimeout(() => console.log('gridStore.layoutItems:', gridStore.layoutItems), 1500) // 初始计算一次，确保 rowHeight 合理

</script>

<template>
  <div class="page">
    <!-- Header -->
    <header class="header">
      <div class="header-inner">
        <div class="header-title-wrap">
          <div class="header-accent-line"></div>
          <h1 class="header-title">AI低代码平台</h1>
        </div>
        <!-- <span class="header-subtitle">2023 — 2026</span> -->
        <nav class="header-nav">
          <a
            v-for="menu in menuStore.menus"
            :key="menu.id"
            class="header-nav-item"
            :class="{ active: menuStore.currentMenuId === menu.id }"
            href="javascript:void(0)"
            @click="handleSwitchMenu(menu.id)"
            @contextmenu="onNavContextMenu($event, menu.id)"
          >
            <input
              v-if="renamingMenuId === menu.id"
              ref="renameMenuInputRef"
              v-model="renamingMenuName"
              type="text"
              class="rename-menu-input"
              @keydown="onRenameMenuKeydown"
              @blur="confirmRenameMenu"
              @click.stop
            />
            <span v-else>{{ menu.name }}</span>
          </a>

          <div v-if="addingMenu" class="add-menu-form" @click.stop>
            <input
              ref="newMenuInputRef"
              v-model="newMenuName"
              type="text"
              class="add-menu-input"
              placeholder="菜单名称"
              @keydown="onNewMenuKeydown"
            />
            <button class="add-menu-btn add-menu-btn--confirm" @click="confirmAddMenu">确认</button>
            <button class="add-menu-btn" @click="cancelAddMenu">取消</button>
          </div>
          <button
            v-else
            class="header-nav-item add-menu-trigger"
            @click="startAddMenu"
            title="添加菜单"
          >+</button>
        </nav>
        <select class="theme-select" v-model="themeStore.currentTheme">
          <option v-for="t in themeStore.themes" :key="t.key" :value="t.key">{{ t.label }}</option>
        </select>
        <button
          class="edit-btn"
          :class="{ active: layoutEditable }"
          @click="toggleLayoutEditable"
        >
          {{ layoutEditable ? '锁定布局' : '编辑布局' }}
        </button>
      </div>
    </header>

    <!-- Main: Asymmetric Two Columns -->
    <main class="main">
      <!-- Left Sidebar (Drawer) -->
      <div ref="sidebarWrapperRef" class="sidebar-wrapper" :class="{ open: drawerOpen }">
        <div class="sidebar-trigger" @click="toggleDrawer"></div>
        <aside class="sidebar">
          <ChatBox ref="chatBoxRef" @close-drawer="closeDrawer" />
        </aside>
      </div>
      <!-- Right Main Content -->      
      <GridLayout
        v-model:layout="gridStore.layoutItems"
        :col-num="60"
        :row-height="rowHeight"
        :margin="[0, 0]"
        :max-rows="MAX_ROWS"
        :auto-size="false"
        :is-draggable="layoutEditable"
        :is-resizable="layoutEditable"
        @layout-updated="gridStore.updateLayout"
      >
        <GridItem
          v-for="item in gridStore.layoutItems"
          :key="item.i"
          v-bind="item"
        >
        
        <div
          class="grid-item-container"
          style="height: 100%; width: 100%; padding: 5px; box-sizing: border-box; position: relative;"
          @contextmenu="onContextMenu($event, item.i)"
        >
        <div v-if="layoutEditable" class="edit-badge">{{ item.i }}</div>
          <div
            v-if="gridStore.getModuleById(item.i)"
            class="grid-item-wrapper"
            :style="gridStore.getModuleById(item.i).style"
          >
            <div
              v-if="gridStore.getModuleById(item.i).props?.title"
              class="grid-item-header"
            >
              {{ gridStore.getModuleById(item.i).props.title }}
            </div>
            <div
              class="grid-item-body"
              :style="{ flexDirection: gridStore.getModuleById(item.i).direction || 'row' }"
            >
              <template
                v-for="(child, idx) in gridStore.getModuleById(item.i).children"
                :key="idx"
              >
                <div class="child-wrapper" :style="child.style">
                  <div v-if="layoutEditable" class="edit-badge child-edit-badge">{{ child.instanceId }}</div>
                  <component
                    :is="widgetMap[child.stableKey]"
                    v-if="widgetMap[child.stableKey]"
                    v-bind="{ ...child.props, ...(child.stableKey === 'LayoutNode' && child.children?.length ? { children: child.children } : {}) }"
                    style="width: 100%; height: 100%;"
                  />
                  <div v-else class="child-fallback" style="width: 100%; height: 100%;">
                    <div class="child-fallback-key">{{ child.stableKey }}</div>
                    <pre>{{ JSON.stringify(child.props, null, 2) }}</pre>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
          
        </GridItem>
      </GridLayout>
    </main>

    <!-- 模块右键菜单 -->
    <div
      v-if="contextmenuVisible"
      class="context-menu"
      :style="{ left: contextmenuPos.x + 'px', top: contextmenuPos.y + 'px' }"
      @click.stop
    >
      <div class="context-menu-item" @click="handleEdit">编辑</div>
      <div class="context-menu-item context-menu-item--danger" @click="handleDelete">删除</div>
    </div>

    <!-- 导航菜单右键菜单 -->
    <div
      v-if="navContextmenuVisible"
      class="context-menu"
      :style="{ left: navContextmenuPos.x + 'px', top: navContextmenuPos.y + 'px' }"
      @click.stop
    >
      <div class="context-menu-item" @click="handleNavEdit">编辑</div>
      <div
        v-if="!isDefaultMenu(navContextmenuWorkspace)"
        class="context-menu-item"
        @click="startRenameMenu(navContextmenuWorkspace); closeNavContextMenu()"
      >重命名</div>
      <div
        v-if="!isDefaultMenu(navContextmenuWorkspace)"
        class="context-menu-item"
        @click="handleSendTo"
      >发送至</div>
      <div
        v-if="!isDefaultMenu(navContextmenuWorkspace)"
        class="context-menu-item context-menu-item--danger"
        @click="handleNavDelete"
      >删除</div>
    </div>

    <!-- 模块编辑弹框 -->
    <div v-if="editModalVisible" class="edit-modal-overlay" @click="closeEditModal">
      <div class="edit-modal" @click.stop style="width: 900px;">
        <div class="edit-modal-header">
          <span class="edit-modal-title">编辑模块</span>
          <button class="edit-modal-close" @click="closeEditModal">&times;</button>
        </div>
        <div class="edit-modal-body">
          <MonacoEditor
            ref="monacoEditorRef"
            v-model="editJson"
            language="json"
            style="height: 100%;"
          />
        </div>
        <div class="edit-modal-footer">
          <button class="edit-modal-btn edit-modal-btn--secondary" @click="closeEditModal">取消</button>
          <button class="edit-modal-btn edit-modal-btn--primary" @click="handleSaveEdit">保存</button>
        </div>
      </div>
    </div>

    <!-- 工作区编辑弹框 -->
    <div v-if="editWorkspaceModalVisible" class="edit-modal-overlay" @click="closeEditWorkspaceModal">
      <div class="edit-modal" @click.stop style="width: 900px;">
        <div class="edit-modal-header">
          <span class="edit-modal-title">编辑 {{ getMenuName(editWorkspaceTarget) }} 布局</span>
          <button class="edit-modal-close" @click="closeEditWorkspaceModal">&times;</button>
        </div>
        <div class="edit-modal-body">
          <MonacoEditor
            ref="monacoEditorRef"
            v-model="editWorkspaceJson"
            language="json"
            style="height: 100%;"
          />
        </div>
        <div class="edit-modal-footer">
          <button class="edit-modal-btn edit-modal-btn--secondary" @click="closeEditWorkspaceModal">取消</button>
          <button class="edit-modal-btn edit-modal-btn--primary" @click="handleSaveWorkspaceEdit">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  background: var(--bg);
  background-image: var(--page-bg-image);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

/* ========== Header ========== */
.header {
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  padding: var(--space-2) var(--space-6);
}

.header-inner {
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-title-wrap {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.header-accent-line {
  width: 4px;
  height: 36px;
  background: var(--accent);
  border-radius: 2px;
  flex-shrink: 0;
}

.header-title {
  font-size: clamp(1.6rem, 2.8vw, 2.25rem);
  font-weight: 700;
  letter-spacing: 0.04em;
}

.header-subtitle {
  font-family: var(--font-display);
  font-size: 0.9rem;
  color: var(--text-muted);
  letter-spacing: 0.12em;
  white-space: nowrap;
}

.header-nav {
  display: flex;
  align-items: center;
  gap: var(--space-6);
  margin: 0 auto;
}

.header-nav-item {
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--text-muted);
  text-decoration: none;
  padding: 4px 2px;
  position: relative;
  transition: color 0.2s;
  white-space: nowrap;
}

.header-nav-item:hover {
  color: var(--text);
}

.header-nav-item.active {
  color: var(--accent);
  font-weight: 600;
}

.header-nav-item.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--accent);
  border-radius: 1px;
}

.rename-menu-input {
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--text);
  background: var(--surface);
  border: 1px solid var(--accent);
  border-radius: var(--radius-btn);
  padding: 2px 6px;
  width: 100px;
  outline: none;
}

.add-menu-trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  padding: 0;
  margin-left: 2px;
  font-size: 1rem;
  font-weight: 500;
  line-height: 1;
  color: var(--text-muted);
  background: transparent;
  border: 1px dashed var(--border);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
  opacity: 0.7;
}

.add-menu-trigger:hover {
  opacity: 1;
  color: var(--accent);
  border-color: var(--accent);
  background: var(--accent-bg);
}

.add-menu-form {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: 2px 4px;
  margin-left: 2px;
}

.add-menu-input {
  font-size: 0.8rem;
  padding: 3px 8px;
  border: 1px solid var(--border);
  border-radius: var(--radius-btn);
  background: var(--surface);
  color: var(--text);
  outline: none;
  width: 100px;
  transition: border-color 0.2s;
}

.add-menu-input:focus {
  border-color: var(--accent);
}

.add-menu-btn {
  font-size: 0.7rem;
  font-weight: 500;
  padding: 3px 7px;
  border-radius: var(--radius-btn);
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text-muted);
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
}

.add-menu-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.add-menu-btn--confirm {
  background: var(--accent);
  color: var(--surface);
  border-color: var(--accent);
}

.add-menu-btn--confirm:hover {
  opacity: 0.9;
}

.theme-select {
  font-size: 0.8rem;
  font-weight: 500;
  padding: 6px 10px;
  border-radius: var(--radius-btn);
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
  cursor: pointer;
  transition: all 0.2s;
  outline: none;
}

.theme-select:focus {
  border-color: var(--accent);
}

.edit-btn {
  font-size: 0.8rem;
  font-weight: 600;
  padding: 6px 14px;
  border-radius: var(--radius-btn);
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.edit-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.edit-btn.active {
  background: var(--accent);
  color: var(--surface);
  border-color: var(--accent);
}

.edit-btn.active:hover {
  opacity: 0.9;
}

/* ========== Main Layout ========== */
.main {
  position: relative;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: minmax(0, 1fr);
  gap: 0;
  padding: var(--space-1) var(--space-1);
  width: 100%;
  box-sizing: border-box;
  flex-grow: 1;
  overflow: hidden;
}

/* ========== Sidebar Drawer ========== */
.sidebar-wrapper {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 14px;
  z-index: 100;
}

.sidebar-trigger {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
  z-index: 103;
}

.sidebar-trigger::after {
  content: '';
  position: absolute;
  left: 5px;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 48px;
  background: var(--border);
  border-radius: 3px;
  opacity: 0.5;
  transition: all 0.25s ease;
}

.sidebar-trigger:active::after {
  transform: translateY(-50%) scaleY(0.9);
}

.sidebar-wrapper.open .sidebar-trigger::after {
  opacity: 1;
  height: 72px;
  background: var(--accent);
}

.sidebar {
  position: absolute;
  left: 0;
  top: var(--space-2);
  bottom: var(--space-2);
  width: 310px;
  transform: translateX(-100%);
  transition: transform 0.35s cubic-bezier(0.25, 0.8, 0.25, 1);
  z-index: 102;
}

.sidebar-wrapper.open .sidebar {
  transform: translateX(0);
}

/* ========== Grid Item ========== */
:deep(.vgl-layout) {
  height: 100%;
  overflow-y: auto;
}

:deep(.vgl-item) {
  /* padding: 6px !important; */
}

.grid-item-wrapper {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-card);
  box-sizing: border-box;
}

.edit-badge {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 10;
  background: var(--accent);
  color: var(--surface);
  font-size: 0.65rem;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 0 0 0 var(--radius-badge);
  pointer-events: none;
  line-height: 1.4;
}

.child-wrapper {
  position: relative;
}

.grid-item-header {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-muted);
  padding: 5px 16px;
  border-bottom: 1px solid var(--border-light);
  flex-shrink: 0;
}

.grid-item-body {
  flex: 1;
  padding: 5px 8px;
  overflow: auto;
  display: flex;
  flex-direction: row;
  gap: 12px;
}

/* ========== Context Menu ========== */
.context-menu {
  position: fixed;
  z-index: 9999;
  background: var(--surface);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow);
  padding: 4px 0;
  min-width: 100px;
  font-size: 0.85rem;
}

.context-menu-item {
  padding: 8px 16px;
  cursor: pointer;
  color: var(--text);
  transition: background 0.15s;
}

.context-menu-item:hover {
  background: var(--surface-hover);
}

.context-menu-item--danger {
  color: #dc3545;
}

.context-menu-item--danger:hover {
  background: rgba(220, 53, 69, 0.08);
}

/* ========== Edit Modal ========== */
.edit-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.edit-modal {
  width: 80vw;
  height: 80vh;
  background: var(--surface);
  border-radius: var(--radius-card);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.edit-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-light);
  flex-shrink: 0;
}

.edit-modal-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text);
}

.edit-modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--text-muted);
  cursor: pointer;
  line-height: 1;
  padding: 0 4px;
}

.edit-modal-close:hover {
  color: var(--text);
}

.edit-modal-body {
  flex: 1;
  min-height: 0;
  padding: 8px;
}

.edit-modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 12px 16px;
  border-top: 1px solid var(--border-light);
  flex-shrink: 0;
}

.edit-modal-btn {
  font-size: 0.85rem;
  font-weight: 500;
  padding: 8px 20px;
  border-radius: var(--radius-btn);
  border: 1px solid var(--border);
  cursor: pointer;
  transition: all 0.2s;
}

.edit-modal-btn--secondary {
  background: var(--surface);
  color: var(--text-muted);
}

.edit-modal-btn--secondary:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.edit-modal-btn--primary {
  background: var(--accent);
  color: var(--surface);
  border-color: var(--accent);
}

.edit-modal-btn--primary:hover {
  opacity: 0.9;
}

/* ========== Responsive ========== */
@media (max-width: 900px) {
  .header-inner {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-2);
  }

  .main {
    grid-template-columns: 1fr;
    gap: var(--space-6);
    padding: var(--space-5) var(--space-4);
  }

  .sidebar-wrapper {
    position: static;
    width: auto;
    height: auto;
  }

  .sidebar-trigger {
    display: none;
  }

  .sidebar {
    position: static;
    width: auto;
    height: auto;
    max-height: 70vh;
    transform: none;
    transition: none;
  }

  .sidebar-wrapper.open .sidebar {
    transform: none;
  }
}

@media (max-width: 480px) {
  .header {
    padding: var(--space-4) var(--space-4);
  }

  .header-title {
    font-size: 1.35rem;
  }

  .header-accent-line {
    height: 28px;
  }

  .main {
    padding: var(--space-4) var(--space-3);
  }
}
</style>
