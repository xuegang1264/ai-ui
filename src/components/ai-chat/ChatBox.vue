<script setup>
import { ref, nextTick } from 'vue'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import localforage from 'localforage'
import { askStream } from '@/api'
import { useGridStore } from '@/stores/gridStore'
import { useMapCommandStore } from '@/stores/mapCommandStore'

const messages = ref([])
const inputText = ref('')
const loading = ref(false)
const gridStore = useGridStore()
const scrollRef = ref(null)
const mapCommandStore = useMapCommandStore()
const inputRef = ref(null)

const WORKSPACE_KEY_MAP = {
  home: 'grid-modules',
  miaoqing: 'miaoqing',
  shangqing: 'shangqing',
  chongqing: 'chongqing',
  zaiqing: 'zaiqing',
}

function renderMarkdown(text) {
  if (!text) return ''
  const raw = marked.parse(text, { async: false })
  return DOMPurify.sanitize(raw)
}

function scrollToBottom() {
  nextTick(() => {
    const el = scrollRef.value
    if (el) el.scrollTop = el.scrollHeight
  })
}

/**
 * 容错 JSON 解析：先走原生 JSON.parse，失败时自动修复
 * AI 常见的两类错误：
 * 1. 字符串值里包含实际换行符（未转义的 \n）
 * 2. 字符串值里包含未转义的英文双引号
 *
 * 对问题 2 采用启发式判断：当在字符串值内遇到 " 时，
 * 检查其后第一个非空白字符是否为 JSON 结构符（, } ] :）。
 * 若不是，则判定为字符串内的未转义引号，自动补转义。
 */
function safeJsonParse(str) {
  try {
    return JSON.parse(str)
  } catch {}

  let fixed = ''
  let inString = false
  let escaped = false

  for (let i = 0; i < str.length; i++) {
    const char = str[i]

    if (escaped) {
      fixed += char
      escaped = false
      continue
    }

    if (char === '\\') {
      fixed += char
      escaped = true
      continue
    }

    if (char === '"') {
      if (inString) {
        let j = i + 1
        while (j < str.length && /\s/.test(str[j])) j++
        const next = str[j]
        const isStructural = next === ',' || next === '}' || next === ']' || next === ':'
        if (!isStructural && next !== undefined) {
          fixed += '\\"'
          continue
        }
      }
      inString = !inString
      fixed += char
      continue
    }

    if (inString && (char === '\n' || char === '\r')) {
      fixed += '\\n'
      continue
    }

    fixed += char
  }

  return JSON.parse(fixed)
}

// 递归深合并对象（数组直接替换，不合并）
function deepMerge(target, source) {
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      if (!target[key] || typeof target[key] !== 'object' || Array.isArray(target[key])) {
        target[key] = {}
      }
      deepMerge(target[key], source[key])
    } else {
      target[key] = source[key]
    }
  }
  return target
}

// 在模块树中递归查找模块
function findModuleInTree(tree, instanceId) {
  for (const m of tree) {
    if (m.instanceId === instanceId) return m
    if (m.children) {
      const found = findModuleInTree(m.children, instanceId)
      if (found) return found
    }
  }
  return null
}

// 在模块树中递归查找模块所在的位置（数组 + 索引）
function findModuleLocation(tree, instanceId) {
  const idx = tree.findIndex(m => m.instanceId === instanceId)
  if (idx !== -1) return { array: tree, index: idx }
  for (const m of tree) {
    if (m.children) {
      const result = findModuleLocation(m.children, instanceId)
      if (result) return result
    }
  }
  return null
}

// 状态机 + 缓存：匹配 <add-grid>、<add-grid-child>、<delete-instanceId>、<update-grid>、<update-grid-child>、<patch-grid-child>
const CONFIG_TAGS = ['add-grid', 'add-grid-map', 'add-grid-child', 'add-grid-child-map', 'delete-instanceId', 'update-grid', 'update-grid-child', 'patch-grid-child', 'map-action']
const OPEN_TAG_RE = new RegExp(`<(add-grid|add-grid-map|add-grid-child|add-grid-child-map|delete-instanceId|update-grid|update-grid-child|patch-grid-child|map-action)>`)
const MAX_TAG_LEN = Math.max(...CONFIG_TAGS.map(t => t.length)) + 1

// 返回 buffer 末尾可安全显示的长度（排除可能截断在未完成标签里的部分）
function safePrefixLen(buf) {
  const start = Math.max(0, buf.length - MAX_TAG_LEN - 10)
  for (let i = buf.length - 1; i >= start; i--) {
    if (buf[i] !== '<') continue
    const after = buf.slice(i + 1)
    if (!after) return i
    for (const t of CONFIG_TAGS) {
      if (t.startsWith(after) || (t + '>').startsWith(after)) return i
    }
  }
  return buf.length
}

async function handleSend() {
  const text = inputText.value.trim()
  if (!text || loading.value) return

  messages.value.push({ role: 'user', content: text })
  inputText.value = ''
  loading.value = true
  scrollToBottom()

  const aiIndex = messages.value.length
  messages.value.push({ role: 'ai', content: '' })

  let buf = ''      // 原始缓存
  let shown = ''    // 实际显示的内容
  let tag = null    // 当前所在标签名，null = 不在标签内

  try {
    await askStream({ question: text, current_layout: gridStore.modules }, (chunk) => {
      buf += typeof chunk === 'string' ? chunk : chunk?.text || String(chunk)

      while (true) {
        if (tag) {
          const end = `</${tag}>`, idx = buf.indexOf(end)
          if (idx === -1) break          // 闭合标签还没来，全部缓存
          const tagContent = buf.slice(0, idx).trim()
          console.log(`[${tag}] tagContent:`, tagContent)
          if (tag === 'add-grid' || tag === 'add-grid-map' || tag === 'add-grid-child' || tag === 'add-grid-child-map') {
            try {
              const parsed = safeJsonParse(tagContent)
              if (tag === 'add-grid' || tag === 'add-grid-map') {
                console.log(`[${tag}] 添加模块:`, parsed)
                gridStore.modules.push(parsed)
              } else if (tag === 'add-grid-child') {
                const parent = findModuleInTree(gridStore.modules, parsed.parentInstanceId)
                if (parent) {
                  if (!parent.children) parent.children = []
                  parent.children.push(parsed)
                } else {
                  console.warn(`[add-grid-child] 未找到 parentInstanceId: ${parsed.parentInstanceId}`)
                }
              } else if (tag === 'add-grid-child-map') {
                const parent = findModuleInTree(gridStore.modules, parsed.parentInstanceId)
                if (parent) {
                  if (!parent.children) parent.children = []
                  if (parsed.stableKey === 'Map') parsed.stableKey = 'MapView'
                  parent.children.push(parsed)
                } else {
                  console.warn(`[add-grid-child-map] 未找到 parentInstanceId: ${parsed.parentInstanceId}`)
                }
              }
            } catch (e) {
              console.error(`[${tag}] JSON 解析失败:`, e, tagContent)
            }
          } else if (tag === 'delete-instanceId') {
            const instanceId = tagContent.trim()
            if (instanceId) {
              const loc = findModuleLocation(gridStore.modules, instanceId)
              if (loc) {
                loc.array.splice(loc.index, 1)
              }
            }
          } else if (tag === 'update-grid') {
            try {
              const parsed = safeJsonParse(tagContent)
              const idx = gridStore.modules.findIndex(m => m.instanceId === parsed.instanceId)
              if (idx !== -1) {
                gridStore.modules.splice(idx, 1, parsed)
              } else {
                console.warn(`[update-grid] 未找到 instanceId: ${parsed.instanceId}`)
              }
            } catch (e) {
              console.error(`[${tag}] JSON 解析失败:`, e, tagContent)
            }
          } else if (tag === 'update-grid-child') {
            try {
              const parsed = safeJsonParse(tagContent)
              const loc = findModuleLocation(gridStore.modules, parsed.instanceId)
              if (loc) {
                loc.array.splice(loc.index, 1, parsed)
              } else {
                console.warn(`[update-grid-child] 未找到 instanceId: ${parsed.instanceId}`)
              }
            } catch (e) {
              console.error(`[${tag}] JSON 解析失败:`, e, tagContent)
            }
          } else if (tag === 'patch-grid-child') {
            try {
              const patches = safeJsonParse(tagContent)
              for (const patch of patches) {
                const child = findModuleInTree(gridStore.modules, patch.instanceId)
                if (child) {
                  if (!child.props) child.props = {}
                  deepMerge(child.props, patch.props)
                } else {
                  console.warn(`[patch-grid-child] 未找到 instanceId: ${patch.instanceId}`)
                }
              }
            } catch (e) {
              console.error(`[${tag}] JSON 解析失败:`, e, tagContent)
            }
          } else if (tag === 'map-action') {
            try {
              const parsed = safeJsonParse(tagContent)
              mapCommandStore.dispatch(parsed)
            } catch (e) {
              console.error(`[${tag}] JSON 解析失败:`, e, tagContent)
            }
          } else {
            console.log(`[${tag}]`, tagContent)
          }
          buf = buf.slice(idx + end.length)
          tag = null
        } else {
          const m = buf.match(OPEN_TAG_RE)
          if (!m) {
            const n = safePrefixLen(buf)
            if (n) { shown += buf.slice(0, n); buf = buf.slice(n) }
            break
          }
          if (m.index) shown += buf.slice(0, m.index)
          tag = m[1]
          buf = buf.slice(m.index + m[0].length)
        }
      }

      messages.value[aiIndex].content = shown
      scrollToBottom()
    })
  } catch (e) {
    console.error('流式接口报错:', e)
    shown += '\n[错误: ' + (e.message || '请求出错') + ']'
    messages.value[aiIndex].content = shown
  } finally {
    if (buf) {
      shown += buf
      messages.value[aiIndex].content = shown
      buf = ''
      tag = null
    }
    if (gridStore.initialized) {
      try {
        const key = WORKSPACE_KEY_MAP[gridStore.currentWorkspace] ?? 'grid-modules'
        await localforage.setItem(key, JSON.parse(JSON.stringify(gridStore.modules)))
      } catch (e) {
        console.error('保存 modules 到 IndexedDB 失败:', e)
      }
    }
    loading.value = false
  }
}

function handleKeydown(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleSend()
  }
}

const emit = defineEmits(['closeDrawer'])

defineExpose({
  focusInput() {
    inputRef.value?.focus()
  },
  loading,
})
</script>

<template>
  <div class="chat-box">
    <div class="chat-header">
      <span class="chat-title">AI 助手</span>
      <button class="chat-close-btn" @click="emit('closeDrawer')">&times;</button>
    </div>

    <div ref="scrollRef" class="chat-messages">
      <div
        v-for="(msg, i) in messages"
        :key="i"
        class="message"
        :class="msg.role"
      >
        <div class="message-bubble">
          <!-- AI 消息 -->
          <div
            v-if="msg.role === 'ai'"
            class="markdown-body"
            v-html="renderMarkdown(msg.content)"
          />

          <!-- 用户消息 -->
          <template v-else>{{ msg.content }}</template>
        </div>
      </div>
    </div>

    <div class="chat-input-area">
      <textarea
        ref="inputRef"
        v-model="inputText"
        rows="3"
        class="chat-input"
        placeholder="输入消息..."
        :disabled="loading"
        @keydown="handleKeydown"
      />
      <button class="chat-send-btn" :disabled="loading" @click="handleSend">
        {{ loading ? '生成中...' : '发送' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.chat-box {
  display: flex;
  flex-direction: column;
  background: var(--surface);
  border-radius: 16px;
  box-shadow: var(--shadow);
  border: 1px solid var(--border-light);
  height: 100%;
  overflow: hidden;
}

.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4) var(--space-5);
  border-bottom: 1px solid var(--border-light);
  flex-shrink: 0;
}

.chat-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-h);
}

.chat-close-btn {
  background: none;
  border: none;
  font-size: 1.25rem;
  color: var(--text-muted);
  cursor: pointer;
  line-height: 1;
  padding: 0 4px;
}

.chat-close-btn:hover {
  color: var(--text);
}

.chat-status {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent);
}

.chat-messages {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: var(--space-4);
}

.chat-messages::-webkit-scrollbar {
  width: 5px;
}

.chat-messages::-webkit-scrollbar-track {
  background: transparent;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 3px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: var(--text-muted);
}

.chat-input-area {
  display: flex;
  align-items: flex-end;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  border-top: 1px solid var(--border-light);
  flex-shrink: 0;
}

.chat-input {
  flex: 1;
  padding: var(--space-2) var(--space-3);
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 0.875rem;
  font-family: inherit;
  color: var(--text-h);
  background: var(--bg);
  outline: none;
  transition: border-color 0.2s ease;
  resize: none;
  line-height: 1.5;
}

.chat-input::placeholder {
  color: var(--text-muted);
}

.chat-input:focus {
  border-color: var(--accent);
}

.chat-send-btn {
  padding: var(--space-2) var(--space-4);
  background: var(--text-h);
  color: var(--surface);
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: background 0.2s ease;
  flex-shrink: 0;
}

.chat-send-btn:hover {
  background: var(--accent);
}

.chat-send-btn:disabled,
.chat-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.message {
  display: flex;
  margin-bottom: var(--space-3);
}

.message.user {
  justify-content: flex-end;
}

.message.ai {
  justify-content: flex-start;
}

.message-bubble {
  max-width: 80%;
  padding: var(--space-2) var(--space-3);
  border-radius: 12px;
  font-size: 0.875rem;
  line-height: 1.6;
  word-break: break-word;
}

.message.user .message-bubble {
  background: var(--text-h);
  color: var(--surface);
  border-bottom-right-radius: 4px;
  white-space: pre-wrap;
}

.message.ai .message-bubble {
  background: var(--bg);
  color: var(--text-h);
  border: 1px solid var(--border-light);
  border-bottom-left-radius: 4px;
}

/* Markdown 样式 */
.markdown-body :deep(p) {
  margin: 0 0 var(--space-2);
}

.markdown-body :deep(p:last-child) {
  margin-bottom: 0;
}

.markdown-body :deep(code) {
  font-family: 'SF Mono', 'Fira Code', 'Cascadia Code', monospace;
  font-size: 0.8em;
  padding: 0.15em 0.4em;
  border-radius: 4px;
  background: oklch(92% 0.01 80);
  color: oklch(40% 0.08 30);
}

.markdown-body :deep(pre) {
  margin: var(--space-2) 0;
  padding: var(--space-3);
  border-radius: 8px;
  background: oklch(20% 0.01 80);
  overflow-x: auto;
}

.markdown-body :deep(pre code) {
  background: none;
  color: oklch(95% 0.01 80);
  padding: 0;
  font-size: 0.8rem;
  line-height: 1.5;
}

.markdown-body :deep(ul),
.markdown-body :deep(ol) {
  margin: var(--space-2) 0;
  padding-left: var(--space-5);
}

.markdown-body :deep(li) {
  margin-bottom: var(--space-1);
}

.markdown-body :deep(blockquote) {
  margin: var(--space-2) 0;
  padding-left: var(--space-3);
  border-left: 3px solid var(--border);
  color: var(--text-muted);
}

.markdown-body :deep(h1),
.markdown-body :deep(h2),
.markdown-body :deep(h3),
.markdown-body :deep(h4) {
  margin: var(--space-3) 0 var(--space-2);
  font-weight: 600;
  line-height: 1.3;
}

.markdown-body :deep(h1) { font-size: 1.15em; }
.markdown-body :deep(h2) { font-size: 1.05em; }
.markdown-body :deep(h3) { font-size: 0.95em; }

.markdown-body :deep(a) {
  color: var(--accent);
  text-decoration: none;
}

.markdown-body :deep(a:hover) {
  text-decoration: underline;
}

.markdown-body :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: var(--space-2) 0;
  font-size: 0.8rem;
}

.markdown-body :deep(th),
.markdown-body :deep(td) {
  padding: var(--space-1) var(--space-2);
  border: 1px solid var(--border-light);
  text-align: left;
}

.markdown-body :deep(th) {
  background: oklch(95% 0.01 80);
  font-weight: 600;
}

.markdown-body :deep(hr) {
  border: none;
  border-top: 1px solid var(--border-light);
  margin: var(--space-3) 0;
}

@media (max-width: 900px) {
  .chat-box {
    height: 100%;
    max-height: 70vh;
  }
}
</style>
